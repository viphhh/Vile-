import React from 'react';
import { Building2, PhoneCall, Mail, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';

import { SitePage } from '../types';

interface FooterProps {
  pages?: SitePage[];
  onPageClick?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ pages = [], onPageClick }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">ڤيلوسيتي (Velocity)</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              منصة حجوزات الفنادق والمنتجعات الفاخرة الأولى بالمملكة العربية السعودية، تدعم أفضل الأسعار والضمان الفوري في كافة مدن المملكة.
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-400">
              🇸🇦 داعمون لرؤية المملكة 2030 لتطوير قطاع السياحة والضيافة
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-white">أشهر وجهات الحجز</h4>
            <ul className="space-y-1.5 text-slate-400 font-medium">
              <li>• فنادق مكة المكرمة الكعبة</li>
              <li>• فنادق المدينة المنورة الحرم</li>
              <li>• أبراج وفنادق الرياض العليا</li>
              <li>• شاليهات ومنتجعات جدة</li>
              <li>• منتجعات العلا وادي أشار</li>
              <li>• فنادق الخبر والشرقية</li>
            </ul>
          </div>

          {/* Payment Methods & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white">وسائل الدفع والضمان</h4>
            <p className="text-slate-400 leading-relaxed">
              نوفر جميع طرق الدفع الآمنة مع التأكيد الفوري للحجز وإلغاء مرن:
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-white">
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">مدى Mada 🇸🇦</span>
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">Apple Pay</span>
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">Visa / Mastercard</span>
              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">الدفع بالفندق</span>
            </div>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white">مركز خدمة العملاء 24/7</h4>
            <div className="space-y-2 text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>الرقم الموحد: <strong className="dir-ltr inline-block text-white font-mono">0593284877</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>البريد: support@mamlaka-hotels.sa</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>الرياض، طريق الملك فهد، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-medium gap-2">
          <span>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ عبدالمجيد هلال الحربي - منصة ڤيلوسيتي (Velocity) 🇸🇦</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {pages.map(page => (
              <button 
                key={page.id} 
                onClick={() => onPageClick && onPageClick(page.slug)}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                {page.title}
              </button>
            ))}
            <span>تراخيص الهيئة العامة للسياحة</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
