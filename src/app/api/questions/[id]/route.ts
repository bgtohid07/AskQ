import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, name: true, username: true, profilePicture: true } },
        receiver: { select: { id: true, name: true, username: true, profilePicture: true } },
        reply: true
      }
    });

    if (!question) {
      return NextResponse.json({ success: false, message: 'Question not found', error: 'Question not found' }, { status: 404 });
    }

    if (user && question.receiverId === user.id && !question.isRead) {
      await prisma.question.update({
        where: { id: question.id },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true, question }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });
    }

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return NextResponse.json({ success: false, message: 'Question not found', error: 'Question not found' }, { status: 404 });
    }

    if (question.receiverId !== user.id && question.senderId !== user.id) {
      return NextResponse.json({ success: false, message: 'Forbidden', error: 'Forbidden' }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Question deleted' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message, error: message }, { status: 500 });
  }
}
