// app/api/webhook/route.ts
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: Request) {
  const headersList = await headers();
  const sig = headersList.get('stripe-signature')!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const err = error as Error;
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('Stripe event:', event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;

        const planId = await getPlanIdFromPrice(priceId);

        if (planId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              subscriptionPlanId: planId,
            },
          });
        }
      }
      console.log('successfully updated user')
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      const planId = await getPlanIdFromPrice(priceId);

      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionPlanId: planId,
        },
      });

      break;
    }

    case 'customer.subscription.deleted': {
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: (event.data.object as Stripe.Subscription).id },
        data: {
          subscriptionStatus: 'canceled',
          subscriptionPlanId: null,
        },
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice URL: ${invoice.hosted_invoice_url}`);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response('ok', { status: 200 });
}

async function getPlanIdFromPrice(priceId: string) {
  const plan = await prisma.subscriptionPlan.findFirst({
    where: { stripePriceId: priceId },
  });
  return plan?.id || null;
}
