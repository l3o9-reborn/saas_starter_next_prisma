import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const stored = await prisma.verificationToken.findUnique({ where: { token } });

  if (!stored || stored.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: stored.identifier },
    data: { emailVerified: new Date() }
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect('/login?status=verified');
}
