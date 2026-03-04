'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Landmark,
  FolderKanban,
  Plus,
  History,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/branches', label: 'Branches', icon: <Building2 className="h-5 w-5" /> },
  { href: '/banks', label: 'Banks', icon: <Landmark className="h-5 w-5" /> },
  { href: '/categories', label: 'Categories', icon: <FolderKanban className="h-5 w-5" /> },
  { href: '/transactions/new', label: 'New Transaction', icon: <Plus className="h-5 w-5" /> },
  { href: '/transactions', label: 'History', icon: <History className="h-5 w-5" /> },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">FinanceAdmin</span>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between px-8">
            <h1 className="text-xl font-semibold text-slate-900">Financial Management System</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  A
                </div>
                <span className="text-sm font-medium text-slate-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
