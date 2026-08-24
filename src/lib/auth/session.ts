import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { AdminSessionData, defaultSession } from '@/types/auth';

export const ADMIN_COOKIE_NAME = 'elkaed_admin_session';

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'c7f98e29a3b610c145e5d38c644efb1e84a29d5b74109f28d6174a819b53ac07',
  cookieName: ADMIN_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSessionData>(cookieStore, sessionOptions);

  if (session.isLoggedIn === undefined) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error('Unauthorized');
  }
  return session;
}
