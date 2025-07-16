import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import crypto from "crypto"
import { prisma }from '@/lib/prisma'
import { sendVerificationEmail } from "@/lib/mailer"


export async function POST(request: Request){
    const {email, name , password} = await request.json()
    if(!email || !password) 
         return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    const existing = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(existing)
        return NextResponse.json({ error: "Email already registered" }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
 // 1️⃣  Create user with emailVerified = null
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      password: hashed,
      emailVerified: null,
    },
  })

  // 2️⃣  Generate token & store
  const token = crypto.randomUUID()
  await prisma.verificationToken.create({
    data: {
      identifier: email.toLowerCase(),
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  })

  // 3️⃣  Send the email
  await sendVerificationEmail(email, token)
     return NextResponse.json({ id: user.id })
}