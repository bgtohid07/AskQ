import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import prisma from './prisma';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }

    // Direct lookup by session cookie value (could be firebaseUid, id, email, or username)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: sessionCookie },
          { id: sessionCookie },
          { email: sessionCookie },
          { username: sessionCookie }
        ]
      }
    });

    if (user) {
      return user;
    }

    // Firebase Admin Session Cookie verification fallback
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      const fbUser = await prisma.user.findUnique({
        where: { firebaseUid: decodedClaims.uid }
      });
      if (fbUser) return fbUser;
    } catch (e) {
      // Ignore firebase admin verification failure
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decodedClaims;
    } catch (e) {
      return { uid: sessionCookie };
    }
  } catch (error) {
    return null;
  }
}
