import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Sparkles, Check, Clock } from 'lucide-react';

interface DateRangePickerProps {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  onChange: (checkIn: string, checkOut: string) => void;
}

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const WEEKDAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Parse current checkIn / checkOut or default to today & today+2
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = checkIn ? new Date(checkIn + 'T00:00:00') : new Date();
  const endDate = checkOut ? new Date(checkOut + 'T00:00:00') : new Date(Date.now() + 86400000 * 2);

  // Calendar view month & year
  const [viewYear, setViewYear] = useState<number>(startDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(startDate.getMonth());

  // Selection state when user clicks on calendar
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Sync temp dates when props change or popover opens
  useEffect(() => {
    if (isOpen) {
      const s = checkIn ? new Date(checkIn + 'T00:00:00') : new Date();
      const e = checkOut ? new Date(checkOut + 'T00:00:00') : new Date(Date.now() + 86400000 * 2);
      setTempStart(s);
      setTempEnd(e);
      setSelectingStep('start');
      setViewYear(s.getFullYear());
      setViewMonth(s.getMonth());
    }
  }, [isOpen, checkIn, checkOut]);

  // Calculate nights
  const getNightsCount = (s: Date | null, e: Date | null) => {
    if (!s || !e) return 0;
    const diffTime = e.getTime() - s.getTime();
    const nights = Math.round(diffTime / (1000 * 3600 * 24));
    return nights > 0 ? nights : 0;
  };

  const formattedDateStr = (date: Date | null) => {
    if (!date) return 'اختر تاريخاً';
    const day = date.getDate();
    const month = ARABIC_MONTHS[date.getMonth()];
    return `${day} ${month}`;
  };

  const toYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Date selection handler
  const handleDateClick = (date: Date) => {
    if (date < today) return; // Cannot select past dates

    if (selectingStep === 'start') {
      setTempStart(date);
      setTempEnd(null);
      setSelectingStep('end');
    } else {
      if (tempStart && date < tempStart) {
        // Reset start if selected date is before tempStart
        setTempStart(date);
        setTempEnd(null);
        setSelectingStep('end');
      } else if (tempStart && date.getTime() === tempStart.getTime()) {
        // Next day default if same date selected
        const nextDay = new Date(date.getTime() + 86400000);
        setTempEnd(nextDay);
        setSelectingStep('start');
        onChange(toYMD(tempStart), toYMD(nextDay));
        setIsOpen(false);
      } else if (tempStart) {
        setTempEnd(date);
        setSelectingStep('start');
        onChange(toYMD(tempStart), toYMD(date));
        setIsOpen(false);
      }
    }
  };

  // Quick preset ranges
  const applyPreset = (nights: number, daysFromNow: number = 0) => {
    const start = new Date(today.getTime() + daysFromNow * 86400000);
    const end = new Date(start.getTime() + nights * 86400000);
    setTempStart(start);
    setTempEnd(end);
    onChange(toYMD(start), toYMD(end));
    setIsOpen(false);
  };

  // Generate calendar grid days for current view month
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const daysArray: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(viewYear, viewMonth, d));
  }

  const nights = getNightsCount(tempStart, tempEnd);

  return (
    <div className="relative w-full" ref={popoverRef}>
      
      {/* Trigger Control Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-right bg-slate-950 border rounded-2xl p-3.5 transition-all flex items-center justify-between cursor-pointer ${
          isOpen
            ? 'border-amber-500 shadow-lg shadow-amber-500/10'
            : 'border-slate-800 hover:border-amber-500/50'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-bold text-slate-400">تاريخ الوصول والمغادرة</span>
            <div className="flex items-center gap-2 text-xs font-black text-white mt-0.5 truncate">
              <span>{formattedDateStr(startDate)}</span>
              <span className="text-amber-400">←</span>
              <span>{formattedDateStr(endDate)}</span>
              <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-500/20 mr-1 shrink-0">
                {getNightsCount(startDate, endDate)} ليالٍ
              </span>
            </div>
          </div>
        </div>

        <div className="text-slate-400 text-xs font-bold bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl shrink-0">
          تعديل
        </div>
      </button>

      {/* Interactive Popover Mini Calendar */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-slate-950 animate-fade-in text-slate-100 min-w-[310px] sm:min-w-[360px]">
          
          {/* Header & Night Counter Summary */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>اختر مواعيد إقامتك الفندقية</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectingStep === 'start' ? 'حدد تاريخ الوصول أولاً' : 'حدد تاريخ المغادرة الآن'}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Short-cuts bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-slate-800/80">
            <button
              type="button"
              onClick={() => applyPreset(2, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              ⚡ الليلة وغداً (ليلتان)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(2, 5)}
              className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              🏖️ عطلة نهاية الأسبوع
            </button>
            <button
              type="button"
              onClick={() => applyPreset(7, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              🗓️ أسبوع كامل (7 ليالٍ)
            </button>
          </div>

          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-sm font-black text-white">
              {ARABIC_MONTHS[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Weekdays Row */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS_AR.map((day) => (
              <span key={day} className="text-[10px] font-black text-slate-500 py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysArray.map((dateObj, idx) => {
              if (!dateObj) {
                return <div key={`empty-${idx}`} className="h-9" />;
              }

              const isPast = dateObj < today;
              const isToday = dateObj.getTime() === today.getTime();

              const isStart = tempStart && dateObj.getTime() === tempStart.getTime();
              const isEnd = tempEnd && dateObj.getTime() === tempEnd.getTime();

              // Range calculations
              const effectiveEnd = tempEnd || (hoverDate && tempStart && hoverDate > tempStart ? hoverDate : null);
              const isInRange =
                tempStart &&
                effectiveEnd &&
                dateObj > tempStart &&
                dateObj < effectiveEnd;

              let dayClasses = 'h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all relative select-none ';

              if (isPast) {
                dayClasses += 'text-slate-700 cursor-not-allowed opacity-40';
              } else if (isStart || isEnd) {
                dayClasses += 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 z-10 scale-105';
              } else if (isInRange) {
                dayClasses += 'bg-amber-500/20 text-amber-300 rounded-none border-y border-amber-500/30';
              } else if (isToday) {
                dayClasses += 'bg-slate-950 text-amber-400 border border-amber-500/40 hover:bg-slate-800';
              } else {
                dayClasses += 'bg-slate-950/60 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 hover:border hover:border-amber-500/30';
              }

              return (
                <button
                  type="button"
                  key={dateObj.toISOString()}
                  disabled={isPast}
                  onClick={() => handleDateClick(dateObj)}
                  onMouseEnter={() => !isPast && setHoverDate(dateObj)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={dayClasses}
                >
                  <span>{dateObj.getDate()}</span>
                  {isToday && !isStart && !isEnd && (
                    <span className="w-1 h-1 bg-amber-400 rounded-full absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Summary & Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">مدة الإقامة الفندقية:</span>
              <span className="font-extrabold text-amber-400">
                {tempStart ? formattedDateStr(tempStart) : '---'}
                {' ← '}
                {tempEnd ? formattedDateStr(tempEnd) : '---'}
                {nights > 0 && ` (${nights} ليالٍ)`}
              </span>
            </div>

            <button
              type="button"
              disabled={!tempStart || !tempEnd}
              onClick={() => {
                if (tempStart && tempEnd) {
                  onChange(toYMD(tempStart), toYMD(tempEnd));
                  setIsOpen(false);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد المواعيد</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
