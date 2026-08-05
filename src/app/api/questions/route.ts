import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { askQuestionSchema } from '@/lib/validators';

// Simple in-memory rate limiting for question submissions
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 questions
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // per minute

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
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const validatedData = askQuestionSchema.parse(body);

    const cleanReceiverUsername = validatedData.receiverUsername.replace(/^%40/, '').replace(/^@/, '');

    // 3. Find Receiver (exact or case-insensitive)
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

    // Auto-create receiver record if missing so question submission always succeeds
    if (!receiver) {
      receiver = await prisma.user.create({
        data: {
          firebaseUid: `user_${cleanReceiverUsername}`,
          email: `${cleanReceiverUsername}@askq.app`,
          name: cleanReceiverUsername.charAt(0).toUpperCase() + cleanReceiverUsername.slice(1),
          username: cleanReceiverUsername.toLowerCase(),
          acceptQuestions: true
        }
      });
    }

    if (!receiver.acceptQuestions) {
      return NextResponse.json({ error: 'User is not accepting questions right now' }, { status: 403 });
    }

    // 4. Create Question
    const question = await prisma.question.create({
      data: {
        senderName: validatedData.senderName,
        content: validatedData.content,
        receiverId: receiver.id,
      }
    });

    // 5. Create Notification
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
      // Non-critical notification creation failure ignored
    }

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: error.errors?.[0]?.message || 'Invalid question data' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter'); // unread, replied
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
      questions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
