import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { replySchema } from '@/lib/validators';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = replySchema.parse(body);

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (question.receiverId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reply = await prisma.reply.create({
      data: {
        content: validatedData.content,
        isPublic: validatedData.isPublic,
        questionId: question.id,
        userId: user.id
      }
    });

    // Only send notification if the sender has an actual account (senderId exists)
    if (question.senderId) {
      await prisma.notification.create({
        data: {
          type: 'NEW_REPLY',
          message: `${user.name} replied to your question`,
          userId: question.senderId,
          data: { questionId: question.id, replyId: reply.id }
        }
      });
    }

    return NextResponse.json(reply, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
