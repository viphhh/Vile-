import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hotel } from '../types';
import { 
  Building2, 
  Star, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  RotateCcw, 
  Layers, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Navigation,
  Info,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Fix Leaflet default icon paths if needed
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// City centers for quick navigation
const CITIES_LOCATIONS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'الرياض': { lat: 24.7136, lng: 46.6753, zoom: 12 },
  'مكة المكرمة': { lat: 21.4225, lng: 39.8262, zoom: 13 },
  'المدينة المنورة': { lat: 24.4686, lng: 39.6142, zoom: 13 },
  'جدة': { lat: 21.5433, lng: 39.1728, zoom: 12 },
  'العلا': { lat: 26.65, lng: 37.95, zoom: 11 },
  'الخبر والدمام': { lat: 26.2886, lng: 50.2089, zoom: 12 },
  'أبها وعسير': { lat: 18.2164, lng: 42.5053, zoom: 12 },
};

// Fallback coordinates for hotels that might miss lat/lng
const CITY_FALLBACKS: Record<string, [number, number]> = {
  'مكة المكرمة': [21.4225, 39.8262],
  'المدينة المنورة': [24.4686, 39.6142],
  'الرياض': [24.7136, 46.6753],
  'جدة': [21.5433, 39.1728],
  'العلا': [26.65, 37.95],
  'الخبر والدمام': [26.2886, 50.2089],
  'أبها وعسير': [18.2164, 42.5053],
};

// Custom interactive hotel marker pin with price and building icon
const createCustomHotelIcon = (hotel: Hotel, isSelected: boolean = false) => {
  const price = hotel.discountedPrice || hotel.basePricePerNight;
  const isFeatured = hotel.isFeatured;

  return L.divIcon({
    className: 'custom-hotel-marker-container',
    html: `
      <div class="relative flex flex-col items-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'}">
        <!-- Price Badge -->
        <div class="px-2.5 py-1 rounded-full text-xs font-black shadow-xl flex items-center gap-1.5 whitespace-nowrap border transition-all ${
          isSelected 
            ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/40 shadow-amber-400/50' 
            : isFeatured 
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border-amber-200 shadow-amber-500/30' 
              : 'bg-slate-900/95 text-amber-400 border-slate-700 shadow-black/60 hover:border-amber-400 hover:text-white'
        }">
          <span class="w-1.5 h-1.5 rounded-full ${isFeatured ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}"></span>
          <span>${price.toLocaleString()} ر.س</span>
        </div>
        <!-- Pin stem and icon disc -->
        <div class="flex flex-col items-center -mt-0.5">
          <div class="w-2.5 h-2.5 rounded-full border-2 ${
            isSelected 
              ? 'bg-amber-400 border-white' 
              : isFeatured 
                ? 'bg-amber-500 border-slate-950' 
                : 'bg-slate-800 border-amber-400'
          }"></div>
          <div class="w-0.5 h-2 ${isSelected ? 'bg-amber-400' : 'bg-slate-700'}"></div>
        </div>
      </div>
    `,
    iconSize: [90, 48],
    iconAnchor: [45, 48],
    popupAnchor: [0, -48],
  });
};

interface ExploreMapProps {
  hotels: Hotel[];
  onHotelClick: (hotel: Hotel) => void;
  selectedHotelId?: string | null;
  onSelectHotelId?: (id: string | null) => void;
  fullHeight?: boolean;
}

// Inner Controller to handle Leaflet Map interactions
interface MapControllerProps {
  hotels: Hotel[];
  activeCity: string;
  triggerFit: number;
  triggerZoomIn: number;
  triggerZoomOut: number;
  selectedHotel: Hotel | null;
}

