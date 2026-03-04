import { AppData, Transaction, Box } from './types';

const STORAGE_KEY = 'financial-admin-data';

export const getInitialData = (): AppData => ({
  branches: [],
  banks: [],
  categories: [],
  transactions: [],
});

export const loadData = (): AppData => {
  if (typeof window === 'undefined') return getInitialData();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return getInitialData();
};

export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const calculateBoxBalance = (
  transactions: Transaction[],
  categoryId: string,
  currency: string
): number => {
  return transactions
    .filter(t => t.categoryId === categoryId && t.currency === currency)
    .reduce((balance, t) => {
      return t.type === 'IN' ? balance + t.amount : balance - t.amount;
    }, 0);
};

export const getBoxes = (data: AppData): Box[] => {
  const boxes: Box[] = [];

  data.categories.forEach(category => {
    category.currencies.forEach(currency => {
      boxes.push({
        categoryId: category.id,
        currency,
        balance: calculateBoxBalance(data.transactions, category.id, currency),
      });
    });
  });

  return boxes;
};
