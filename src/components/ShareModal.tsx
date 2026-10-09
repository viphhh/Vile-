import React, { useState } from 'react';
import { X, Share2, Copy, Check, Send, Mail, MessageCircle, ExternalLink, Sparkles, CheckCheck } from 'lucide-react';
import { Hotel } from '../types';
import { getHotelShareInfo, copyHotelToClipboard } from '../utils/share';

interface ShareModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ hotel, isOpen, onClose }) => {
  if (!isOpen || !hotel) return null;

  const [copied, setCopied] = useState(false);
  const { shareUrl, shareTitle, shareText, whatsappUrl } = getHotelShareInfo(hotel);

  const handleCopyLink = async () => {
    const ok = await copyHotelToClipboard(hotel);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (e) {
        console.log('Share dismissed', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in dir-rtl"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">مشاركة الفندق</h3>
              <p className="text-xs text-slate-400">شارك تفاصيل الفندق والعروض عبر واتساب أو انسخ الرابط</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Hotel Preview Card */}
          <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <img 
              loading="lazy" 
              src={hotel.image}
              alt={hotel.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{hotel.name}</h4>
              <p className="text-xs text-slate-400 truncate">{hotel.city} - {hotel.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-black text-amber-400">
                  {(hotel.discountedPrice || hotel.basePricePerNight).toLocaleString()} ر.س / ليلة
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  إلغاء مجاني
                </span>
              </div>
            </div>
          </div>

          {/* PRIMARY ACTIONS: WhatsApp & Copy Link */}
          <div className="space-y-3">
            {/* WhatsApp Hero Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>مشاركة عبر واتساب (WhatsApp)</span>
            </a>

            {/* Copy Link Hero Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                copied
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700 hover:border-amber-500/40'
              }`}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-5 h-5 text-slate-950" />
                  <span>تم نسخ رابط الفندق للحافظة بنجاح! ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ رابط الفندق إلى الحافظة</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Link Display */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-400 block">رابط الفندق المباشر:</label>
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2 text-xs text-slate-300 dir-ltr text-left font-mono focus:outline-none truncate select-all"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {copied ? 'تم!' : 'نسخ'}
              </button>
            </div>
          </div>

          {/* Other Channels */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">منصات أخرى:</span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>تويتر / X</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>تليجرام</span>
              </a>

              <a
                href={mailUrl}
                className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>إيميل</span>
              </a>
            </div>
          </div>

          {/* Native Device Share API Button */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>مزيد من خيارات المشاركة بالجهاز</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