const MapController: React.FC<MapControllerProps> = ({
  hotels,
  activeCity,
  triggerFit,
  triggerZoomIn,
  triggerZoomOut,
  selectedHotel,
}) => {
  const map = useMap();

  // Invalidate size on mount to ensure smooth render
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  // Handle zoom in trigger
  useEffect(() => {
    if (triggerZoomIn > 0) {
      map.zoomIn();
    }
  }, [triggerZoomIn, map]);

  // Handle zoom out trigger
  useEffect(() => {
    if (triggerZoomOut > 0) {
      map.zoomOut();
    }
  }, [triggerZoomOut, map]);

  // Handle city change or fit all
  useEffect(() => {
    if (activeCity === 'all') {
      if (hotels.length > 0) {
        const coords = hotels
          .map((h) => {
            if (h.lat && h.lng) return [h.lat, h.lng] as [number, number];
            const fallback = CITY_FALLBACKS[h.city];
            return fallback ? fallback : null;
          })
          .filter((c): c is [number, number] => c !== null);

        if (coords.length > 0) {
          const bounds = L.latLngBounds(coords);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true, duration: 1.2 });
        }
      } else {
        map.flyTo([23.8859, 45.0792], 6);
      }
    } else if (CITIES_LOCATIONS[activeCity]) {
      const loc = CITIES_LOCATIONS[activeCity];
      map.flyTo([loc.lat, loc.lng], loc.zoom, { animate: true, duration: 1.2 });
    }
  }, [activeCity, triggerFit, hotels, map]);

  // Pan to selected hotel if changed externally
  useEffect(() => {
    if (selectedHotel) {
      const lat = selectedHotel.lat || CITY_FALLBACKS[selectedHotel.city]?.[0];
      const lng = selectedHotel.lng || CITY_FALLBACKS[selectedHotel.city]?.[1];
      if (lat && lng) {
        map.flyTo([lat, lng], Math.max(map.getZoom(), 14), {
          animate: true,
          duration: 1.0,
        });
      }
    }
  }, [selectedHotel, map]);

  return null;
};

