'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Branch, Bank, Category, Transaction } from './types';
import { loadData, saveData, getInitialData } from './storage';

interface AppContextType {
  data: AppData;
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  addBank: (bank: Omit<Bank, 'id' | 'createdAt'>) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteBranch: (id: string) => void;
  deleteBank: (id: string) => void;
  deleteCategory: (id: string) => void;
  deleteTransaction: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialData());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(loadData());
  }, []);

  useEffect(() => {
    if (mounted) {
      saveData(data);
    }
  }, [data, mounted]);

  const addBranch = (branch: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...branch,
      id: `branch_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, branches: [...prev.branches, newBranch] }));
  };

  const addBank = (bank: Omit<Bank, 'id' | 'createdAt'>) => {
    const newBank: Bank = {
      ...bank,
      id: `bank_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, banks: [...prev.banks, newBank] }));
  };

  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: `category_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, transactions: [...prev.transactions, newTransaction] }));
  };

  const deleteBranch = (id: string) => {
    setData(prev => ({
      ...prev,
      branches: prev.branches.filter(b => b.id !== id),
      banks: prev.banks.filter(b => b.branchId !== id),
      categories: prev.categories.filter(c => c.branchId !== id),
      transactions: prev.transactions.filter(t => t.branchId !== id),
    }));
  };

  const deleteBank = (id: string) => {
    setData(prev => ({
      ...prev,
      banks: prev.banks.filter(b => b.id !== id),
      transactions: prev.transactions.filter(t => t.bankId !== id),
    }));
  };

  const deleteCategory = (id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      transactions: prev.transactions.filter(t => t.categoryId !== id),
    }));
  };

  const deleteTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        data,
        addBranch,
        addBank,
        addCategory,
        addTransaction,
        deleteBranch,
        deleteBank,
        deleteCategory,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
