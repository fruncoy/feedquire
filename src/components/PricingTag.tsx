import React from 'react';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'light' | 'dark';

export function PricingTag({ amount, previousAmount, size = 'md', tone = 'light', className = '' }: { amount: number; previousAmount?: number; size?: Size; tone?: Tone; className?: string }) {
  const pillBase = 'rounded-full px-2.5 py-1 text-xs font-semibold';
  const currentStyles = tone === 'light'
    ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm'
    : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md';
  const prevStyles = tone === 'light'
    ? 'bg-red-50 text-red-700 line-through'
    : 'bg-red-100 text-red-800 line-through';
  const gap = size === 'lg' ? 'gap-3' : size === 'sm' ? 'gap-1.5' : 'gap-2';

  return (
    <div className={`flex ${gap} items-center ${className}`}>
      {previousAmount != null && (
        <span className={`${pillBase} ${prevStyles}`}>${previousAmount.toFixed(2)}</span>
      )}
      <span className={`${pillBase} ${currentStyles}`}>${amount.toFixed(2)}</span>
    </div>
  );
}