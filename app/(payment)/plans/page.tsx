'use client';

import { useState, useEffect } from 'react';
import { Plan } from '@/components/CurrentPlans';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data.plans);
        setSubscriptionStatus(data.user.subscriptionStatus);
        if (data.user.subscriptionPlanId) {
          setCurrentPlan(data.user.subscriptionPlanId);
        }
      })
      .catch(err => console.log('Error fetching Plans', err));
  }, []);

  const subscribe = async (planId: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const openPortal = async () => {
    const res = await fetch('/api/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  // Filter plans by duration
  const filteredPlans = plans.filter(plan => plan.duration === durationFilter);

  return (
    <div className="w-full min-h-[100vh] mx-auto p-6 bg-gray-200 ">
      <h1 className="text-2xl font-bold mb-4 text-center text-pink-800">Choose Your Plan</h1>

      {/* Duration Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-cyan-800 rounded-md border-2 border-pink-800 overflow-hidden ">
          <button
            onClick={() => setDurationFilter('MONTHLY')}
            className={`px-4 py-2 text-md font-medium rounded-sm cursor-pointer duration-500 hover:text-gray-400 ${
              durationFilter === 'MONTHLY' ? 'bg-pink-800 text-white' : 'bg-cyan-800 text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setDurationFilter('YEARLY')}
            className={`px-4 py-2 text-md font-medium rounded-sm cursor-pointer duration-500 hover:text-gray-400 ${
              durationFilter === 'YEARLY' ? 'bg-pink-800 text-white' : ' bg-cyan-800 text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row gap-6 justify-center">
        {filteredPlans.map((plan) => {
          const isCurrentActive =
            currentPlan === plan.id && subscriptionStatus === 'active';

          return (
            <div
              key={plan.id}
              className="bg-gray-900 min-h-100 w-[400px] px-4 flex flex-col justify-around rounded-md shadow-xl shadow-cyan-900"
            >
              <div>
                <h2 className="text-xl font-semibold text-center">{plan.name}</h2>
                <p className="text-pink-800 text-center">
                  ${plan.charge} / {plan.duration.toLowerCase()}
                </p>
              </div>
              <ul className="mt-4 text-md text-cyan-600 list-disc pl-5">
                {plan.features.map((f) => (
                  <li key={f.id}>{f.text}</li>
                ))}
              </ul>

              {isCurrentActive ? (
                <button
                  onClick={openPortal}
                  className="bg-cyan-800 h-10 w-full rounded-md mt-5 cursor-pointer hover:scale-105 duration-300"
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  onClick={() => subscribe(plan.id)}
                  className="bg-pink-800 h-10 w-full rounded-md mt-5 cursor-pointer hover:scale-105 duration-300"
                >
                  Subscribe
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
