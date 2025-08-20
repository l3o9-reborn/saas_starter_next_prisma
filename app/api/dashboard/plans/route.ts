import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const plans = await prisma.subscriptionPlan.findMany({
        include:{
            features: true,
            users: true
        }
    })
    return NextResponse.json(plans)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, charge, currency, duration, features,stripePriceId } = body

    const newPlan = await prisma.subscriptionPlan.create({
      data: {
        name,
        charge,
        currency,
        duration,
        stripePriceId,
        features: {
          create: features.map((feature: string) => ({ text: feature }))
        }
      }
    })

    return NextResponse.json(newPlan)
  } catch (error) {
    console.error('Error creating subscription plan:', error)

    return NextResponse.json(
      { error: 'Failed to create subscription plan', details: `${error}` },
      { status: 500 }
    )
  }
}