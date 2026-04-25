/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ShieldCheck, Zap, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function PremiumModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-12">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-10 shadow-xl rotate-6">
            <ShieldCheck className="text-white" size={40} />
          </div>

          <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">Unlock Professional Reporting</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
            You've reached a Premium-only feature. Upgrade today to unlock advanced exports, custom categories, and priority support.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "Export transactions to PDF and Excel",
              "Advanced monthly and yearly analytics",
              "Custom categories and payment methods",
              "Priority 24/7 customer support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-gray-700 font-bold text-sm tracking-tight">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/pricing" 
              onClick={onClose}
              className="w-full sm:flex-1 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
            >
              <Zap size={18} fill="currentColor" />
              Check Pricing
            </Link>
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-5 text-gray-400 font-bold hover:text-black transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 flex items-center justify-center gap-3 border-t border-gray-100">
          <ShieldCheck size={18} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Secure Checkout Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
