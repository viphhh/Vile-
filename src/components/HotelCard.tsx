import React, { useState } from 'react';
import { Star, MapPin, Heart, CheckCircle2, MessageSquareText, Sparkles, BellRing, Bell, Share2, Scale, Bot, MessageCircle, Copy, Check } from 'lucide-react';
import { Hotel } from '../types';
import { ShareModal } from './ShareModal';
import { getHotelShareInfo, copyHotelToClipboard } from '../utils/share';

interface HotelCardProps {
  hotel: Hotel;
  isFavorite: boolean;
  isCompareSelected?: boolean;
  onCompare?: (hotel: Hotel) => void;
  hasPriceAlert?: boolean;
  onToggleFavorite: (hotelId: string) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onInquire?: (hotel: Hotel) => void;
  onOpenPriceAlert?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  isFavorite,
  hasPriceAlert,
  onToggleFavorite,
  onSelectHotel,
  onInquire,
  onOpenPriceAlert,
  isCompareSelected,
  onCompare,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showQuickShare, setShowQuickShare] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);
  const shareInfo = getHotelShareInfo(hotel);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyHotelToClipboard(hotel);
    if (ok) {
      setCopiedQuick(true);
      setTimeout(() => {
        setCopiedQuick(false);
        setShowQuickShare(false);
      }, 1800);
    }
  };

  return (
    <div
      onClick={() => onSelectHotel(hotel)}
      className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      
      {/* Top Image & Overlay Badges */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img loading="lazy" 
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Action Overlay Buttons Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {/* Compare Button */}
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare(hotel);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                isCompareSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-slate-950/60 text-slate-300 hover:text-amber-400 hover:bg-slate-900/90'
              }`}
              title={isCompareSelected ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(hotel.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
                : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900/90'
            }`}
            title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Direct Social Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="p-2.5 rounded-full backdrop-blur-md bg-slate-950/60 text-slate-300 hover:text-amber-400 hover:bg-slate-900/90 transition-all cursor-pointer"
            title="مشاركة الفندق عبر وسائل التواصل الاجتماعي"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Price Alert Bell Button */}
          {onOpenPriceAlert && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPriceAlert(hotel);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                hasPriceAlert
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105 animate-pulse'
                  : 'bg-slate-950/60 text-slate-300 hover:text-amber-400 hover:bg-slate-900/90'
              }`}
              title={hasPriceAlert ? 'تنبيه انخفاض السعر مفعل' : 'تفعيل تنبيه انخفاض السعر'}
            >
              <BellRing className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Top Featured Tag */}
        {hotel.featuredTag && (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hotel.featuredTag}</span>
          </div>
        )}
        {/* AI Category Tag */}
        {hotel.aiCategory && (
          <div className={`absolute ${hotel.featuredTag ? 'top-12' : 'top-3'} right-3 bg-indigo-600/90 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-indigo-400/50 animate-fade-in`}>
            <Bot className="w-3.5 h-3.5 text-indigo-200" />
            <span>{hotel.aiCategory}</span>
          </div>
        )}

        {/* City & Rating Pill Overlay */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{hotel.city}</span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white font-black text-xs px-2.5 py-1 rounded-xl border border-emerald-400/30">
            <span>{hotel.reviewScore}</span>
            <span className="text-[10px] font-normal text-emerald-100">/10 ({hotel.reviewText})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Stars & Landmark */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="text-xs text-slate-300 font-semibold mr-1">({hotel.starRating} نجوم)</span>
            </div>
            
            <div className="text-slate-400 font-medium truncate max-w-[180px]">
              {hotel.distanceToLandmark}
            </div>
          </div>

          {/* Hotel Name */}
          <h3
            onClick={() => onSelectHotel(hotel)}
            className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {hotel.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-medium leading-relaxed">
            {hotel.description}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded-lg"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{amenity}</span>
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[10px] text-slate-500 font-bold self-center">
                +{hotel.amenities.length - 3} ميزات
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price & Action Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold">يبدأ من / ليلة واحدة</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400">
                {hotel.discountedPrice || hotel.basePricePerNight}
              </span>
              <span className="text-xs font-bold text-slate-300">ر.س</span>
              {hotel.discountedPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {hotel.basePricePerNight} ر.س
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Share Menu Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickShare((prev) => !prev);
                }}
                className={`p-2.5 rounded-2xl border font-bold text-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer ${
                  showQuickShare 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border-slate-700'
                }`}
                title="مشاركة الفندق عبر واتساب أو نسخ الرابط"
                aria-label="مشاركة الفندق"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Quick Share Menu Popover */}
              {showQuickShare && (
                <div 
                  className="absolute bottom-full left-0 mb-2 w-52 bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-2 z-30 space-y-1 text-right animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 border-b border-slate-800 text-[10px] font-black text-amber-400 flex items-center justify-between">
                    <span>مشاركة الفندق 🔗</span>
                    <button 
                      type="button"
                      onClick={() => setShowQuickShare(false)} 
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      ✕
                    </button>
                  </div>

                  {/* WhatsApp Direct Share */}
                  <a
                    href={shareInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowQuickShare(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors w-full"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
                    <span>مشاركة عبر واتساب</span>
                  </a>

                  {/* Copy Link Direct Button */}
                  <button
                    type="button"
                    onClick={handleQuickCopy}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors w-full text-right cursor-pointer"
                  >
                    {copiedQuick ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-emerald-400 font-black">تم النسخ بنجاح! ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>نسخ رابط الفندق</span>
                      </>
                    )}
                  </button>

                  {/* More Options / Full Modal */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickShare(false);
                      setIsShareOpen(true);
                    }}
                    className="flex items-center gap-2 p-1.5 px-2 rounded-xl text-[11px] font-medium text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors w-full text-right border-t border-slate-800 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>خيارات مشاركة أخرى...</span>
                  </button>
                </div>
              )}
            </div>

            {onInquire && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInquire(hotel);
                }}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="استفسار عن السعر والتوفر قبل الحجز"
                aria-label="استفسار أصحاب الفندق"
              >
                <MessageSquareText className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onSelectHotel(hotel)}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>التفاصيل والحجز</span>
            </button>
          </div>
        </div>

      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        hotel={hotel}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

    </div>
  );
};
