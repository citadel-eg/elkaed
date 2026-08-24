import { getAdminSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  session.destroy();

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  session.destroy();

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}
