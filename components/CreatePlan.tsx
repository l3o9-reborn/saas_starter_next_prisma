'use client'
import React, { useState } from 'react'

export interface CreatePlanProps {
  name: string
  charge: number
  duration: 'MONTHLY' | 'YEARLY'
  currency: string
  stripePriceId: string
  features: string[]
}

interface Props {

  onClose: () => void
  onSuccess: () => void
}

function CreatePlan({ onClose, onSuccess }: Props) {
  const [plan, setPlan] = useState<Omit<CreatePlanProps, 'features'> & { featureInput: string }>({
    name: '',
    charge: 0,
    duration: 'MONTHLY',
    currency: 'USD',
    stripePriceId:'',
    featureInput: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const features = plan.featureInput
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0)

    if (!plan.name || !plan.charge || features.length === 0) {
      alert('Please fill in all fields')
      return
    }

    const payload: CreatePlanProps = {
      name: plan.name,
      charge: plan.charge,
      duration: plan.duration,
      stripePriceId: plan.stripePriceId,
      currency: plan.currency,
      features,
    }

    try {
      setLoading(true)
      const res = await fetch('/api/dashboard/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create plan')

      alert('Plan created successfully!')
      setPlan({ name: '', charge: 0, duration: 'MONTHLY', currency: 'USD',stripePriceId: ' ' , featureInput: '' })
      onSuccess()
      onClose()

    } catch (error) {
      console.error(error)
      alert('Error creating plan')
    } finally {
      setLoading(false)
    }
  }

  return (

      <div className="bg-pink-800 text-white p-6 rounded-md shadow-2xl shadow-gray-950 max-w-sm md:max-w-2xl w-full">
      <h1 className="text-2xl font-bold mb-2">Create a New Plan</h1>
      <p className="text-sm text-gray-400 mb-4">
        Fill in the details and separate features with commas.
      </p>

      {/* Plan Name */}
      <input
        type="text"
        value={plan.name}
        onChange={(e) => setPlan({ ...plan, name: e.target.value })}
        placeholder="Plan Name"
        className="w-full mb-3 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none"
      />

      {/* Charge */}
      <input
        type="number"
        value={plan.charge}
        onChange={(e) => setPlan({ ...plan, charge: parseFloat(e.target.value) })}
        placeholder="Charge"
        className="w-full mb-3 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none"
      />
      {/* stripePriceId */}
        <input
        type="text"
        value={plan.stripePriceId}
        onChange={(e) => setPlan({ ...plan, stripePriceId: e.target.value })}
        placeholder="Stripe Price Id"
        className="w-full mb-3 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none"
      />

      {/* Duration */}
      <select
        value={plan.duration}
        onChange={(e) => setPlan({ ...plan, duration: e.target.value as 'MONTHLY' | 'YEARLY' })}
        className="w-full mb-3 p-2 rounded border-2 border-white bg-gray-700 text-white outline-none"
      >
        <option value="MONTHLY">Monthly</option>
        <option value="YEARLY">Yearly</option>
      </select>

      {/* Currency */}
      <input
        type="text"
        value={plan.currency}
        onChange={(e) => setPlan({ ...plan, currency: e.target.value })}
        placeholder="Currency (e.g., USD)"
        className="w-full mb-3 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none"
      />

      {/* Features */}
      <input
        type="text"
        value={plan.featureInput}
        onChange={(e) => setPlan({ ...plan, featureInput: e.target.value })}
        placeholder="Features (comma-separated)"
        className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full border-2 border-white  hover:bg-white hover:text-pink-800 cursor-pointer font-semibold py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Plan'}
      </button>
    </div>
  )
}

export default CreatePlan
