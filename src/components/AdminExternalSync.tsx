import React, { useState, useEffect } from 'react';
import { Search, DownloadCloud, CheckCircle2, AlertCircle, RefreshCw, Server, Link, Edit3, Trash2, UploadCloud, Globe, Settings, Key, Database, Zap, Save } from 'lucide-react';
import { Hotel } from '../types';

interface AdminExternalSyncProps {
  onAddHotel: (hotel: Omit<Hotel, 'id'>) => void;
}

export const AdminExternalSync: React.FC<AdminExternalSyncProps> = ({ onAddHotel }) => {
  const [activeTab, setActiveTab] = useState<'import' | 'api'>('import');
  const [importMode, setImportMode] = useState<'url' | 'search'>('url');
  
  // URL Mode State
  const [urls, setUrls] = useState('');
  
  // Search Mode State
  const [source, setSource] = useState<string>('booking');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('الرياض');
  
  // API Settings State
  const [apiConfigs, setApiConfigs] = useState({
    booking: { url: 'https://api.booking.com/v1', key: '', isConnected: false },
    airbnb: { url: 'https://api.airbnb.com/v2', key: '', isConnected: false },
    expedia: { url: 'https://api.expedia.com/v3', key: '', isConnected: false },
    almatar: { url: 'https://api.almatar.com/v1', key: '', isConnected: false },
    mabeet: { url: 'https://api.mabeet.com/v1', key: '', isConnected: false },
    gathern: { url: 'https://api.gathern.co/v1', key: '', isConnected: false }
  });
  
  // Common State
  const [isFetching, setIsFetching] = useState(false);
  const [syncingApi, setSyncingApi] = useState<string | null>(null);
  const [stagedHotels, setStagedHotels] = useState<Omit<Hotel, 'id'>[]>([]);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Load API configs from local storage on mount
  useEffect(() => {
    const savedConfigs = localStorage.getItem('ksastays_api_configs');
    if (savedConfigs) {
      try {
        setApiConfigs(JSON.parse(savedConfigs));
      } catch (e) {}
    }
  }, []);

  const handleSaveApiConfigs = () => {
    localStorage.setItem('ksastays_api_configs', JSON.stringify(apiConfigs));
    setPublishSuccess('تم حفظ إعدادات الربط بنجاح!');
    setTimeout(() => setPublishSuccess(null), 3000);
  };

  const handleUpdateApiConfig = (platform: 'booking' | 'airbnb' | 'expedia' | 'almatar' | 'mabeet' | 'gathern', field: 'url' | 'key', value: string) => {
    setApiConfigs(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
        isConnected: prev[platform].key.length > 5 || value.length > 5 // Mock connection status
      }
    }));
  };

  const generateMockHotels = (platform: string, count: number) => {
    const fetchedItems: Omit<Hotel, 'id'>[] = [];
    const sourceName = platform === 'booking' ? 'بوكينج' 
                     : platform === 'airbnb' ? 'اير بي ان بي' 
                     : platform === 'almatar' ? 'المطار'
                     : platform === 'mabeet' ? 'مبيت'
                     : platform === 'gathern' ? 'جاذر ان'
                     : 'اكسبيديا';
    
    for (let i = 0; i < count; i++) {
      const mockHotel: Omit<Hotel, 'id'> = {
        name: `فندق ${city} رويال (${sourceName}) - ${Math.floor(Math.random() * 1000)}`,
        nameEn: `${city} Royal Suites`,
        city: city,
        cityEn: city === 'الرياض' ? 'Riyadh' : city === 'جدة' ? 'Jeddah' : 'Makkah',
        region: 'المنطقة الوسطى',
        address: `شارع العليا، ${city}`,
        starRating: Math.floor(Math.random() * 3) + 3,
        reviewScore: Number((Math.random() * 2 + 7).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 1000) + 50,
        reviewText: 'ممتاز جداً',
        description: `تم جلب هذه البيانات من ${sourceName} عبر واجهة برمجة التطبيقات (API). يقدم هذا الفندق إقامة فاخرة تناسب تطلعاتك.`,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        basePricePerNight: Math.floor(Math.random() * 1000) + 300,
        amenities: ['واي فاي مجاني', 'مسبح داخلي', 'موقف سيارات', 'مطعم'],
        distanceToLandmark: '1 كم من المركز',
        landmarkName: 'المركز التجاري',
        roomTypes: [
          {
            id: `room_${Math.random().toString(36).substr(2, 9)}`,
            name: 'غرفة ديلوكس',
            description: 'غرفة واسعة ومريحة',
            pricePerNight: Math.floor(Math.random() * 500) + 300,
            maxGuests: 2,
            bedType: 'سرير كينج',
            areaSqm: 35,
            perks: ['إفطار مجاني', 'آلة قهوة'],
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
        ]
      };
      fetchedItems.push(mockHotel);
    }
    return fetchedItems;
  };

  const handleFetch = () => {
    setIsFetching(true);
    setPublishSuccess(null);
    
    setTimeout(() => {
      setIsFetching(false);
      
      let count = 1;
      let platform = source;

      if (importMode === 'url') {
        const lines = urls.split('\n').filter(l => l.trim().length > 0);
        count = lines.length || 1;
        if (urls.includes('airbnb')) platform = 'airbnb';
        else if (urls.includes('expedia')) platform = 'expedia';
        else if (urls.includes('almatar') || urls.includes('المطار')) platform = 'almatar';
        else if (urls.includes('mabeet') || urls.includes('مبيت')) platform = 'mabeet';
        else if (urls.includes('gathern') || urls.includes('جاذر ان')) platform = 'gathern';
        else platform = 'booking';
      } else {
        count = Math.floor(Math.random() * 3) + 2; // 2 to 4 hotels
      }
      
      const fetchedItems = generateMockHotels(platform, count);
      
      setStagedHotels([...stagedHotels, ...fetchedItems]);
      if (importMode === 'url') setUrls('');
      
    }, 2000);
  };

  const handleApiSync = async (platform: 'booking' | 'airbnb' | 'expedia' | 'almatar' | 'mabeet' | 'gathern' | 'almatar' | 'mabeet' | 'gathern') => {
    setSyncingApi(platform);
    try {
      const count = Math.floor(Math.random() * 5) + 3;
      const res = await fetch(`/api/external/sync?platform=${platform}&city=${city}&count=${count}`);
      const data = await res.json();
      
      if (data.success && data.hotels) {
        data.hotels.forEach((h: Hotel) => onAddHotel(h));
        setPublishSuccess(`تم جلب ${data.hotels.length} فنادق فعلياً من سيرفر الـ API لـ ${platform} كمسودات! يرجى مراجعتها من قسم إدارة الفنادق.`);
      } else {
        throw new Error('فشل جلب البيانات');
      }
    } catch (err) {
      console.error(err);
      setPublishSuccess('عفواً، حدث خطأ أثناء الاتصال بالـ API الخارجي.');
    } finally {
      setSyncingApi(null);
      setTimeout(() => setPublishSuccess(null), 6000);
    }
  };

  const handleUpdateStaged = (index: number, field: string, value: any) => {
    const updated = [...stagedHotels];
    updated[index] = { ...updated[index], [field]: value };
    setStagedHotels(updated);
  };

  const handlePublish = (index: number) => {
    const hotel = stagedHotels[index];
    onAddHotel(hotel);
    setStagedHotels(prev => prev.filter((_, i) => i !== index));
    setPublishSuccess(`تم نشر "${hotel.name}" بنجاح!`);
    setTimeout(() => setPublishSuccess(null), 3000);
  };

  const handlePublishAll = () => {
    stagedHotels.forEach(h => onAddHotel(h));
    const count = stagedHotels.length;
    setStagedHotels([]);
    setPublishSuccess(`تم نشر ${count} فنادق بنجاح!`);
    setTimeout(() => setPublishSuccess(null), 3000);
  };

  const handleRemoveStaged = (index: number) => {
    setStagedHotels(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('import')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'import' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <DownloadCloud className="w-4 h-4" />
          الاستيراد اليدوي والمسودات
          {stagedHotels.length > 0 && (
            <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] ml-1">
              {stagedHotels.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'api' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          إعدادات الربط (API)
        </button>
      </div>

      {/* Success Alert */}
      {publishSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-emerald-300 font-bold text-sm">{publishSuccess}</p>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: IMPORT & STAGING */}
      {/* ========================================================= */}
      {activeTab === 'import' && (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Server className="w-6 h-6 text-amber-500" />
              <div>
                <h2 className="text-lg font-black text-white">استيراد الفنادق والخدمات</h2>
                <p className="text-xs text-slate-400 mt-1">
                  اجلب منتجات متعددة بضغطة زر، عدّل المحتوى، ثم انشرها مباشرة
                </p>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-slate-950 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setImportMode('url')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  importMode === 'url' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-4 h-4" />
                استيراد بالروابط (URL)
              </button>
              <button
                onClick={() => setImportMode('search')}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  importMode === 'search' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                استيراد بالبحث
              </button>
            </div>

            {importMode === 'url' ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    الاستيراد عبر الرابط أو بالجملة (روابط الفنادق - رابط واحد في كل سطر)
                  </label>
                  <textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    placeholder="https://www.booking.com/hotel/sa/example.html&#10;https://www.airbnb.com/rooms/123456"
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm font-semibold font-mono"
                    dir="ltr"
                  />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  يدعم استيراد الروابط من: بوكينج، اير بي ان بي، اكسبيديا، المطار، مبيت، جاذر ان
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">المصدر</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm font-semibold"
                  >
                    <option value="booking">Booking.com (بوكينج)</option>
                    <option value="airbnb">Airbnb (اير بي ان بي)</option>
                    <option value="expedia">Expedia (اكسبيديا)</option>
                    <option value="almatar">Almatar (المطار)</option>
                    <option value="mabeet">Mabeet (مبيت)</option>
                    <option value="gathern">Gathern (جاذر ان)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">المدينة</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm font-semibold"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                    <option value="جدة">جدة</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">كلمات مفتاحية</label>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="ابحث..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end">
              <button
                onClick={handleFetch}
                disabled={isFetching || (importMode === 'url' && !urls.trim())}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  isFetching || (importMode === 'url' && !urls.trim())
                    ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                {isFetching ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري سحب البيانات...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-5 h-5" />
                    <span>جلب المنتجات الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Staged Edit Area */}
          {stagedHotels.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">المسودات والمراجعة</h3>
                  <p className="text-xs text-slate-400">راجع البيانات، قم بتعديلها ثم انشرها للموقع</p>
                </div>
                <button
                  onClick={handlePublishAll}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <UploadCloud className="w-4 h-4" />
                  نشر الكل ({stagedHotels.length})
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {stagedHotels.map((hotel, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row gap-6 animate-fade-in">
                    {/* Image Preview */}
                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 relative group">
                      <img loading="lazy"  src={hotel.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors">
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Edit Form */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">عنوان الفندق / الخدمة</label>
                          <input
                            type="text"
                            value={hotel.name}
                            onChange={(e) => handleUpdateStaged(idx, 'name', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">السعر لليلة (ر.س)</label>
                          <input
                            type="number"
                            value={hotel.basePricePerNight}
                            onChange={(e) => handleUpdateStaged(idx, 'basePricePerNight', Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">وصف المنتج</label>
                          <textarea
                            value={hotel.description}
                            onChange={(e) => handleUpdateStaged(idx, 'description', e.target.value)}
                            rows={2}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => handleRemoveStaged(idx)}
                          className="px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </button>
                        <button
                          onClick={() => handlePublish(idx)}
                          className="px-5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          اعتماد ونشر
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================= */}
      {/* TAB 2: API SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'api' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                إعدادات الربط المباشر (API Integrations)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                قم بإدخال روابط ومفاتيح (API Keys) للمنصات العالمية لمزامنة التوافر والأسعار وجلب المنتجات مباشرة.
              </p>
            </div>
            <button
              onClick={handleSaveApiConfigs}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Booking.com API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#003580] flex items-center justify-center text-white font-bold text-xs">B.</div>
                  Booking.com API
                </h3>
                {apiConfigs.booking.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Endpoint URL</label>
                  <input
                    type="url"
                    value={apiConfigs.booking.url}
                    onChange={(e) => handleUpdateApiConfig('booking', 'url', e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key / Bearer Token</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="sk_live_..................."
                      value={apiConfigs.booking.key}
                      onChange={(e) => handleUpdateApiConfig('booking', 'key', e.target.value)}
                      dir="ltr"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => handleApiSync('booking')}
                  disabled={syncingApi === 'booking' || !apiConfigs.booking.key}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    syncingApi === 'booking' 
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : !apiConfigs.booking.key 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
                  }`}
                >
                  {syncingApi === 'booking' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {syncingApi === 'booking' ? 'جاري الجلب...' : 'جلب البيانات الآن (Manual Sync)'}
                </button>
              </div>
            </div>

            {/* Airbnb API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white font-bold text-xs">A</div>
                  Airbnb API
                </h3>
                {apiConfigs.airbnb.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Endpoint URL</label>
                  <input
                    type="url"
                    value={apiConfigs.airbnb.url}
                    onChange={(e) => handleUpdateApiConfig('airbnb', 'url', e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-[#FF5A5F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Client Secret / API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Enter API Key"
                      value={apiConfigs.airbnb.key}
                      onChange={(e) => handleUpdateApiConfig('airbnb', 'key', e.target.value)}
                      dir="ltr"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-[#FF5A5F] focus:outline-none"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => handleApiSync('airbnb')}
                  disabled={syncingApi === 'airbnb' || !apiConfigs.airbnb.key}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    syncingApi === 'airbnb' 
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : !apiConfigs.airbnb.key 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-[#FF5A5F]/10 text-[#FF5A5F] border border-[#FF5A5F]/20 hover:bg-[#FF5A5F]/20'
                  }`}
                >
                  {syncingApi === 'airbnb' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {syncingApi === 'airbnb' ? 'جاري الجلب...' : 'جلب البيانات الآن (Manual Sync)'}
                </button>
              </div>
            </div>

            {/* Expedia API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#000080] flex items-center justify-center text-white font-bold text-xs">E</div>
                  Expedia Partner Solutions
                </h3>
                {apiConfigs.expedia.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">EPS Rapid API Endpoint</label>
                  <input
                    type="url"
                    value={apiConfigs.expedia.url}
                    onChange={(e) => handleUpdateApiConfig('expedia', 'url', e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key / Token</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="EPS API Key"
                      value={apiConfigs.expedia.key}
                      onChange={(e) => handleUpdateApiConfig('expedia', 'key', e.target.value)}
                      dir="ltr"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleApiSync('expedia')}
                disabled={syncingApi === 'expedia' || !apiConfigs.expedia.key}
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  syncingApi === 'expedia' 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : !apiConfigs.expedia.key 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                      : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/20'
                }`}
              >
                {syncingApi === 'expedia' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {syncingApi === 'expedia' ? 'جاري الجلب...' : 'جلب البيانات الآن (Manual Sync)'}
              </button>
            </div>


            {/* Almatar API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">M</div>
                  المطار (Almatar)
                </h3>
                {apiConfigs.almatar?.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Endpoint URL</label>
                  <input type="url" value={apiConfigs.almatar?.url} onChange={(e) => handleUpdateApiConfig('almatar', 'url', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Enter API Key" value={apiConfigs.almatar?.key} onChange={(e) => handleUpdateApiConfig('almatar', 'key', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
                <button onClick={() => handleApiSync('almatar')} disabled={syncingApi === 'almatar' || !apiConfigs.almatar?.key} className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${syncingApi === 'almatar' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : !apiConfigs.almatar?.key ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'}`}>
                  {syncingApi === 'almatar' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {syncingApi === 'almatar' ? 'جاري الجلب...' : 'جلب البيانات الآن'}
                </button>
              </div>
            </div>

            {/* Mabeet API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">B</div>
                  مبيت (Mabeet)
                </h3>
                {apiConfigs.mabeet?.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Endpoint URL</label>
                  <input type="url" value={apiConfigs.mabeet?.url} onChange={(e) => handleUpdateApiConfig('mabeet', 'url', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Enter API Key" value={apiConfigs.mabeet?.key} onChange={(e) => handleUpdateApiConfig('mabeet', 'key', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>
                <button onClick={() => handleApiSync('mabeet')} disabled={syncingApi === 'mabeet' || !apiConfigs.mabeet?.key} className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${syncingApi === 'mabeet' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : !apiConfigs.mabeet?.key ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600/20'}`}>
                  {syncingApi === 'mabeet' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {syncingApi === 'mabeet' ? 'جاري الجلب...' : 'جلب البيانات الآن'}
                </button>
              </div>
            </div>

            {/* Gathern API Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-white text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs">G</div>
                  جاذر ان (Gathern)
                </h3>
                {apiConfigs.gathern?.isConnected ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded-lg text-[10px] font-bold">غير متصل</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Gathern API Endpoint</label>
                  <input type="url" value={apiConfigs.gathern?.url} onChange={(e) => handleUpdateApiConfig('gathern', 'url', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:border-teal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">API Key / Token</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Gathern API Key" value={apiConfigs.gathern?.key} onChange={(e) => handleUpdateApiConfig('gathern', 'key', e.target.value)} dir="ltr" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-300 text-xs focus:border-teal-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <button onClick={() => handleApiSync('gathern')} disabled={syncingApi === 'gathern' || !apiConfigs.gathern?.key} className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${syncingApi === 'gathern' ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : !apiConfigs.gathern?.key ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-teal-600/10 text-teal-400 border border-teal-500/20 hover:bg-teal-600/20'}`}>
                {syncingApi === 'gathern' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {syncingApi === 'gathern' ? 'جاري الجلب...' : 'جلب البيانات الآن'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
