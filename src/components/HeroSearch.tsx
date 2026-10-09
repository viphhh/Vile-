import React, { useState } from 'react';
import { MapPin, Calendar, Users, Search, Sparkles, Filter, X, SlidersHorizontal, Star, Globe } from 'lucide-react';
import { SearchFilters } from '../types';
import { CITIES_DATA, AMENITIES_LIST } from '../data/hotels';
import { DateRangePicker } from './DateRangePicker';

interface HeroSearchProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
  onOpenAi: () => void;
  onOpenLiveSearch?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  setFilters,
  onSearch,
  onOpenAi,
  onOpenLiveSearch,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleCityChange = (cityName: string) => {
    setFilters((prev) => ({ ...prev, city: cityName }));
  };

  const handleStarToggle = (star: number) => {
    setFilters((prev) => {
      const exists = prev.starRatings.includes(star);
      return {
        ...prev,
        starRatings: exists
          ? prev.starRatings.filter((s) => s !== star)
          : [...prev.starRatings, star],
      };
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      city: 'all',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      guests: 2,
      rooms: 1,
      minPrice: 0,
      maxPrice: 5000,
      starRatings: [],
      amenities: [],
      sortBy: 'recommended',
      searchQuery: '',
    });
  };

  return (
    <div className="relative bg-slate-950 overflow-hidden py-10 lg:py-16 border-b border-slate-800">
      {/* Background Decorative Pattern & Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>وجهتك الأولى لإقامة فاخرة في المملكة العربية السعودية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            احجز <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">إقامتك الفاخرة</span> في مدن المملكة
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            احجز أرقى الفنادق والمنتجعات بجوار الحرمين الشريفين، العاصمة الرياض، كورنيش جدة، أو بين جبال العلا الساحرة.
          </p>
        </div>

        {/* Main Search Panel Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-950 backdrop-blur-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            
            {/* 1. Destination Dropdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 hover:border-amber-500/50 transition-colors">
              <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>المدينة أو الوجهة</span>
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">جميع المدن (كل المملكة)</option>
                {CITIES_DATA.map((c) => (
                  <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                    {c.name} ({c.hotelCount} فندق)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Interactive Date Range Picker */}
            <DateRangePicker
              checkIn={filters.checkIn}
              checkOut={filters.checkOut}
              onChange={(checkIn, checkOut) =>
                setFilters((prev) => ({ ...prev, checkIn, checkOut }))
              }
            />

            {/* 3. Guests & Rooms */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 hover:border-amber-500/50 transition-colors">
              <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>الضيوف والغرف</span>
              </label>
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">الضيوف:</span>
                  <select
                    value={filters.guests}
                    onChange={(e) => setFilters((p) => ({ ...p, guests: Number(e.target.value) }))}
                    className="bg-slate-900 text-white rounded px-2 py-0.5 border border-slate-800 text-xs focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} شخص
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">الغرف:</span>
                  <select
                    value={filters.rooms}
                    onChange={(e) => setFilters((p) => ({ ...p, rooms: Number(e.target.value) }))}
                    className="bg-slate-900 text-white rounded px-2 py-0.5 border border-slate-800 text-xs focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} غرفة
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Keyword / Search Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSearch}
                className="w-full h-full min-h-[58px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>ابحث الآن</span>
              </button>


            </div>

          </div>

          {/* Quick Destination Tags */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-slate-400 font-bold whitespace-nowrap">الوجهات الأكثر شعبية:</span>
              {[
                { name: 'مكة المكرمة', label: '🕌 إطلالة الحرم المكي' },
                { name: 'المدينة المنورة', label: '🌙 الحرم النبوي الشريف' },
                { name: 'الرياض', label: '🏙️ الفايصلية والبوليفارد' },
                { name: 'جدة', label: '🌊 كورنيش جدة' },
                { name: 'العلا', label: '🏜️ منتجعات العلا الصحراوية' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleCityChange(item.name)}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
                    filters.city === item.name
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {onOpenLiveSearch && (
                <button
                  type="button"
                  onClick={onOpenLiveSearch}
                  className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-950/60 border border-blue-500/40 px-3.5 py-1.5 rounded-full hover:bg-blue-900/60 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>الفعاليات المباشرة (Google Search)</span>
                </button>
              )}

              {/* AI Assistant Banner Button */}
              <button
                type="button"
                onClick={onOpenAi}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full hover:bg-emerald-900/60 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>مستشار الحجز بالذكاء الاصطناعي</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
