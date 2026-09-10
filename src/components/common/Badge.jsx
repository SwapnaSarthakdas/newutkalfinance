import React from 'react';

const Badge = ({ status, size = 'sm', className = '' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (['completed', 'active', 'verified', 'approved', 'success'].includes(normalized)) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    dotColor = 'bg-emerald-500';
  } else if (['pending', 'in review', 'processing'].includes(normalized)) {
    style = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (['rejected', 'failed', 'suspended', 'flagged'].includes(normalized)) {
    style = 'bg-rose-50 text-rose-700 border-rose-200/80';
    dotColor = 'bg-rose-500';
  } else if (['deposit'].includes(normalized)) {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (['withdrawal'].includes(normalized)) {
    style = 'bg-slate-100 text-slate-800 border-slate-200';
    dotColor = 'bg-slate-500';
  } else if (['loan payment'].includes(normalized)) {
    style = 'bg-finance-50 text-finance-800 border-finance-200';
    dotColor = 'bg-finance-600';
  } else if (['transfer'].includes(normalized)) {
    style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotColor = 'bg-indigo-500';
  }

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${sizes[size] || sizes.sm} ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default Badge;
