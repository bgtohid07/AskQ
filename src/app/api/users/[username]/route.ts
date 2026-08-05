import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validators';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        profilePicture: true,
        isVerified: true,
        acceptQuestions: true,
        _count: {
          select: { followers: true, following: true, receivedQuestions: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    let isFollowing = false;

    if (currentUser) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: user.id
          }
        }
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({ ...user, isFollowing }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const user = await getCurrentUser();
    if (!user || user.username !== username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    if (validatedData.username && validatedData.username !== user.username) {
      const existing = await prisma.user.findUnique({
        where: { username: validatedData.username }
      });
      if (existing) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: validatedData,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        profilePicture: true,
        isVerified: true,
        acceptQuestions: true,
      }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
