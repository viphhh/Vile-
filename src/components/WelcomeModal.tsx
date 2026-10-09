import React from 'react';
import { Crown, Sparkles, X, ShieldCheck, Hotel, Compass, Gift } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
  onOpenAi: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onExplore,
  onOpenAi,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Decorative Background & Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 text-center space-y-6">
          {/* Crown Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 mx-auto">
            <Crown className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold tracking-wide">
              مرحباً بك كعضو VIP
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              أهلاً بك كمسافر متميّز <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400">
                في ڤيلوسيتي (Velocity) 👑
              </span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed pt-1">
              يسعدنا تواجدك معنا! تمتع بتجربة حجز استثنائية لأفخم فنادق ومنتجعات المملكة العربية السعودية مع مميزات حصرية مخصصة لك.
            </p>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-2 gap-3 text-right bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">خصومات حصرية</h4>
                <p className="text-[11px] text-slate-400">أسعار خاصة للمسافرين المميزين</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">تأكيد فوري</h4>
                <p className="text-[11px] text-slate-400">حجز مضمون وبدون رسوم خفية</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">مساعد AI ذكي</h4>
                <p className="text-[11px] text-slate-400">توصيات مخصصة لجدول رحلتك</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
                <Hotel className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">تغطية شاملة</h4>
                <p className="text-[11px] text-slate-400">أرقى وجهات ومدن المملكة</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onExplore();
              }}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>استكشف الفنادق الفاخرة</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAi();
              }}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>المساعد الذكي</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
