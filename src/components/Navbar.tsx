import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Rocket, Sparkles, Heart, BookmarkCheck, PhoneCall, Menu, X, Compass, Search, Sun, Moon, Crown, Monitor, LogOut, User, Map, LogIn, Globe } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'cities' | 'ai' | 'bookings' | 'favorites' | 'dashboard' | 'map';
  setActiveTab: (tab: 'home' | 'cities' | 'ai' | 'bookings' | 'favorites' | 'dashboard' | 'map') => void;
  bookingsCount: number;
  favoritesCount: number;
  onOpenAi: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenWelcome?: () => void;
  onOpenLiveSearch?: () => void;
  user: { role: 'customer' | 'host'; name: string; email?: string; photoURL?: string; id?: string } | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bookingsCount,
  favoritesCount,
  onOpenAi,
  theme,
  onToggleTheme,
  onOpenWelcome,
  onOpenLiveSearch,
  user,
  onLogout,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-colors duration-300">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-amber-600 py-1 text-center text-xs font-semibold text-white tracking-wide">
        🌟 أهلاً بك في ڤيلوسيتي (Velocity) | احجز إقامتك الفاخرة بأفضل الأسعار وبضمان التأكيد الفوري
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-blue-300/30 relative overflow-hidden"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              {/* Dynamic Jet/Velocity Stream Background */}
              <motion.div 
                className="absolute inset-0 bg-white/20"
                style={{ transformOrigin: "0 0", skewX: -20 }}
                animate={{ x: ["-150%", "250%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <motion.div
                animate={{ y: [0, -2, 0], x: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              >
                <Rocket className="w-6 h-6 text-white font-bold relative z-10" />
              </motion.div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}
                >
                  Velocity
                </motion.span>
                <span className="text-lg font-bold text-white tracking-tight">ڤيلوسيتي</span>
                <motion.span 
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  سريع ومضمون ⚡
                </motion.span>
              </div>
              <p className="text-xs text-slate-400 font-medium group-hover:text-blue-400 transition-colors">بوابة الحجوزات الأسرع في المملكة</p>
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>الرئيسية والبحث</span>
            </button>

            <button
              onClick={() => setActiveTab('cities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'cities'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>وجهات المملكة</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>خريطة الفنادق</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                activeTab === 'favorites'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-400 fill-rose-400/40' : ''}`} />
              <span>المفضلة</span>
              {favoritesCount > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                activeTab === 'bookings'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>حجوزاتي</span>
              {bookingsCount > 0 && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAi}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>المستشار الذكي</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-white hover:bg-slate-800/50 border border-amber-500/30'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Real-time Google Search Grounding Live Events Button */}
            {onOpenLiveSearch && (
              <button
                onClick={onOpenLiveSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="استكشاف الفعاليات والمواسم الحالية عبر بحث Google المباشر"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>فعاليات حية 🔍</span>
              </button>
            )}

            {/* VIP Welcome Badge */}
            {onOpenWelcome && (
              <button
                onClick={onOpenWelcome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-emerald-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all cursor-pointer"
                title="عرض الترحيب بالمسافر المتميز والمزايا"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>مسافر متميّز 👑</span>
              </button>
            )}

            {/* Theme Toggle Button (Desktop) */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700 hover:border-amber-400 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              title={theme === 'dark' ? 'التحويل إلى الوضع النهاري (ألوان فاتحة)' : 'التحويل إلى الوضع الليلي (ألوان داكنة)'}
              aria-label="تبديل وضع العرض"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-amber-300">الوضع النهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="text-slate-800 font-extrabold">الوضع الليلي</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>العملة: ريال سعودي (ر.س)</span>
            </div>

            <a
              href="tel:0593284877"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400">خدمة العملاء 24/7</span>
                <span className="dir-ltr font-mono font-bold text-white text-xs">0593284877</span>
              </div>
            </a>

            {user ? (
              <div className="flex items-center gap-2 mr-2 pl-2 border-r border-slate-700/50">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-semibold">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-4 h-4 rounded-full object-cover border border-amber-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="truncate max-w-[120px]">أهلاً، {user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer mr-2"
                title="تسجيل الدخول أو إنشاء حساب"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            )}
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title={theme === 'dark' ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
              aria-label="تبديل وضع العرض"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {/* Theme Switcher Button in Mobile Drawer */}
          <button
            onClick={() => {
              onToggleTheme();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
              <span>مظهر التطبيق (الليل / النهار)</span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-400 text-slate-950">
              {theme === 'dark' ? 'الوضع الليلي 🌙' : 'الوضع النهاري ☀️'}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${
              activeTab === 'home' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5" />
              <span>الرئيسية والبحث</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('cities'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${
              activeTab === 'cities' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5" />
              <span>وجهات المملكة</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${
              activeTab === 'map' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Map className="w-5 h-5 text-amber-400" />
              <span>خريطة الفنادق التفاعلية</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">جديد 🗺️</span>
          </button>

          <button
            onClick={() => { setActiveTab('favorites'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${
              activeTab === 'favorites' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-400 fill-rose-400/40' : ''}`} />
              <span>الفنادق المفضلة</span>
            </div>
            {favoritesCount > 0 && (
              <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-black">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${
              activeTab === 'bookings' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookmarkCheck className="w-5 h-5 text-amber-400" />
              <span>سجل حجوزاتي</span>
            </div>
            {bookingsCount > 0 && (
              <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                {bookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { onOpenAi(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>مستشار الحجز الذكي (AI)</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">جديد</span>
          </button>

          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-sm ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-amber-500/30 text-amber-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5" />
              <span>لوحة التحكم</span>
            </div>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>العملة: ريال سعودي (ر.س)</span>
            <span>الدعم: 0593284877</span>
          </div>

          {user ? (
            <button
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 p-3 mt-2 rounded-xl font-bold text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج ({user.name})</span>
            </button>
          ) : (
            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 p-3 mt-2 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

