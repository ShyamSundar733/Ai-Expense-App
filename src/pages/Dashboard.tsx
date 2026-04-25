/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, TrendingUp, TrendingDown, Wallet, Calendar, ArrowRight, User, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { transactionService } from "../services/transactionService";
import { Transaction } from "../types";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const unsubscribe = transactionService.subscribeToTransactions('all', (data) => {
      setAllTransactions(data);
    });
    return () => unsubscribe();
  }, []);

  const totals = allTransactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const stats = [
    { label: 'Total Income', value: `$${totals.income.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Expenses', value: `$${totals.expense.toLocaleString()}`, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Remaining Balance', value: `$${(totals.income - totals.expense).toLocaleString()}`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const recentTransactions = allTransactions.slice(0, 5);

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Calendar size={14} /> Today is {format(new Date(), 'MMMM dd, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/expenses" 
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm font-bold shadow-lg"
          >
            <Plus size={18} />
            Add Expense
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">{stat.label}</p>
            <p className={cn("text-3xl font-black tabular-nums", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Monthly Performance</h2>
          <Link to="/reports" className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors">
            Full Analysis <ArrowRight size={14} />
          </Link>
        </div>
        <AnalyticsCharts data={allTransactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link to="/expenses" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest">See All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">No recent activity</div>
            ) : recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm",
                    t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                  )}>
                    {t.category[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.note || t.category}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.category} • {format(t.date.toDate(), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <p className={cn("font-black tabular-nums", t.type === 'income' ? 'text-emerald-600' : 'text-gray-900')}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <ShieldCheck className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Get advanced export tools, custom categories, and priority support today.
              </p>
              <Link 
                to="/pricing" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all text-sm"
              >
                Learn More
              </Link>
            </div>
            <div className="absolute -right-10 -bottom-10 text-white/5 group-hover:text-white/10 transition-colors">
              <ShieldCheck size={200} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Currency</span>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user?.currency || 'USD'}</span>
              </div>
              <Link to="/settings" className="block text-center text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest py-2">
                Manage all settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
