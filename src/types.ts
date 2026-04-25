/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Timestamp } from 'firebase/firestore';

export type SubscriptionPlan = 'free' | 'premium';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currency: string;
  subscription: SubscriptionPlan;
  createdAt: Timestamp;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: Timestamp;
  note: string;
  type: TransactionType;
  createdAt: Timestamp;
}
