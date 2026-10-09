import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Footprints,
  Car,
  ExternalLink,
  Layers,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Building2,
  Plane,
  ShoppingBag,
  Palmtree,
  Milestone,
  Check,
  LocateFixed
} from 'lucide-react';
import { Hotel } from '../types';

interface HotelMiniMapProps {
  hotel: Hotel;
}

interface Landmark {
  id: string;
  name: string;
  category: 'religious' | 'shopping' | 'transit' | 'attraction' | 'nature';
  categoryLabel: string;
  distanceStr: string;
  distanceKm: number;
  walkingMinutes?: number;
  drivingMinutes?: number;
  xPercent: number; // 10 to 90
  yPercent: number; // 10 to 90
}

const CITY_LANDMARKS_DATA: Record<string, Landmark[]> = {
  'مكة المكرمة': [
    { id: 'm1', name: 'المسجد الحرام الشريف', category: 'religious', categoryLabel: 'شعائر ودين', distanceStr: '200 متر', distanceKm: 0.2, walkingMinutes: 3, xPercent: 50, yPercent: 48 },
    { id: 'm2', name: 'أبراج البيت وساعة مكة', category: 'attraction', categoryLabel: 'معلم رئيسي', distanceStr: '350 متر', distanceKm: 0.35, walkingMinutes: 4, xPercent: 62, yPercent: 42 },
    { id: 'm3', name: 'محطة قطار الحرمين مكة', category: 'transit', categoryLabel: 'مواصلات', distanceStr: '3.8 كم', distanceKm: 3.8, drivingMinutes: 8, xPercent: 22, yPercent: 25 },
    { id: 'm4', name: 'جبل النور وغار حراء', category: 'nature', categoryLabel: 'معلم تاريخي', distanceStr: '5.5 كم', distanceKm: 5.5, drivingMinutes: 12, xPercent: 82, yPercent: 20 },
    { id: 'm5', name: 'مكة مول والروضة', category: 'shopping', categoryLabel: 'تسوق وترفيه', distanceStr: '6.2 كم', distanceKm: 6.2, drivingMinutes: 14, xPercent: 78, yPercent: 75 },
  ],
  'المدينة المنورة': [
    { id: 'd1', name: 'المسجد النبوي الشريف', category: 'religious', categoryLabel: 'شعائر ودين', distanceStr: '250 متر', distanceKm: 0.25, walkingMinutes: 3, xPercent: 50, yPercent: 50 },
    { id: 'd2', name: 'الروضة الشريفة والبقيع', category: 'religious', categoryLabel: 'معلم مقدس', distanceStr: '450 متر', distanceKm: 0.45, walkingMinutes: 5, xPercent: 65, yPercent: 52 },
    { id: 'd3', name: 'مسجد قباء', category: 'religious', categoryLabel: 'تاريخ إسلامي', distanceStr: '3.2 كم', distanceKm: 3.2, drivingMinutes: 7, xPercent: 32, yPercent: 78 },
    { id: 'd4', name: 'جبل أحد ومقبرة الشهداء', category: 'nature', categoryLabel: 'معلم طبيعي وتاريخي', distanceStr: '4.8 كم', distanceKm: 4.8, drivingMinutes: 10, xPercent: 52, yPercent: 18 },
    { id: 'd5', name: 'مطار الأمير محمد بن عبد العزيز', category: 'transit', categoryLabel: 'مطار دولي', distanceStr: '15 كم', distanceKm: 15, drivingMinutes: 18, xPercent: 85, yPercent: 22 },
  ],
  'الرياض': [
    { id: 'r1', name: 'بوليفارد سيتي ورياض سيزون', category: 'attraction', categoryLabel: 'ترفيه وفعاليات', distanceStr: '1.2 كم', distanceKm: 1.2, drivingMinutes: 4, xPercent: 30, yPercent: 28 },
    { id: 'r2', name: 'مركز الملك عبد الله المالي KAFD', category: 'attraction', categoryLabel: 'أبراج وأعمال', distanceStr: '2.5 كم', distanceKm: 2.5, drivingMinutes: 6, xPercent: 25, yPercent: 42 },
    { id: 'r3', name: 'برج المملكة والفيصلية', category: 'attraction', categoryLabel: 'تسوق ومعلم', distanceStr: '3.8 كم', distanceKm: 3.8, drivingMinutes: 8, xPercent: 52, yPercent: 55 },
    { id: 'r4', name: 'الدرعية التاريخية حي الطريف', category: 'nature', categoryLabel: 'تراث وسياحة', distanceStr: '6.5 كم', distanceKm: 6.5, drivingMinutes: 12, xPercent: 18, yPercent: 70 },
    { id: 'r5', name: 'مطار الملك خالد الدولي', category: 'transit', categoryLabel: 'مطار العاصمة', distanceStr: '24 كم', distanceKm: 24, drivingMinutes: 22, xPercent: 82, yPercent: 15 },
  ],
  'جدة': [
    { id: 'j1', name: 'واجهة جدة البحرية - الكورنيش', category: 'attraction', categoryLabel: 'بحر واستجمام', distanceStr: '300 متر', distanceKm: 0.3, walkingMinutes: 4, xPercent: 20, yPercent: 50 },
    { id: 'j2', name: 'نافورة الملك فهد', category: 'attraction', categoryLabel: 'معلم عالمي', distanceStr: '2.2 كم', distanceKm: 2.2, drivingMinutes: 5, xPercent: 25, yPercent: 72 },
    { id: 'j3', name: 'رد سي مول Red Sea Mall', category: 'shopping', categoryLabel: 'تسوق فاخر', distanceStr: '3.1 كم', distanceKm: 3.1, drivingMinutes: 7, xPercent: 32, yPercent: 25 },
    { id: 'j4', name: 'بلد جدة التاريخية', category: 'nature', categoryLabel: 'تراث عالمي اليونسكو', distanceStr: '8.0 كم', distanceKm: 8.0, drivingMinutes: 15, xPercent: 48, yPercent: 85 },
    { id: 'j5', name: 'مطار الملك عبد العزيز الدولي', category: 'transit', categoryLabel: 'مطار جدة', distanceStr: '14 كم', distanceKm: 14, drivingMinutes: 16, xPercent: 78, yPercent: 20 },
  ],
  'العلا': [
    { id: 'u1', name: 'مسرح مرايا العالمي', category: 'attraction', categoryLabel: 'فنون وأيقونة فاخرة', distanceStr: '4.5 كم', distanceKm: 4.5, drivingMinutes: 8, xPercent: 68, yPercent: 42 },
    { id: 'u2', name: 'مدائن صالح - آثار الحجر', category: 'nature', categoryLabel: 'موقع يونسكو أثري', distanceStr: '11 كم', distanceKm: 11, drivingMinutes: 14, xPercent: 35, yPercent: 20 },
    { id: 'u3', name: 'جبل الفيل', category: 'nature', categoryLabel: 'تكوين صخري طبيعي', distanceStr: '6.2 كم', distanceKm: 6.2, drivingMinutes: 9, xPercent: 78, yPercent: 65 },
    { id: 'u4', name: 'البلدة القديمة بالعلا', category: 'nature', categoryLabel: 'تراث وسوق قديم', distanceStr: '3.0 كم', distanceKm: 3.0, drivingMinutes: 5, xPercent: 28, yPercent: 70 },
  ],
  'الخبر والدمام': [
    { id: 'k1', name: 'واجهة الخبر البحرية والكورنيش', category: 'attraction', categoryLabel: 'إطلالة بحرية', distanceStr: '400 متر', distanceKm: 0.4, walkingMinutes: 5, xPercent: 72, yPercent: 50 },
    { id: 'k2', name: 'مركز إثراء Ithra الثقافي', category: 'attraction', categoryLabel: 'فنون وعلوم', distanceStr: '5.2 كم', distanceKm: 5.2, drivingMinutes: 9, xPercent: 30, yPercent: 38 },
    { id: 'k3', name: 'جسر الملك فهد والبحرين', category: 'transit', categoryLabel: 'جسر وسفر', distanceStr: '12 كم', distanceKm: 12, drivingMinutes: 15, xPercent: 85, yPercent: 82 },
  ],
};

