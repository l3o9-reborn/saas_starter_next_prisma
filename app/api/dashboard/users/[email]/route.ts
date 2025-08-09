// app/api/dashboard/users/[email]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function PUT(req: Request,
  context: { params: Promise<{ email: string }> }) {
  const body = await req.json();
  const { name, email, emailVerified, image, password, role, subscriptionPlanId } = body;
  const params = await context.params
  let subscriptionPlan = null;
  try {
    if(subscriptionPlanId){
      subscriptionPlan=await prisma.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId },
      });
    }
    const hashed = await bcrypt.hash(password, 10)

    const updatedUser = await prisma.user.update({
      where: { email: params.email },
      data: { name, email, emailVerified, image, role, password: hashed,
        subscriptionPlanId: subscriptionPlan ? subscriptionPlanId : null, // Use the plan ID if it exists
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    const err= error as Error
    console.log(err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ email: string }> }
) {
  const params = await context.params;
  const email = params.email;

  try {
    console.log('Deleting user with email:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: `User with email ${email} not found` }, { status: 404 });
    }

    await prisma.user.delete({ where: { email } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    const err= error as Error
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}



