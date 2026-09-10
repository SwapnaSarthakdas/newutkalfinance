import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-finance-50 text-finance-600',
  trend,
  trendType = 'up',
  actionLabel,
  onAction,
  badgeText
}) => {
  return (
    <div
      onClick={onAction}
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between ${
        onAction ? 'cursor-pointer hover:border-finance-300 group' : ''
      }`}
    >
      {/* Top Header & Metric */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span
            className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate"
            title={title}
          >
            {title}
          </span>
          {Icon && (
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} shadow-2xs group-hover:scale-105 transition-transform`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div
          className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate"
          title={String(value)}
        >
          {value}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1 truncate" title={subtitle}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer Indicators & Action */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-md whitespace-nowrap ${
                trendType === 'up'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {trendType === 'up' ? (
                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span>{trend}</span>
            </span>
          )}
          {badgeText && (
            <span className="bg-slate-100 text-slate-700 border border-slate-200/60 px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap">
              {badgeText}
            </span>
          )}
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="font-bold text-xs text-finance-600 hover:text-finance-800 transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0 ml-auto group-hover:translate-x-0.5 transition-transform cursor-pointer"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StatCard;
