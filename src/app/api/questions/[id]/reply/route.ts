import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { replySchema } from '@/lib/validators';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = replySchema.parse(body);

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ success: false, message: 'Question not found', error: 'Question not found' }, { status: 404 });
    }

    if (question.receiverId !== user.id) {
      return NextResponse.json({ success: false, message: 'Forbidden', error: 'Forbidden' }, { status: 403 });
    }

    const reply = await prisma.reply.create({
      data: {
        content: validatedData.content,
        isPublic: validatedData.isPublic,
        questionId: question.id,
        userId: user.id
      }
    });

    if (question.senderId) {
      try {
        await prisma.notification.create({
          data: {
            type: 'NEW_REPLY',
            message: `${user.name} replied to your question`,
            userId: question.senderId,
            data: { questionId: question.id, replyId: reply.id }
          }
        });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, reply }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message, error: message }, { status: 500 });
  }
}
