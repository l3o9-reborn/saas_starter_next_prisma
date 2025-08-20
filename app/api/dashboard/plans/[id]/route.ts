import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } =await params
  try {
    const deletedPlan = await prisma.subscriptionPlan.delete({
      where: { id }
    })
    return NextResponse.json(deletedPlan)
  } catch (error) {
    console.error('Error deleting subscription plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscription plan', details: `${error}` },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name, charge, isActive, currency, duration, features,stripePriceId } = body
    await prisma.feature.deleteMany({ where: { planId: id } })

const updatedPlan = await prisma.subscriptionPlan.update({
  where: { id },
  data: {
    name,
    charge,
    currency,
    isActive,
    duration,
    stripePriceId,
    features: {
      create: features.map((feature: string) => ({
        text: feature,
      }))
    }
  }
})

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error('Error updating subscription plan:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription plan', details: `${error}` },
      { status: 500 }
    )
  }
}