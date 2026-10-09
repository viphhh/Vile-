import React, { useEffect, useState } from 'react';
import { Mail, X, CheckCircle2, FileText, Calendar, MapPin, CreditCard, ExternalLink } from 'lucide-react';
import { Booking } from '../types';

interface SimulatedEmailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const SimulatedEmailModal: React.FC<SimulatedEmailModalProps> = ({ booking, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSending, setIsSending] = useState(true);

  useEffect(() => {
    if (booking) {
      setIsVisible(true);
      setIsSending(true);
      
      // Simulate sending delay
      const timer = setTimeout(() => {
        setIsSending(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [booking]);

  if (!isVisible || !booking) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-300">
        
        {/* Email Client Header (macOS style) */}
        <div className="bg-slate-200/50 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>البريد الوارد (Simulated)</span>
          </div>
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>

        {isSending ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="relative">
              <Mail className="w-12 h-12 text-slate-300 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-slate-50 animate-bounce" />
            </div>
            <p className="font-bold text-sm">جاري إرسال تذكرة الحجز إلى البريد الإلكتروني...</p>
            <p className="text-xs text-slate-400 dir-ltr">{booking.guestInfo.email}</p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[80vh]">
            {/* Email Metadata */}
            <div className="bg-white border-b border-slate-100 p-4 shrink-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-1">تأكيد حجزك في {booking.hotelName} 🏨</h2>
                  <div className="flex flex-col text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-12 text-slate-400">من:</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">noreply@ksa-stays.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-12 text-slate-400">إلى:</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{booking.guestInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-12 text-slate-400">التاريخ:</span>
                      <span>{new Date(booking.createdAt).toLocaleString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                  تم الاستلام
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6 bg-slate-50 overflow-y-auto custom-scrollbar">
              <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm max-w-xl mx-auto">
                {/* Email Header */}
                <div className="text-center mb-8 border-b border-slate-100 pb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl mb-4 text-amber-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 mb-2">حجزك مؤكد يا {booking.guestInfo.firstName}!</h1>
                  <p className="text-slate-500 text-sm">يسعدنا أن نؤكد حجزك عبر منصة ڤيلوسيتي (Velocity). إليك تفاصيل التذكرة:</p>
                </div>

                {/* Email Content */}
                <div className="space-y-6">
                  {/* Booking Code Banner */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">رقم مرجع الحجز (Booking Ref)</p>
                    <p className="text-2xl font-mono font-black text-slate-800 tracking-wider dir-ltr">{booking.bookingCode}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold mb-0.5">الفندق والوجهة</p>
                        <p className="text-sm font-semibold text-slate-900">{booking.hotelName}</p>
                        <p className="text-xs text-slate-500">{booking.hotelCity}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold mb-0.5">مواعيد الإقامة</p>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                          <div>
                            <span className="block text-[10px] text-slate-400 font-normal">تسجيل الوصول</span>
                            {booking.checkIn}
                          </div>
                          <div className="w-6 border-t-2 border-dashed border-slate-300" />
                          <div>
                            <span className="block text-[10px] text-slate-400 font-normal">تسجيل المغادرة</span>
                            {booking.checkOut}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">المدة: {booking.totalNights} ليالي</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold mb-0.5">تفاصيل الدفع</p>
                        <p className="text-sm font-semibold text-slate-900">المبلغ الإجمالي: {booking.totalPrice} ر.س</p>
                        <p className="text-xs text-slate-500">
                          طريقة الدفع: {booking.paymentMethod === 'hotel' ? 'الدفع في الفندق عند الوصول' : 'بطاقة ائتمانية'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3 justify-center">
                    <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      الذهاب للوحة التحكم
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
                  <p>هذا البريد الإلكتروني مرسل تلقائياً من نظام منصة ڤيلوسيتي (Velocity).</p>
                  <p>لأي استفسار، يرجى التواصل معنا عبر info@ksa-stays.com</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
