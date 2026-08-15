import React from 'react';
import { Calendar as CalendarIcon, Check } from 'lucide-react';

interface DateRangeModalProps {
  selectedRange: string;
  onSelectRange: (range: string) => void;
  onClose: () => void;
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  selectedRange,
  onSelectRange,
  onClose
}) => {
  const options = [
    'Today (May 20, 2025)',
    'May 13 – May 20, 2025',
    'May 01 – May 20, 2025',
    'Last 30 Days',
    'This Quarter (Q2 2025)',
    'Custom Range...'
  ];

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-40 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Select Date Range</span>
        </div>
        <div className="py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelectRange(opt.includes('May 13') ? 'May 13 – May 20, 2025' : opt)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-left transition-colors"
            >
              <span>{opt}</span>
              {selectedRange === opt && <Check className="w-4 h-4 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
