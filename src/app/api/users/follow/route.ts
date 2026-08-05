import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { followingId } = await req.json();
    if (!followingId) return NextResponse.json({ error: 'followingId is required' }, { status: 400 });

    if (user.id === followingId) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });

    const follow = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId
      }
    });

    await prisma.notification.create({
      data: {
        type: 'NEW_FOLLOWER',
        message: `${user.name} started following you`,
        userId: followingId,
        data: { followerId: user.id }
      }
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const followingId = searchParams.get('followingId');
    if (!followingId) return NextResponse.json({ error: 'followingId is required' }, { status: 400 });

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId
        }
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
