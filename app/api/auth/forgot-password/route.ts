import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
      }
    });

    await sendPasswordResetEmail(email, token);
  }

  return new Response('If the email exists, a reset link has been sent.');
}
