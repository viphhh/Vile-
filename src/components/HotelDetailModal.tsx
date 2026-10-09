import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MapPin, ChevronLeft, ChevronRight, ZoomIn, CheckCircle2, Bed, Users, ShieldCheck, Heart, Sparkles, MessageSquare, ArrowRight, DollarSign, Building, MessageSquareText, BellRing, Share2, MessageCircle, Copy, CheckCheck } from 'lucide-react';
import { Hotel, RoomType } from '../types';
import { HotelMiniMap } from './HotelMiniMap';
import { ShareModal } from './ShareModal';
import { getHotelShareInfo, copyHotelToClipboard } from '../utils/share';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  onBookRoom: (hotel: Hotel, room: RoomType) => void;
  isFavorite: boolean;
  hasPriceAlert?: boolean;
  onToggleFavorite: (hotelId: string) => void;
  onOpenInquiry?: (hotel: Hotel, room?: RoomType) => void;
  onOpenPriceAlert?: (hotel: Hotel) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  onClose,
  onBookRoom,
  isFavorite,
  hasPriceAlert,
  onToggleFavorite,
  onOpenInquiry,
  onOpenPriceAlert,
}) => {
  if (!hotel) return null;

  const [activeImage, setActiveImage] = useState(hotel.image);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(hotel.roomTypes[0]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copiedModal, setCopiedModal] = useState(false);
  const shareInfo = getHotelShareInfo(hotel);

  const handleCopyLink = async () => {
    const ok = await copyHotelToClipboard(hotel);
    if (ok) {
      setCopiedModal(true);
      setTimeout(() => setCopiedModal(false), 2200);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel.gallery) {
      const currentIndex = hotel.gallery.indexOf(activeImage);
      const nextIndex = (currentIndex + 1) % hotel.gallery.length;
      setActiveImage(hotel.gallery[nextIndex]);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel.gallery) {
      const currentIndex = hotel.gallery.indexOf(activeImage);
      const prevIndex = (currentIndex - 1 + hotel.gallery.length) % hotel.gallery.length;
      setActiveImage(hotel.gallery[prevIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">{hotel.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{hotel.city} - {hotel.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInquiry && (
              <button
                onClick={() => onOpenInquiry(hotel, selectedRoom)}
                className="px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="استفسار أصحاب الفندق والمنتجع عن السعر والتوفر"
              >
                <MessageSquareText className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">استفسار عن السعر والتوفر</span>
              </button>
            )}

            {onOpenPriceAlert && (
              <button
                onClick={() => onOpenPriceAlert(hotel)}
                className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  hasPriceAlert
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-amber-400'
                }`}
                title={hasPriceAlert ? 'تنبيه انخفاض السعر مفعل' : 'تفعيل تنبيه انخفاض السعر'}
              >
                <BellRing className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">
                  {hasPriceAlert ? 'التنبيه مفعل 🔔' : 'تنبيه السعر'}
                </span>
              </button>
            )}

            {/* Share Button in Header */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-2 rounded-2xl bg-slate-800 text-slate-200 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="مشاركة الفندق عبر واتساب أو نسخ الرابط"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">مشاركة</span>
            </button>

            <button
              onClick={() => onToggleFavorite(hotel.id)}
              className={`p-2.5 rounded-2xl border transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Main Photo & Thumbnails */}
          <div className="space-y-3">
            <div 
              className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 cursor-zoom-in group"
              onClick={() => setIsZoomOpen(true)}
            >
              <img loading="lazy" 
                src={activeImage}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-slate-900/90 backdrop-blur-md text-white font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <ZoomIn className="w-5 h-5 text-amber-400" />
                  <span>تكبير الصورة</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-400 z-10 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span>{hotel.starRating} نجوم فاخرة</span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {hotel.gallery && hotel.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {hotel.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img loading="lazy"  src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <div>
              <span className="block text-xs text-slate-400">التقييم العام</span>
              <span className="text-lg font-extrabold text-emerald-400">{hotel.reviewScore} / 10</span>
              <span className="block text-[10px] text-slate-500">({hotel.reviewText})</span>
            </div>

            <div>
              <span className="block text-xs text-slate-400">المسافة لأهم المعالم</span>
              <span className="text-sm font-bold text-white line-clamp-1">{hotel.distanceToLandmark}</span>
              <span className="block text-[10px] text-slate-500">{hotel.landmarkName}</span>
            </div>

            <div>
              <span className="block text-xs text-slate-400">عدد التقييمات</span>
              <span className="text-lg font-bold text-white">{hotel.reviewCount} تقييم</span>
              <span className="block text-[10px] text-slate-500">نزلاء موثوقون</span>
            </div>

            <div>
              <span className="block text-xs text-slate-400">السعر الأساسي</span>
              <span className="text-lg font-black text-amber-400">{hotel.discountedPrice || hotel.basePricePerNight} ر.س</span>
              <span className="block text-[10px] text-slate-500">شامل ضريبة 15%</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span>نبذة عن الفندق والإقامة</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {hotel.description}
            </p>
          </div>

          {/* Direct Share Bar: WhatsApp & Copy Link */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm sm:text-base">مشاركة هذا الفندق مع رفقاء السفر 🔗</h4>
                <p className="text-xs text-slate-400 mt-0.5">شارك تفاصيل الفندق والغرف مباشرة عبر واتساب أو انسخ الرابط</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* WhatsApp direct button */}
              <a
                href={shareInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>مشاركة عبر واتساب</span>
              </a>

              {/* Copy Link direct button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
                  copiedModal
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                }`}
              >
                {copiedModal ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-slate-950" />
                    <span>تم النسخ بنجاح! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>نسخ رابط الفندق</span>
                  </>
                )}
              </button>

              {/* More options button */}
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                title="خيارات مشاركة أخرى"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Mini Map & Proximity to Landmarks */}
          <HotelMiniMap hotel={hotel} />

          {/* Room Types Selection List */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-amber-400" />
              <span>أنواع الغرف والأجنحة المتاحة للحجز</span>
            </h3>

            <div className="space-y-4">
              {hotel.roomTypes.map((room) => (
                <div
                  key={room.id}
                  className={`bg-slate-950 border rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    selectedRoom.id === room.id
                      ? 'border-amber-500/80 bg-slate-950/90 shadow-lg shadow-amber-500/5'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex gap-4 items-start flex-1">
                    <img loading="lazy" 
                      src={room.image}
                      alt={room.name}
                      className="w-24 h-20 rounded-xl object-cover hidden sm:block border border-slate-800"
                    />
                    <div>
                      <h4 className="font-extrabold text-white text-base">{room.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{room.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-semibold text-slate-300">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-400">
                          🖈 {room.bedType}
                        </span>
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          📐 {room.areaSqm} متر مربع
                        </span>
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          👥 يتسع لـ {room.maxGuests} ضيوف
                        </span>
                      </div>

                      {/* Perks */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {room.perks.map((perk, pIdx) => (
                          <span key={pIdx} className="text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">السعر / ليلة</span>
                      <span className="text-xl font-black text-amber-400">{room.pricePerNight} ر.س</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        onBookRoom(hotel, room);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all mt-2"
                    >
                      احجز هذه الغرفة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Amenities Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>المميزات والخدمات المتوفرة</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs font-semibold text-slate-300">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          {hotel.reviewsList && hotel.reviewsList.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>آراء الضيوف والنزلاء ({hotel.reviewsList.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotel.reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold flex items-center justify-center text-xs">
                          {rev.userName[0]}
                        </div>
                        <div>
                          <span className="block font-bold text-white text-xs">{rev.userName}</span>
                          <span className="text-[10px] text-slate-400">{rev.travelerType} • {rev.date}</span>
                        </div>
                      </div>
                      <div className="bg-emerald-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg">
                        {rev.rating} / 10
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Checkout Trigger */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block">الغرفة المختارة: {selectedRoom.name}</span>
            <span className="text-xl font-black text-amber-400">{selectedRoom.pricePerNight} ر.س / ليلة</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Footer Share Button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="py-3 px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="مشاركة الفندق عبر واتساب أو نسخ الرابط"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">مشاركة</span>
            </button>

            {onOpenInquiry && (
              <button
                onClick={() => onOpenInquiry(hotel, selectedRoom)}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4 text-amber-400" />
                <span>استفسار السعر والتوفر</span>
              </button>
            )}

            <button
              onClick={() => onBookRoom(hotel, selectedRoom)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              متابعة إتمام الحجز الفوري
            </button>
          </div>
        </div>

        {/* Share Modal Dialog */}
        <ShareModal
          hotel={hotel}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />

      </div>
      {/* Lightbox / Image Zoom */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-8"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 bg-slate-900/50 hover:bg-rose-500/80 text-white rounded-2xl transition-colors backdrop-blur-md border border-white/10 z-50"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            {hotel.gallery && hotel.gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-2xl transition-colors backdrop-blur-md border border-white/10 z-50"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2.5 sm:p-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-2xl transition-colors backdrop-blur-md border border-white/10 z-50"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img loading="lazy"  
                src={activeImage}
                alt={hotel.name}
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            {hotel.gallery && hotel.gallery.length > 1 && (
              <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-white/10 z-50">
                {hotel.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(img); }}
                    className={`rounded-full transition-all ${
                      activeImage === img ? 'w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-500 hover:bg-slate-300'
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
