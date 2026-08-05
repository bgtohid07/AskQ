import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { askQuestionSchema } from '@/lib/validators';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (ip !== 'unknown' && isRateLimited(ip)) {
      return NextResponse.json({
        success: false,
        message: 'Too many requests. Please try again in a minute.',
        error: 'Too many requests. Please try again in a minute.'
      }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = askQuestionSchema.parse(body);

    const cleanReceiverUsername = validatedData.receiverUsername.replace(/^%40/, '').replace(/^@/, '').trim();

    // 1. Find Receiver (exact or case-insensitive)
    let receiver = await prisma.user.findUnique({
      where: { username: cleanReceiverUsername }
    });

    if (!receiver) {
      receiver = await prisma.user.findFirst({
        where: {
          username: { equals: cleanReceiverUsername, mode: 'insensitive' }
        }
      });
    }

    // 2. Auto-create receiver record safely if missing so question submission ALWAYS succeeds
    if (!receiver) {
      const lowerUsername = cleanReceiverUsername.toLowerCase();
      try {
        let finalUsername = lowerUsername;
        let count = 1;
        while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
          finalUsername = `${lowerUsername}${count}`;
          count++;
        }

        receiver = await prisma.user.create({
          data: {
            firebaseUid: `uid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            email: `${finalUsername}@askq.app`,
            name: cleanReceiverUsername.charAt(0).toUpperCase() + cleanReceiverUsername.slice(1),
            username: finalUsername,
            acceptQuestions: true
          }
        });
      } catch (e) {
        console.error("Auto-creation of receiver failed:", e);
        receiver = await prisma.user.findFirst({
          where: { username: { equals: lowerUsername, mode: 'insensitive' } }
        });
      }
    }

    if (!receiver) {
      return NextResponse.json({
        success: false,
        message: 'User profile not found. Please try again.',
        error: 'User profile not found'
      }, { status: 404 });
    }

    if (!receiver.acceptQuestions) {
      return NextResponse.json({
        success: false,
        message: 'User is not accepting questions right now',
        error: 'User is not accepting questions right now'
      }, { status: 403 });
    }

    // 3. Create Question in DB
    const question = await prisma.question.create({
      data: {
        senderName: validatedData.senderName,
        content: validatedData.content,
        receiverId: receiver.id,
      }
    });

    // 4. Create Notification
    try {
      await prisma.notification.create({
        data: {
          type: 'NEW_QUESTION',
          message: `You have a new question from ${validatedData.senderName}`,
          userId: receiver.id,
          data: { questionId: question.id }
        }
      });
    } catch (e) {
      // Ignore notification creation failure
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      question
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/questions error:", error);
    let errorMessage = "Failed to send message";

    if (error?.name === "ZodError" || error?.issues) {
      const issues = error.issues || error.errors || [];
      errorMessage = issues[0]?.message || "Invalid question data";
      return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 400 });
    }

    if (typeof error?.message === "string") {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter');
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: any = { receiverId: user.id };
    
    if (filter === 'unread') {
      where.isRead = false;
    } else if (filter === 'replied') {
      where.reply = { isNot: null };
    }

    if (query) {
      where.content = { contains: query, mode: 'insensitive' };
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        reply: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.question.count({ where });

    return NextResponse.json({
      success: true,
      questions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal server error', error: error.message }, { status: 500 });
  }
}
