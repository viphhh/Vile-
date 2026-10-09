import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkCheck, Calendar, Users, MapPin, Printer, Trash2, ShieldCheck, AlertCircle, Sparkles, MessageSquareText, Clock } from 'lucide-react';
import { Booking, HotelInquiry } from '../types';

interface MyBookingsViewProps {
  bookings: Booking[];
  inquiries?: HotelInquiry[];
  onCancelBooking: (bookingId: string) => void;
  onSimulateEmail?: (booking: Booking) => void;
  onExploreHotels: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  inquiries = [],
  onCancelBooking,
  onSimulateEmail,
  onExploreHotels,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'inquiries'>('bookings');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">سجل الحجوزات والاستفسارات</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">إدارة الحجوزات ومتابعة استفسارات السعر والتوفر المرسلة لأصحاب الفنادق</p>
        </div>

        {/* Sub Tabs Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الحجوزات ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'inquiries'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            استفسارات الأسعار والتوفر ({inquiries.length})
          </button>
        </div>
      </div>

      {/* SubTab 1: Bookings */}
      {activeSubTab === 'bookings' && (
        bookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-700">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">لا توجد حجوزات حالية مسجلة</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              لم تقم بإجراء أي حجز فندقي بعد. ابدأ الآن بالبحث واكتشف أفضل العروض والمنتجعات الفاخرة في مدن المملكة.
            </p>
            <button
              onClick={onExploreHotels}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
            >
              استكشف ڤيلوسيتي (Velocity) واقتنص عرضك
            </button>
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
            {bookings.map((booking) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={booking.id}
                className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all space-y-4 ${
                  booking.status === 'cancelled'
                    ? 'border-rose-900/50 bg-slate-950/60 opacity-75'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img loading="lazy" 
                      src={booking.hotelImage}
                      alt={booking.hotelName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-400 dir-ltr">{booking.bookingCode}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {booking.status === 'confirmed' ? '✓ مؤكد بالفندق' : '✕ ملغى'}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-white mt-1">{booking.hotelName}</h3>
                      <p className="text-xs text-amber-400 font-semibold">{booking.roomTypeName}</p>
                    </div>
                  </div>

                  <div className="text-right sm:text-left w-full sm:w-auto">
                    <span className="text-[10px] text-slate-400 block">المبلغ الإجمالي:</span>
                    <span className="text-xl font-black text-white">{booking.totalPrice} ر.س</span>
                    <span className="text-[10px] text-slate-500 block">شامل ضريبة 15%</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">تاريخ الوصول:</span>
                    <span className="text-slate-200 font-bold">{booking.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">تاريخ المغادرة:</span>
                    <span className="text-slate-200 font-bold">{booking.checkOut} ({booking.totalNights} ليالي)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">الضيف الرئيسي:</span>
                    <span className="text-slate-200 font-bold">{booking.guestInfo.firstName} {booking.guestInfo.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">طريقة الدفع:</span>
                    <span className="text-emerald-400 font-bold uppercase">{booking.paymentMethod}</span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSelectedBookingForDetails(booking)}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    عرض التذكرة والوصل الكامل 📋
                  </button>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        if (confirm('هل أنت تأكد من رغبتك في إلغاء هذا الحجز؟')) {
                          onCancelBooking(booking.id);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إلغاء الحجز</span>
                    </button>
                  )}
                </div>

              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        )
      )}

      {/* SubTab 2: Inquiries */}
      {activeSubTab === 'inquiries' && (
        inquiries.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-700">
              <MessageSquareText className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">لم تقم بإرسال أي استفسار بعد</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              يمكنك الاستفسار المباشر من أصحاب وإدارات الفنادق والمنتجعات عن توفر الأيام والخصومات قبل إتمام عملية الحجز.
            </p>
            <button
              onClick={onExploreHotels}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
            >
              اختر فندقاً وأرسل استفساراً
            </button>
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
            {inquiries.map((inquiry) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={inquiry.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <img loading="lazy" 
                      src={inquiry.hotelImage}
                      alt={inquiry.hotelName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400 dir-ltr">{inquiry.inquiryCode}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          قيد المراجعة والرد ⏳
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-white mt-0.5">{inquiry.hotelName}</h3>
                      <p className="text-xs text-slate-400">{inquiry.hotelCity}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>مرسل بتاريخ: {new Date(inquiry.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span><strong>الاسم:</strong> {inquiry.userName}</span>
                    <span><strong>الجوال:</strong> <span className="dir-ltr inline-block">{inquiry.userPhone}</span></span>
                    {inquiry.checkIn && <span><strong>الوصول المتوقع:</strong> {inquiry.checkIn}</span>}
                  </div>
                  {inquiry.message && (
                    <div className="pt-2 border-t border-slate-800/80 text-slate-300">
                      <strong className="block text-slate-400 mb-1">نص الاستفسار لأصحاب الفندق:</strong>
                      <p className="italic bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-amber-200">
                        "{inquiry.message}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        )
      )}

      {/* Ticket Details Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">تفاصيل تذكرة الحجز</h3>
              <button onClick={() => setSelectedBookingForDetails(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">رمز الحجز:</span>
                <span className="font-mono font-bold text-amber-400">{selectedBookingForDetails.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الفندق:</span>
                <span className="font-bold text-white">{selectedBookingForDetails.hotelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الغرفة:</span>
                <span className="font-bold text-white">{selectedBookingForDetails.roomTypeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">رقم جوال الضيف:</span>
                <span className="font-mono text-white">{selectedBookingForDetails.guestInfo.phone}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-extrabold text-sm text-amber-400">
                <span>المبلغ الكلي:</span>
                <span>{selectedBookingForDetails.totalPrice} ر.س</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSimulateEmail && onSimulateEmail(selectedBookingForDetails)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-bold text-xs border border-blue-500/30"
              >
                إرسال للبريد
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                طباعة الفاتورة
              </button>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
