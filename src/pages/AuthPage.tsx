/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletCards, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-3">
          <WalletCards className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">SpendWise</h1>
        <p className="text-gray-500 font-medium">Professional expense management.</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto">
            {mode === 'login' 
              ? 'Sign in with Google to access your dashboard.' 
              : 'Start your journey with professional expense tracking.'}
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-100"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enterprise Security</span>
          <div className="h-px flex-1 bg-gray-100"></div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase text-center tracking-tighter">By continuing, you agree to our Terms of Service.</p>
          <div className="flex justify-center">
             <ShieldCheck className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <Link to={mode === 'login' ? '/signup' : '/login'} className="text-black font-bold hover:underline">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-gray-400">
        <ShieldCheck size={16} />
        <p className="text-xs font-bold uppercase tracking-wider">Enterprise Grade 256-bit Encryption</p>
      </div>
    </div>
  );
}
