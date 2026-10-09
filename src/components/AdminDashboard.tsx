import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Ticket,
  MessageSquare,
  Compass,
  Building,
  Umbrella,
  Home,
  Plane,
  Car,
  Ship,
  Calendar,
  Briefcase,
  Clock,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  Sparkles,
  Building2,
  X,
  Check, CheckCircle2,
  LogOut,
  Mail,
  CalendarRange,
  Download,
  FileText,
  Bell,
  BellRing,
  Users,
  BarChart as BarChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Hotel, Booking, HotelInquiry, User, SitePage } from '../types';
import { AdminPageFormModal } from './AdminPageFormModal';
import { AdminHotelFormModal } from './AdminHotelFormModal';
import { AdminExternalSync } from './AdminExternalSync';

import { AdminHotelCalendar } from './AdminHotelCalendar';

interface AdminDashboardProps {
  hotels: Hotel[];
  onAddHotel?: (hotel: Hotel) => void;
  onUpdateHotel?: (hotel: Hotel) => void;
  onDeleteHotel?: (hotelId: string) => void;
  bookings: Booking[];
  usersList?: User[];
  pages?: SitePage[];
  onAddPage?: (page: SitePage) => void;
  onUpdatePage?: (page: SitePage) => void;
  onDeletePage?: (pageId: string) => void;
  initialMenu?: MenuSection;
  inquiries?: HotelInquiry[];
  onLogout?: () => void;
  user: { role: 'customer' | 'host'; name: string; email?: string } | null;
}

export type MenuSection =
  | 'dashboard'
  | 'external_sync'
  | 'pages'
  | 'users'
  | 'coupons'
  | 'reviews'
  | 'locations'
  | 'hotels'
  | 'hotel_calendar'
  | 'tours'
  | 'spaces'
  | 'flights'
  | 'cars'
  | 'boats'
  | 'events'
  | 'visa'
  | 'bookings';

