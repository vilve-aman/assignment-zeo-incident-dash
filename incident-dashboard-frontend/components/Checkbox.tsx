// Checkbox component for boolean selections
import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-zinc-700 border-zinc-300 rounded focus:ring-2 focus:ring-zinc-500"
      />
      <span className="text-sm text-zinc-700">{label}</span>
    </label>
  );
}
