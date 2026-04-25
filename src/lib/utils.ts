/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
];

export const CATEGORIES = {
  EXPENSE: [
    'Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Others'
  ],
  INCOME: [
    'Salary', 'Freelance', 'Investment', 'Other'
  ]
};

export const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer'];
