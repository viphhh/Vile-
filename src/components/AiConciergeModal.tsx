import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Building2, MapPin, Compass, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Hotel, AiRecommendationResponse } from '../types';
import { HOTELS_DATA } from '../data/hotels';

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHotel: (hotel: Hotel) => void;
}

export const AiConciergeModal: React.FC<AiConciergeModalProps> = ({
  isOpen,
  onClose,
  onSelectHotel,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [travelers, setTravelers] = useState('عائلة');

  const [aiResult, setAiResult] = useState<{
    advice: string;
    recommendedHotels: Hotel[];
    suggestedActivities: string[];
  } | null>(null);

  const samplePrompts = [
    'أبحث عن فندق فاخر في مكة المكرمة قريب جداً من الحرم مع والدَي كبار السن ومصعد مباشر.',
    'أريد منتجعاً صحراوياً رومانسياً في العلا مع مسبح خاص وجلسات تأمل.',
    'فندق عائلي في جدة يطل على الكورنيش والبحر مع مسبح بأسعار مناسبة.',
    'فندق تنفيذي راقٍ في الرياض قريب من البوليفارد وحي العليا للعمل والتسوق.'
  ];

  const handleAskAi = async (customQuery?: string) => {
    const queryToUse = customQuery || prompt;
    if (!queryToUse.trim()) return;

    setLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToUse,
          city: city || undefined,
          budgetPerNight: budget ? Number(budget) : undefined,
          travelers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResult({
          advice: data.advice,
          recommendedHotels: data.recommendedHotels || [],
          suggestedActivities: data.suggestedActivities || [],
        });
      } else {
        // Fallback
        setAiResult({
          advice: 'بناءً على طلبك، نوصي بالإقامات التالية في المملكة والتي توفر أعلى درجات الراحة والخدمات الفندقية المتميزة.',
          recommendedHotels: HOTELS_DATA.slice(0, 2),
          suggestedActivities: ['استكشاف المعالم السياحية القريبة', 'تجربة المطاعم السعودية المحلية'],
        });
      }
    } catch (err) {
      setAiResult({
        advice: 'نرحب بك في ڤيلوسيتي (Velocity)! إليك خياراتنا الفاخرة المقترحة خصيصاً لإقامتك.',
        recommendedHotels: HOTELS_DATA.slice(0, 2),
        suggestedActivities: ['استمتاع بأجواء الضيافة الفاخرة'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-lg">مستشار الحجز الذكي</h3>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400">مساعدك الشخصي لاختيار أفضل الفنادق والأنشطة السياحية بالمملكة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Form Input Area */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-slate-300">
              صِف رحلتك أو متطلبات حجزك باللغة العربية:
            </label>
            
            <div className="relative">
              <textarea
                rows={3}
                placeholder="مثال: أبحث عن فندق في مكة لقضاء العمرة مع والدي، أهتم بالنظافة والوصول السريع للحرم وإفطار بوفيه..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <span className="block text-[11px] text-slate-400 font-bold mb-2">أفكار بحث سريعة:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(p);
                      handleAskAi(p);
                    }}
                    className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-right transition-colors"
                  >
                    💡 {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAskAi()}
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-950 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري تحليل طلبك واستخراج التوصيات بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>احصل على التوصية الفندقية الخبيرة</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result View */}
          {aiResult && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Advice Box */}
              <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Bot className="w-4 h-4" />
                  <span>توصية المستشار الذكي:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                  {aiResult.advice}
                </p>
              </div>

              {/* Recommended Activities */}
              {aiResult.suggestedActivities && aiResult.suggestedActivities.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    أنشطة ومعالم سياحية موصى بها في الوجهة:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {aiResult.suggestedActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Hotels Grid */}
              <div>
                <h4 className="font-extrabold text-white text-sm mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>الفنادق الموصى بها لطلبك ({aiResult.recommendedHotels.length}):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiResult.recommendedHotels.map((hotel, hIdx) => (
                    <div
                      key={`${hotel.id}-${hIdx}`}
                      className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors"
                    >
                      <div className="flex gap-3">
                        <img loading="lazy" 
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-20 h-20 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                            {hotel.city}
                          </span>
                          <h5 className="font-extrabold text-white text-xs line-clamp-1">{hotel.name}</h5>
                          <p className="text-[10px] text-slate-400 line-clamp-2">{hotel.distanceToLandmark}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">تبدأ من:</span>
                          <span className="font-black text-amber-400">{hotel.discountedPrice || hotel.basePricePerNight} ر.س</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectHotel(hotel);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          عرض واستكمال الحجز
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
