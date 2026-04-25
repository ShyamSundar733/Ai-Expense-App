/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, X, ShieldCheck, Zap } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function Pricing() {
  const { user, isPremium, upgrade } = useAuth();

  const PLANS = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for basic tracking.',
      features: [
        { text: 'Unlimited transactions', included: true },
        { text: 'Basic categories', included: true },
        { text: 'Dashboard analytics', included: true },
        { text: 'Export PDF/Excel', included: false },
        { text: 'Custom categories', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: isPremium ? 'Downgrade' : 'Current Plan',
      onClick: () => {},
      disabled: !isPremium,
      accent: 'gray'
    },
    {
      name: 'Premium',
      price: '$9',
      period: '/mo',
      description: 'For power users who need reports.',
      features: [
        { text: 'Unlimited transactions', included: true },
        { text: 'Custom categories', included: true },
        { text: 'Dashboard analytics', included: true },
        { text: 'Export PDF/Excel', included: true },
        { text: 'Advanced filters', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: isPremium ? 'Active Plan' : 'Upgrade to Premium',
      onClick: async () => {
        if (!isPremium) {
          await upgrade();
          alert('Welcome to Premium!');
        }
      },
      disabled: isPremium,
      accent: 'black'
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose your plan</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-lg italic serif">
          Unlock professional reporting and advanced analytics to take full control of your finances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "relative bg-white rounded-3xl p-8 border hover:shadow-xl transition-all duration-300",
              plan.accent === 'black' ? "border-gray-900 shadow-lg" : "border-gray-100"
            )}
          >
            {plan.accent === 'black' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                <Zap size={12} fill="currentColor" /> Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-500 text-sm">{plan.description}</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-500 font-medium">{plan.period}</span>}
            </div>

            <button 
              onClick={plan.onClick}
              disabled={plan.disabled}
              className={cn(
                "w-full py-4 rounded-xl font-bold transition-all mb-8 shadow-sm flex items-center justify-center gap-2",
                plan.accent === 'black' 
                  ? "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-emerald-600 disabled:opacity-100" 
                  : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-100 disabled:opacity-50"
              )}
            >
              {plan.accent === 'black' && <ShieldCheck size={18} />}
              {plan.cta}
            </button>

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Included Features</p>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                    feature.included ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-300"
                  )}>
                    {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    feature.included ? "text-gray-700" : "text-gray-400 line-through decoration-gray-300"
                  )}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-black text-white p-12 rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Enterprise Grade Security</h2>
          <p className="text-gray-400 max-w-md text-lg font-light leading-relaxed">
            Your financial data is encrypted and protected with industry-standard security protocols. We never sell your data.
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-10">
          <ShieldCheck size={400} />
        </div>
      </div>
    </div>
  );
}
