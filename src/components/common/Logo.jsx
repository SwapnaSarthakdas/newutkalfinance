import React from 'react';

const Logo = ({ variant = 'dark', size = 'md', showTagline = true, onClick, fullImage = false }) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-11 sm:h-11',
    lg: 'w-11 h-11 sm:w-14 sm:h-14',
    xl: 'w-14 h-14 sm:w-20 sm:h-20',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-xl',
    lg: 'text-lg sm:text-2xl',
    xl: 'text-xl sm:text-3xl',
  };

  if (fullImage) {
    return (
      <div 
        className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <img
          src="/logo.jpg"
          alt="New Utkal Finance Ltd."
          className={`${iconSizes[size] || iconSizes.md} w-auto object-contain rounded-xl shadow-sm`}
        />
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 sm:gap-3 select-none flex-shrink-0 whitespace-nowrap ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`relative flex-shrink-0 ${iconSizes[size] || iconSizes.md} rounded-xl overflow-hidden bg-white p-0.5 shadow-md border border-slate-200/90 flex items-center justify-center group`}>
        <img
          src="/logo.jpg"
          alt="New Utkal Finance Logo"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute -top-0.5 -right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-white" />
      </div>

      <div className="flex flex-col flex-shrink-0 whitespace-nowrap">
        <div className="flex items-center gap-1 sm:gap-1.5 leading-tight whitespace-nowrap">
          <span className={`font-extrabold tracking-tight font-sans whitespace-nowrap ${titleSizes[size] || titleSizes.md} ${isLight ? 'text-white' : 'text-black'}`}>
            NEW UTKAL
          </span>
          <span className={`font-bold tracking-tight font-sans whitespace-nowrap ${titleSizes[size] || titleSizes.md} ${isLight ? 'text-white' : 'text-finance-600'}`}>
            FINANCE
          </span>
        </div>
        {showTagline && (
          <span className={`text-[8.5px] sm:text-[10px] uppercase font-semibold tracking-wider whitespace-nowrap ${isLight ? 'text-slate-300' : 'text-slate-500'} mt-0.5`}>
            Trust &bull; Growth &bull; Prosperity
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
