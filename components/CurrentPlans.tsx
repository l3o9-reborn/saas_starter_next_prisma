'use client'
import React, { useEffect, useState } from 'react'
import { FaTrash, FaEdit } from 'react-icons/fa'
import EditPlan from './EditPlan' // make sure this path is correct

interface Plan {
  id: string
  name: string
  charge: number
  currency: string
  duration: 'MONTHLY' | 'YEARLY'
  isActive: boolean
  features: { id: string; text: string }[]
}
interface Props {
  openModal: React.Dispatch<React.SetStateAction<boolean>>
}

function CurrentPlans({openModal}: Props) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/dashboard/plans')
      if (!response.ok) {
        throw new Error('Failed to fetch plans')
      }
      const data = await response.json()
      setPlans(data)
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (planId: string) => {
    try {
      const response = await fetch(`/api/dashboard/plans/${planId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete plan')
      setPlans(plans.filter((p) => p.id !== planId))
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center mt-10">Current Plans</h1>

      {loading ? (
        <p>Loading plans...</p>
      ) : plans.length === 0 ? (
        <div className="text-gray-600 text-sm text-center">
          <p className="mb-2">No plans available.</p>
          <p>
            <a onClick={()=>openModal(true)} className=" cursor-pointer text-pink-600 underline hover:text-pink-800">
              Create a new plan →
            </a>
          </p>
        </div>
      ) : (
        <ul className="flex gap-4 flex-wrap justify-center">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="relative bg-pink-800 w-[300px] md:w-[400px] h-[600px] py-12 rounded-lg  font-mono text-white text-center shadow-2xl shadow-gray-950"
            >
              <div className="flex items-center flex-col justify-center p-5">
                <h2 className="text-4xl underline">{plan.name}</h2>
                <p>${plan.charge}/month</p>
              </div>

              <div className="text-left pl-5 text-sm">
                <p className="text-2xl">Features:</p>
                <ul className="pl-5 list-disc">
                  {plan.features.map((f) => (
                    <li key={f.id}>{f.text}</li>
                  ))}
                </ul>
              </div>
              <span className='absolute top-5 right-5 text-sm bg-gray-800 px-2 py-1 rounded-md '>
                {
                  plan.isActive ? (
                    <span className="text-green-400  ">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )
                }
              </span>

              <div className="absolute bottom-2 w-full flex justify-around py-5">
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="bg-white w-20 h-10 rounded-md text-pink-800 flex items-center justify-center hover:bg-pink-800 hover:text-white border-2 border-white transition-colors duration-300 cursor-pointer"
                >
                  <FaTrash className="text-2xl" />
                </button>

                <button
                  onClick={() => {
                    setSelectedPlan(plan)
                    setEditModalOpen(true)
                  }}
                  className="w-20 h-10 rounded-md border-2 border-white bg-pink-800 flex items-center justify-center hover:bg-white hover:text-pink-800 transition-colors duration-300 cursor-pointer"
                >
                  <FaEdit className="text-2xl" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-gray-800 md:bg-transparent md:ml-20 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-3 text-white text-xl hover:text-pink-400"
            >
              &times;
            </button>

            <EditPlan
              plan={selectedPlan}
              onClose={() => setEditModalOpen(false)}
              onSuccess={fetchPlans}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrentPlans
