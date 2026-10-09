import React, { useState } from 'react';
import { User, Settings, Heart, CalendarRange, Bell, LogOut, Search, MapPin, Building2, Crown } from 'lucide-react';
import { Hotel, Booking, HotelInquiry, PriceAlert } from '../types';
import { MyBookingsView } from './MyBookingsView';
import { FavoritesView } from './FavoritesView';

interface CustomerDashboardProps {
  user: { name: string; email?: string } | null;
  bookings: Booking[];
  inquiries: HotelInquiry[];
  favorites: string[];
  hotels: Hotel[];
  priceAlerts: PriceAlert[];
  onLogout: () => void;
  onNavigateHome: () => void;
  onRemoveFavorite: (hotelId: string) => void;
  onCancelBooking: (bookingId: string) => void;
    onSelectHotel: (hotel: Hotel) => void;
  onOpenPriceAlert: (hotel: Hotel) => void;
  onSimulatePriceDrop,
  onSimulateEmail: (booking: Booking) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  bookings,
  inquiries,
  favorites,
  hotels,
  priceAlerts,
  onLogout,
  onNavigateHome,
  onRemoveFavorite,
  onCancelBooking,
  onSelectHotel,
  onOpenPriceAlert,
  onSimulatePriceDrop,
  onSimulateEmail
}) => {
  const [activeMenu, setActiveMenu] = useState<'profile' | 'bookings' | 'favorites' | 'alerts'>('bookings');

  const favoriteHotelsList = hotels.filter((h) => favorites.includes(h.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 overflow-hidden sticky top-24">
            <div className="p-6 bg-slate-800/80 border-b border-slate-700 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-4 border-4 border-slate-800 shadow-lg shadow-amber-500/10">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user?.name || 'العميل'}</h2>
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
                <Crown className="w-3.5 h-3.5" />
                <span>عضو ذهبي</span>
              </div>
            </div>

            <nav className="p-4 flex flex-col gap-2">
              <button
                onClick={() => setActiveMenu('profile')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeMenu === 'profile'
                    ? 'bg-amber-500 text-slate-900 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span>الملف الشخصي</span>
                </div>
              </button>

              <button
                onClick={() => setActiveMenu('bookings')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeMenu === 'bookings'
                    ? 'bg-amber-500 text-slate-900 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarRange className="w-5 h-5" />
                  <span>حجوزاتي</span>
                </div>
                {bookings.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeMenu === 'bookings' ? 'bg-slate-900 text-amber-500' : 'bg-amber-500 text-slate-900'
                  }`}>
                    {bookings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu('favorites')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeMenu === 'favorites'
                    ? 'bg-amber-500 text-slate-900 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  <span>المفضلة</span>
                </div>
                {favorites.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeMenu === 'favorites' ? 'bg-slate-900 text-amber-500' : 'bg-rose-500 text-white'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu('alerts')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeMenu === 'alerts'
                    ? 'bg-amber-500 text-slate-900 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <span>التنبيهات</span>
                </div>
              </button>

              <div className="h-px bg-slate-700 my-2"></div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          <div className="bg-slate-800/30 rounded-3xl border border-slate-700/50 p-6 min-h-[600px]">
            
            {activeMenu === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">المعلومات الشخصية</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      defaultValue="+966 5X XXX XXXX"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all dir-ltr text-right"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || `${user?.name}@example.com`}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all">
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">حجوزاتي</h2>
                  <button onClick={onNavigateHome} className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1">
                    <Search className="w-4 h-4" /> حجز جديد
                  </button>
                </div>
                {bookings.length > 0 ? (
                  <MyBookingsView bookings={bookings} inquiries={inquiries} onCancelBooking={onCancelBooking} onExploreHotels={onNavigateHome}  />
                ) : (
                  <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="w-16 h-16 bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarRange className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">لا توجد حجوزات حالياً</h3>
                    <p className="text-slate-400 mb-6">قم باستكشاف الفنادق والمنتجعات للحجز.</p>
                    <button 
                      onClick={onNavigateHome}
                      className="px-6 py-2.5 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
                    >
                      تصفح الفنادق
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeMenu === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">الفنادق المفضلة</h2>
                {favoriteHotelsList.length > 0 ? (
                  <FavoritesView 
                    favoriteHotels={favoriteHotelsList} 
                    priceAlerts={priceAlerts}
                    onToggleFavorite={onRemoveFavorite} 
                    onSelectHotel={onSelectHotel}
                    onExploreHotels={onNavigateHome}
                    onOpenPriceAlert={onOpenPriceAlert}
                    onSimulatePriceDrop={onSimulatePriceDrop}
                    
                  />
                ) : (
                  <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="w-16 h-16 bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">قائمة المفضلة فارغة</h3>
                    <p className="text-slate-400 mb-6">قم بإضافة الفنادق التي تعجبك لتجدها هنا لاحقاً.</p>
                    <button 
                      onClick={onNavigateHome}
                      className="px-6 py-2.5 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
                    >
                      استكشاف الفنادق
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeMenu === 'alerts' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">التنبيهات</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-start gap-4">
                    <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">مرحباً بك في ڤيلوسيتي (Velocity)</h4>
                      <p className="text-sm text-slate-400">يسعدنا انضمامك إلينا، نتمنى لك إقامة سعيدة ومميزة.</p>
                      <span className="text-xs text-slate-500 mt-2 block">منذ ساعتين</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
