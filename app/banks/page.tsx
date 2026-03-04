'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Landmark, Plus, Trash2, Building2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function BanksPage() {
  const { data, addBank, deleteBank } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [branchId, setBranchId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && branchId) {
      addBank({ name: name.trim(), branchId });
      setName('');
      setBranchId('');
      setOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Banks</h2>
          <p className="mt-2 text-slate-600">Manage banks for each branch</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Bank
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bank</DialogTitle>
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
                <label className="text-sm font-medium text-slate-700">Bank Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter bank name"
                  className="mt-1.5"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                  Add Bank
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
            <p className="mt-2 text-slate-600">You need to create a branch first before adding banks</p>
          </CardContent>
        </Card>
      ) : data.banks.length === 0 ? (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <Landmark className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No banks yet</h3>
            <p className="mt-2 text-slate-600">Get started by adding your first bank</p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-6 bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Bank
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.branches.map((branch) => {
            const branchBanks = data.banks.filter(b => b.branchId === branch.id);
            if (branchBanks.length === 0) return null;

            return (
              <div key={branch.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  <h3 className="text-xl font-semibold text-slate-900">{branch.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {branchBanks.length} {branchBanks.length === 1 ? 'bank' : 'banks'}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {branchBanks.map((bank) => {
                    const bankTransactions = data.transactions.filter(t => t.bankId === bank.id);

                    return (
                      <Card key={bank.id} className="border-slate-200">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-green-50 p-2">
                              <Landmark className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold text-slate-900">
                                {bank.name}
                              </CardTitle>
                              <p className="mt-1 text-xs text-slate-500">
                                {bankTransactions.length} transactions
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
                                <AlertDialogTitle>Delete Bank</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this bank? This will also delete all associated transactions. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBank(bank.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardHeader>
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
