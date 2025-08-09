// app/api/dashboard/user/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET() {

  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    const err= error as Error
    console.log(err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, emailVerified, password, image, role, subscriptionPlanId } = body;

  let subscriptionPlan = null

  try {

    if(subscriptionPlanId){
      subscriptionPlan=await prisma.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified,
        password : hashedPassword,
        image,
        role,
        subscriptionPlanId: subscriptionPlan ? subscriptionPlanId: null, // Use the plan ID if it exists
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    const err= error as Error
    console.log(err)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
