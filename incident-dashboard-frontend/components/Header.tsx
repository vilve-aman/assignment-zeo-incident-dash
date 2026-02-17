// Common header component used across all pages
import React from 'react';

interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

export default function Header({ title, action }: HeaderProps) {
  return (
    <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
      {action && <div>{action}</div>}
    </header>
  );
}
