export interface Branch {
  id: string;
  name: string;
  createdAt: string;
}

export interface Bank {
  id: string;
  name: string;
  branchId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  branchId: string;
  currencies: Currency[];
  createdAt: string;
}

export type Currency = 'USD' | 'IQD';

export interface Box {
  categoryId: string;
  currency: Currency;
  balance: number;
}

export type TransactionType = 'IN' | 'OUT';

export interface Transaction {
  id: string;
  branchId: string;
  bankId: string;
  categoryId: string;
  currency: Currency;
  type: TransactionType;
  amount: number;
  note?: string;
  createdAt: string;
}

export interface AppData {
  branches: Branch[];
  banks: Bank[];
  categories: Category[];
  transactions: Transaction[];
}
