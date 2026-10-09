import React from 'react';
import { X, CheckCircle2, Star, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Hotel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CompareModalProps {
  hotels: Hotel[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onBook: (hotel: Hotel) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ hotels, isOpen, onClose, onRemove, onBook }) => {
  if (!isOpen) return null;

  // Gather all unique amenities to compare
  const allAmenities = Array.from(new Set(hotels.flatMap(h => h.amenities)));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">مقارنة الفنادق</h2>
              <p className="text-xs text-slate-400">{hotels.length} فنادق محددة للمقارنة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 bg-slate-950">
          <div className="min-w-max flex gap-4 sm:gap-6">
            {/* Properties Column */}
            <div className="w-48 sm:w-56 shrink-0 flex flex-col border-r border-slate-800 pr-4 mt-48 sm:mt-56">
              <div className="h-12 flex items-center font-bold text-slate-400 text-sm border-b border-slate-800">السعر / ليلة</div>
              <div className="h-12 flex items-center font-bold text-slate-400 text-sm border-b border-slate-800">التقييم</div>
              <div className="h-16 flex items-center font-bold text-slate-400 text-sm border-b border-slate-800">الموقع</div>
              {allAmenities.map((amenity, idx) => (
                <div key={idx} className="h-12 flex items-center font-bold text-slate-400 text-xs border-b border-slate-800 line-clamp-1">{amenity}</div>
              ))}
            </div>

            {/* Hotel Columns */}
            {hotels.map((hotel) => (
              <div key={hotel.id} className="w-64 sm:w-72 shrink-0 flex flex-col relative bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-800 p-3">
                <button
                  onClick={() => onRemove(hotel.id)}
                  className="absolute top-5 left-5 z-10 w-8 h-8 rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-lg"
                  title="إزالة من المقارنة"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Header Image & Info */}
                <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden mb-4">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                  <div className="absolute bottom-3 right-3 left-3">
                    <h3 className="font-black text-white text-sm sm:text-base line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{hotel.starRating} نجوم</span>
                    </div>
                  </div>
                </div>

                {/* Price Row */}
                <div className="h-12 flex items-center justify-center font-black text-amber-400 border-b border-slate-800/60 text-lg">
                  {hotel.discountedPrice || hotel.basePricePerNight} ر.س
                </div>

                {/* Rating Row */}
                <div className="h-12 flex items-center justify-center gap-1.5 border-b border-slate-800/60">
                  <span className="font-black text-emerald-400">{hotel.reviewScore}</span>
                  <span className="text-[10px] text-slate-500">({hotel.reviewText})</span>
                </div>

                {/* Location Row */}
                <div className="h-16 flex flex-col items-center justify-center gap-1 border-b border-slate-800/60 text-center px-2">
                  <span className="font-bold text-slate-200 text-xs">{hotel.city}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-2">{hotel.distanceToLandmark}</span>
                </div>

                {/* Amenities Rows */}
                {allAmenities.map((amenity, idx) => (
                  <div key={idx} className="h-12 flex items-center justify-center border-b border-slate-800/60">
                    {hotel.amenities.includes(amenity) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </div>
                ))}

                {/* Action Footer */}
                <div className="mt-auto pt-4 pb-2">
                  <button
                    onClick={() => onBook(hotel)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>احجز الآن</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State / Add More */}
            {hotels.length < 4 && (
              <div 
                className="w-64 sm:w-72 shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20 text-slate-500 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer"
                onClick={onClose}
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <span className="text-3xl font-light">+</span>
                </div>
                <span className="font-bold">أضف فندق آخر</span>
                <span className="text-xs mt-2 opacity-70">المقارنة تدعم حتى 4 فنادق</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
