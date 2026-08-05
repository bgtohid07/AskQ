import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validators';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const cleanUsername = username.replace(/^%40/, '').replace(/^@/, '');

    let user = await prisma.user.findUnique({
      where: { username: cleanUsername },
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
      user = await prisma.user.findFirst({
        where: {
          username: { equals: cleanUsername, mode: 'insensitive' }
        },
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
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUser = await getCurrentUser(req);
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
    const { username: paramUsername } = await params;
    const cleanUsername = paramUsername.replace(/^%40/, '').replace(/^@/, '');
    
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Please log in again' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    if (validatedData.username && validatedData.username.toLowerCase() !== currentUser.username.toLowerCase()) {
      const existing = await prisma.user.findFirst({
        where: {
          username: { equals: validatedData.username, mode: 'insensitive' }
        }
      });
      if (existing && existing.id !== currentUser.id) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        isVerified: true,
        acceptQuestions: true,
      }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: unknown) {
    console.error("PATCH /api/users/[username] error:", error);
    const err = error as any;
    if (err?.name === 'ZodError' || err?.issues) {
      const issues = err.issues || err.errors || [];
      return NextResponse.json({ error: issues[0]?.message || 'Invalid profile data' }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
