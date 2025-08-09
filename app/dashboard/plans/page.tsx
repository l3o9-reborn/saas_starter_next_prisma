'use client'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import CurrentPlans from '@/components/CurrentPlans'
import CreatePlan from '@/components/CreatePlan'

function SubscriptionPlans() {
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const handleRefresh = () => setRefreshKey(prev => prev + 1)

  return (
    <div className="relative">
      {/* Plus Button */}
      <FaPlus
        onClick={() => setShowModal(true)}
        className="absolute top-0 right-0 md:top-2 md:right-2 h-10 w-10  p-2 rounded-full bg-pink-800 hover:bg-pink-600 hover:scale-105 duration-300 cursor-pointer z-10"
      />

      {/* Header */}
      <div>
        <h1 className="text-md md:text-2xl  text-white font-bold">Subscription Plans</h1>
        <p className="text-gray-400 mt-2">Manage your subscription plans here.</p>
      </div>

      {/* List of Plans */}
      <CurrentPlans openModal={setShowModal}  key={refreshKey}/>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 md:ml-20 md:bg-transparent flex items-center justify-center z-50">
            <div className=" text-white rounded-lg shadow-lg  mx-10 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className=" absolute top-2 right-3 text-white text-xl hover:text-pink-400"
            >
              &times;
            </button>

            {/* Create Plan Form */}
            <CreatePlan 
             
              onClose={() => setShowModal(false)}
              onSuccess={handleRefresh}
            />
            </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionPlans
