'use client'
import React, { useState } from 'react'

interface Plan {
  id: string
  name: string
  charge: number
  currency: string
  stripePriceId: string
  duration: 'MONTHLY' | 'YEARLY'
  isActive: boolean
  features: { id: string; text: string }[]
}

interface EditPlanProps {
  plan: Plan
  onClose: () => void
  onSuccess: () => void
}

const EditPlan: React.FC<EditPlanProps> = ({ plan, onClose, onSuccess }) => {
  const [name, setName] = useState(plan.name)
  const [charge, setCharge] = useState(plan.charge)
  const [currency, setCurrency] = useState(plan.currency)
  const [duration, setDuration] = useState<'MONTHLY' | 'YEARLY'>(plan.duration)
  const [isActive, setIsActive] = useState(plan.isActive)
  const [features, setFeatures] = useState<string[]>(plan.features.map(f => f.text))
  const [stripePriceId, setStripPriceId] =useState<string>(plan.stripePriceId?? '')
  const [newFeature, setNewFeature] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/dashboard/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, charge, currency, duration, isActive, features,stripePriceId }),
      })
      if (!res.ok) throw new Error('Update failed')
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-pink-800 p-6 rounded-lg w-full max-w-sm md:max-w-2xl shadow-2xl shadow-gray-950">
      <h2 className="text-xl font-bold mb-4">Edit Plan</h2>
       <label >Plan name</label>
      <input className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="Plan name" />
      <label >Price</label>
      <input type="number" className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none" value={charge} onChange={e => setCharge(Number(e.target.value))} placeholder="Charge" />
      <label >Currency</label>
      <input className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none" value={currency} onChange={e => setCurrency(e.target.value)} placeholder="Currency" />
      <label >Stripe Price Id</label>
      <input className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none" value={stripePriceId} onChange={e => setStripPriceId(e.target.value)} placeholder="Stripe Price Id" />

      <label >Plan Duration</label>
      <select value={duration} onChange={e => setDuration(e.target.value as 'MONTHLY' | 'YEARLY')} 
      className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none">
        <option value="MONTHLY">MONTHLY</option>
        <option value="YEARLY">YEARLY</option>
      </select>

      <label className="flex items-center mb-2">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        <span className="ml-2">Active</span>
      </label>

      <div className="mb-2">
        <p className="text-2xl underline">Features:</p>
        <ul className=" pl-4 ">
          {features.map((f, i) => (
            <li key={i} className="flex items-center justify-start gap-2">
             <button type="button" className="bg-white text-red-400 text-xl border-1 rounded-full h-5 w-5 flex items-center justify-center" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}>
                ×
              </button>
              {f}{' '}

            </li>
          ))}
        </ul>
        <input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          className="w-full mb-4 p-2 rounded border-2 border-white bg-gray-700 placeholder-gray-400 outline-none"
          placeholder="New feature"
        />
        <button
          type="button"
          className="mt-1 border-2 border-white hover:bg-white hover:text-pink-800 cursor-pointer px-2 py-1 rounded"
          onClick={() => {
            if (newFeature) {
              setFeatures([...features, newFeature])
              setNewFeature('')
            }
          }}
        >
          Add Feature
        </button>
      </div>

      <div className="mt-4 flex justify-between">
        <button type="button" onClick={onClose} className="text-white underline cursor-pointer">
          Cancel
        </button>
        <button type="submit" className=" cursor-pointer bg-white text-pink-900 px-4 py-2 rounded hover:scale-105 transition-transform duration-300">
          Save
        </button>
      </div>
    </form>
  )
}

export default EditPlan
