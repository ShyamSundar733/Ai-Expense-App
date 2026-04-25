/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction } from '../types';
import { format } from 'date-fns';

// Extend jsPDF for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (transactions: Transaction[], title: string) => {
  const doc = new jsPDF();
  const dateStr = format(new Date(), 'yyyy-MM-dd');

  doc.setFontSize(20);
  doc.text(`SpendWise - ${title}`, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${dateStr}`, 14, 30);

  const tableData = transactions.map(t => [
    format(t.date.toDate ? t.date.toDate() : new Date(t.date as any), 'MMM dd, yyyy'),
    t.category,
    t.note,
    t.paymentMethod,
    `${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 40,
    head: [['Date', 'Category', 'Note', 'Method', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0] },
  });

  doc.save(`SpendWise_Report_${dateStr}.pdf`);
};

export const exportToExcel = (transactions: Transaction[], title: string) => {
  const worksheet = XLSX.utils.json_to_sheet(transactions.map(t => ({
    Date: format(t.date.toDate ? t.date.toDate() : new Date(t.date as any), 'yyyy-MM-dd'),
    Type: t.type.toUpperCase(),
    Category: t.category,
    Note: t.note,
    Method: t.paymentMethod,
    Amount: t.amount
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  XLSX.writeFile(workbook, `SpendWise_Data_${dateStr}.xlsx`);
};
