'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Filter, Download, Trash2, CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { calculateBoxBalance } from '@/lib/storage';

const ALL_FILTER = '__all__';

export default function TransactionsPage() {
  const { data, deleteTransaction } = useApp();

  const [branchFilter, setBranchFilter] = useState(ALL_FILTER);
  const [bankFilter, setBankFilter] = useState(ALL_FILTER);
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER);
  const [currencyFilter, setCurrencyFilter] = useState(ALL_FILTER);
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    let filtered = [...data.transactions];

    if (branchFilter !== ALL_FILTER) {
      filtered = filtered.filter(t => t.branchId === branchFilter);
    }
    if (bankFilter !== ALL_FILTER) {
      filtered = filtered.filter(t => t.bankId === bankFilter);
    }
    if (categoryFilter !== ALL_FILTER) {
      filtered = filtered.filter(t => t.categoryId === categoryFilter);
    }
    if (currencyFilter !== ALL_FILTER) {
      filtered = filtered.filter(t => t.currency === currencyFilter);
    }
    if (typeFilter !== ALL_FILTER) {
      filtered = filtered.filter(t => t.type === typeFilter);
    }
    if (searchFilter) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(t => t.note?.toLowerCase().includes(search));
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data.transactions, branchFilter, bankFilter, categoryFilter, currencyFilter, typeFilter, searchFilter]);

  const transactionsWithBalance = useMemo(() => {
    return filteredTransactions.map((transaction, index) => {
      const previousTransactions = data.transactions
        .filter(t =>
          new Date(t.createdAt) <= new Date(transaction.createdAt) &&
          t.categoryId === transaction.categoryId &&
          t.currency === transaction.currency
        );

      const balance = calculateBoxBalance(previousTransactions, transaction.categoryId, transaction.currency);

      return { ...transaction, balance };
    });
  }, [filteredTransactions, data.transactions]);

  const clearFilters = () => {
    setBranchFilter(ALL_FILTER);
    setBankFilter(ALL_FILTER);
    setCategoryFilter(ALL_FILTER);
    setCurrencyFilter(ALL_FILTER);
    setTypeFilter(ALL_FILTER);
    setSearchFilter('');
  };

  const hasActiveFilters =
    branchFilter !== ALL_FILTER ||
    bankFilter !== ALL_FILTER ||
    categoryFilter !== ALL_FILTER ||
    currencyFilter !== ALL_FILTER ||
    typeFilter !== ALL_FILTER ||
    !!searchFilter;

  const exportToCSV = () => {
    const headers = ['Date', 'Branch', 'Bank', 'Category', 'Currency', 'Type', 'Amount', 'Balance', 'Note'];
    const rows = transactionsWithBalance.map(t => {
      const branch = data.branches.find(b => b.id === t.branchId);
      const bank = data.banks.find(b => b.id === t.bankId);
      const category = data.categories.find(c => c.id === t.categoryId);

      return [
        new Date(t.createdAt).toLocaleString(),
        branch?.name || '',
        bank?.name || '',
        category?.name || '',
        t.currency,
        t.type,
        t.amount,
        t.balance,
        t.note || '',
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Transaction History</h2>
          <p className="mt-2 text-slate-600">View and filter all transactions</p>
        </div>
        {filteredTransactions.length > 0 && (
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Branch</label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>All branches</SelectItem>
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
              <Select value={bankFilter} onValueChange={setBankFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="All banks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>All banks</SelectItem>
                  {data.banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>All categories</SelectItem>
                  {data.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Currency</label>
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="All currencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>All currencies</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="IQD">IQD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER}>All types</SelectItem>
                  <SelectItem value="IN">Money In</SelectItem>
                  <SelectItem value="OUT">Money Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Search Notes</label>
              <Input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search in notes..."
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {data.transactions.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <History className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No transactions yet</h3>
            <p className="mt-2 text-slate-600">Start by adding your first transaction</p>
          </CardContent>
        </Card>
      ) : filteredTransactions.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <Filter className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No transactions match your filters</h3>
            <p className="mt-2 text-slate-600">Try adjusting your filters to see more results</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsWithBalance.map((transaction) => {
                    const branch = data.branches.find(b => b.id === transaction.branchId);
                    const bank = data.banks.find(b => b.id === transaction.bankId);
                    const category = data.categories.find(c => c.id === transaction.categoryId);

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{branch?.name}</TableCell>
                        <TableCell>{bank?.name}</TableCell>
                        <TableCell>{category?.name}</TableCell>
                        <TableCell>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
                            {transaction.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {transaction.type === 'IN' ? (
                              <>
                                <ArrowDownCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-700">In</span>
                              </>
                            ) : (
                              <>
                                <ArrowUpCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-700">Out</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={transaction.type === 'IN' ? 'text-green-700' : 'text-red-700'}>
                            {transaction.type === 'IN' ? '+' : '-'}
                            {transaction.currency === 'USD' ? '$' : ''}
                            {transaction.amount.toLocaleString('en-US', {
                              minimumFractionDigits: transaction.currency === 'USD' ? 2 : 0,
                              maximumFractionDigits: transaction.currency === 'USD' ? 2 : 0,
                            })}
                            {transaction.currency === 'IQD' ? ' IQD' : ''}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {transaction.currency === 'USD' ? '$' : ''}
                          {transaction.balance.toLocaleString('en-US', {
                            minimumFractionDigits: transaction.currency === 'USD' ? 2 : 0,
                            maximumFractionDigits: transaction.currency === 'USD' ? 2 : 0,
                          })}
                          {transaction.currency === 'IQD' ? ' IQD' : ''}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-slate-600">
                          {transaction.note || '-'}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteTransaction(transaction.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredTransactions.length > 0 && (
        <div className="text-center text-sm text-slate-600">
          Showing {filteredTransactions.length} of {data.transactions.length} transactions
        </div>
      )}
    </div>
  );
}
