import { 
  auth, 
  googleProvider, 
  db, 
  signInWithPopup, 
  signOut,
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  onSnapshot,
  User
} from '../lib/firebase';
import { Booking, HotelInquiry, PriceAlert } from '../types';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'customer' | 'host' | 'admin';
}

// 1. Google Sign-In with Firebase Auth
export async function signInWithGoogle(): Promise<AppUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    if (!fbUser) return null;

    const isAdmin = fbUser.email === 'viphhhxxx@gmail.com' || fbUser.email?.includes('admin');
    const role: 'customer' | 'host' | 'admin' = isAdmin ? 'host' : 'customer';

    const appUser: AppUser = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'مسافر متميّز',
      email: fbUser.email || '',
      photoURL: fbUser.photoURL || undefined,
      role: role
    };

    // Upsert user profile in Firestore
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || '',
        photoURL: fbUser.photoURL || '',
        role: role,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (firestoreErr) {
      console.warn('Firestore user doc sync warning:', firestoreErr);
    }

    return appUser;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

// 2. Sign Out
export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase signOut error:', error);
  }
}

// 3. Save Booking to Firestore
export async function saveBookingToFirestore(booking: Booking, userId: string): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', booking.id);
    await setDoc(bookingRef, {
      ...booking,
      userId: userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error saving booking to Firestore:', err);
  }
}

// 4. Update / Cancel Booking in Firestore
export async function updateBookingStatusInFirestore(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await setDoc(bookingRef, { status }, { merge: true });
  } catch (err) {
    console.error('Error updating booking status in Firestore:', err);
  }
}

// 5. Subscribe to User Bookings
export function subscribeToUserBookings(userId: string, onUpdate: (bookings: Booking[]) => void) {
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Booking);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    }, (error) => {
      console.warn('Firestore bookings snapshot error:', error);
    });
  } catch (err) {
    console.warn('Error setting up bookings subscription:', err);
    return () => {};
  }
}

// 6. Save / Toggle Favorite in Firestore
export async function toggleFavoriteInFirestore(hotelId: string, userId: string, isFav: boolean, hotelData?: { name: string; city: string; image: string }): Promise<void> {
  try {
    const favId = `${userId}_${hotelId}`;
    const favRef = doc(db, 'favorites', favId);
    if (isFav) {
      await setDoc(favRef, {
        id: favId,
        userId,
        hotelId,
        hotelName: hotelData?.name || '',
        hotelCity: hotelData?.city || '',
        hotelImage: hotelData?.image || '',
        createdAt: new Date().toISOString()
      });
    } else {
      await deleteDoc(favRef);
    }
  } catch (err) {
    console.warn('Error toggling favorite in Firestore:', err);
  }
}

// 7. Subscribe to User Favorites
export function subscribeToUserFavorites(userId: string, onUpdate: (hotelIds: string[]) => void) {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hotelId) ids.push(data.hotelId);
      });
      onUpdate(ids);
    }, (error) => {
      console.warn('Firestore favorites snapshot error:', error);
    });
  } catch (err) {
    console.warn('Error setting up favorites subscription:', err);
    return () => {};
  }
}

// 8. Save Price Alert to Firestore
export async function savePriceAlertToFirestore(alert: PriceAlert, userId: string): Promise<void> {
  try {
    const alertRef = doc(db, 'priceAlerts', alert.id);
    await setDoc(alertRef, {
      ...alert,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Error saving price alert to Firestore:', err);
  }
}

// 9. Subscribe to User Price Alerts
export function subscribeToUserPriceAlerts(userId: string, onUpdate: (alerts: PriceAlert[]) => void) {
  try {
    const q = query(collection(db, 'priceAlerts'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const list: PriceAlert[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as PriceAlert);
      });
      onUpdate(list);
    }, (error) => {
      console.warn('Firestore priceAlerts snapshot error:', error);
    });
  } catch (err) {
    console.warn('Error setting up price alerts subscription:', err);
    return () => {};
  }
}

// 10. Save Hotel Inquiry to Firestore
export async function saveInquiryToFirestore(inquiry: HotelInquiry, userId?: string): Promise<void> {
  try {
    const inqRef = doc(db, 'inquiries', inquiry.id);
    await setDoc(inqRef, {
      ...inquiry,
      userId: userId || 'guest',
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Error saving inquiry to Firestore:', err);
  }
}
