// components/ManageSubscription.tsx
'use client';

export default function ManageSubscription({ status }: { status: string | null }) {
  const cancelSubscription = async () => {
    const res = await fetch('/api/cancel-subscription', { method: 'POST' });
    const data = await res.json();
    alert(data.message || 'Subscription updated');
  };

  if (status === 'active') {
    return (
      <button
        onClick={cancelSubscription}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Cancel Subscription
      </button>
    );
  }

  return <p>No active subscription</p>;
}
