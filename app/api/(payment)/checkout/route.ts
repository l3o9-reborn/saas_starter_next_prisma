// app/api/checkout/route.ts
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth'; // replace with your auth logic
import {authOptions} from "@/lib/authOptions"
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user= session?.user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { planId } = await req.json();
  console.log(planId)
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan?.stripePriceId) return NextResponse.json({ error: 'Plan not configured' }, { status: 400 });

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email! });
    stripeCustomerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId } });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
