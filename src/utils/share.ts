import { Hotel } from '../types';

export interface HotelShareInfo {
  shareUrl: string;
  shareTitle: string;
  shareText: string;
  whatsappUrl: string;
}

export const getHotelShareInfo = (hotel: Pick<Hotel, 'id' | 'name' | 'city' | 'discountedPrice' | 'basePricePerNight'>): HotelShareInfo => {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const shareUrl = `${origin}?hotel=${encodeURIComponent(hotel.id)}`;
  const price = (hotel.discountedPrice || hotel.basePricePerNight).toLocaleString();
  const shareTitle = `فندق ${hotel.name} في ${hotel.city} | ڤيلوسيتي (Velocity)`;
  const shareText = `🌟 أنصحك بتجربة الإقامة في ${hotel.name} (${hotel.city}) الفاخر ابتداءً من ${price} ر.س / ليلة.\nاحجز بأفضل سعر عبر ڤيلوسيتي:`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

  return {
    shareUrl,
    shareTitle,
    shareText,
    whatsappUrl,
  };
};

export const copyHotelToClipboard = async (
  hotel: Pick<Hotel, 'id' | 'name' | 'city' | 'discountedPrice' | 'basePricePerNight'>
): Promise<boolean> => {
  const { shareText, shareUrl } = getHotelShareInfo(hotel);
  const fullText = `${shareText}\n${shareUrl}`;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(fullText);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
};
