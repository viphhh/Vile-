import React from 'react';
import { SearchFilters } from '../types';
import { Filter, Star, Wifi, Coffee, Dumbbell, Car, Map, Droplets, Utensils, UtensilsCrossed, MonitorPlay } from 'lucide-react';

export const AMENITIES_ICONS: Record<string, React.ReactNode> = {
  'واي فاي مجاني': <Wifi className="w-4 h-4" />,
  'مسبح داخلي': <Droplets className="w-4 h-4" />,
  'مسبح خارجي': <Droplets className="w-4 h-4" />,
  'نادي رياضي': <Dumbbell className="w-4 h-4" />,
  'إفطار مجاني': <Coffee className="w-4 h-4" />,
  'موقف سيارات مجاني': <Car className="w-4 h-4" />,
  'إطلالة على الحرم': <Map className="w-4 h-4" />,
  'إطلالة على البحر': <Map className="w-4 h-4" />,
  'مطعم فاخر': <Utensils className="w-4 h-4" />,
  'روم سيرفيس 24 ساعة': <UtensilsCrossed className="w-4 h-4" />,
  'شاشات ذكية': <MonitorPlay className="w-4 h-4" />
};

export const POPULAR_AMENITIES = [
  'واي فاي مجاني', 'مسبح داخلي', 'مسبح خارجي', 'نادي رياضي', 'سبا', 
  'إفطار مجاني', 'موقف سيارات مجاني', 'روم سيرفيس 24 ساعة', 'شاشات ذكية',
  'إطلالة على الحرم', 'إطلالة على البحر', 'مطعم فاخر', 'مقهى', 'غرفة اجتماعات'
];

interface SidebarFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({ filters, setFilters }) => {
  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleStarToggle = (star: number) => {
    setFilters((prev) => ({
      ...prev,
      starRatings: prev.starRatings.includes(star)
        ? prev.starRatings.filter((s) => s !== star)
        : [...prev.starRatings, star],
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-8 sticky top-24 shadow-xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Filter className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-black text-white">التصفية المتقدمة</h3>
      </div>

      {/* Price Slider */}
      <div className="space-y-4">
        <label className="block font-bold text-slate-300">
          السعر الأقصى لليلة: <span className="text-amber-400 font-extrabold text-sm block mt-1">{filters.maxPrice} ر.س</span>
        </label>
        <input
          type="range"
          min="300"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>300 ر.س</span>
          <span>5000 ر.س</span>
        </div>
      </div>

      {/* Star Ratings */}
      <div className="space-y-4">
        <label className="block font-bold text-slate-300">تصنيف النجوم</label>
        <div className="flex flex-col gap-2">
          {[5, 4, 3].map((star) => (
            <label key={star} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                filters.starRatings.includes(star)
                  ? 'bg-amber-500 border-amber-500'
                  : 'bg-slate-950 border-slate-700 group-hover:border-slate-500'
              }`}>
                {filters.starRatings.includes(star) && <svg className="w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div className="flex items-center gap-1">
                <span>{star} نجوم</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <label className="block font-bold text-slate-300">المرافق والخدمات</label>
        <div className="flex flex-col gap-3">
          {POPULAR_AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                filters.amenities.includes(amenity)
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'bg-slate-950 border-slate-700 group-hover:border-slate-500'
              }`}>
                {filters.amenities.includes(amenity) && <svg className="w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-sm transition-colors ${
                filters.amenities.includes(amenity) ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Reset button */}
      {(filters.amenities.length > 0 || filters.starRatings.length > 0 || filters.maxPrice < 5000) && (
        <button
          onClick={() => setFilters(p => ({ ...p, amenities: [], starRatings: [], maxPrice: 5000 }))}
          className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
        >
          إعادة ضبط الفلاتر
        </button>
      )}
    </div>
  );
};