const chartData = [
  { name: 'يناير', bookings: 12, revenue: 15000 },
  { name: 'فبراير', bookings: 19, revenue: 23000 },
  { name: 'مارس', bookings: 25, revenue: 32000 },
  { name: 'أبريل', bookings: 32, revenue: 41000 },
  { name: 'مايو', bookings: 45, revenue: 58000 },
  { name: 'يونيو', bookings: 60, revenue: 85000 },
  { name: 'يوليو', bookings: 75, revenue: 105000 },
  { name: 'أغسطس', bookings: 90, revenue: 125000 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  hotels,
  onAddHotel,
  onUpdateHotel,
  onDeleteHotel,
  bookings,
  usersList = [],
  pages = [],
  onAddPage,
  onUpdatePage,
  onDeletePage,
  initialMenu,
  inquiries,
  onLogout,
  user
}) => {
  const isSuperAdmin = user?.email?.toLowerCase() === 'p@gmail.com';

  const [activeMenu, setActiveMenu] = useState<MenuSection>(initialMenu || 'dashboard');
  const [dashboardView, setDashboardView] = useState<'charts' | 'calendar'>('charts');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<SitePage | null>(null);

  // Hotel Modals & Calendar states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHotelFormOpen, setIsHotelFormOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hotelToEdit, setHotelToEdit] = useState<Hotel | null>(null);
  const [selectedCalendarHotelId, setSelectedCalendarHotelId] = useState<string | undefined>(undefined);

  // Local state sync with hotels prop
  const [localHotels, setLocalHotels] = useState<Hotel[]>(() => {
    const seen = new Set<string>();
    return hotels.filter((h) => {
      if (!h || !h.id || seen.has(h.id)) return false;
      if (!isSuperAdmin && h.hostEmail !== user?.email) return false;
      seen.add(h.id);
      return true;
    });
  });

  useEffect(() => {
    const seen = new Set<string>();
    setLocalHotels(
      hotels.filter((h) => {
        if (!h || !h.id || seen.has(h.id)) return false;
        if (!isSuperAdmin && h.hostEmail !== user?.email) return false;
        seen.add(h.id);
        return true;
      })
    );
  }, [hotels, isSuperAdmin, user]);

  const filteredBookings = isSuperAdmin ? bookings : bookings.filter(b => localHotels.some(h => h.id === b.hotelId));
  const filteredInquiries = inquiries ? (isSuperAdmin ? inquiries : inquiries.filter(i => localHotels.some(h => h.id === i.hotelId))) : [];
  const pendingInquiriesCount = filteredInquiries.filter(i => i.status === 'pending').length;
  const newBookingsCount = filteredBookings.filter(b => {
    // Treat bookings from last 24h as new, or just a simple mock logic
    const createdDate = b.createdAt ? new Date(b.createdAt) : new Date();
    return (Date.now() - createdDate.getTime()) < 24 * 60 * 60 * 1000;
  }).length;
  
  const totalNotifications = pendingInquiriesCount + newBookingsCount;

  const handleOpenAddHotel = () => {
    setHotelToEdit(null);
    setIsHotelFormOpen(true);
  };

  const handleOpenEditHotel = (hotel: Hotel) => {
    setHotelToEdit(hotel);
    setIsHotelFormOpen(true);
  };

  const handleOpenCalendarForHotel = (hotelId: string) => {
    setSelectedCalendarHotelId(hotelId);
    setActiveMenu('hotel_calendar');
  };

  const handleDeleteHotelConfirm = (hotel: Hotel) => {
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف فندق "${hotel.name}" نهائياً من النظام؟`)) {
      if (onDeleteHotel) {
        onDeleteHotel(hotel.id);
      } else {
        setLocalHotels(prev => prev.filter(h => h.id !== hotel.id));
      }
    }
  };

  const handleSaveHotelForm = (savedHotel: Hotel) => {
    if (hotelToEdit) {
      if (onUpdateHotel) {
        onUpdateHotel(savedHotel);
      } else {
        setLocalHotels(prev => prev.map(h => h.id === savedHotel.id ? savedHotel : h));
      }
    } else {
      if (onAddHotel) {
        onAddHotel(savedHotel);
      } else {
        setLocalHotels(prev => [savedHotel, ...prev]);
      }
    }
  };

  const exportBookingsToCSV = () => {
    if (!filteredBookings || filteredBookings.length === 0) {
      alert('لا توجد حجوزات لتصديرها');
      return;
    }

    const headers = ['رقم الحجز', 'اسم الضيف', 'البريد الإلكتروني', 'رقم الهاتف', 'الفندق', 'نوع الغرفة', 'عدد الضيوف', 'تاريخ الوصول', 'تاريخ المغادرة', 'السعر الإجمالي', 'حالة الحجز', 'تاريخ إنشاء الحجز'];
    
    const rows = filteredBookings.map(b => [
      b.id,
      `${b.guestInfo.firstName} ${b.guestInfo.lastName}`,
      b.guestInfo.email,
      b.guestInfo.phone,
      b.hotelName,
      b.roomTypeName,
      b.guests,
      b.checkIn,
      b.checkOut,
      b.totalPrice,
      b.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار',
      b.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [coupons, setCoupons] = useState([
    { id: '1', code: 'KSA2027', discount: '20%', validUntil: '2027-12-31', status: 'نشط', uses: 142 },
    { id: '2', code: 'SUMMER50', discount: '500 ر.س', validUntil: '2026-09-01', status: 'نشط', uses: 89 },
    { id: '3', code: 'VIPMAKKAH', discount: '15%', validUntil: '2026-10-15', status: 'منتهي', uses: 230 },
  ]);

  const [locations, setLocations] = useState([
    { id: '1', name: 'الرياض', region: 'المنطقة الوسطى', hotelsCount: 18, status: 'نشط' },
    { id: '2', name: 'مكة المكرمة', region: 'منطقة مكة', hotelsCount: 24, status: 'نشط' },
    { id: '3', name: 'المدينة المنورة', region: 'منطقة المدينة', hotelsCount: 15, status: 'نشط' },
    { id: '4', name: 'العلا', region: 'منطقة المدينة', hotelsCount: 8, status: 'نشط' },
    { id: '5', name: 'جدة', region: 'منطقة مكة', hotelsCount: 20, status: 'نشط' },
  ]);

  const [tours, setTours] = useState([
    { id: '1', name: 'جولة سفاري العلا والبلدة القديمة', location: 'العلا', price: '850 ر.س', duration: 'يوم كامل', status: 'متاح' },
    { id: '2', name: 'رحلة وادي الديسة الطبيعية', location: 'تبوك', price: '1,200 ر.س', duration: 'يومان', status: 'متاح' },
    { id: '3', name: 'جولة جدة التاريخية وغوص البحر الأحمر', location: 'جدة', price: '650 ر.س', duration: '6 ساعات', status: 'متاح' },
  ]);

  const [reviews, setReviews] = useState([
    { id: '1', user: 'محمد العتيبي', item: 'فندق فيرمونت برج الساعة', rating: 5, comment: 'إقامة فاخرة وإطلالة ساحرة على الحرم المكي الشريف.', date: '2026-08-01', status: 'مقبول' },
    { id: '2', user: 'سارة الشمري', item: 'منتجع هابيتاس العلا', rating: 5, comment: 'تجربة صحراوية لا تُنسى وهدوء تام!', date: '2026-07-28', status: 'مقبول' },
    { id: '3', user: 'خالد الغامدي', item: 'فندق نارسيس الرياض', rating: 4, comment: 'الخدمة ممتازة والموقع في قلب العاصمة.', date: '2026-07-25', status: 'قيد المراجعة' },
  ]);

  const [cars, setCars] = useState([
    { id: '1', name: 'مرسيدس مايباخ S-Class', category: 'فارهة مع سائق', priceDay: '2,500 ر.س', status: 'متاح' },
    { id: '2', name: 'لكزس LX600 2026', category: 'دفع رباعي فاخر', priceDay: '1,800 ر.س', status: 'متاح' },
    { id: '3', name: 'رينج روفر أوتوبيوغرافي', category: 'VIP', priceDay: '3,200 ر.س', status: 'محجوز' },
  ]);

  // Form states for modal
  const [newItemName, setNewItemName] = useState('');
  const [newItemCity, setNewItemCity] = useState('الرياض');
  const [newItemPrice, setNewItemPrice] = useState('1200');

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    if (activeMenu === 'hotels') {
      const price = Number(newItemPrice) || 1200;
      const newHotel: Hotel = {
        id: `custom-${Date.now()}`,
        name: newItemName,
        nameEn: newItemName,
        city: newItemCity,
        cityEn: 'Riyadh',
        region: 'المنطقة الوسطى',
        reviewScore: 9.8,
        reviewCount: 1,
        reviewText: 'ممتاز جداً',
        basePricePerNight: price,
        discountedPrice: price - 200,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
        starRating: 5,
        address: `${newItemCity} - حي النخيل`,
        distanceToLandmark: '5 دقائق من المركز',
        landmarkName: 'مركز المدينة',
        description: 'فندق فاخر تم إضافته حديثاً عبر لوحة التحكم.',
        amenities: ['مسبح', 'واي فاي مجاني', 'خدمة غرف 24 ساعة', 'موقف سيارات', 'مطعم فاخر'],
        isFeatured: true,
        featuredTag: 'جديد مضاف حديثاً',
        roomTypes: [
          {
            id: `room-${Date.now()}`,
            name: 'جناح ملكي فاخر',
            description: 'جناح فسيح وفاخر مع أرقى التجهيزات',
            pricePerNight: price,
            maxGuests: 2,
            bedType: 'سرير كينج كبير',
            areaSqm: 65,
            perks: ['إطلالة بانورامية', 'إفطار مجاني', 'خدمة الخادم الشخصي'],
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
          }
        ]
      };
      setLocalHotels([newHotel, ...localHotels]);
      if (onAddHotel) onAddHotel(newHotel);
    } else if (activeMenu === 'coupons') {
      setCoupons([
        { id: String(Date.now()), code: newItemName.toUpperCase(), discount: `${newItemPrice} ر.س`, validUntil: '2027-12-31', status: 'نشط', uses: 0 },
        ...coupons
      ]);
    } else if (activeMenu === 'locations') {
      setLocations([
        { id: String(Date.now()), name: newItemName, region: 'المملكة العربية السعودية', hotelsCount: 1, status: 'نشط' },
        ...locations
      ]);
    } else if (activeMenu === 'tours') {
      setTours([
        { id: String(Date.now()), name: newItemName, location: newItemCity, price: `${newItemPrice} ر.س`, duration: 'يوم كامل', status: 'متاح' },
        ...tours
      ]);
    }

    setNewItemName('');
    setIsAddModalOpen(false);
  };

  const filteredUsers = usersList?.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row dir-rtl font-sans antialiased">
      
      {/* ========================================================= */}
      {/* RIGHT SIDEBAR (Matching screenshot layout) */}
      {/* ========================================================= */}
      <aside className="w-full md:w-64 bg-[#141b2d] border-l border-slate-800/80 shrink-0 flex flex-col justify-between select-none">
        <div>
          {/* Dashboard Header Brand */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight">لوحة الإدارة والمشرف</h1>
                <p className="text-[10px] text-slate-400">منصة ڤيلوسيتي (Velocity) 🇸🇦</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Top Menu Section */}
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'dashboard'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 shrink-0 text-amber-400" />
              <span>لوحة التحكم</span>
            </button>

            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setActiveMenu('users')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'users'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>المستخدمين</span>
                </button>

                <button
                  onClick={() => setActiveMenu('pages')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'pages'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>الصفحات</span>
                </button>

                <button
                  onClick={() => setActiveMenu('coupons')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'coupons'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Ticket className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>قسيمة</span>
                </button>

                <button
                  onClick={() => setActiveMenu('reviews')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'reviews'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>التقييمات</span>
                </button>
              </>
            )}
          </div>

          {/* CATALOG SECTION HEADER (الكتالوج) */}
          <div className="px-5 pt-4 pb-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              الكتالوج
            </h3>
          </div>

          {/* Catalog Menu Items */}
          <div className="px-3 pb-6 space-y-1">
            
            {/* 1. موقع */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveMenu('locations')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeMenu === 'locations'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>موقع</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* 2. الفندق */}
            <button
              onClick={() => setActiveMenu('hotels')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'hotels'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 shrink-0 text-amber-400" />
                <span>إدارة الفنادق</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* 2.1 تقويم الفنادق */}
            <button
              onClick={() => setActiveMenu('hotel_calendar')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'hotel_calendar'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-black'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarRange className="w-4 h-4 shrink-0 text-amber-400" />
                <span>تقويم الفنادق والأسعار</span>
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold">جديد</span>
            </button>

            {/* 3. رحلة */}
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setActiveMenu('tours')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'tours'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Umbrella className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>رحلة</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 4. فضاء */}
                <button
                  onClick={() => setActiveMenu('spaces')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'spaces'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>فضاء</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 5. رحلة جوية */}
                <button
                  onClick={() => setActiveMenu('flights')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'flights'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Plane className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>رحلة جوية</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 6. سيارة */}
                <button
                  onClick={() => setActiveMenu('cars')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'cars'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>سيارة</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 7. قارب */}
                <button
                  onClick={() => setActiveMenu('boats')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'boats'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Ship className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>قارب</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 8. حدث */}
                <button
                  onClick={() => setActiveMenu('events')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'events'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>حدث</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* 9. فيزا */}
                <button
                  onClick={() => setActiveMenu('visa')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'visa'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>فيزا</span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </>
            )}

            {/* 10. الحجوزات */}
            <button
              onClick={() => setActiveMenu('bookings')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'bookings'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                <span>الحجوزات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                  {filteredBookings.length}
                </span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </button>

          </div>
        </div>

        {/* Footer Admin info & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-200">{user?.name || 'مدير النظام'}</p>
              <p className="text-[10px] text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{user?.email || 'Hp@gmail.com'}</span>
              </p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="تسجيل الخروج من لوحة التحكم"
                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        
        {/* Top Header & Actions Matching Screenshot: "إضافة موضوع جديد" & "يتقدم" */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>
                {activeMenu === 'dashboard' && 'لوحة التحكم الرئيسية 📊'}
                {activeMenu === 'users' && 'إدارة المستخدمين 👥'}
                {activeMenu === 'pages' && 'إدارة الصفحات والمحتوى 📝'}
                {activeMenu === 'coupons' && 'إدارة القسائم والخصومات 🏷️'}
                {activeMenu === 'reviews' && 'تقييمات وآراء العملاء ⭐'}
                {activeMenu === 'locations' && 'دليل المواقع والوجهات 📍'}
                {activeMenu === 'hotels' && 'إدارة الفنادق والمنتجعات 🏨'}
                {activeMenu === 'tours' && 'إدارة الرحلات السياحية 🌴'}
                {activeMenu === 'spaces' && 'إدارة المساحات والعقارات 🏠'}
                {activeMenu === 'flights' && 'عروض الطيران والرحلات الجوية ✈️'}
                {activeMenu === 'cars' && 'إدارة تأجير السيارات VIP 🚗'}
                {activeMenu === 'boats' && 'إدارة اليخوت والقوارب ⛵'}
                {activeMenu === 'events' && 'إدارة الفعاليات والمواسم 🎟️'}
                {activeMenu === 'visa' && 'خدمات التأشيرات الإلكترونية 🛂'}
                {activeMenu === 'bookings' && 'سجل كافة الحجوزات 📝'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              إدارة كافة خدمات منصة ڤيلوسيتي (Velocity) والتحديث الفوري للبيانات
            </p>
          </div>

          {/* Action Buttons matching the Screenshot: Blue Add Button + Filter/Submit Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto relative">
            {/* Notification Bell */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {totalNotifications > 0 ? (
                <>
                  <BellRing className="w-4 h-4 animate-bounce text-amber-400" />
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-slate-950">
                    {totalNotifications > 9 ? '9+' : totalNotifications}
                  </span>
                </>
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-12 left-0 sm:right-0 sm:left-auto w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                  <h3 className="text-sm font-bold text-white">الإشعارات</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                  {totalNotifications === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">لا توجد إشعارات جديدة</div>
                  ) : (
                    <>
                      {pendingInquiriesCount > 0 && (
                        <div onClick={() => setActiveMenu('dashboard')} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 cursor-pointer hover:bg-amber-500/20 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-amber-400 mb-1">استفسارات جديدة ({pendingInquiriesCount})</p>
                            <p className="text-[10px] text-slate-300">لديك استفسارات معلقة من العملاء بانتظار الرد.</p>
                          </div>
                        </div>
                      )}
                      {newBookingsCount > 0 && (
                        <div onClick={() => setActiveMenu('bookings')} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 cursor-pointer hover:bg-emerald-500/20 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <CalendarRange className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-400 mb-1">حجوزات جديدة ({newBookingsCount})</p>
                            <p className="text-[10px] text-slate-300">تم تسجيل حجوزات جديدة في آخر 24 ساعة.</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* "يتقدم" Filter/Submit Button */}
            <button
              onClick={() => alert('تم تطبيق التصفية وتحديث البيانات بنجاح.')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>يتقدم</span>
            </button>

            {/* "إضافة فندق جديد" Primary Blue Button */}
            <button
              onClick={handleOpenAddHotel}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة فندق جديد</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم أو الموقع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs font-bold">
            <span className="text-slate-400 shrink-0">الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/60 cursor-pointer"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط / متاح</option>
              <option value="pending">قيد الانتظار</option>
              <option value="disabled">معطل / منتهي</option>
            </select>

            <span className="text-slate-400 shrink-0 border-r border-slate-800 pr-3">نوع الحساب:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/60 cursor-pointer"
            >
              <option value="all">الكل</option>
              <option value="customer">عميل</option>
              <option value="host">مضيف</option>
              <option value="admin">مدير</option>
            </select>
          </div>
        </div>

        {/* Dynamic Section Contents */}
        {/* External Sync Section */}
        {activeMenu === 'external_sync' && (
          <AdminExternalSync onAddHotel={onAddHotel} />
        )}
        {activeMenu === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">إجمالي الفنادق</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-white">{localHotels.length}</span>
                  <span className="text-[11px] text-emerald-400 mr-2 font-bold">+12% هذا الشهر</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">إجمالي الحجوزات</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-white">{filteredBookings.length + 14}</span>
                  <span className="text-[11px] text-emerald-400 mr-2 font-bold">مؤكدة ومفعلة</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">القسائم الفعالة</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                    <Ticket className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-white">{coupons.length}</span>
                  <span className="text-[11px] text-blue-400 mr-2 font-bold">جاهزة للاستخدام</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">معدل التقييمات</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-white">4.9 / 5.0</span>
                  <span className="text-[11px] text-amber-400 mr-2 font-bold">ممتاز جداً</span>
                </div>
              </div>
            </div>

            {/* Charts & Calendar Toggle Header */}
            <div className="flex items-center justify-between mt-8 mb-4">
              <h3 className="text-lg font-black text-white">نظرة عامة على الأداء</h3>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDashboardView('charts')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    dashboardView === 'charts' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChartIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">الرسوم البيانية</span>
                </button>
                <button
                  onClick={() => setDashboardView('calendar')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    dashboardView === 'calendar' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">تقويم الحجوزات</span>
                </button>
              </div>
            </div>

            {dashboardView === 'charts' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Chart */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-white">اتجاهات الإيرادات (ريال سعودي)</h3>
                    <p className="text-xs text-slate-400">إحصائيات الإيرادات الشهرية</p>
                  </div>
                  <div className="h-64 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                          cursor={{ fill: '#1e293b' }}
                        />
                        <Bar dataKey="revenue" name="الإيرادات" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bookings Chart */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-white">اتجاهات الحجوزات</h3>
                    <p className="text-xs text-slate-400">إحصائيات الحجوزات الشهرية</p>
                  </div>
                  <div className="h-64 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Line type="monotone" dataKey="bookings" name="الحجوزات" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full animate-fade-in">
                <AdminHotelCalendar
                  hotels={localHotels}
                  bookings={filteredBookings}
                  onUpdateHotel={handleSaveHotelForm}
                  selectedHotelId={selectedCalendarHotelId}
                />
              </div>
            )}

            {/* Overview Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>أحدث الفنادق والخدمات المضافة</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">العنصر / الفندق</th>
                      <th className="p-4">المدينة / الموقع</th>
                      <th className="p-4">السعر لليلة</th>
                      <th className="p-4">حالة</th>
                      <th className="p-4">تاريخ</th>
                      <th className="p-4 text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {localHotels.slice(0, 5).map((hotel) => (
                      <tr key={hotel.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-3">
                          <img loading="lazy"  src={hotel.image} alt={hotel.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          <span>{hotel.name}</span>
                        </td>
                        <td className="p-4 text-slate-300">{hotel.city}</td>
                        <td className="p-4 font-black text-amber-400">{hotel.basePricePerNight} ر.س</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            متاح ونشط
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">2026-08-02</td>
                        <td className="p-4 text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Section */}
        {activeMenu === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  إدارة المستخدمين
                </h3>
                <p className="text-xs text-slate-400 mt-1">عرض وإدارة حسابات العملاء والمضيفين.</p>
              </div>
            </div>
            
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-slate-300">
                  <thead className="text-xs text-slate-400 bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-r-xl">الاسم</th>
                      <th className="px-4 py-3">البريد الإلكتروني</th>
                      <th className="px-4 py-3">الدور</th>
                      <th className="px-4 py-3">تاريخ التسجيل</th>
                      <th className="px-4 py-3 rounded-l-xl">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, idx) => (
                      <tr key={u.id || idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4 font-bold text-white">{u.name}</td>
                        <td className="px-4 py-4 font-mono text-xs">{u.email}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            u.role === 'host' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {u.role === 'admin' ? 'مدير' : u.role === 'host' ? 'مضيف' : 'عميل'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {u.status === 'active' ? 'نشط' : 'محظور'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          لا يوجد مستخدمين حالياً
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        
        {/* Pages Management Section */}
        {activeMenu === 'pages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  إدارة الصفحات والمحتوى
                </h3>
                <p className="text-xs text-slate-400 mt-1">التحكم بصفحات الموقع، إضافة، نشر، وتعديل.</p>
              </div>
              <button
                onClick={() => {
                  setPageToEdit(null);
                  setIsPageModalOpen(true);
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all"
              >
                <span className="w-4 h-4 flex items-center justify-center font-bold text-lg leading-none pb-0.5">+</span>
                <span>إضافة صفحة جديدة</span>
              </button>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <div key={page.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-bold">{page.title}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        page.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {page.status === 'published' ? 'منشورة' : 'مسودة'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>النوع: {page.type}</span>
                      <span>تعديل: {page.lastEdited}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-700/50">
                      <button
                        onClick={() => {
                          setPageToEdit(page);
                          setIsPageModalOpen(true);
                        }}
                        className="flex-1 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-600/50"
                      >
                        تعديل
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
                            if (onDeletePage) onDeletePage(page.id);
                          }
                        }}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                      >
                        <span className="w-4 h-4 flex items-center justify-center font-bold">×</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hotels Table Section (إدارة الفنادق) */}
        {activeMenu === 'hotels' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>قائمة الفنادق والمنتجعات المسجلة</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">يمكنك إضافة فنادق جديدة، تعديل بياناتها، ضبط التقويم أو حذف الفندق</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  العدد: {localHotels.length} فندق
                </span>
                <button
                  onClick={handleOpenAddHotel}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>إضافة فندق</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">الفندق والنوع</th>
                    <th className="p-4">المدينة / الموقغ</th>
                    <th className="p-4">التقييم والنجوم</th>
                    <th className="p-4">سعر الليلة الأساسي</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-left">العمليات (تعديل / تقويم / حذف)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {localHotels.map((h, idx) => (
                    <tr key={`${h.id}-${idx}`} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <img loading="lazy"  src={h.image} alt={h.name} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                        <div>
                          <p className="text-white font-extrabold text-sm">{h.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{h.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-200">{h.city}</span>
                        <p className="text-[10px] text-slate-400">{h.address}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <span>★ {h.reviewScore}</span>
                          <span className="text-slate-500 text-[10px]">({h.reviewCount} تقييم)</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{h.starRating} نجوم</p>
                      </td>
                      <td className="p-4 font-black text-amber-400 text-sm">{h.basePricePerNight} ر.س</td>
                      <td className="p-4">
                        {h.status === 'draft' ? (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> مسودة (للمراجعة)
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> منشور ونشط
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          {h.status === 'draft' && (
                            <button
                              onClick={() => {
                                const hCopy = { ...h, status: 'published' as const };
                                if (onUpdateHotel) onUpdateHotel(hCopy);
                              }}
                              title="اعتماد ونشر الفندق"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">نشر الفندق</span>
                            </button>
                          )}
                          {/* Calendar button */}
                          <button
                            onClick={() => handleOpenCalendarForHotel(h.id)}
                            title="تقويم الفندق وإدارة الأسعار اليومية"
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <CalendarRange className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">التقويم والأسعار</span>
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEditHotel(h)}
                            title="تعديل بيانات الفندق"
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteHotelConfirm(h)}
                            title="حذف الفندق"
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hotel Calendar Section (تقويم الفنادق) */}
        {activeMenu === 'hotel_calendar' && (
          <AdminHotelCalendar
            hotels={localHotels}
            bookings={filteredBookings}
            onUpdateHotel={handleSaveHotelForm}
            selectedHotelId={selectedCalendarHotelId}
          />
        )}

        {/* Coupons Section (قسيمة) */}
        {activeMenu === 'coupons' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">قسائم التخفيض وأكواد الخصم</h3>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                + إنشاء كود جديد
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">كود القسيمة</th>
                    <th className="p-4">مبلغ الخصم</th>
                    <th className="p-4">صالح لغاية</th>
                    <th className="p-4">عدد الاستخدامات</th>
                    <th className="p-4">حالة</th>
                    <th className="p-4 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-black text-amber-400">{c.code}</td>
                      <td className="p-4 font-bold text-white">{c.discount}</td>
                      <td className="p-4 text-slate-300">{c.validUntil}</td>
                      <td className="p-4 text-slate-300">{c.uses} مرّة</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.status === 'نشط'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-left">
                        <button
                          onClick={() => setCoupons(coupons.filter(item => item.id !== c.id))}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Generic Table View for other categories */}
        {['locations', 'tours', 'spaces', 'flights', 'cars', 'boats', 'events', 'visa', 'reviews', 'bookings'].includes(activeMenu) && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">
                جدول البيانات والتفاصيل الخاصة بـ {activeMenu}
              </h3>
              <div className="flex items-center gap-3">
                {activeMenu === 'bookings' && filteredBookings.length > 0 && (
                  <button
                    onClick={exportBookingsToCSV}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-colors font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير كـ CSV</span>
                  </button>
                )}
                <span className="text-xs text-slate-400 font-bold">الحالة: مفعل ومحدث</span>
              </div>
            </div>

            {/* Table layout with Status (حالة) and Date (تاريخ) columns matching screenshot layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">الاسم / العنوان</th>
                    <th className="p-4">التفاصيل / النوع</th>
                    <th className="p-4">حالة</th>
                    <th className="p-4">تاريخ</th>
                    <th className="p-4 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {activeMenu === 'locations' && locations.map(loc => (
                    <tr key={loc.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{loc.name}</td>
                      <td className="p-4 text-slate-300">{loc.region} ({loc.hotelsCount} فنادق)</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {loc.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">2026-08-02</td>
                      <td className="p-4 text-left">
                        <button className="p-1.5 rounded-lg bg-slate-800 text-amber-400">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeMenu === 'tours' && tours.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{t.name}</td>
                      <td className="p-4 text-slate-300">{t.location} • {t.duration}</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">2026-08-02</td>
                      <td className="p-4 text-left">
                        <span className="font-bold text-amber-400">{t.price}</span>
                      </td>
                    </tr>
                  ))}

                  {activeMenu === 'reviews' && reviews.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{r.user} - {r.item}</td>
                      <td className="p-4 text-slate-300">{r.comment}</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{r.date}</td>
                      <td className="p-4 text-left font-black text-amber-400">★ {r.rating}</td>
                    </tr>
                  ))}

                  {activeMenu === 'cars' && cars.map(car => (
                    <tr key={car.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{car.name}</td>
                      <td className="p-4 text-slate-300">{car.category}</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {car.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">2026-08-02</td>
                      <td className="p-4 text-left font-bold text-amber-400">{car.priceDay}</td>
                    </tr>
                  ))}

                  {activeMenu === 'bookings' && filteredBookings.length > 0 && filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{b.guestInfo.firstName} {b.guestInfo.lastName} ({b.hotelName})</td>
                      <td className="p-4 text-slate-300">{b.roomTypeName} - {b.guests} ضيوف</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {b.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{b.createdAt}</td>
                      <td className="p-4 text-left font-black text-amber-400">{b.totalPrice} ر.س</td>
                    </tr>
                  ))}

                  {/* Empty state matching the screenshot text "لم يتم العثور على أي عناصر" when empty */}
                  {((activeMenu === 'spaces') ||
                    (activeMenu === 'flights') ||
                    (activeMenu === 'boats') ||
                    (activeMenu === 'events') ||
                    (activeMenu === 'visa') ||
                    (activeMenu === 'bookings' && filteredBookings.length === 0)) && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="space-y-3">
                          <p className="text-base font-black text-slate-300">لم يتم العثور على أي عناصر</p>
                          <p className="text-xs text-slate-500">
                            يمكنك استخدام زر "إضافة موضوع جديد" بالأعلى لإنشاء عنصر جديد فوراً.
                          </p>
                          <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs mt-2"
                          >
                            + إضافة موضوع جديد
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: "إضافة موضوع جديد" (Add New Item Dialog) */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>إضافة موضوع جديد ({activeMenu})</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1.5">العنوان / الاسم الرئيسي *</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل الاسم (مثال: فندق قصر الرياض / كود الخصم)..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5">المدينة / الوجهة</label>
                <select
                  value={newItemCity}
                  onChange={(e) => setNewItemCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="الرياض">الرياض</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                  <option value="العلا">العلا</option>
                  <option value="جدة">جدة</option>
                  <option value="الخبر">الخبر</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5">السعر / قيمة الخصم (ر.س)</label>
                <input
                  type="text"
                  placeholder="مثال: 1200"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ وإضافة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Hotel Form Modal for Add & Edit */}
      <AdminHotelFormModal
        isOpen={isHotelFormOpen}
        onClose={() => setIsHotelFormOpen(false)}
        onSave={handleSaveHotelForm}
        hotelToEdit={hotelToEdit}
      />


      <AdminPageFormModal
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        pageToEdit={pageToEdit}
        onSave={(page) => {
          if (pageToEdit) {
            if (onUpdatePage) onUpdatePage(page);
          } else {
            if (onAddPage) onAddPage(page);
          }
          setIsPageModalOpen(false);
        }}
      />
    </div>
  );
};

