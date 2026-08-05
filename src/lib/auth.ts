import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import prisma from './prisma';

export async function getCurrentUser(req?: Request) {
  try {
    let sessionCookie: string | undefined;

    if (req) {
      sessionCookie = req.headers.get('x-user-id') || req.headers.get('authorization')?.replace('Bearer ', '');
    }

    if (!sessionCookie) {
      const cookieStore = await cookies();
      sessionCookie = cookieStore.get('session')?.value;
    }
    
    if (!sessionCookie) {
      return null;
    }

    const cleanId = sessionCookie.replace(/^%40/, '').replace(/^@/, '').trim();

    if (!cleanId) return null;

    // Direct lookup by session cookie / header value
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { firebaseUid: cleanId },
          { email: cleanId },
          { username: cleanId }
        ]
      }
    });

    if (user) {
      return user;
    }

    // Fallback: case-insensitive username / email lookup
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: cleanId, mode: 'insensitive' } },
          { email: { equals: cleanId, mode: 'insensitive' } }
        ]
      }
    });

    if (user) {
      return user;
    }

    // Try firebase admin if session cookie is a JWT/Session token
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(cleanId, true);
      const fbUser = await prisma.user.findUnique({
        where: { firebaseUid: decodedClaims.uid }
      });
      if (fbUser) return fbUser;
    } catch (e) {
      // Ignore firebase admin verification failure
    }

    // Auto-provision user in DB if still missing so auth operations never fail silently
    try {
      const cleanUsername = cleanId.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const validUsername = cleanUsername.length >= 3 ? cleanUsername : `user_${cleanId.substring(0, 6)}`;
      
      let finalUsername = validUsername;
      let count = 1;
      while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
        finalUsername = `${validUsername}${count}`;
        count++;
      }

      user = await prisma.user.create({
        data: {
          firebaseUid: cleanId,
          email: cleanId.includes('@') ? cleanId : `${finalUsername}@askq.app`,
          name: finalUsername.charAt(0).toUpperCase() + finalUsername.slice(1),
          username: finalUsername,
          acceptQuestions: true
        }
      });
      return user;
    } catch (e) {
      console.error("Auto-provision in getCurrentUser failed:", e);
    }

    return null;
  } catch (error) {
    console.error("getCurrentUser error:", error);
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
