// app/api/portal/route.ts
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });

export async function POST() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  console.log(user)
  if (!user?.stripeCustomerId) return NextResponse.json({ error: 'Not subscribed' }, { status: 401 });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
