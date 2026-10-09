import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Building2,
  DollarSign,
  Ban,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Clock,
  X,
  Sliders,
  Check,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Hotel, Booking, HotelDateRule } from '../types';

interface AdminHotelCalendarProps {
  hotels: Hotel[];
  bookings: Booking[];
  onUpdateHotel: (updatedHotel: Hotel) => void;
  selectedHotelId?: string;
  onClose?: () => void;
}

export const AdminHotelCalendar: React.FC<AdminHotelCalendarProps> = ({
  hotels,
  bookings,
  onUpdateHotel,
  selectedHotelId,
  onClose
}) => {
  // Currently selected hotel ID
  const [activeHotelId, setActiveHotelId] = useState<string>(
    selectedHotelId || (hotels.length > 0 ? hotels[0].id : '')
  );

  // Current selected month & year (Default August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August

  // Selected date cell for quick edit popover/modal
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<number>(1000);
  const [editBlockedInput, setEditBlockedInput] = useState<boolean>(false);
  const [editNoteInput, setEditNoteInput] = useState<string>('');

  // Find active hotel
  const activeHotel = hotels.find((h) => h.id === activeHotelId) || hotels[0];

  if (!activeHotel) {
    return (
      <div className="p-8 text-center text-slate-400 font-bold bg-slate-900 rounded-3xl border border-slate-800">
        لا يوجد فنادق متاحة حالياً لإدارة التقويم.
      </div>
    );
  }

  // Month Names in Arabic
  const ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Calculate calendar grid days for current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayIndex = firstDayOfMonth.getDay(); // 0 = Sunday
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleOpenDateDetails = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    const existingRule = activeHotel.dateRules?.[dateStr];
    setEditPriceInput(existingRule?.customPrice || activeHotel.basePricePerNight);
    setEditBlockedInput(existingRule?.isBlocked || false);
    setEditNoteInput(existingRule?.note || '');
  };

  const handleSaveDateRule = () => {
    if (!selectedDateStr) return;

    const currentRules = activeHotel.dateRules || {};
    const updatedRule: HotelDateRule = {
      date: selectedDateStr,
      customPrice: editPriceInput !== activeHotel.basePricePerNight ? editPriceInput : undefined,
      isBlocked: editBlockedInput,
      note: editNoteInput.trim() || undefined
    };

    const updatedDateRules = {
      ...currentRules,
      [selectedDateStr]: updatedRule
    };

    const updatedHotel: Hotel = {
      ...activeHotel,
      dateRules: updatedDateRules
    };

    onUpdateHotel(updatedHotel);
    setSelectedDateStr(null);
  };

  // Bulk operation: Set weekend prices
  const handleApplyWeekendPricing = (multiplier: number = 1.25) => {
    const currentRules = { ...(activeHotel.dateRules || {}) };
    
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dayOfWeek = dateObj.getDay(); // 5 = Friday, 6 = Saturday in Saudi weekend
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const newPrice = Math.round(activeHotel.basePricePerNight * multiplier);
        currentRules[dateStr] = {
          ...(currentRules[dateStr] || {}),
          date: dateStr,
          customPrice: newPrice,
          note: 'سعر نهاية الأسبوع'
        };
      }
    }

    onUpdateHotel({
      ...activeHotel,
      dateRules: currentRules
    });
  };

  // Reset calendar for this hotel
  const handleResetCalendar = () => {
    if (window.confirm(`هل أنت تأكد من رغبتك في إعادة ضبط تقويم فندق ${activeHotel.name} واستعادة الأسعار الافتراضية؟`)) {
      onUpdateHotel({
        ...activeHotel,
        dateRules: {}
      });
    }
  };

  // Find booking on a date
  const getBookingForDate = (dateStr: string) => {
    return bookings.find(
      (b) =>
        b.hotelId === activeHotel.id &&
        b.status === 'confirmed' &&
        dateStr >= b.checkIn &&
        dateStr <= b.checkOut
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 dir-rtl font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>تقويم إتاحة وأسعار الفندق</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                تحكم حي
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              إدارة الأسعار الليلية، إغلاق الأيام للحجز، وعرض الحجوزات المؤكدة مباشرة على التقويم
            </p>
          </div>
        </div>

        {/* Hotel Selector & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Building2 className="w-4 h-4 text-amber-400 absolute right-3 top-3" />
            <select
              value={activeHotelId}
              onChange={(e) => setActiveHotelId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-9 pl-4 py-2.5 text-xs text-white font-black focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {hotels.map((h, idx) => (
                <option key={`${h.id}-${idx}`} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Hotel Stats & Quick Bulk Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl text-xs">
        <div className="flex items-center gap-3 p-2">
          <img loading="lazy" 
            src={activeHotel.image}
            alt={activeHotel.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
          />
          <div>
            <p className="font-black text-white text-sm">{activeHotel.name}</p>
            <p className="text-slate-400 text-[11px]">{activeHotel.city} • {activeHotel.starRating} نجوم</p>
          </div>
        </div>

        <div className="p-2 flex flex-col justify-center border-r md:border-r border-slate-800/60">
          <span className="text-slate-400 font-bold">السعر الافتراضي لليلة:</span>
          <span className="text-amber-400 font-black text-base mt-0.5">{activeHotel.basePricePerNight} ر.س</span>
        </div>

        <div className="p-2 flex flex-col justify-center border-r border-slate-800/60">
          <span className="text-slate-400 font-bold">حجوزات هذا الشهر:</span>
          <span className="text-emerald-400 font-black text-base mt-0.5">
            {bookings.filter(b => b.hotelId === activeHotel.id).length} حجز مؤكد
          </span>
        </div>

        {/* Quick Operations */}
        <div className="p-2 flex items-center gap-2 border-r border-slate-800/60">
          <button
            onClick={() => handleApplyWeekendPricing(1.25)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            title="رفع أسعار ليالي الجمعة والسبت بنسبة 25%"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تسعير الويكند (+25%)</span>
          </button>

          <button
            onClick={handleResetCalendar}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="إعادة ضبط التقويم"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Month Navigation Header */}
      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center gap-1 transition-all cursor-pointer text-xs"
        >
          <ChevronRight className="w-4 h-4" />
          <span>الشهر السابق</span>
        </button>

        <div className="text-center">
          <h3 className="text-base font-black text-white flex items-center gap-2 justify-center">
            <span>{ARABIC_MONTHS[currentMonth]}</span>
            <span className="text-amber-400 font-mono">{currentYear}</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">انقر على أي يوم لضبط السعر أو تغيير الإتاحة</p>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold flex items-center gap-1 transition-all cursor-pointer text-xs"
        >
          <span>الشهر التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
          <span>متاح بالسعر الأساسي</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500" />
          <span>موسمي / سعر مخصص</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500" />
          <span>مغلق / غير متاح</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500" />
          <span>محجوز لنزيل مؤكد</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 pb-1">
          {DAYS_OF_WEEK.map((dayName, idx) => (
            <div key={idx} className="p-2 bg-slate-950/80 rounded-xl border border-slate-800/60">
              {dayName}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2 text-xs">
          {/* Empty leading padding slots */}
          {Array.from({ length: startingDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-24 bg-slate-950/20 rounded-2xl border border-slate-900/40 opacity-30" />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            
            const rule = activeHotel.dateRules?.[dateStr];
            const booking = getBookingForDate(dateStr);

            const isBlocked = rule?.isBlocked;
            const hasCustomPrice = rule?.customPrice && rule.customPrice !== activeHotel.basePricePerNight;
            const price = rule?.customPrice || activeHotel.basePricePerNight;
            const note = rule?.note;

            return (
              <div
                key={dateStr}
                onClick={() => handleOpenDateDetails(dateStr)}
                className={`h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                  booking
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400'
                    : isBlocked
                    ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400 opacity-90'
                    : hasCustomPrice
                    ? 'bg-amber-950/30 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span className={`font-mono font-black text-sm ${
                    booking ? 'text-emerald-400' : isBlocked ? 'text-rose-400' : hasCustomPrice ? 'text-amber-400' : 'text-white'
                  }`}>
                    {dayNum}
                  </span>

                  {/* Status Indicator Icon */}
                  {booking ? (
                    <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400" title={`محجوز: ${booking.guestInfo.firstName}`}>
                      <UserCheck className="w-3.5 h-3.5" />
                    </span>
                  ) : isBlocked ? (
                    <span className="p-1 rounded-md bg-rose-500/20 text-rose-400" title="مغلق للحجز">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  ) : hasCustomPrice ? (
                    <span className="p-1 rounded-md bg-amber-500/20 text-amber-400" title="سعر مخصص">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  ) : null}
                </div>

                {/* Main Content Info */}
                <div className="mt-auto">
                  {booking ? (
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-emerald-300 truncate">
                        {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                      </p>
                      <p className="text-[9px] text-emerald-400/80 font-mono">{booking.bookingCode}</p>
                    </div>
                  ) : isBlocked ? (
                    <span className="text-[10px] font-bold text-rose-400">مغلق للحجز</span>
                  ) : (
                    <div>
                      <span className={`font-black font-sans text-xs ${hasCustomPrice ? 'text-amber-400' : 'text-slate-200'}`}>
                        {price} ر.س
                      </span>
                      {note && <p className="text-[9px] text-slate-400 truncate">{note}</p>}
                    </div>
                  )}
                </div>

                {/* Subtle Hover Action Hint */}
                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Edit Modal / Popover */}
      {selectedDateStr && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setSelectedDateStr(null)}
              className="absolute left-4 top-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-black text-sm">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">تعديل اليوم: {selectedDateStr}</h3>
                <p className="text-xs text-slate-400 font-medium">فندق {activeHotel.name}</p>
              </div>
            </div>

            {/* Existing Booking Check */}
            {getBookingForDate(selectedDateStr) && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1 text-emerald-300">
                <p className="font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>يوجد حجز مؤكد في هذا اليوم!</span>
                </p>
                <p className="text-[11px] text-emerald-200/80">
                  النزيل: {getBookingForDate(selectedDateStr)?.guestInfo.firstName} {getBookingForDate(selectedDateStr)?.guestInfo.lastName} ({getBookingForDate(selectedDateStr)?.bookingCode})
                </p>
              </div>
            )}

            <div className="space-y-4 text-xs font-bold text-slate-300">
              {/* Block / Unblock Toggle */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">إغلاق الحجز لهذا اليوم</p>
                  <p className="text-[10px] text-slate-500">منع العملاء من اختيار هذا التاريخ للحجز</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editBlockedInput}
                    onChange={(e) => setEditBlockedInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              {/* Price Override Input */}
              {!editBlockedInput && (
                <div>
                  <label className="block text-slate-300 mb-1.5">سعر الليلة لهذه التاريخ (ر.س)</label>
                  <input
                    type="number"
                    min={100}
                    value={editPriceInput}
                    onChange={(e) => setEditPriceInput(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-400 font-black text-base focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">السعر الافتراضي للفندق: {activeHotel.basePricePerNight} ر.س</p>
                </div>
              )}

              {/* Custom Note */}
              <div>
                <label className="block text-slate-300 mb-1.5">ملاحظة أو عنوان المناسبة (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: اليوم الوطني / عطلة نهاية الأسبوع"
                  value={editNoteInput}
                  onChange={(e) => setEditNoteInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedDateStr(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                onClick={handleSaveDateRule}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
