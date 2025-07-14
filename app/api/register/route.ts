import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import { prisma }from '@/lib/prisma'


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
    const user = await prisma.user.create({
        data:{
            email,
            name,
            password:hashed
        }
    })
     return NextResponse.json({ id: user.id })
}