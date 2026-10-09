import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Bell, BellRing, TrendingDown, Sparkles, AlertCircle } from 'lucide-react';
import { Hotel, PriceAlert } from '../types';
import { HotelCard } from './HotelCard';

interface FavoritesViewProps {
  favoriteHotels: Hotel[];
  priceAlerts: PriceAlert[];
  onToggleFavorite: (hotelId: string) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onExploreHotels: () => void;
  onOpenPriceAlert: (hotel: Hotel) => void;
  onSimulatePriceDrop: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteHotels,
  priceAlerts,
  onToggleFavorite,
  onSelectHotel,
  onExploreHotels,
  onOpenPriceAlert,
  onSimulatePriceDrop,
}) => {
  if (favoriteHotels.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/30">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white">قائمة المفضلة فارغة حالياً</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          يمكنك إضافة الفنادق والمنتجعات التي تنال إعجابك إلى قائمة المفضلة بالضغط على رمز القلب أثناء التصفح لتفعيل "تنبيه انخفاض السعر" والرجوع إليها لاحقاً.
        </p>
        <button
          onClick={onExploreHotels}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20"
        >
          تصفح الفنادق وإضافتها للمفضلة
        </button>
      </div>
    );
  }

  const activeAlertsCount = priceAlerts.filter((a) => a.enabled).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>فنادقي المفضلة</span>
            <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/30">
              {favoriteHotels.length} فندق
            </span>
            {activeAlertsCount > 0 && (
              <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <BellRing className="w-3 h-3" />
                <span>{activeAlertsCount} تنبيه مفعل</span>
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تابع أسعار فنادقك المفضلة، واستقبل إشعاراً فورياً عند انخفاض أسعار الغرف أو توفر عروض استثنائية.
          </p>
        </div>

        {/* Simulate Price Drop Button for user testing */}
        <button
          onClick={onSimulatePriceDrop}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/40 hover:border-amber-400 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          title="محاكاة نزول سعر أحد الفنادق المفضلة لتجربة التنبيه"
        >
          <TrendingDown className="w-4 h-4 text-amber-400" />
          <span>اختبار محاكاة انخفاض السعر ⚡</span>
        </button>
      </div>

      {/* Feature Explainer Strip */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <span className="font-extrabold text-amber-400 block mb-0.5">ميزة تنبيه انخفاض الأسعار الذكية:</span>
          <p className="text-slate-400">
            اضغط على رمز الجرس 🔔 بجانب أي فندق لتحديد السعر الذي يناسبك، وسيقوم النظام بمراقبة التغييرات اليومية للأسعار وتنبيهك عبر الواتساب أو البريد.
          </p>
        </div>
      </div>

      {/* Favorites Cards Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {favoriteHotels.map((hotel) => {
            const hasPriceAlert = priceAlerts.some((a) => a.hotelId === hotel.id && a.enabled);
            return (
              <motion.div
                key={hotel.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <HotelCard
                  hotel={hotel}
                  isFavorite={true}
                  hasPriceAlert={hasPriceAlert}
                  onToggleFavorite={onToggleFavorite}
                  onSelectHotel={onSelectHotel}
                  onOpenPriceAlert={onOpenPriceAlert}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

