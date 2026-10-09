import React, { useState, useEffect } from 'react';
import {
  Building2,
  X,
  Check,
  Star,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Wifi,
  Coffee,
  Car,
  Utensils,
  Dumbbell,
  Bed,
  Users,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { Hotel, RoomType } from '../types';

interface AdminHotelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotel: Hotel) => void;
  hotelToEdit?: Hotel | null;
}

const PRESET_IMAGES = [
  { label: 'الرياض فاخر', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
  { label: 'مكة المكرمة - الحرم', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80' },
  { label: 'المدينة المنورة', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'العلا صحراوي', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'جدة البحر الأحمر', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'أبها الجبلية', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80' },
];

const ALL_AMENITIES = [
  'مسبح داخلي وخارجي',
  'واي فاي مجاني سريع',
  'خدمة غرف 24 ساعة',
  'موقف سيارات مجاني مع خدمة صف السيارات',
  'مطاعم عالمية فاخرة',
  'سبا ومركز مساج متكامل',
  'مركز لياقة بدنية (جيم)',
  'إفطار مجاني فاخر',
  'خدمة نقل من وإلى المطار',
  'صالة كبار الشخصيات Executive Lounge',
  'إطلالة مباشرة على الحرم',
  'شاطئ خاص وملاذ بحري',
  'مركز أعمال وقاعات اجتماعات',
  'نادي أطفال ومجالسة أطفال'
];

export const AdminHotelFormModal: React.FC<AdminHotelFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  hotelToEdit
}) => {
  const isEditing = Boolean(hotelToEdit);

  // Form State
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [city, setCity] = useState('الرياض');
  const [region, setRegion] = useState('المنطقة الوسطى');
  const [address, setAddress] = useState('');
  const [distanceToLandmark, setDistanceToLandmark] = useState('');
  const [landmarkName, setLandmarkName] = useState('');
  
  const [starRating, setStarRating] = useState<number>(5);
  const [basePricePerNight, setBasePricePerNight] = useState<number>(1200);
  const [discountedPrice, setDiscountedPrice] = useState<number>(950);
  const [reviewScore, setReviewScore] = useState<number>(9.5);
  const [reviewText, setReviewText] = useState('ممتاز جداً');
  
  const [isFeatured, setIsFeatured] = useState(true);
  const [featuredTag, setFeaturedTag] = useState('إقامة فاخرة موصى بها');
  
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Room Types
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Active form section tab
  const [activeTabSection, setActiveTabSection] = useState<'info' | 'pricing' | 'images' | 'amenities' | 'rooms'>('info');

  useEffect(() => {
    if (hotelToEdit) {
      setName(hotelToEdit.name || '');
      setNameEn(hotelToEdit.nameEn || '');
      setCity(hotelToEdit.city || 'الرياض');
      setRegion(hotelToEdit.region || 'المنطقة الوسطى');
      setAddress(hotelToEdit.address || '');
      setDistanceToLandmark(hotelToEdit.distanceToLandmark || '');
      setLandmarkName(hotelToEdit.landmarkName || '');
      setStarRating(hotelToEdit.starRating || 5);
      setBasePricePerNight(hotelToEdit.basePricePerNight || 1200);
      setDiscountedPrice(hotelToEdit.discountedPrice || 950);
      setReviewScore(hotelToEdit.reviewScore || 9.5);
      setReviewText(hotelToEdit.reviewText || 'ممتاز جداً');
      setIsFeatured(hotelToEdit.isFeatured ?? true);
      setFeaturedTag(hotelToEdit.featuredTag || 'إقامة فاخرة موصى بها');
      setImage(hotelToEdit.image || PRESET_IMAGES[0].url);
      setGallery(hotelToEdit.gallery && hotelToEdit.gallery.length > 0 ? hotelToEdit.gallery : [hotelToEdit.image || PRESET_IMAGES[0].url]);
      setDescription(hotelToEdit.description || '');
      setSelectedAmenities(hotelToEdit.amenities || ALL_AMENITIES.slice(0, 5));
      setRoomTypes(hotelToEdit.roomTypes || []);
      setStatus(hotelToEdit.status || 'published');
    } else {
      // Defaults for new hotel
      setName('');
      setNameEn('');
      setStatus('published');
      setCity('الرياض');
      setRegion('المنطقة الوسطى');
      setAddress('طريق الملك فهد، حي الصحافة');
      setDistanceToLandmark('5 دقائق من مركز الملك عبدالله المالي');
      setLandmarkName('مركز الملك عبدالله المالي');
      setStarRating(5);
      setBasePricePerNight(1450);
      setDiscountedPrice(1200);
      setReviewScore(9.4);
      setReviewText('ممتاز جداً');
      setIsFeatured(true);
      setFeaturedTag('فندق فاخر جديد');
      setImage(PRESET_IMAGES[0].url);
      setGallery([PRESET_IMAGES[0].url, PRESET_IMAGES[3].url]);
      setDescription('فندق فاخر بفرع جديد يضم أرقى أجنحة الضيافة السعودية والخدمات الفندقية من فئة الخمس نجوم.');
      setSelectedAmenities(ALL_AMENITIES.slice(0, 6));
      setRoomTypes([
        {
          id: `room-${Date.now()}-1`,
          name: 'جناح ديلوكس الملكي',
          description: 'جناح راقٍ بمساحة واسعة مع إطلالة ممتازة وإفطار مجاني',
          pricePerNight: 1200,
          maxGuests: 2,
          bedType: 'سرير كينج فاخر',
          areaSqm: 55,
          perks: ['إفطار مجاني', 'خدمة صف السيارات', 'واي فاي سريع'],
          image: PRESET_IMAGES[0].url
        }
      ]);
    }
  }, [hotelToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleAddGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryUrl = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleAddRoomType = () => {
    const newRoom: RoomType = {
      id: `room-${Date.now()}`,
      name: 'جناح تنفيذي جديد',
      description: 'جناح فسيح يتضمن منطقة جلوس مجهزة بأحدث وسائل الراحة',
      pricePerNight: basePricePerNight,
      maxGuests: 2,
      bedType: 'سرير كينج كبير',
      areaSqm: 50,
      perks: ['إفطار مجاني', 'دخول صالة كبار الشخصيات'],
      image: image
    };
    setRoomTypes([...roomTypes, newRoom]);
  };

  const handleRemoveRoomType = (id: string) => {
    setRoomTypes(roomTypes.filter(r => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('يرجى إدخال اسم الفندق بالعربية');
      return;
    }

    const cityEnMap: Record<string, string> = {
      'الرياض': 'Riyadh',
      'مكة المكرمة': 'Makkah',
      'المدينة المنورة': 'Madinah',
      'العلا': 'AlUla',
      'جدة': 'Jeddah',
      'أبها': 'Abha',
      'الخبر': 'Khobar'
    };

    const finalHotel: Hotel = {
      id: hotelToEdit ? hotelToEdit.id : `hotel-${Date.now()}`,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      city: city,
      cityEn: cityEnMap[city] || 'Saudi Arabia',
      region: region || 'المملكة العربية السعودية',
      address: address || `${city} - المركز الرئيس`,
      starRating: Number(starRating) || 5,
      reviewScore: Number(reviewScore) || 9.2,
      reviewCount: hotelToEdit ? hotelToEdit.reviewCount : 1,
      reviewText: reviewText || 'ممتاز',
      basePricePerNight: Number(basePricePerNight) || 1000,
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      isFeatured: isFeatured,
      featuredTag: featuredTag,
      image: image || PRESET_IMAGES[0].url,
      gallery: gallery.length > 0 ? gallery : [image || PRESET_IMAGES[0].url],
      description: description || 'فندق فاخر مميز بأرقى الخدمات والراحة.',
      distanceToLandmark: distanceToLandmark || 'بالقرب من الأماكن الحيوية',
      landmarkName: landmarkName || 'مركز المدينة',
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ALL_AMENITIES.slice(0, 4),
      roomTypes: roomTypes.length > 0 ? roomTypes : [
        {
          id: `room-def-${Date.now()}`,
          name: 'غرفة قياسية ديلوكس',
          description: 'غرفة فاخرة مجهزة بجميع الاحتياجات',
          pricePerNight: Number(basePricePerNight) || 1000,
          maxGuests: 2,
          bedType: 'سرير كينج',
          areaSqm: 40,
          perks: ['واي فاي مجاني', 'إفطار'],
          image: image || PRESET_IMAGES[0].url
        }
      ],
      dateRules: hotelToEdit?.dateRules || {}
    };

    onSave(finalHotel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans dir-rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {isEditing ? `تعديل بيانات فندق: ${hotelToEdit?.name}` : 'إضافة فندق فاخر جديد'}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                قم بتعبئة وتحديث تفاصيل الفندق، الأسعار، الخدمات والغرف لتحديثها مباشرة في الموقع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="bg-slate-950 border-b border-slate-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTabSection('info')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'info'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>المعلومات العامة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('pricing')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'pricing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>الأسعار والتقييم</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('images')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'images'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>الصور والمعرض ({gallery.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('amenities')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'amenities'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>الخدمات والمرافق ({selectedAmenities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection('rooms')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTabSection === 'rooms'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>أنواع الغرف ({roomTypes.length})</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          
          {/* TAB 1: INFO */}
          {activeTabSection === 'info' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">اسم الفندق باللغة العربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: فندق نارسيس الرياض"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">اسم الفندق باللغة الإنجليزية</label>
                  <input
                    type="text"
                    placeholder="e.g. Narcissus Hotel Riyadh"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">المدينة الرئيسية</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500/80 cursor-pointer font-bold"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                    <option value="العلا">العلا</option>
                    <option value="جدة">جدة</option>
                    <option value="أبها">أبها</option>
                    <option value="الخبر">الخبر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">المنطقة الجغرافية</label>
                  <input
                    type="text"
                    placeholder="مثال: المنطقة الوسطى / منطقة مكة"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">العنوان بالتفصيل</label>
                <input
                  type="text"
                  placeholder="مثال: طريق الملك فهد - حي العليا، الرياض"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">المسافة عن المعلم الرئيسي</label>
                  <input
                    type="text"
                    placeholder="مثال: 200 متر عن المسجد الحرام / 5 دقائق من الفيصلية"
                    value={distanceToLandmark}
                    onChange={(e) => setDistanceToLandmark(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">اسم المعلم المقارب</label>
                  <input
                    type="text"
                    placeholder="مثال: الحرم المكي / برج المملكة / بوليفارد الرياض"
                    value={landmarkName}
                    onChange={(e) => setLandmarkName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">الوصف الكامل للفندق</label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً جذاباً يشمل مزايا الفندق والفخامة والخدمات المتوفرة..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & RATING */}
          {activeTabSection === 'pricing' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">سعر الليلة الأساسي (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={basePricePerNight}
                    onChange={(e) => setBasePricePerNight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-400 font-black placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans text-base"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">السعر المخفض إن وجد (ر.س)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountedPrice || ''}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-black placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">تصنيف النجوم</label>
                  <select
                    value={starRating}
                    onChange={(e) => setStarRating(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500/80 font-bold cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم فاخر)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 نجوم ممتاز)</option>
                    <option value={3}>⭐⭐⭐ (3 نجوم جودة عالية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">درجة التقييم (من 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">عبارة التقييم</label>
                  <input
                    type="text"
                    placeholder="مثال: استثنائي / ممتاز جداً / رائع"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">تميز الفندق وشارة العرض</p>
                    <p className="text-[10px] text-slate-400">إظهار الفندق كـ "مميز" في الصفحة الرئيسية ونتائج البحث</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {isFeatured && (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">نص الشارة المميزة (Badge)</label>
                    <input
                      type="text"
                      placeholder="مثال: الأكثر طلباً في مكة المكرمة"
                      value={featuredTag}
                      onChange={(e) => setFeaturedTag(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: IMAGES & GALLERY */}
          {activeTabSection === 'images' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">رابط الصورة الرئيسية بالفندق</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                />
              </div>

              {/* Presets */}
              <div>
                <span className="block text-slate-400 font-bold mb-2">اختيار صورة جاهزة فائقة الدقة:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className={`p-2 rounded-xl border text-right flex items-center gap-2 transition-all cursor-pointer ${
                        image === p.url
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <img loading="lazy"  src={p.url} alt={p.label} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <span className="text-[11px] truncate">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="relative rounded-2xl overflow-hidden h-44 border border-slate-800 shadow-inner">
                  <img loading="lazy"  src={image} alt="معاينة الصورة" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-amber-400 font-bold border border-slate-800">
                    الصورة الرئيسية الحالية
                  </div>
                </div>
              )}

              {/* Gallery Section */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <label className="block text-slate-300 font-bold">معرض الصور الإضافي ({gallery.length} صور)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أدخل رابط صورة إضافية (Unsplash / URL)..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-amber-400 font-bold hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {gallery.map((imgUrl, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-800 h-24">
                      <img loading="lazy"  src={imgUrl} alt={`صورة معرض ${i+1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryUrl(i)}
                        className="absolute top-1 left-1 p-1 rounded-lg bg-rose-600/90 text-white opacity-90 hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AMENITIES & DESCRIPTION */}
          {activeTabSection === 'amenities' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-slate-300 font-bold mb-2">حدد المرافق والخدمات المتوفرة بالفندق:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_AMENITIES.map((item, idx) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAmenity(item)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{item}</span>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isChecked ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: ROOM TYPES */}
          {activeTabSection === 'rooms' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-white text-sm">إدارة الغرف والأجنحة</h3>
                  <p className="text-[11px] text-slate-400">حدد أنواع الغرف المتاحة داخل الفندق وأسعارها</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRoomType}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة نوع غرفة</span>
                </button>
              </div>

              <div className="space-y-3">
                {roomTypes.map((room, idx) => (
                  <div key={room.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveRoomType(room.id)}
                      className="absolute left-3 top-3 p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="حذف هذا النوع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">اسم الغرفة / الجناح</label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => {
                            const updated = [...roomTypes];
                            updated[idx].name = e.target.value;
                            setRoomTypes(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">السعر لليلة (ر.س)</label>
                        <input
                          type="number"
                          value={room.pricePerNight}
                          onChange={(e) => {
                            const updated = [...roomTypes];
                            updated[idx].pricePerNight = Number(e.target.value);
                            setRoomTypes(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-black focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">نوع الأسرّة</label>
                        <input
                          type="text"
                          value={room.bedType}
                          onChange={(e) => {
                            const updated = [...roomTypes];
                            updated[idx].bedType = e.target.value;
                            setRoomTypes(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">أقصى عدد ضيوف</label>
                        <input
                          type="number"
                          value={room.maxGuests}
                          onChange={(e) => {
                            const updated = [...roomTypes];
                            updated[idx].maxGuests = Number(e.target.value);
                            setRoomTypes(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">المساحة (م²)</label>
                        <input
                          type="number"
                          value={room.areaSqm}
                          onChange={(e) => {
                            const updated = [...roomTypes];
                            updated[idx].areaSqm = Number(e.target.value);
                            setRoomTypes(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isEditing ? 'حفظ التعديلات' : 'إضافة الفندق الآن'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
