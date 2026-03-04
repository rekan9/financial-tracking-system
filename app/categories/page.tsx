'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FolderKanban, Plus, Trash2, Building2, DollarSign } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Currency } from '@/lib/types';
import { calculateBoxBalance } from '@/lib/storage';

export default function CategoriesPage() {
  const { data, addCategory, deleteCategory } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>(['USD']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && branchId && currencies.length > 0) {
      addCategory({ name: name.trim(), branchId, currencies });
      setName('');
      setBranchId('');
      setCurrencies(['USD']);
      setOpen(false);
    }
  };

  const toggleCurrency = (currency: Currency) => {
    setCurrencies(prev =>
      prev.includes(currency)
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Categories</h2>
          <p className="mt-2 text-slate-600">Manage categories with currency boxes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Branch</label>
                <Select value={branchId} onValueChange={setBranchId} required>
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
                <label className="text-sm font-medium text-slate-700">Category Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Toyota, Kia"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Supported Currencies</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="usd"
                      checked={currencies.includes('USD')}
                      onCheckedChange={() => toggleCurrency('USD')}
                    />
                    <label htmlFor="usd" className="text-sm font-medium text-slate-700">
                      USD
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="iqd"
                      checked={currencies.includes('IQD')}
                      onCheckedChange={() => toggleCurrency('IQD')}
                    />
                    <label htmlFor="iqd" className="text-sm font-medium text-slate-700">
                      IQD
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                  Add Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {data.branches.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No branches available</h3>
            <p className="mt-2 text-slate-600">You need to create a branch first before adding categories</p>
          </CardContent>
        </Card>
      ) : data.categories.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No categories yet</h3>
            <p className="mt-2 text-slate-600">Get started by adding your first category</p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-6 bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.branches.map((branch) => {
            const branchCategories = data.categories.filter(c => c.branchId === branch.id);
            if (branchCategories.length === 0) return null;

            return (
              <div key={branch.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  <h3 className="text-xl font-semibold text-slate-900">{branch.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {branchCategories.length} {branchCategories.length === 1 ? 'category' : 'categories'}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {branchCategories.map((category) => {
                    const categoryTransactions = data.transactions.filter(t => t.categoryId === category.id);

                    return (
                      <Card key={category.id} className="border-slate-200">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-amber-50 p-2">
                              <FolderKanban className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold text-slate-900">
                                {category.name}
                              </CardTitle>
                              <p className="mt-1 text-xs text-slate-500">
                                {categoryTransactions.length} transactions
                              </p>
                            </div>
                          </div>
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
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this category? This will also delete all associated transactions. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {category.currencies.map((currency) => {
                            const balance = calculateBoxBalance(data.transactions, category.id, currency);
                            const isPositive = balance >= 0;

                            return (
                              <div
                                key={currency}
                                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                              >
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-slate-600" />
                                  <span className="text-sm font-medium text-slate-700">{currency}</span>
                                </div>
                                <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {currency === 'USD' ? '$' : ''}
                                  {balance.toLocaleString('en-US', {
                                    minimumFractionDigits: currency === 'USD' ? 2 : 0,
                                    maximumFractionDigits: currency === 'USD' ? 2 : 0,
                                  })}
                                  {currency === 'IQD' ? ' IQD' : ''}
                                </span>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
