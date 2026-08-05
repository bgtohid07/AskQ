import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { blockedId } = await req.json();
    if (!blockedId) return NextResponse.json({ error: 'blockedId is required' }, { status: 400 });

    if (user.id === blockedId) return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });

    const block = await prisma.blockedUser.create({
      data: {
        blockerId: user.id,
        blockedId
      }
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const blockedId = searchParams.get('blockedId');
    if (!blockedId) return NextResponse.json({ error: 'blockedId is required' }, { status: 400 });

    await prisma.blockedUser.delete({
      where: {
        blockerId_blockedId: {
          blockerId: user.id,
          blockedId
        }
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
