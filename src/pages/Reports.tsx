/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileSpreadsheet, FileText, Lock, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { AnalyticsCharts, SpendingTrend } from "../components/AnalyticsCharts";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { exportToPDF, exportToExcel } from "../lib/exportUtils";
import { transactionService } from "../services/transactionService";
import { Transaction } from "../types";

export default function Reports({ onPremiumFeature }: { onPremiumFeature?: () => void }) {
  const { isPremium } = useAuth();
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = transactionService.subscribeToTransactions('all', (data) => {
      setData(data);
    });
    return () => unsubscribe();
  }, []);

  const handleExport = (type: 'pdf' | 'excel') => {
    if (!isPremium) {
      onPremiumFeature?.();
      return;
    }
    
    if (type === 'pdf') exportToPDF(data, 'Monthly Summary');
    else exportToExcel(data, 'Monthly Summary');
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Financial Reports</h1>
          <p className="text-sm text-gray-500">Comprehensive overview of your spending habits and income growth.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm">
            {['Monthly', 'Yearly', 'All Time'].map((p) => (
              <button 
                key={p} 
                className={cn(
                  "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                  p === 'Monthly' ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl hover:text-gray-900 shadow-sm transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-12">
        <AnalyticsCharts data={data} />
        <SpendingTrend data={data} />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF Export Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm group hover:border-gray-200 transition-all cursor-pointer relative overflow-hidden" 
               onClick={() => handleExport('pdf')}>
            <div className="flex items-start justify-between relative z-10">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <FileText size={28} />
              </div>
              {!isPremium && <Lock className="text-gray-300" size={20} />}
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Export to PDF</h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Get a professional, neatly formatted PDF document of your transactions and summary charts.
            </p>
            <button className={cn(
              "flex items-center gap-2 text-sm font-bold transition-all",
              isPremium ? "text-rose-600 hover:underline" : "text-gray-400"
            )}>
              Download PDF Report
            </button>
            {!isPremium && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">Premium Required</span>
            </div>}
          </div>

          {/* Excel Export Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm group hover:border-gray-200 transition-all cursor-pointer relative overflow-hidden"
               onClick={() => handleExport('excel')}>
            <div className="flex items-start justify-between relative z-10">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                <FileSpreadsheet size={28} />
              </div>
              {!isPremium && <Lock className="text-gray-300" size={20} />}
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Export to Excel</h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Download your data as a clean CSV/XLSX file, perfect for custom analysis in spreadsheet tools.
            </p>
            <button className={cn(
              "flex items-center gap-2 text-sm font-bold transition-all",
              isPremium ? "text-emerald-600 hover:underline" : "text-gray-400"
            )}>
              Generate Spreadsheet
            </button>
            {!isPremium && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">Premium Required</span>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
