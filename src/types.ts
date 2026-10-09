export interface RoomType {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedType: string;
  areaSqm: number;
  perks: string[];
  image: string;
}

export interface HotelReview {
  id: string;
  userName: string;
  userAvatar?: string;
  date: string;
  rating: number;
  comment: string;
  travelerType: string; // e.g., 'عائلات', 'أزواج', 'مسافر عمل', 'مع الأصدقاء'
}

export interface HotelDateRule {
  date: string; // 'YYYY-MM-DD'
  customPrice?: number;
  isBlocked?: boolean;
  note?: string;
}

export interface Hotel {
  id: string;
  name: string;
  nameEn: string;
  city: string; // Arabic name
  cityEn: string;
  region: string;
  address: string;
  lat?: number;
  lng?: number;
  starRating: number; // 3, 4, 5
  reviewScore: number; // e.g. 9.3
  reviewCount: number;
  reviewText: string; // 'استثنائي', 'ممتاز جداً', 'رائع'
  basePricePerNight: number; // SAR
  discountedPrice?: number;
  isFeatured?: boolean;
  featuredTag?: string; // 'الأكثر طلباً في مكة', 'إطلالة كاشفة على البحر', 'منتجع صحراوي فاخر'
  aiCategory?: string; // 'خيار العائلات', 'مثالي للأعمال', 'وجهة شهر العسل'
  image: string;
  gallery: string[];
  description: string;
  distanceToLandmark: string; // e.g. "200 متر عن المسجد الحرام", "5 دقائق عن بوليفارد الرياض"
  landmarkName: string;
  amenities: string[];
  roomTypes: RoomType[];
  reviewsList?: HotelReview[];
  dateRules?: Record<string, HotelDateRule>;
  hostEmail?: string; // To track which host owns this hotel
  status?: 'published' | 'draft';
}

export interface CityInfo {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  image: string;
  hotelCount: number;
  popularFor: string[];
}

export interface SearchFilters {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  minPrice: number;
  maxPrice: number;
  starRatings: number[];
  amenities: string[];
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating';
  searchQuery: string;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  hotelCity: string;
  roomTypeId: string;
  roomTypeName: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  guests: number;
  rooms: number;
  pricePerNight: number;
  subtotal: number;
  vatAmount: number; // 15%
  totalPrice: number;
  guestInfo: GuestInfo;
  paymentMethod: 'mada' | 'applepay' | 'credit' | 'hotel';
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface AiRecommendationRequest {
  prompt: string;
  city?: string;
  budgetPerNight?: number;
  travelers?: string;
}

export interface AiRecommendationResponse {
  advice: string;
  recommendedHotelIds: string[];
  suggestedActivities?: string[];
}

export interface PriceAlert {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  hotelCity: string;
  currentPrice: number;
  targetPrice?: number;
  contactChannel: 'whatsapp' | 'email' | 'push';
  contactValue: string;
  enabled: boolean;
  createdAt: string;
  triggered?: boolean;
  triggeredPrice?: number;
  receiveBookingAlerts?: boolean;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  type: 'أساسية' | 'فرعية' | 'قانونية';
  lastEdited: string;
  templateType?: "custom" | "modern" | "classic";
  templateData?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'host' | 'admin';
  createdAt: string;
  status: 'active' | 'blocked';
}

export interface HotelInquiry {
  id: string;
  inquiryCode: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  inquiryType: 'availability' | 'price_discount' | 'special_request' | 'events' | 'general';
  checkIn?: string;
  checkOut?: string;
  guestsCount?: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  message: string;
  status: 'pending' | 'replied';
  replyText?: string;
  createdAt: string;
}

