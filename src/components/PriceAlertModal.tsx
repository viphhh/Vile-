import React, { useState } from 'react';
import { X, Bell, BellRing, ShieldCheck, CheckCircle2, TrendingDown, DollarSign, Smartphone, Mail, Sparkles } from 'lucide-react';
import { Hotel, PriceAlert } from '../types';

interface PriceAlertModalProps {
  hotel: Hotel | null;
  existingAlert?: PriceAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onRemoveAlert?: (alertId: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  hotel,
  existingAlert,
  isOpen,
  onClose,
  onSaveAlert,
  onRemoveAlert,
}) => {
  if (!isOpen || !hotel) return null;

  const currentPrice = hotel.discountedPrice || hotel.basePricePerNight;
  const [targetPrice, setTargetPrice] = useState<number>(
    existingAlert?.targetPrice || Math.round(currentPrice * 0.85)
  );
  const [contactChannel, setContactChannel] = useState<'whatsapp' | 'email' | 'push'>(
    existingAlert?.contactChannel || 'whatsapp'
  );
  const [contactValue, setContactValue] = useState<string>(
    existingAlert?.contactValue || ''
  );
  const [receiveBookingAlerts, setReceiveBookingAlerts] = useState<boolean>(
    existingAlert?.receiveBookingAlerts || false
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    onSaveAlert({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      hotelCity: hotel.city,
      currentPrice,
      targetPrice: Number(targetPrice),
      contactChannel,
      contactValue,
      enabled: true,
      receiveBookingAlerts,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">تنبيه انخفاض السعر وحالة الحجز 🔔</h3>
              <p className="text-xs text-slate-400">احصل على إشعار فوري عند انخفاض سعر هذا الفندق</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-white">تم تفعيل التنبيه بنجاح!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              سنقوم بمراقبة أسعار <strong className="text-amber-400">{hotel.name}</strong> فوراً وإرسال إشعار لك فور انخفاض السعر إلى <strong className="text-emerald-400 dir-ltr inline-block">{targetPrice} ر.س</strong> أو أقل.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Hotel Mini Preview Card */}
            <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <img loading="lazy" 
                src={hotel.image}
                alt={hotel.name}
                className="w-16 h-14 rounded-xl object-cover border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{hotel.name}</h4>
                <p className="text-xs text-slate-400 truncate">{hotel.city}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">السعر الحالي:</span>
                  <span className="text-sm font-black text-amber-400">{currentPrice} ر.س</span>
                </div>
              </div>
            </div>

            {/* Target Price Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  السعر المستهدف للإنذار (ر.س)
                </label>
                <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                  خصم حوالي {Math.round((1 - targetPrice / currentPrice) * 100)}%
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={100}
                  max={currentPrice}
                  step={10}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 dir-ltr text-right"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTargetPrice(Math.round(currentPrice * 0.9))}
                  className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300"
                >
                  خصم 10% ({Math.round(currentPrice * 0.9)} ر.س)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPrice(Math.round(currentPrice * 0.8))}
                  className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300"
                >
                  خصم 20% ({Math.round(currentPrice * 0.8)} ر.س)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetPrice(Math.round(currentPrice * 0.7))}
                  className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300"
                >
                  خصم 30% ({Math.round(currentPrice * 0.7)} ر.س)
                </button>
              </div>
            </div>

            {/* Notification Channel Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">طريقة تلقي الإشعار:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setContactChannel('whatsapp')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    contactChannel === 'whatsapp'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>واتساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactChannel('email')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    contactChannel === 'email'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>بريد إلكتروني</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactChannel('push')}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    contactChannel === 'push'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>إشعار بالموقع</span>
                </button>
              </div>
            </div>

            {/* Contact Input Value */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {contactChannel === 'whatsapp'
                  ? 'رقم الجوال / واتساب *'
                  : contactChannel === 'email'
                  ? 'عنوان البريد الإلكتروني *'
                  : 'اسم أو معرف التنبيه *'}
              </label>
              <input
                type={contactChannel === 'email' ? 'email' : 'text'}
                required
                placeholder={
                  contactChannel === 'whatsapp'
                    ? '05xxxxxxxx'
                    : contactChannel === 'email'
                    ? 'example@domain.com'
                    : 'تنبيه إقاماتي'
                }
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 dir-ltr text-right"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-2">
              {existingAlert && onRemoveAlert && (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveAlert(existingAlert.id);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs transition-all"
                >
                  إلغاء التنبيه
                </button>
              )}

              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <BellRing className="w-4 h-4" />
                <span>{existingAlert ? 'تحديث التنبيه' : 'تفعيل التنبيهات (السعر / حالة الحجز)'}</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>نضمن لك تلقي التنبيه فور انخفاض أسعار الغرف أو توفر العروض المباشرة</span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
