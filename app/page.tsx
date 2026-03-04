'use client';

import { useApp } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Landmark, FolderKanban, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { calculateBoxBalance } from '@/lib/storage';

export default function Home() {
  const { data } = useApp();

  const totalInTransactions = data.transactions
    .filter(t => t.type === 'IN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutTransactions = data.transactions
    .filter(t => t.type === 'OUT')
    .reduce((sum, t) => sum + t.amount, 0);

  const usdBoxes = data.categories.flatMap(cat =>
    cat.currencies.includes('USD')
      ? [{ categoryId: cat.id, balance: calculateBoxBalance(data.transactions, cat.id, 'USD') }]
      : []
  );

  const iqdBoxes = data.categories.flatMap(cat =>
    cat.currencies.includes('IQD')
      ? [{ categoryId: cat.id, balance: calculateBoxBalance(data.transactions, cat.id, 'IQD') }]
      : []
  );

  const totalUSD = usdBoxes.reduce((sum, box) => sum + box.balance, 0);
  const totalIQD = iqdBoxes.reduce((sum, box) => sum + box.balance, 0);

  const stats = [
    {
      title: 'Total Branches',
      value: data.branches.length,
      icon: <Building2 className="h-5 w-5 text-slate-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Total Banks',
      value: data.banks.length,
      icon: <Landmark className="h-5 w-5 text-slate-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Total Categories',
      value: data.categories.length,
      icon: <FolderKanban className="h-5 w-5 text-slate-600" />,
      color: 'bg-amber-50',
    },
    {
      title: 'Total Transactions',
      value: data.transactions.length,
      icon: <DollarSign className="h-5 w-5 text-slate-600" />,
      color: 'bg-slate-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-slate-600">Overview of your financial management system</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Total Balance by Currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-sm font-medium text-slate-600">USD Balance</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-sm font-medium text-slate-600">IQD Balance</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalIQD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} IQD
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
              <div>
                <p className="text-sm font-medium text-green-700">Total Inflow</p>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {totalInTransactions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
              <div>
                <p className="text-sm font-medium text-red-700">Total Outflow</p>
                <p className="mt-1 text-2xl font-bold text-red-900">
                  {totalOutTransactions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {data.branches.length === 0 && (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Get Started</h3>
            <p className="mt-2 text-slate-600">
              Start by creating your first branch, then add banks and categories to begin tracking finances.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
