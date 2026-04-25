/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, TransactionType } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const transactionService = {
  subscribeToTransactions: (type: TransactionType | 'all', callback: (transactions: Transaction[]) => void) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};

    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    if (type !== 'all') {
      q = query(q, where('type', '==', type));
    }

    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      callback(transactions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    });
  },

  addTransaction: async (data: Omit<Transaction, 'id' | 'createdAt' | 'userId'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    try {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        userId,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    }
  },

  updateTransaction: async (id: string, data: Partial<Transaction>) => {
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, { ...data });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${id}`);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      const docRef = doc(db, 'transactions', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `transactions/${id}`);
    }
  }
};
