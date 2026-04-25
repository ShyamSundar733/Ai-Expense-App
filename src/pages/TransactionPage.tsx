/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Search, Filter, Download, MoreHorizontal, ArrowUpRight, ArrowDownLeft, X, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { CATEGORIES, PAYMENT_METHODS } from "../lib/utils";
import { transactionService } from "../services/transactionService";
import { Transaction } from "../types";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface TransactionPageProps {
  type: 'income' | 'expense';
  title: string;
  onPremiumFeature?: () => void;
}

export default function TransactionPage({ type, title, onPremiumFeature }: TransactionPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    note: '',
    paymentMethod: PAYMENT_METHODS[0]
  });

  const categories = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;

  useEffect(() => {
    const unsubscribe = transactionService.subscribeToTransactions(type, (data) => {
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    await transactionService.addTransaction({
      amount: parseFloat(formData.amount),
      date: Timestamp.fromDate(new Date(formData.date)),
      category: formData.category || categories[0],
      note: formData.note,
      type: type,
      paymentMethod: formData.paymentMethod || PAYMENT_METHODS[0]
    });

    setIsAdding(false);
    setFormData({
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: '',
      note: '',
      paymentMethod: PAYMENT_METHODS[0]
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await transactionService.deleteTransaction(id);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-500">Manage and track your {type} sources.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onPremiumFeature}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors text-sm font-bold"
            id="export-btn"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-bold shadow-sm"
            id="add-transaction-btn"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by note..." 
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-black/5 flex-1 md:flex-none">
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:text-gray-900 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Note</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Method</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                  No {type} records found. Start by adding one!
                </td>
              </tr>
            ) : transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {format(t.date.toDate(), 'MMM dd, yyyy')}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 italic">
                  {t.note || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                  {t.paymentMethod}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1 font-bold tabular-nums",
                    type === 'income' ? "text-emerald-600" : "text-gray-900"
                  )}>
                    {type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                    {type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Entry Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Add {title}</h2>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Amount</label>
                  <input 
                    type="number" 
                    required 
                    step="0.01"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00" 
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-gray-900 font-bold focus:ring-2 focus:ring-black/5" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-gray-900 font-bold focus:ring-2 focus:ring-black/5" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Category</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-gray-900 font-bold focus:ring-2 focus:ring-black/5"
                  >
                    <option value="">Select</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Method</label>
                  <select 
                    required
                    value={formData.paymentMethod}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-gray-900 font-bold focus:ring-2 focus:ring-black/5"
                  >
                    {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Note</label>
                <textarea 
                  rows={2} 
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                  placeholder="What was this for?" 
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-gray-900 font-bold focus:ring-2 focus:ring-black/5 resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
