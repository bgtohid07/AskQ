import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firebaseUid, email, name, username, profilePicture } = body;

    if (!firebaseUid && !email) {
      return NextResponse.json({ error: 'Missing required user information' }, { status: 400 });
    }

    const effectiveEmail = email || `${firebaseUid}@askq.app`;
    let cleanUsername = (username || effectiveEmail.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');
    
    if (cleanUsername.length < 3) {
      cleanUsername = `user_${(firebaseUid || Date.now().toString()).substring(0, 6)}`;
    }

    // Check if user exists by firebaseUid, email, or id
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(firebaseUid ? [{ firebaseUid }] : []),
          { email: effectiveEmail }
        ]
      }
    });

    if (!user) {
      // Ensure unique username
      let finalUsername = cleanUsername;
      let count = 1;
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${cleanUsername}${count}`;
        count++;
      }

      user = await prisma.user.create({
        data: {
          firebaseUid: firebaseUid || `uid_${Date.now()}`,
          email: effectiveEmail,
          name: name || cleanUsername,
          username: finalUsername,
          profilePicture: profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalUsername}`,
          acceptQuestions: true
        }
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('Auth sync error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
