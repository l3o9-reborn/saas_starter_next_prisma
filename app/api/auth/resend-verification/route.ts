import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/mailer"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user)
    return NextResponse.json({ error: "No account found for this email" }, { status: 404 })

  if (user.emailVerified)
    return NextResponse.json({ error: "Email is already verified" }, { status: 400 })

  // ✅ Remove any existing tokens (optional but cleaner)
  await prisma.verificationToken.deleteMany({
    where: { identifier: email.toLowerCase() },
  })

  const token = crypto.randomUUID()

  await prisma.verificationToken.create({
    data: {
      identifier: email.toLowerCase(),
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  })

  await sendVerificationEmail(email, token)

  return NextResponse.json({ success: true, message: "Verification email resent" })
}