// Fallback landmarks for any other city
const DEFAULT_LANDMARKS: Landmark[] = [
  { id: 'f1', name: 'وسط المدينة والمنطقة التجارية', category: 'shopping', categoryLabel: 'تسوق ومطاعم', distanceStr: '500 متر', distanceKm: 0.5, walkingMinutes: 6, xPercent: 40, yPercent: 35 },
  { id: 'f2', name: 'المطار الرئيسي والمعالم البرية', category: 'transit', categoryLabel: 'مواصلات', distanceStr: '12 كم', distanceKm: 12, drivingMinutes: 15, xPercent: 75, yPercent: 20 },
  { id: 'f3', name: 'منتزه الكورنيش والواجهة الرئيسية', category: 'nature', categoryLabel: 'ترفيه وطبيعة', distanceStr: '1.8 كم', distanceKm: 1.8, drivingMinutes: 4, xPercent: 25, yPercent: 70 },
];

export const HotelMiniMap: React.FC<HotelMiniMapProps> = ({ hotel }) => {
  const landmarks = CITY_LANDMARKS_DATA[hotel.city] || DEFAULT_LANDMARKS;

  // Map state
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(landmarks[0]);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Hotel location in coordinate percent on map canvas (center-left)
  const hotelCoords = { x: 45, y: 55 };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotel.name} ${hotel.city} Saudi Arabia`
  )}`;

  const getCategoryBadge = (cat: Landmark['category']) => {
    switch (cat) {
      case 'religious':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] font-extrabold">🕌 شعائر</span>;
      case 'shopping':
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[10px] font-extrabold">🛍️ تسوق</span>;
      case 'transit':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md text-[10px] font-extrabold">✈️ مواصلات</span>;
      case 'nature':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-extrabold">🌴 طبيعة وتراث</span>;
      default:
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] font-extrabold">✨ معلم شهير</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5 text-slate-100">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>خريطة الموقع والمحيط الجغرافي</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            استكشف موقع <strong className="text-white">{hotel.name}</strong> ومدى قربه من أشهر معالم {hotel.city}
          </p>
        </div>

        {/* Map View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setMapMode('standard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mapMode === 'standard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            خريطة التضاريس
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mapMode === 'satellite'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            قمر صناعي
          </button>
        </div>
      </div>

      {/* Main Map Visual Display */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 select-none group">
        
        {/* Map Background Tiles / Canvas Styling */}
        {mapMode === 'standard' ? (
          <div className="absolute inset-0 bg-[#0f172a] opacity-90 overflow-hidden">
            {/* Grid & Road Network Simulation */}
            <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Main Simulated Highways */}
              <path d="M -50 150 Q 200 80 500 220 T 1000 180" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 3" />
              <path d="M 180 -50 Q 220 200 250 500" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 400 -50 L 350 500" fill="none" stroke="#64748b" strokeWidth="2" />
            </svg>
            {/* Subtle Gradient Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-slate-950/80" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#020617] overflow-hidden">
            <img loading="lazy" 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
              alt="Satellite view"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
          </div>
        )}

        {/* SVG Route Line from Hotel to Selected Landmark */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <line
            x1={`${hotelCoords.x}%`}
            y1={`${hotelCoords.y}%`}
            x2={`${selectedLandmark.xPercent}%`}
            y2={`${selectedLandmark.yPercent}%`}
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          {/* Animated Midpoint Badge showing Distance */}
          <foreignObject
            x={`${(hotelCoords.x + selectedLandmark.xPercent) / 2 - 12}%`}
            y={`${(hotelCoords.y + selectedLandmark.yPercent) / 2 - 5}%`}
            width="24%"
            height="10%"
            className="overflow-visible"
          >
            <div className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg text-center whitespace-nowrap border border-white/40 mx-auto w-max dir-ltr">
              {selectedLandmark.distanceStr}
            </div>
          </foreignObject>
        </svg>

        {/* Hotel Pin Marker (Golden Pin) */}
        <div
          style={{ left: `${hotelCoords.x}%`, top: `${hotelCoords.y}%` }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group/pin"
        >
          <div className="bg-slate-950 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-lg border border-amber-500/60 shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 scale-95 group-hover/pin:scale-105 transition-transform">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
            <span>{hotel.name} (أنت هنا)</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 border-2 border-slate-950 text-slate-950 flex items-center justify-center font-black shadow-xl shadow-amber-500/40">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Landmarks Pin Markers */}
        {landmarks.map((lm) => {
          const isSelected = selectedLandmark.id === lm.id;
          return (
            <button
              key={lm.id}
              onClick={() => setSelectedLandmark(lm)}
              style={{ left: `${lm.xPercent}%`, top: `${lm.yPercent}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all cursor-pointer ${
                isSelected ? 'scale-110 z-30' : 'scale-95 opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : 'bg-slate-950/90 text-slate-200 border-slate-700'
                }`}
              >
                <span>{lm.name}</span>
                <span className="text-[9px] opacity-80">({lm.distanceStr})</span>
              </div>

              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 border-white text-slate-950 shadow-emerald-500/40'
                    : 'bg-slate-900 border-slate-700 text-amber-400 hover:border-amber-400'
                }`}
              >
                <LocateFixed className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}

        {/* Map Compass Rose & Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400 flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
        </div>

        {/* Map Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 right-3 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <span>الفندق</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <span>المعلم المختار</span>
          </div>
        </div>

      </div>

      {/* Selected Landmark Detail Highlight Strip */}
      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-white text-sm">{selectedLandmark.name}</h4>
              {getCategoryBadge(selectedLandmark.category)}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1 text-amber-400">
                <Navigation className="w-3.5 h-3.5" />
                <span>المسافة: {selectedLandmark.distanceStr}</span>
              </span>

              {selectedLandmark.walkingMinutes && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{selectedLandmark.walkingMinutes} دقائق مشياً</span>
                </span>
              )}

              {selectedLandmark.drivingMinutes && (
                <span className="flex items-center gap-1 text-blue-400">
                  <Car className="w-3.5 h-3.5" />
                  <span>{selectedLandmark.drivingMinutes} دقائق بالسيارة</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* External Google Maps Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center"
        >
          <span>الملاحة بالخرائط</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* All Nearby Landmarks Grid Selector */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-slate-300 block">
          أشهر المعالم السياحية والدينية القريبة من الفندق:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {landmarks.map((lm) => {
            const isSelected = selectedLandmark.id === lm.id;
            return (
              <button
                key={lm.id}
                onClick={() => setSelectedLandmark(lm)}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="min-w-0 flex-1 pl-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs truncate">{lm.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{lm.categoryLabel}</span>
                </div>

                <div className="text-left shrink-0 dir-ltr">
                  <span className="text-xs font-black text-amber-400 block">{lm.distanceStr}</span>
                  <span className="text-[9px] text-slate-500 block">
                    {lm.walkingMinutes ? `${lm.walkingMinutes} min walk` : `${lm.drivingMinutes} min drive`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
