import React, { useState } from 'react';
import { X, Send, Building2, Calendar, Users, MessageSquareText, ShieldCheck, CheckCircle2, Phone, Mail, User, Sparkles, Clock } from 'lucide-react';
import { Hotel, HotelInquiry, RoomType } from '../types';

interface InquiryModalProps {
  hotel: Hotel | null;
  selectedRoom?: RoomType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: Omit<HotelInquiry, 'id' | 'inquiryCode' | 'createdAt' | 'status'>) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  hotel,
  selectedRoom,
  isOpen,
  onClose,
  onSubmitInquiry,
}) => {
  if (!isOpen || !hotel) return null;

  const [inquiryType, setInquiryType] = useState<HotelInquiry['inquiryType']>('availability');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) return;

    onSubmitInquiry({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelImage: hotel.image,
      inquiryType,
      checkIn,
      checkOut,
      guestsCount,
      userName,
      userPhone,
      userEmail,
      message,
    });

    const mockCode = 'INQ-' + Math.floor(10000 + Math.random() * 90000);
    setSubmittedCode(mockCode);
  };

  const handleReset = () => {
    setSubmittedCode(null);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">استفسار عن السعر والتوفر</h3>
              <p className="text-xs text-slate-400">تواصل مباشر مع إدارة وأصحاب {hotel.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedCode ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                تم إرسال الاستفسار بنجاح!
              </span>
              <h4 className="text-2xl font-black text-white">شكراً لك، {userName}</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                تم استلام طلب الاستفسار الخاص بـ <strong className="text-amber-400">{hotel.name}</strong> برقم تتبع:
              </p>
              <div className="inline-block bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-amber-400 font-bold text-lg dir-ltr">
                {submittedCode}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right text-xs text-slate-300 space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>زمن الرد المتوقع: خلال 15 إلى 30 دقيقة</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                سيقوم مسئول الضيافة بالفندق بمراجعة التواريخ والأسعار وإرسال الرد أو الاتصال بك على الرقم (<span className="text-white dir-ltr inline-block">{userPhone}</span>) لتقديم أفضل عرض سعر متاح.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              متابعة تصفح الفنادق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Selected Hotel Card Mini */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <img loading="lazy" 
                src={hotel.image}
                alt={hotel.name}
                className="w-16 h-14 rounded-xl object-cover border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{hotel.name}</h4>
                <p className="text-xs text-slate-400 truncate">{hotel.city} - {hotel.landmarkName}</p>
                {selectedRoom && (
                  <span className="inline-block text-[11px] font-semibold text-amber-400 mt-0.5">
                    الغرفة: {selectedRoom.name} ({selectedRoom.pricePerNight} ر.س)
                  </span>
                )}
              </div>
            </div>

            {/* Inquiry Type Radio Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">نوع الاستفسار المطلوبة من أصحاب الفندق:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInquiryType('availability')}
                  className={`p-2.5 rounded-xl border text-right font-bold transition-all ${
                    inquiryType === 'availability'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📅 التوفر والمواعيد
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('price_discount')}
                  className={`p-2.5 rounded-xl border text-right font-bold transition-all ${
                    inquiryType === 'price_discount'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💰 طلب خصم خاص/عروض
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('special_request')}
                  className={`p-2.5 rounded-xl border text-right font-bold transition-all ${
                    inquiryType === 'special_request'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🛏️ طلب أسرة أو غرف إضافية
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('events')}
                  className={`p-2.5 rounded-xl border text-right font-bold transition-all ${
                    inquiryType === 'events'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✨ مناسبات وحجوزات كبار الشخصيات
                </button>
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">تاريخ الوصول المتوقع</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">تاريخ المغادرة</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">عدد الضيوف</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>ضيف واحد</option>
                  <option value={2}>ضيفان (2)</option>
                  <option value={3}>3 ضيوف (عائلة)</option>
                  <option value={4}>4 ضيوف فأكثر</option>
                  <option value={8}>مجموعة / حجز متعدد</option>
                </select>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">اسمك الكريم *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد المحسن العتيبي"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">رقم الجوال / واتساب *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="05xxxxxxxx"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 dir-ltr text-right"
                  />
                </div>
              </div>
            </div>

            {/* Inquiry Message Text */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">تفاصيل استفسارك أو ملاحظاتك لإدارة الفندق</label>
              <textarea
                rows={3}
                placeholder="اكتب استفسارك هنا، مثال: هل يوجد خصم خاص لحجز 5 ليلة؟ وهل الإفطار شامل؟"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer hover:brightness-110"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الاستفسار لأصحاب الفندق مباشرة</span>
            </button>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>خدمة الاستفسار المباشر مجانية وسريعة بضمان منصة ڤيلوسيتي (Velocity)</span>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
