import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();
  const stored = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!stored || stored.expires < new Date()) {
    return new Response('Invalid or expired token', { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: stored.email },
    data: { password: hashed }
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return new Response('Password reset successfully');
}
