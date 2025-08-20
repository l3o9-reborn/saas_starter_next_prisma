// app/api/cancel-subscription/route.ts
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth'; // replace with your auth logic
import {authOptions} from "@/lib/authOptions"
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });

export async function POST() {
  const session = await getServerSession(authOptions)
  const user= session?.user
  if (!user?.stripeSubscriptionId) return NextResponse.json({ error: 'No subscription' }, { status: 400 });

  await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionStatus: 'canceled' }
  });

  return NextResponse.json({ message: 'Subscription will be canceled at period end' });
}
