'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle } from 'lucide-react';
import { TransactionType, Currency } from '@/lib/types';

export default function NewTransactionPage() {
  const router = useRouter();
  const { data, addTransaction } = useApp();

  const [branchId, setBranchId] = useState('');
  const [bankId, setBankId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currency, setCurrency] = useState<Currency | ''>('');
  const [type, setType] = useState<TransactionType>('IN');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const availableBanks = useMemo(() => {
    return data.banks.filter(b => b.branchId === branchId);
  }, [data.banks, branchId]);

  const availableCategories = useMemo(() => {
    return data.categories.filter(c => c.branchId === branchId);
  }, [data.categories, branchId]);

  const availableCurrencies = useMemo(() => {
    const category = data.categories.find(c => c.id === categoryId);
    return category ? category.currencies : [];
  }, [data.categories, categoryId]);

  const handleBranchChange = (value: string) => {
    setBranchId(value);
    setBankId('');
    setCategoryId('');
    setCurrency('');
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setCurrency('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (branchId && bankId && categoryId && currency && amount) {
      addTransaction({
        branchId,
        bankId,
        categoryId,
        currency,
        type,
        amount: parseFloat(amount),
        note: note.trim() || undefined,
      });
      router.push('/transactions');
    }
  };

  if (data.branches.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">New Transaction</h2>
          <p className="mt-2 text-slate-600">Add a new transaction</p>
        </div>
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <Plus className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Setup Required</h3>
            <p className="mt-2 text-slate-600">
              You need to create branches, banks, and categories before adding transactions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">New Transaction</h2>
        <p className="mt-2 text-slate-600">Add a new transaction to track money movement</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700">Branch</label>
                <Select value={branchId} onValueChange={handleBranchChange} required>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Bank</label>
                <Select value={bankId} onValueChange={setBankId} disabled={!branchId} required>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={branchId ? 'Select a bank' : 'Select branch first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBanks.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500">No banks available for this branch</div>
                    ) : (
                      availableBanks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Category</label>
                <Select value={categoryId} onValueChange={handleCategoryChange} disabled={!branchId} required>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={branchId ? 'Select a category' : 'Select branch first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500">No categories available for this branch</div>
                    ) : (
                      availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Currency</label>
                <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)} disabled={!categoryId} required>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={categoryId ? 'Select currency' : 'Select category first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500">No currencies available</div>
                    ) : (
                      availableCurrencies.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Transaction Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('IN')}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      type === 'IN'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ArrowDownCircle className="h-5 w-5" />
                    <span className="font-medium">Money In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('OUT')}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      type === 'OUT'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ArrowUpCircle className="h-5 w-5" />
                    <span className="font-medium">Money Out</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Note (Optional)</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any additional notes or reference number"
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
