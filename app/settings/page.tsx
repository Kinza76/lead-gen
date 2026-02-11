"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

type BillingState = {
  subscription: { id?: string; plan: string; status: string };
  cards: Array<{ id: string; brand: string; last4: string; expMonth: number; expYear: number }>;
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [billing, setBilling] = useState<BillingState>({
    subscription: { plan: "Free", status: "active" },
    cards: []
  });
  const [plan, setPlan] = useState("Starter");
  const [cardNumber, setCardNumber] = useState("");

  const load = async () => {
    const res = await fetch("/api/billing");
    if (!res.ok) return;
    const data = await res.json();
    setBilling(data);
    setPlan(data.subscription?.plan ?? "Starter");
  };

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  if (status === "loading") return <p>Loading settings...</p>;
  if (!session?.user) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Login required</h1>
        <button onClick={() => signIn("google", { callbackUrl: "/settings" })} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white">Login</button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <header className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">Account & Billing</h1>
        <p className="text-sm text-slate-600">User: {session.user.name ?? session.user.email}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Subscription</h2>
          <p className="text-sm text-slate-600">Current: {billing.subscription.plan} ({billing.subscription.status})</p>
          <div className="mt-3 flex gap-2">
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-lg border p-2">
              <option>Starter</option>
              <option>Growth</option>
              <option>Agency</option>
            </select>
            <button
              className="rounded-lg bg-indigo-600 px-3 py-2 text-white"
              onClick={async () => {
                await fetch("/api/billing", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "subscription", id: billing.subscription.id, plan })
                });
                await load();
              }}
            >
              Update
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Card management</h2>
          <div className="mt-2 flex gap-2">
            <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full rounded-lg border p-2" placeholder="Card number" />
            <button
              className="rounded-lg bg-emerald-600 px-3 py-2 text-white"
              onClick={async () => {
                await fetch("/api/billing", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "card",
                    cardNumber,
                    brand: "Visa",
                    expMonth: 12,
                    expYear: new Date().getFullYear() + 2
                  })
                });
                setCardNumber("");
                await load();
              }}
            >
              Save card
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {billing.cards.map((card) => (
              <li key={card.id} className="rounded-lg border p-2">{card.brand} •••• {card.last4} (exp {card.expMonth}/{card.expYear})</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
