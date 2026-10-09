import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { HotelCard } from './components/HotelCard';
import { HotelDetailModal } from './components/HotelDetailModal';
import { CompareModal } from './components/CompareModal';
import { ExploreMap } from './components/ExploreMap';
import { SimulatedEmailModal } from "./components/SimulatedEmailModal";
import { BookingModal } from './components/BookingModal';
import { AiConciergeModal } from './components/AiConciergeModal';
import { WelcomeModal } from './components/WelcomeModal';
import { InquiryModal } from './components/InquiryModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { FloatingChatAssistant } from './components/FloatingChatAssistant';
import { MyBookingsView } from './components/MyBookingsView';
import { CityExplore } from './components/CityExplore';
import { FavoritesView } from './components/FavoritesView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AuthScreen } from './components/AuthScreen';
import { Footer } from './components/Footer';
import { PageViewer } from './components/PageViewer';
import { LiveSearchGroundingModal } from './components/LiveSearchGroundingModal';
import { auth, onAuthStateChanged, testFirestoreConnection } from './lib/firebase';
import { 
  saveBookingToFirestore, 
  updateBookingStatusInFirestore, 
  subscribeToUserBookings, 
  toggleFavoriteInFirestore, 
  subscribeToUserFavorites, 
  savePriceAlertToFirestore, 
  subscribeToUserPriceAlerts, 
  saveInquiryToFirestore, 
  logoutFirebase 
} from './services/firebaseService';
import { Hotel, RoomType, SearchFilters, Booking, HotelInquiry, PriceAlert, SitePage } from './types';
import { HOTELS_DATA } from './data/hotels';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Building2, SlidersHorizontal, ArrowUpDown, Filter, Map, Menu, Scale, ShieldCheck, Award } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<{ role: 'customer' | 'host'; name: string; email?: string; photoURL?: string; id?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('ksastays_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'cities' | 'map' | 'ai' | 'bookings' | 'favorites' | 'dashboard'>('home');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalSubtitle, setAuthModalSubtitle] = useState<string>('سجل الدخول لإدارة حجوزاتك أو تأكيد إقامتك الفاخرة');
  const [pendingBooking, setPendingBooking] = useState<{ hotel: Hotel; room: RoomType } | null>(null);
  const [liveSearchModalOpen, setLiveSearchModalOpen] = useState(false);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ksastays_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'host';
      }
      return false;
    } catch {
      return false;
    }
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  // Initialize and verify Firestore connection on mount & listen to Firebase Auth
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isAdmin = fbUser.email === 'viphhhxxx@gmail.com' || fbUser.email?.includes('admin');
        const role: 'customer' | 'host' = isAdmin ? 'host' : 'customer';
        const updatedUser = {
          role,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'مسافر متميّز',
          email: fbUser.email || '',
          id: fbUser.uid,
          photoURL: fbUser.photoURL || undefined
        };
        setUser(updatedUser);
        try {
          localStorage.setItem('ksastays_user', JSON.stringify(updatedUser));
        } catch (e) {
          console.error(e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Firestore Bookings, Favorites, and Price Alerts in real-time when user is logged in
  useEffect(() => {
    if (!user?.id || !auth.currentUser) return;

    const unsubBookings = subscribeToUserBookings(user.id, (firestoreBookings) => {
      if (firestoreBookings && firestoreBookings.length > 0) {
        setBookings(firestoreBookings);
      }
    });

    const unsubFavorites = subscribeToUserFavorites(user.id, (firestoreFavs) => {
      if (firestoreFavs && firestoreFavs.length > 0) {
        setFavorites(firestoreFavs);
      }
    });

    const unsubAlerts = subscribeToUserPriceAlerts(user.id, (firestoreAlerts) => {
      if (firestoreAlerts && firestoreAlerts.length > 0) {
        setPriceAlerts(firestoreAlerts);
      }
    });

    return () => {
      unsubBookings();
      unsubFavorites();
      unsubAlerts();
    };
  }, [user?.id]);

  const handleLogin = (userData: { role: 'customer' | 'host'; name: string; email: string; id?: string; photoURL?: string }) => {
    setUser(userData);
    try {
      localStorage.setItem('ksastays_user', JSON.stringify(userData));
      
      setUsersList(prev => {
        const exists = prev.find(u => u.email === userData.email);
        if (exists) return prev;
        const newList = [...prev, {
          id: userData.id || Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: new Date().toISOString(),
          status: 'active'
        }];
        localStorage.setItem('ksastays_users_list', JSON.stringify(newList));
        return newList;
      });

    } catch (e) {
      console.error(e);
    }

    setAuthModalOpen(false);

    if (pendingBooking) {
      setSelectedHotel(null);
      setBookingTarget(pendingBooking);
      setPendingBooking(null);
    } else if (userData.role === 'host') {
      setIsAdminAuthenticated(true);
      setActiveTab('dashboard');
    } else {
      setIsAdminAuthenticated(false);
    }
  };

  const handleInitiateBooking = (hotel: Hotel, room: RoomType) => {
    if (!user) {
      setPendingBooking({ hotel, room });
      setAuthModalSubtitle(`يرجى تسجيل الدخول أو إنشاء حساب لمتابعة حجزك في ${hotel.name}`);
      setAuthModalOpen(true);
    } else {
      setSelectedHotel(null);
      setBookingTarget({ hotel, room });
    }
  };

  const handleLogout = async () => {
    await logoutFirebase();
    setUser(null);
    setIsAdminAuthenticated(false);
    setActiveTab('home');
    try {
      localStorage.removeItem('ksastays_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTab = (tab: 'home' | 'cities' | 'map' | 'ai' | 'bookings' | 'favorites' | 'dashboard') => {
    setActiveTab(tab);
  };
  const [filters, setFilters] = useState<SearchFilters>({
    city: 'all',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    guests: 2,
    rooms: 1,
    minPrice: 0,
    maxPrice: 5000,
    starRatings: [],
    amenities: [],
    sortBy: 'recommended',
    searchQuery: '',
  });

  const deduplicateHotels = (list: Hotel[]): Hotel[] => {
    const seen = new Set<string>();
    return list.filter((item) => {
      if (!item || !item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const [hotels, setHotels] = useState<Hotel[]>(() => {
    try {
      const saved = localStorage.getItem('ksastays_hotels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deduplicateHotels(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return deduplicateHotels(HOTELS_DATA);
  });

  const publicHotels = hotels.filter((h) => h.status !== 'draft');

  const handleAddHotel = (newHotel: Hotel) => {
    setHotels((prev) => {
      const safeHotel = {
        ...newHotel,
        id: newHotel.id || 'hotel_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        hostEmail: newHotel.hostEmail || user?.email // Assign to current user if not provided
      };
      const updated = deduplicateHotels([safeHotel, ...prev]);
      try {
        localStorage.setItem('ksastays_hotels', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleUpdateHotel = (updatedHotel: Hotel) => {
    setHotels((prev) => {
      const updated = deduplicateHotels(prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h)));
      try {
        localStorage.setItem('ksastays_hotels', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDeleteHotel = (hotelId: string) => {
    setHotels((prev) => {
      const updated = prev.filter((h) => h.id !== hotelId);
      try {
        localStorage.setItem('ksastays_hotels', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [loadingHotels, setLoadingHotels] = useState(false);

  // Theme (Dark / Light Mode) stored in LocalStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('ksastays_theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'dark'; // default
  });

  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ksastays_favorites');
      return saved ? JSON.parse(saved) : ['fairmont-makkah', 'habitas-alula'];
    } catch {
      return ['fairmont-makkah', 'habitas-alula'];
    }
  });

  // Bookings stored in LocalStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('ksastays_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Inquiries stored in LocalStorage
  const [simulatedEmailBooking, setSimulatedEmailBooking] = useState<Booking | null>(null);
  const [inquiries, setInquiries] = useState<HotelInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('ksastays_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Price Alerts stored in LocalStorage
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('ksastays_price_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [usersList, setUsersList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ksastays_users_list');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'مدير النظام', email: 'Hp@gmail.com', role: 'admin', createdAt: new Date().toISOString(), status: 'active' }
      ];
    } catch {
      return [];
    }
  });

  // Modals & Banners
  
  const [pages, setPages] = useState<SitePage[]>(() => {
    const saved = localStorage.getItem('ksastays_pages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', title: 'الرئيسية', slug: '/', content: 'محتوى الصفحة الرئيسية', status: 'published', type: 'أساسية', lastEdited: 'اليوم' },
      { id: '2', title: 'من نحن', slug: '/about', content: 'محتوى صفحة من نحن', status: 'published', type: 'فرعية', lastEdited: 'قبل يومين' },
      { id: '3', title: 'الشروط والأحكام', slug: '/terms', content: 'محتوى صفحة الشروط', status: 'draft', type: 'قانونية', lastEdited: 'قبل أسبوع' },
      { id: '4', title: 'سياسة الخصوصية', slug: '/privacy', content: 'محتوى صفحة سياسة الخصوصية', status: 'published', type: 'قانونية', lastEdited: 'منذ شهر' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ksastays_pages', JSON.stringify(pages));
  }, [pages]);

  const [activePageSlug, setActivePageSlug] = useState<string | null>(null);
  
  const handleAddPage = (page: SitePage) => setPages([...pages, page]);
  const handleUpdatePage = (page: SitePage) => setPages(pages.map(p => p.id === page.id ? page : p));
  const handleDeletePage = (pageId: string) => setPages(pages.filter(p => p.id !== pageId));

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingTarget, setBookingTarget] = useState<{ hotel: Hotel; room: RoomType } | null>(null);
  const [inquiryTarget, setInquiryTarget] = useState<{ hotel: Hotel; room?: RoomType | null } | null>(null);
  const [priceAlertTarget, setPriceAlertTarget] = useState<Hotel | null>(null);
  const [priceDropNotification, setPriceDropNotification] = useState<{
    hotelName: string;
    oldPrice: number;
    newPrice: number;
    discountPercent: number;
  } | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);

  // Sync theme with localStorage and root element
  useEffect(() => {
    try {
      localStorage.setItem('ksastays_theme', theme);
    } catch (e) {
      console.error(e);
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ksastays_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Sync bookings with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ksastays_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  // Sync inquiries with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ksastays_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  // Sync priceAlerts with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ksastays_price_alerts', JSON.stringify(priceAlerts));
    } catch (e) {
      console.error(e);
    }
  }, [priceAlerts]);

  // Handle shared hotel URL parameter ?hotel=id
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const hotelId = params.get('hotel');
        if (hotelId) {
          const matched = HOTELS_DATA.find((h) => h.id === hotelId);
          if (matched) {
            setSelectedHotel(matched);
          }
        }
      }
    } catch (e) {
      console.error('Error parsing shared hotel URL:', e);
    }
  }, []);


  const handleOpenPriceAlert = (hotel: Hotel) => {
    setPriceAlertTarget(hotel);
  };

  const handleSavePriceAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    setPriceAlerts((prev) => {
      const existingIdx = prev.findIndex((a) => a.hotelId === alertData.hotelId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...alertData,
        };
        savePriceAlertToFirestore(updated[existingIdx], user?.id || 'guest');
        return updated;
      } else {
        const newAlert: PriceAlert = {
          ...alertData,
          id: 'alert_' + Date.now(),
          createdAt: new Date().toISOString(),
        };
        savePriceAlertToFirestore(newAlert, user?.id || 'guest');
        return [newAlert, ...prev];
      }
    });
  };

  const handleRemovePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleSimulatePriceDrop = () => {
    // Select a hotel (preferably from favorites, or first hotel in list)
    const favoriteHotels = hotels.filter((h) => favorites.includes(h.id));
    const targetHotel = favoriteHotels[0] || hotels[0];

    if (!targetHotel) return;

    const currentPrice = targetHotel.discountedPrice || targetHotel.basePricePerNight;
    const newPrice = Math.round(currentPrice * 0.75); // 25% price drop
    const discountPercent = 25;

    setPriceDropNotification({
      hotelName: targetHotel.name,
      oldPrice: currentPrice,
      newPrice,
      discountPercent,
    });

    // Automatically ensure alert is registered as triggered
    setPriceAlerts((prev) => {
      const exists = prev.find((a) => a.hotelId === targetHotel.id);
      if (exists) {
        return prev.map((a) =>
          a.hotelId === targetHotel.id
            ? { ...a, triggered: true, triggeredPrice: newPrice }
            : a
        );
      } else {
        return [
          {
            id: 'alert_' + Date.now(),
            hotelId: targetHotel.id,
            hotelName: targetHotel.name,
            hotelImage: targetHotel.image,
            hotelCity: targetHotel.city,
            currentPrice,
            targetPrice: newPrice,
            contactChannel: 'whatsapp',
            contactValue: '0501234567',
            enabled: true,
            createdAt: new Date().toISOString(),
            triggered: true,
            triggeredPrice: newPrice,
          },
          ...prev,
        ];
      }
    });
  };

  const handleOpenInquiry = (hotel: Hotel, room?: RoomType | null) => {
    setInquiryTarget({ hotel, room: room || null });
  };

  const handleSubmitInquiry = (inquiryData: Omit<HotelInquiry, 'id' | 'inquiryCode' | 'createdAt' | 'status'>) => {
    const newInquiry: HotelInquiry = {
      ...inquiryData,
      id: 'inq_' + Date.now(),
      inquiryCode: 'INQ-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    saveInquiryToFirestore(newInquiry, user?.id);
  };

  // Fetch hotels from API or apply client filtering
  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city && filters.city !== 'all') queryParams.set('city', filters.city);
      if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
      if (filters.starRatings.length) queryParams.set('stars', filters.starRatings.join(','));
      if (filters.searchQuery) queryParams.set('q', filters.searchQuery);

      const res = await fetch(`/api/hotels?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.hotels)) {
        let list = data.hotels as Hotel[];

        // Apply Amenities client-side filter
        if (filters.amenities.length > 0) {
          list = list.filter((h) =>
            filters.amenities.every((am) => h.amenities.includes(am))
          );
        }

        // Apply Sorting
        if (filters.sortBy === 'price_asc') {
          list.sort((a, b) => (a.discountedPrice || a.basePricePerNight) - (b.discountedPrice || b.basePricePerNight));
        } else if (filters.sortBy === 'price_desc') {
          list.sort((a, b) => (b.discountedPrice || b.basePricePerNight) - (a.discountedPrice || a.basePricePerNight));
        } else if (filters.sortBy === 'rating') {
          list.sort((a, b) => b.reviewScore - a.reviewScore);
        }

        setHotels(deduplicateHotels(list));
      } else {
        setHotels(deduplicateHotels(HOTELS_DATA));
      }
    } catch {
      // Fallback
      setHotels(deduplicateHotels(HOTELS_DATA));
    } finally {
      setLoadingHotels(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [filters.city, filters.maxPrice, filters.starRatings, filters.sortBy, filters.amenities]);

  const toggleFavorite = (hotelId: string) => {
    const isAdding = !favorites.includes(hotelId);
    setFavorites((prev) =>
      prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
    );
    const target = HOTELS_DATA.find((h) => h.id === hotelId);
    toggleFavoriteInFirestore(hotelId, user?.id || 'guest', isAdding, target ? { name: target.name, city: target.city, image: target.image } : undefined);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    const bookingWithUser = {
      ...newBooking,
    };
    setBookings((prev) => [bookingWithUser, ...prev]);
    setSimulatedEmailBooking(bookingWithUser);
    saveBookingToFirestore(bookingWithUser, user?.id || 'guest_' + Date.now());
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    updateBookingStatusInFirestore(bookingId, 'cancelled');
  };

  // AI Auto-Categorization on mount
  useEffect(() => {
    const fetchCategories = async () => {
      // Find hotels that don't have an aiCategory yet
      const uncategorized = hotels.filter(h => !h.aiCategory);
      if (uncategorized.length === 0) return;

      // Only send up to 5 hotels at a time to avoid timeout
      const batch = uncategorized.slice(0, 5);
      
      const localCategories = ['خيار العائلات', 'مثالي للأعمال', 'وجهة شهر العسل'];
      const getLocalFallback = (h: Hotel) => {
          let cat = localCategories[0];
          if (h.amenities.some(a => a.includes('واي فاي') || a.includes('أعمال'))) cat = localCategories[1];
          if (h.starRating >= 5 || h.amenities.some(a => a.includes('مسبح') || a.includes('سبا'))) cat = localCategories[2];
          return cat;
      };

      try {
        const res = await fetch('/api/ai/categorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotels: batch.map(h => ({ id: h.id, name: h.name, description: h.description, amenities: h.amenities, reviewScore: h.reviewScore, reviewText: h.reviewText })) })
        });
        
        if (!res.ok) throw new Error('Network response was not ok');
        
        const data = await res.json();
        
        if (data.success && data.categories) {
          setHotels(prev => prev.map(h => {
            if (h.aiCategory) return h;
            // if it's in the batch and we got a category, use it. Otherwise use fallback for EVERYTHING else to ensure no empty tags.
            const cat = data.categories[h.id] || getLocalFallback(h);
            return { ...h, aiCategory: cat };
          }));
        } else {
            throw new Error('AI success false');
        }
      } catch (error) {
        console.log("AI Categorization applied via fallback");
        setHotels(prev => prev.map(h => {
            if (h.aiCategory) return h;
            return { ...h, aiCategory: getLocalFallback(h) };
        }));
      }
    };
    
    // Only run if there are actual hotels loaded to avoid empty calls
    if (hotels.length > 0) {
      fetchCategories();
    }
  }, [hotels.length]); // Re-run if hotels length changes but only process uncategorized

  const favoriteHotelsList = deduplicateHotels(publicHotels.filter((h) => favorites.includes(h.id)));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-cairo dir-rtl">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
        favoritesCount={favorites.length}
        onOpenAi={() => setAiModalOpen(true)}
        onOpenLiveSearch={() => setLiveSearchModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenWelcome={() => setWelcomeModalOpen(true)}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setAuthModalSubtitle('سجل الدخول لإدارة حجوزاتك أو الاستفادة من العروض الخاصة');
          setAuthModalOpen(true);
        }}
      />

      {/* Simulated Price Drop Alert Toast Banner */}
      {priceDropNotification && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-4 py-3 border-b border-amber-300 shadow-xl flex items-center justify-between gap-3 animate-fade-in z-40">
          <div className="flex items-center gap-3 max-w-5xl mx-auto flex-1">
            <span className="text-xl">🔥</span>
            <div>
              <p className="font-extrabold text-xs sm:text-sm">
                تنبيه انخفاض السعر! انخفض سعر <span className="underline font-black">{priceDropNotification.hotelName}</span> بنسبة {priceDropNotification.discountPercent}%!
              </p>
              <p className="text-[11px] text-slate-900 opacity-90">
                السعر الجديد: <strong className="font-mono">{priceDropNotification.newPrice} ر.س</strong> بدلاً من <span className="line-through">{priceDropNotification.oldPrice} ر.س</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setPriceDropNotification(null)}
            className="p-1 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 font-bold text-xs"
          >
            إغلاق ✕
          </button>
        </div>
      )}

      {/* Main Views Container */}
      <main className="flex-1">
        {/* DYNAMIC PAGE VIEWER */}
        <AnimatePresence mode="wait">
          {activePageSlug ? (
            <motion.div key="page-viewer" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <PageViewer 
                page={pages.find(p => p.slug === activePageSlug)} 
                onBack={() => setActivePageSlug(null)} 
              />
            </motion.div>
          ) : activeTab === 'home' ? (
            <motion.div key="home-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="space-y-10">
              <HeroSearch
                filters={filters}
                setFilters={setFilters}
                onSearch={fetchHotels}
                onOpenAi={() => setAiModalOpen(true)}
                onOpenLiveSearch={() => setLiveSearchModalOpen(true)}
              />
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-4 text-slate-300 font-bold">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-500" />
                      <span>النتائج: <span className="text-white">{publicHotels.length}</span></span>
                    </div>
                    <div className="h-6 w-px bg-slate-800"></div>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          viewMode === 'list' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Menu className="w-4 h-4" />
                        <span>قائمة</span>
                      </button>
                      <button
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          viewMode === 'map' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Map className="w-4 h-4" />
                        <span>خريطة</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <ArrowUpDown className="w-4 h-4 text-slate-400" />
                    <select
                      className="bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 flex-1 sm:flex-none font-bold"
                      value={filters.sortBy}
                      onChange={(e) => {
                        setFilters({ ...filters, sortBy: e.target.value as any });
                        fetchHotels();
                      }}
                    >
                      <option value="recommended">الأكثر توصية (ذكاء اصطناعي)</option>
                      <option value="price_asc">الأقل سعراً</option>
                      <option value="price_desc">الأعلى سعراً</option>
                      <option value="rating">الأعلى تقييماً</option>
                    </select>
                  </div>
                </div>
                    {loadingHotels ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Sparkles className="w-10 h-10 text-amber-500 animate-pulse mb-4" />
                        <p className="text-slate-400 font-bold">جاري البحث بذكاء...</p>
                      </div>
                    ) : publicHotels.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-950 rounded-3xl border border-slate-800">
                        <Filter className="w-12 h-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-black text-white mb-2">لا توجد نتائج مطابقة</h3>
                        <p className="text-sm text-slate-400 mb-6 max-w-md">لم نتمكن من العثور على فنادق تطابق معايير البحث الدقيقة. جرب تخفيف الفلاتر.</p>
                        <button
                          onClick={() =>
                            setFilters({
                              city: 'all',
                              checkIn: '',
                              checkOut: '',
                              guests: 1,
                              rooms: 1,
                              minPrice: 0,
                              maxPrice: 5000,
                              starRatings: [],
                              amenities: [],
                              sortBy: 'recommended',
                              searchQuery: '',
                            })
                          }
                          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                        >
                          عرض كافة الفنادق
                        </button>
                      </div>
                    ) : viewMode === 'map' ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ExploreMap
                          hotels={publicHotels}
                          onHotelClick={(h) => setSelectedHotel(h)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                          {publicHotels.map((hotel, index) => (
                            <motion.div
                              key={hotel.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                              <HotelCard
                                hotel={hotel}
                                isFavorite={favorites.includes(hotel.id)}
                                hasPriceAlert={priceAlerts.some((a) => a.hotelId === hotel.id && a.enabled)}
                                onToggleFavorite={toggleFavorite}
                                onSelectHotel={(h) => setSelectedHotel(h)}
                                onInquire={handleOpenInquiry}
                                onOpenPriceAlert={handleOpenPriceAlert}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
              </section>

              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center">
                  <div className="space-y-1">
                    <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-sm">ضمان أفضل سعر</h4>
                    <p className="text-xs text-slate-400">أسعار تنافسية ومباشرة بدون عمولات خفية</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-sm">تأكيد حجز فورى</h4>
                    <p className="text-xs text-slate-400">تصلك التذكرة والوصل فوراً برمز الحجز QR</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-white text-sm">مستشار حجز ذكي</h4>
                    <p className="text-xs text-slate-400">توصيات مخصصة بذكاء الاصطناعي لرحلتك</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : activeTab === 'cities' ? (
            <motion.div key="cities-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <CityExplore
                onSelectCity={(cityName) => {
                  setFilters((prev) => ({ ...prev, city: cityName }));
                  setActiveTab('home');
                }}
                onOpenAi={() => setAiModalOpen(true)}
              />
            </motion.div>
          ) : activeTab === 'map' ? (
            <motion.div key="map-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">خريطة الفنادق والمنتجعات التفاعلية في السعودية</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    استكشف مواقع كافة الفنادق والمنتجعات في مكة المكرمة، المدينة المنورة، الرياض، جدة، العلا، وأبها. انقر على أي فندق لعرض اسمه وعنوانه بالتفصيل وحجز إقامتك مباشرة.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    عرض كقائمة وفلاتر ←
                  </button>
                </div>
              </div>

              <ExploreMap
                hotels={publicHotels}
                onHotelClick={(h) => setSelectedHotel(h)}
                fullHeight={true}
              />
            </motion.div>
          ) : activeTab === 'dashboard' ? (
            <motion.div key="dashboard-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              {user?.role === 'host' ? (
                <AdminDashboard
                  hotels={hotels}
                  bookings={bookings}
                  usersList={usersList}
                  onAddHotel={handleAddHotel}
                  onUpdateHotel={handleUpdateHotel}
                  onDeleteHotel={handleDeleteHotel}
                  onLogout={handleLogout}
                  user={user}
                />
              ) : (
                <CustomerDashboard
                  user={user}
                  bookings={bookings}
                  inquiries={inquiries}
                  favorites={favorites}
                  hotels={publicHotels}
                  priceAlerts={priceAlerts}
                  onLogout={handleLogout}
                  onNavigateHome={() => setActiveTab('home')}
                  onRemoveFavorite={toggleFavorite}
                  onCancelBooking={handleCancelBooking}
                  onSimulateEmail={setSimulatedEmailBooking}
                  onSelectHotel={(h) => setSelectedHotel(h)}
                  onOpenPriceAlert={handleOpenPriceAlert}
                  onSimulatePriceDrop={handleSimulatePriceDrop}
                />
              )}
            </motion.div>
          ) : activeTab === 'bookings' ? (
            <motion.div key="bookings-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <MyBookingsView
                bookings={bookings}
                inquiries={inquiries}
                onCancelBooking={handleCancelBooking}
                onSimulateEmail={setSimulatedEmailBooking}
                onExploreHotels={() => setActiveTab('home')}
              />
            </motion.div>
          ) : activeTab === 'favorites' ? (
            <motion.div key="favorites-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <FavoritesView
                favoriteHotels={favoriteHotelsList}
                priceAlerts={priceAlerts}
                onToggleFavorite={toggleFavorite}
                onSelectHotel={(h) => setSelectedHotel(h)}
                onExploreHotels={() => setActiveTab('home')}
                onOpenPriceAlert={handleOpenPriceAlert}
                onSimulatePriceDrop={handleSimulatePriceDrop}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Hotel Detail Modal */}
      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onBookRoom={(hotel, room) => handleInitiateBooking(hotel, room)}
          isFavorite={favorites.includes(selectedHotel.id)}
          hasPriceAlert={priceAlerts.some((a) => a.hotelId === selectedHotel.id && a.enabled)}
          onToggleFavorite={toggleFavorite}
          onOpenInquiry={(hotel, room) => handleOpenInquiry(hotel, room)}
          onOpenPriceAlert={handleOpenPriceAlert}
        />
      )}

      {/* Price Alert Config Modal */}
      {priceAlertTarget && (
        <PriceAlertModal
          hotel={priceAlertTarget}
          existingAlert={priceAlerts.find((a) => a.hotelId === priceAlertTarget.id)}
          isOpen={!!priceAlertTarget}
          onClose={() => setPriceAlertTarget(null)}
          onSaveAlert={handleSavePriceAlert}
          onRemoveAlert={handleRemovePriceAlert}
        />
      )}

      {/* Inquiry Modal */}
      {inquiryTarget && (
        <InquiryModal
          hotel={inquiryTarget.hotel}
          selectedRoom={inquiryTarget.room}
          isOpen={!!inquiryTarget}
          onClose={() => setInquiryTarget(null)}
          onSubmitInquiry={handleSubmitInquiry}
        />
      )}

      {/* Booking Checkout Wizard Modal */}
      {bookingTarget && (
        <BookingModal
          hotel={bookingTarget.hotel}
          room={bookingTarget.room}
          checkInDate={filters.checkIn}
          checkOutDate={filters.checkOut}
          guestsCount={filters.guests}
          roomsCount={filters.rooms}
          onClose={() => setBookingTarget(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* AI Concierge Modal */}
      <AiConciergeModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectHotel={(h) => setSelectedHotel(h)}
      />

      {/* Welcome VIP Modal */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        onExplore={() => {
          setActiveTab('home');
        }}
        onOpenAi={() => setAiModalOpen(true)}
      />

      {/* Floating Personal Assistant Chat Widget */}
      <FloatingChatAssistant
        onSelectHotel={(h) => setSelectedHotel(h)}
        onOpenPriceAlert={handleOpenPriceAlert}
      />

      {/* Admin Protected Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setUser({ role: 'host', name: 'مدير النظام', email: 'p@gmail.com' });
          setShowAdminLoginModal(false);
          setActiveTab('dashboard');
          try {
            localStorage.setItem('ksastays_user', JSON.stringify({ role: 'host', name: 'مدير النظام', email: 'p@gmail.com' }));
            sessionStorage.setItem('ksastays_admin_authed', 'true');
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* Auth Screen Modal (Opened from navigation or booking prompt) */}
      {authModalOpen && (
        <AuthScreen
          isModal={true}
          onClose={() => {
            setAuthModalOpen(false);
            setPendingBooking(null);
          }}
          onLogin={handleLogin}
          subtitle={authModalSubtitle}
        />
      )}

      {/* AI Search Grounded Live Tourism & Seasons Modal */}
      <LiveSearchGroundingModal
        isOpen={liveSearchModalOpen}
        onClose={() => setLiveSearchModalOpen(false)}
      />

      <SimulatedEmailModal booking={simulatedEmailBooking} onClose={() => setSimulatedEmailBooking(null)} />

      {/* Footer */}
      <Footer pages={pages.filter(p => p.status === 'published')} onPageClick={setActivePageSlug} />

    </div>
  );
}
