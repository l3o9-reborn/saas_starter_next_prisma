import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
  });
}
