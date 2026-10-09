import React, { useState } from 'react';
import { X, Calendar, Users, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building, Printer, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Hotel, RoomType, Booking, GuestInfo } from '../types';

interface BookingModalProps {
  hotel: Hotel | null;
  room: RoomType | null;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  roomsCount: number;
  onClose: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  room,
  checkInDate,
  checkOutDate,
  guestsCount,
  roomsCount,
  onClose,
  onBookingConfirmed,
}) => {
  if (!hotel || !room) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Details & Guest Info, 2: Payment, 3: Confirmation Ticket

  // Calculate nights
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pricePerNight = room.pricePerNight;
  const subtotal = pricePerNight * totalNights * roomsCount;
  const vatAmount = Math.round(subtotal * 0.15); // 15% Saudi VAT
  const totalPrice = subtotal + vatAmount;

  // Guest Form State
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'applepay' | 'credit' | 'hotel'>('mada');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.phone) {
      alert('يرجى تعبئة جميع بيانات الضيف الأساسية (الاسم ورقم الجوال)');
      return;
    }
    setStep(2);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const bookingCode = `KSA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newBooking: Booking = {
        id: `bk_${Date.now()}`,
        bookingCode,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        hotelCity: hotel.city,
        roomTypeId: room.id,
        roomTypeName: room.name,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalNights,
        guests: guestsCount,
        rooms: roomsCount,
        pricePerNight,
        subtotal,
        vatAmount,
        totalPrice,
        guestInfo,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setConfirmedBooking(newBooking);
      onBookingConfirmed(newBooking);
      setIsProcessing(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-auto">
        
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
              {step === 3 ? '✓' : step}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {step === 1 && 'إدخال بيانات الضيف والحجز'}
                {step === 2 && 'اختيار طريقة الدفع الآمنة'}
                {step === 3 && 'تأكيد الحجز وتذكرة الوصول'}
              </h3>
              <p className="text-[11px] text-slate-400">ڤيلوسيتي (Velocity) • حجز مؤكد ومضمون</p>
            </div>
          </div>

          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          
          {/* STEP 1: Guest Information & Summary */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-6">
              
              {/* Hotel & Room Recap Card */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                <img loading="lazy" 
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-800 hidden sm:block"
                />
                <div className="flex-1 text-xs space-y-1">
                  <h4 className="font-extrabold text-white text-sm">{hotel.name}</h4>
                  <p className="text-amber-400 font-bold">{room.name}</p>
                  <div className="flex flex-wrap gap-3 text-slate-400 pt-1 font-semibold">
                    <span>📅 الوصول: {checkInDate}</span>
                    <span>📅 المغادرة: {checkOutDate} ({totalNights} ليالي)</span>
                    <span>👥 {guestsCount} ضيوف / {roomsCount} غرفة</span>
                  </div>
                </div>
              </div>

              {/* Guest Form Fields */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-white">معلومات الضيف الرئيسي</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-300 mb-1">الاسم الأول *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: عبدالله"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">اسم العائلة *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: السبيعي"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">رقم الجوال (السعودية) *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="050XXXXXXX"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none text-left dir-ltr"
                      />
                      <span className="absolute left-3 top-3 text-slate-500 font-mono text-xs">+966</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">البريد الإلكتروني (لتأكيد الحجز)</label>
                    <input
                      type="email"
                      placeholder="example@domain.sa"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-500 focus:outline-none text-left dir-ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">طلبات خاصة (اختياري)</label>
                  <textarea
                    rows={2}
                    placeholder="مثال: طابق علوي، سرير إضافي، تسجيل وصول متأخر..."
                    value={guestInfo.specialRequests}
                    onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>إقامة الغرفة ({totalNights} ليالي × {pricePerNight} ر.س):</span>
                  <span>{subtotal} ر.س</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>ضريبة القيمة المضافة (15% VAT):</span>
                  <span>{vatAmount} ر.س</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black text-amber-400">
                  <span>الإجمالي الكلي للحجز:</span>
                  <span className="text-xl">{totalPrice} ر.س</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all"
              >
                المتابعة لاختيار طريقة الدفع ({totalPrice} ر.س)
              </button>

            </form>
          )}

          {/* STEP 2: Payment Selection */}
          {step === 2 && (
            <div className="space-y-6">
              
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="block text-xs text-slate-400">المبلغ الإجمالي المطلوبة دفعه:</span>
                  <span className="text-2xl font-black text-amber-400">{totalPrice} ر.س</span>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                  ✓ ضمان أفضل سعر
                </span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-white">اختر وسيلة الدفع المناسبة:</label>
                
                {/* Payment Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Mada */}
                  <button
                    onClick={() => setPaymentMethod('mada')}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'mada'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-sm">بطاقة مدى (Mada)</span>
                      <span className="text-[10px] text-slate-400">الدفع الفوري بالبطاقات السعودية</span>
                    </div>
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg">
                      مدى 🇸🇦
                    </span>
                  </button>

                  {/* Apple Pay */}
                  <button
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'applepay'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-sm">Apple Pay</span>
                      <span className="text-[10px] text-slate-400">دفع بنقرة واحدة آمنة وسريعة</span>
                    </div>
                    <Smartphone className="w-6 h-6 text-slate-100" />
                  </button>

                  {/* Credit Card */}
                  <button
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'credit'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-sm">بطاقة إئتمانية (Visa / Master)</span>
                      <span className="text-[10px] text-slate-400">فيزا أو ماستركارد</span>
                    </div>
                    <CreditCard className="w-6 h-6 text-amber-400" />
                  </button>

                  {/* Pay at Hotel */}
                  <button
                    onClick={() => setPaymentMethod('hotel')}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'hotel'
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-sm">الدفع في الفندق عند الوصول</span>
                      <span className="text-[10px] text-slate-400">احجز الآن وادفع لاحقاً في الاستقبال</span>
                    </div>
                    <Building className="w-6 h-6 text-emerald-400" />
                  </button>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
                >
                  الرجوع
                </button>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>جاري إكمال الحجز...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>تأكيد الحجز والدفع الفوري ({totalPrice} ر.س)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Booking Ticket Confirmation */}
          {step === 3 && confirmedBooking && (
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/40 mb-2">
                  تم تأكيد الحجز بنجاح! 🎉
                </span>
                <h3 className="text-2xl font-black text-white">تذكرة الوصول وحجز الفندق</h3>
                <p className="text-xs text-slate-400 mt-1">
                  تم إرسال نسخة التأكيد إلى جوالك عبر SMS والبريد الإلكتروني
                </p>
              </div>

              {/* Ticket Coupon Card */}
              <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-6 text-right space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">رقم مرجع الحجز (Booking Ref):</span>
                    <span className="text-xl font-mono font-black text-amber-400 dir-ltr block">{confirmedBooking.bookingCode}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">حالة الحجز:</span>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      مؤكد في الفندق
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-500 block">الفندق:</span>
                    <span className="text-white font-extrabold">{confirmedBooking.hotelName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">نوع الغرفة:</span>
                    <span className="text-amber-400 font-bold">{confirmedBooking.roomTypeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">تاريخ الوصول:</span>
                    <span className="text-white">{confirmedBooking.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">تاريخ المغادرة:</span>
                    <span className="text-white">{confirmedBooking.checkOut} ({confirmedBooking.totalNights} ليالي)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الضيف الرئيسي:</span>
                    <span className="text-white">{confirmedBooking.guestInfo.firstName} {confirmedBooking.guestInfo.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">المبلغ المدفوع الكلي:</span>
                    <span className="text-amber-400 font-black text-sm">{confirmedBooking.totalPrice} ر.س</span>
                  </div>
                </div>

                {/* QR Simulation */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">امسح رمز الاستجابة في موظف الاستقبال</span>
                    <span className="text-xs font-bold text-slate-300">طريقة الدفع: {confirmedBooking.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center text-slate-950 font-mono text-[9px] text-center font-bold">
                    [QR CODE KSA-STAYS]
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الفاتورة والوصل</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
                >
                  الذهاب لحجوزاتي
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
