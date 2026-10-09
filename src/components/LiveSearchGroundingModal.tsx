import React, { useState } from 'react';
import { Sparkles, Globe, Search, ExternalLink, X, MapPin, Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface LiveSearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string;
}

export const LiveSearchGroundingModal: React.FC<LiveSearchGroundingModalProps> = ({
  isOpen,
  onClose,
  initialCity = 'الرياض',
}) => {
  if (!isOpen) return null;

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    sources: Array<{ uri: string; title?: string }>;
    webSearchQueries: string[];
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const popularDestinations = [
    { name: 'الرياض', query: 'أحدث فعاليات ومواسم الرياض 2026/2027 وأفضل الفنادق' },
    { name: 'مكة المكرمة', query: 'موسم العمرة الحالي، الطقس، وإرشادات السكن بالقرب من الحرم المكي' },
    { name: 'المدينة المنورة', query: 'زيارة الحرم النبوي والروضة الشريفة وأفخم فنادق المنطقة المركزية' },
    { name: 'جدة', query: 'فعاليات كورنيش جدة ومنطقة البلد ومواسم الشاطئ' },
    { name: 'العلا', query: 'فعاليات شتاء طنطورة ومنتجعات العلا الصحراوية' },
    { name: 'أبها', query: 'أجواء عسير، موسم الأمطار، والمنتجعات الجبلية' },
  ];

  const handleSearch = async (cityToUse: string, queryToUse?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/live-grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityToUse,
          query: queryToUse || `أحدث الفعاليات والمواسم والطقس ونصائح الإقامة في ${cityToUse}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          answer: data.answer,
          sources: data.sources || [],
          webSearchQueries: data.webSearchQueries || [],
          timestamp: data.timestamp,
        });
      } else {
        setError(data.error || 'حدث خطأ أثناء البحث المباشر');
      }
    } catch (err: any) {
      setError('تعذر الاتصال بخدمة بحث Google المباشرة. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 dir-rtl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  استكشاف الفعاليات والمواسم المباشرة
                </h3>
                <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>Google Search Grounding</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </span>
              </div>
              <p className="text-xs text-slate-400">
                بيانات حية ومحدثة لحظياً حول الفعاليات، المواسم، والطقس في مدن المملكة عبر Gemini 2.5 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Destination Quick Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>اختر وجهة للاستكشاف الحي:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {popularDestinations.map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => {
                    setSelectedCity(dest.name);
                    handleSearch(dest.name, dest.query);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedCity === dest.name
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Query Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(selectedCity, customQuery);
                  }
                }}
                placeholder={`ابحث عن أي فعالية، طقس، أو موسم في ${selectedCity} (مثال: أحدث فعاليات موسم الرياض الآن)`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-10 pl-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSearch(selectedCity, customQuery)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري البحث الحي...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>بحث مباشر</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Initial Prompt State */}
          {!result && !loading && !error && (
            <div className="text-center py-12 px-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base">استكشف أحدث الفعاليات والمواسم السياحية</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                انقر على إحدى المدن بالأعلى أو اكتب استفسارك للبحث في بيانات Google المباشرة عن كل ما هو جديد في وجهات المملكة.
              </p>
            </div>
          )}

          {/* Results Presentation */}
          {result && (
            <div className="space-y-5 animate-fade-in">
              {/* Answer Content */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم التحقق من بيانات بحث Google الحية</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {new Date(result.timestamp).toLocaleTimeString('ar-SA')}
                  </span>
                </div>

                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                  {result.answer}
                </div>
              </div>

              {/* Web Sources & Grounding Citations */}
              {result.sources && result.sources.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block">
                    المصادر وروابط التحقق المباشرة عبر بحث Google:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.sources.slice(0, 4).map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 transition-colors text-xs group"
                      >
                        <span className="text-slate-300 group-hover:text-blue-400 truncate max-w-[220px]">
                          {source.title || source.uri.replace(/^https?:\/\//, '')}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
