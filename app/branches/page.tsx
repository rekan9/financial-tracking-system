'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus, Trash2, Landmark, FolderKanban } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function BranchesPage() {
  const { data, addBranch, deleteBranch } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addBranch({ name: name.trim() });
      setName('');
      setOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Branches</h2>
          <p className="mt-2 text-slate-600">Manage your company branches</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Branch Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter branch name"
                  className="mt-1.5"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                  Add Branch
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
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No branches yet</h3>
            <p className="mt-2 text-slate-600">Get started by creating your first branch</p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-6 bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.branches.map((branch) => {
            const branchBanks = data.banks.filter(b => b.branchId === branch.id);
            const branchCategories = data.categories.filter(c => c.branchId === branch.id);
            const branchTransactions = data.transactions.filter(t => t.branchId === branch.id);

            return (
              <Card key={branch.id} className="border-slate-200">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {branch.name}
                      </CardTitle>
                      <p className="mt-1 text-xs text-slate-500">
                        Created {new Date(branch.createdAt).toLocaleDateString()}
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
                        <AlertDialogTitle>Delete Branch</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this branch? This will also delete all associated banks, categories, and transactions. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteBranch(branch.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Banks</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{branchBanks.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Categories</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{branchCategories.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Transactions</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{branchTransactions.length}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