export const ExploreMap: React.FC<ExploreMapProps> = ({
  hotels,
  onHotelClick,
  selectedHotelId: externalSelectedId,
  onSelectHotelId,
  fullHeight = false,
}) => {
  const [activeCity, setActiveCity] = useState<string>('all');
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'dark' | 'streets'>('dark');
  const [triggerFit, setTriggerFit] = useState<number>(0);
  const [triggerZoomIn, setTriggerZoomIn] = useState<number>(0);
  const [triggerZoomOut, setTriggerZoomOut] = useState<number>(0);

  const selectedHotelId = externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;
  const setSelectedHotelId = (id: string | null) => {
    if (onSelectHotelId) {
      onSelectHotelId(id);
    }
    setInternalSelectedId(id);
  };

  // Ensure every hotel has usable coordinates
  const displayHotels = hotels.map((h, index) => {
    let lat = h.lat;
    let lng = h.lng;
    if (!lat || !lng) {
      const base = CITY_FALLBACKS[h.city] || [24.7136, 46.6753];
      // small deterministic offset so markers in same city don't stack directly on top of each other
      const offsetLat = ((index % 5) - 2) * 0.007;
      const offsetLng = (((index * 3) % 5) - 2) * 0.007;
      lat = base[0] + offsetLat;
      lng = base[1] + offsetLng;
    }
    return { ...h, lat, lng };
  });

  // Filtered hotels based on active city
  const filteredHotels = activeCity === 'all'
    ? displayHotels
    : displayHotels.filter(h => h.city === activeCity);

  const selectedHotel = displayHotels.find((h) => h.id === selectedHotelId) || null;

  // Available unique cities in the provided hotels list
  const availableCities = Array.from(new Set(displayHotels.map(h => h.city)));

  return (
    <div className={`w-full flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative select-none ${
      fullHeight ? 'h-[750px] lg:h-[820px]' : 'h-[620px]'
    }`}>
      
      {/* Top Map Header & Filter Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 z-10 shrink-0">
        
        {/* Title & Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-base">خريطة الفنادق والمنتجعات التفاعلية</h3>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                {filteredHotels.length} فندق متاح
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              انقر على أيقونة أي فندق لعرض اسمه وعنوانه بالتفصيل وحجز إقامتك
            </p>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => {
              setActiveCity('all');
              setTriggerFit((prev) => prev + 1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeCity === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            كافة المدن ({displayHotels.length})
          </button>
          
          {availableCities.map((cityName) => {
            const count = displayHotels.filter(h => h.city === cityName).length;
            return (
              <button
                key={cityName}
                onClick={() => setActiveCity(cityName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeCity === cityName
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cityName} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Map Container Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-900">
        
        {/* Leaflet Map */}
        <MapContainer
          center={[24.7136, 46.6753]} // Riyadh coordinates as center
          zoom={6}
          minZoom={4}
          maxZoom={18}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomControl={false} // We provide custom floating zoom controls with Arabic styling
          style={{ width: '100%', height: '100%', background: '#090d16' }}
        >
          {mapStyle === 'dark' ? (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              maxZoom={19}
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              maxZoom={19}
            />
          )}

          <MapController
            hotels={filteredHotels}
            activeCity={activeCity}
            triggerFit={triggerFit}
            triggerZoomIn={triggerZoomIn}
            triggerZoomOut={triggerZoomOut}
            selectedHotel={selectedHotel}
          />

          {filteredHotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={[hotel.lat!, hotel.lng!]}
              icon={createCustomHotelIcon(hotel, selectedHotelId === hotel.id)}
              eventHandlers={{
                click: () => {
                  setSelectedHotelId(hotel.id);
                },
              }}
            >
              {/* Hotel Information Popup on Marker Click */}
              <Popup className="hotel-interactive-popup" minWidth={270} maxWidth={320}>
                <div className="bg-slate-950 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 p-0 text-right dir-rtl">
                  
                  {/* Hotel Photo Header with Badges */}
                  <div className="relative h-32 w-full overflow-hidden group">
                    <img
                      loading="lazy"
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Stars and Rating badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-700 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{hotel.starRating} نجوم</span>
                    </div>

                    <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-xs font-black">
                      {hotel.reviewScore} ★
                    </div>

                    {hotel.isFeatured && (
                      <div className="absolute bottom-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>مميز وحصري</span>
                      </div>
                    )}
                  </div>

                  {/* Hotel Details Body */}
                  <div className="p-3.5 space-y-2.5">
                    
                    {/* Hotel Name */}
                    <div>
                      <h4 className="font-extrabold text-white text-sm line-clamp-1 leading-snug hover:text-amber-400 transition-colors">
                        {hotel.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {hotel.nameEn}
                      </p>
                    </div>

                    {/* Hotel Address - REQUIRED FEATURE */}
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-bold">العنوان:</strong>
                          <span className="text-[11px] text-slate-300 leading-tight block">{hotel.address}</span>
                          <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">المدينة: {hotel.city}</span>
                        </div>
                      </div>
                      {hotel.distanceToLandmark && (
                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-1 border-t border-slate-800">
                          <Navigation className="w-3 h-3 shrink-0" />
                          <span className="truncate">{hotel.distanceToLandmark}</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">السعر يبدأ من</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-amber-400">
                            {(hotel.discountedPrice || hotel.basePricePerNight).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-300">ر.س / ليلة</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`فندق ${hotel.name} (${hotel.city}) عبر ڤيلوسيتي: ${typeof window !== 'undefined' ? window.location.origin : ''}?hotel=${hotel.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center justify-center cursor-pointer"
                          title="مشاركة عبر واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onHotelClick(hotel);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <span>حجز وتفاصيل</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Custom Map Controls (Zoom In, Zoom Out, Recenter, Style) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          
          {/* Zoom In Button */}
          <button
            onClick={() => setTriggerZoomIn((prev) => prev + 1)}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-white hover:text-amber-400 flex items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer"
            title="تكبير الخريطة (+)"
            aria-label="تكبير الخريطة"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={() => setTriggerZoomOut((prev) => prev + 1)}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-white hover:text-amber-400 flex items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer"
            title="تصغير الخريطة (-)"
            aria-label="تصغير الخريطة"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          {/* Reset / Fit View Button */}
          <button
            onClick={() => {
              setActiveCity('all');
              setTriggerFit((prev) => prev + 1);
            }}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-white hover:text-amber-400 flex items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer"
            title="إعادة ضبط الرؤية لكافة الفنادق"
            aria-label="إعادة ضبط الخريطة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Map Style Toggle (Dark / Street) */}
          <button
            onClick={() => setMapStyle(mapStyle === 'dark' ? 'streets' : 'dark')}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer ${
              mapStyle === 'streets' 
                ? 'bg-amber-500 text-slate-950 border-amber-300' 
                : 'bg-slate-950/90 hover:bg-slate-900 text-white border-slate-700/80'
            }`}
            title={mapStyle === 'dark' ? 'التحويل إلى خريطة الشوارع الفاتحة' : 'التحويل إلى الخريطة الداكنة الفاخرة'}
            aria-label="تبديل نمط الخريطة"
          >
            <Layers className="w-4 h-4" />
          </button>

        </div>

        {/* Floating Instruction / Navigation Badge */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300 shadow-xl">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>اسحب للتحريك واستخدم العجلة للتكبير والتصغير</span>
        </div>

        {/* Selected Hotel Quick Preview Card (if a hotel is chosen) */}
        {selectedHotel && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl p-3 shadow-2xl flex items-center gap-3 text-right"
            >
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-extrabold text-white text-xs truncate">
                    {selectedHotel.name}
                  </h5>
                  <button
                    onClick={() => setSelectedHotelId(null)}
                    className="text-slate-400 hover:text-white text-xs p-1"
                    title="إغلاق المعاينة"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{selectedHotel.address}</span>
                </p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                  <span className="text-xs font-black text-white">
                    {(selectedHotel.discountedPrice || selectedHotel.basePricePerNight).toLocaleString()} ر.س
                  </span>
                  <button
                    onClick={() => onHotelClick(selectedHotel)}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg transition-all"
                  >
                    عرض الغرف والحجز
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>

      {/* Bottom Horizontal Quick-Browse Carousel */}
      <div className="bg-slate-900 border-t border-slate-800 p-2.5 sm:p-3 overflow-x-auto no-scrollbar z-10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-max">
          <span className="text-xs font-black text-slate-400 px-2 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>فنادق الخريطة:</span>
          </span>
          {filteredHotels.map((h) => {
            const isSelected = selectedHotelId === h.id;
            return (
              <button
                key={h.id}
                onClick={() => {
                  setSelectedHotelId(h.id);
                }}
                className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <div className="text-right">
                  <p className="font-bold text-xs truncate max-w-[130px] sm:max-w-[180px]">{h.name}</p>
                  <p className="text-[10px] text-amber-400 font-semibold truncate max-w-[130px] sm:max-w-[180px]">
                    {h.city} • {(h.discountedPrice || h.basePricePerNight).toLocaleString()} ر.س
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global CSS for Leaflet Popup in ExploreMap */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hotel-interactive-popup .leaflet-popup-content-wrapper {
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 1rem !important;
          }
          .hotel-interactive-popup .leaflet-popup-content {
            margin: 0 !important;
            width: auto !important;
            line-height: inherit !important;
          }
          .hotel-interactive-popup .leaflet-popup-tip-container {
            margin-top: -1px;
          }
          .hotel-interactive-popup .leaflet-popup-tip {
            background: #020617 !important;
            border: 1px solid #334155 !important;
          }
          .hotel-interactive-popup .leaflet-popup-close-button {
            color: #ffffff !important;
            padding: 6px !important;
            z-index: 30 !important;
            font-size: 16px !important;
          }
        `,
      }} />

    </div>
  );
};
