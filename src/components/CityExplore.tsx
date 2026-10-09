import React from 'react';
import { MapPin, Building, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { CITIES_DATA } from '../data/hotels';

interface CityExploreProps {
  onSelectCity: (cityName: string) => void;
  onOpenAi: () => void;
}

export const CityExplore: React.FC<CityExploreProps> = ({ onSelectCity, onOpenAi }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>وجهات الفخامة والسياحة السعودية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">استكشف مدن المملكة العربية السعودية</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
            اختر وجهتك المفضلة من العاصمة النابضة بالحياة، أجواء الإيمان والحرمين الشريفين، عروس البحر الأحمر، أو منتجعات العلا التاريخية.
          </p>
        </div>

        <button
          onClick={onOpenAi}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 border border-emerald-400/30"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>استشر المستشار الذكي لاختيار الوجهة</span>
        </button>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CITIES_DATA.map((city) => (
          <div
            key={city.id}
            onClick={() => onSelectCity(city.name)}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-800 hover:border-amber-500/60 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {/* Background Image */}
            <img loading="lazy" 
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Hotel Count Pill */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>{city.hotelCount} فندق متاح</span>
            </div>

            {/* Bottom Details */}
            <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full inline-block">
                {city.tagline}
              </span>
              <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                {city.name}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                {city.description}
              </p>

              {/* Popular tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {city.popularFor.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-200 px-2.5 py-0.5 rounded-lg border border-slate-800"
                  >
                    • {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
