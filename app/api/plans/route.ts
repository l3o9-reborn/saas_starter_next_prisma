// app/api/plans/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions)
  const user= session?.user
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    include: { features: true, users: true },
  });
  return NextResponse.json({plans, user});
}
