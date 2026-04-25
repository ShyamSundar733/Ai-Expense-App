/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Shield, Wallet, ChevronRight, Globe, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Settings() {
  const { user } = useAuth();
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [loading, setLoading] = useState(false);

  const handleUpdateCurrency = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { currency });
      alert('Settings updated!');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Profile Settings',
      icon: User,
      items: [
        { label: 'Display Name', value: user?.displayName || 'N/A', type: 'text' },
        { label: 'Email Address', value: user?.email || 'N/A', type: 'email' },
      ]
    },
    {
      title: 'Preferences',
      icon: Wallet,
      items: [
        { label: 'Subscription Plan', value: user?.subscription?.toUpperCase() || 'FREE', type: 'text' },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Wallet className="text-gray-400" size={20} />
            <h3 className="font-bold text-gray-900">Currency Settings</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Preferred Currency</p>
                <p className="text-sm text-gray-500">How your amounts are displayed.</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-gray-50 border-none rounded-xl py-2 px-4 text-sm font-bold focus:ring-2 focus:ring-black/5"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
                <button 
                  onClick={handleUpdateCurrency}
                  disabled={loading || currency === user?.currency}
                  className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <section.icon className="text-gray-400" size={20} />
              <h3 className="font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item) => (
                <div key={item.label} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Globe className="text-gray-400" size={24} />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Global Accessibility</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          SpendWise supports multi-currency and global payment methods for seamless tracking worldwide.
        </p>
      </div>
    </div>
  );
}
