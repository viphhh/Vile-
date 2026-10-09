import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareText, Sparkles, X, Send, Bot, Building2, User, ChevronDown, CheckCircle2, ArrowLeft, RefreshCw, PhoneCall, HelpCircle } from 'lucide-react';
import { Hotel } from '../types';
import { HOTELS_DATA } from '../data/hotels';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedHotels?: Hotel[];
}

interface FloatingChatAssistantProps {
  onSelectHotel: (hotel: Hotel) => void;
  onOpenPriceAlert?: (hotel: Hotel) => void;
}

export const FloatingChatAssistant: React.FC<FloatingChatAssistantProps> = ({
  onSelectHotel,
  onOpenPriceAlert,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    id: 'msg_welcome',
    sender: 'assistant',
    text: 'أهلاً ومرحباً بك في منصة **ڤيلوسيتي (Velocity)** 🇸🇦!\n\nأنا مساعدك الشخصي الذكي، جاهز فوراً للإجابة على جميع استفساراتك حول خيارات الإقامة، الحجوزات، الأسعار، أو خدمات الموقع. كيف يمكنني مساعدتك اليوم؟',
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  const quickQuestions = [
    { label: '🕌 أفضل فنادق مكة القريبة من الحرم؟', query: 'أبحث عن أفضل فنادق مكة المكرمة القريبة من الحرم المكي مع التكاليف.' },
    { label: '💳 سياسة الإلغاء وطرق الدفع؟', query: 'ما هي طرق الدفع المتاحة في الموقع وهل الإلغاء مجاني؟' },
    { label: '🔔 كيف أستفيد من تنبيه السعر؟', query: 'كيف تفعل ميزة تنبيه انخفاض السعر للفنادق؟' },
    { label: '💬 هل يمكن الاستفسار من الفندق؟', query: 'كيف أستطيع الاستفسار المباشر من أصحاب الفندق قبل الحجز؟' },
    { label: '✨ فندق عائلي في جدة على البحر؟', query: 'اقترح لي فندقاً عائلياً مميزاً في جدة يطل على الكورنيش.' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const assistantMsg: Message = {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          recommendedHotels: data.recommendedHotels,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Local smart fallback matching query context
        const lower = query.toLowerCase();
        let fallbackText = 'أهلاً بك! يسعدني إجابتك. في منصة ڤيلوسيتي (Velocity) نوفر لك أفضل العروض المضمونة مع خيارات إلغاء مجانية ودفع مرن عند الوصول أو بالبطاقة.';
        let matched: Hotel[] = [];

        if (lower.includes('مكة') || lower.includes('الحرم') || lower.includes('عمرة')) {
          fallbackText = 'تتميز فنادق مكة المكرمة في منصتنا بالاطلاع المباشر على الحرم الشريف والإفطار الاستثنائي. نوصي بالفنادق التالية لسهولة الوصول للحرم:';
          matched = HOTELS_DATA.filter((h) => h.city === 'مكة المكرمة').slice(0, 2);
        } else if (lower.includes('جدة') || lower.includes('البحر') || lower.includes('الكورنيش')) {
          fallbackText = 'عروس البحر الأحمر جدة تضم منتجعات وفنادق فاخرة ذات إطلالات ساحرة على الكورنيش والبحر. إليك أبرز الخيارات الموصى بها:';
          matched = HOTELS_DATA.filter((h) => h.city === 'جدة').slice(0, 2);
        } else if (lower.includes('دفع') || lower.includes('إلغاء') || lower.includes('بطاقة')) {
          fallbackText = '💳 **سياسة الدفع والإلغاء:**\n- يمكنك الدفع ببطاقات مدى، فيزا، ماستر كارد، أبل باي، أو اختيار الدفع عند الوصول بالفندق.\n- جميع الحجوزات تتضمن إلغاءً مجانياً حتى 24 ساعة قبل تاريخ الوصول.';
        } else if (lower.includes('تنبيه') || lower.includes('سعر') || lower.includes('انخفاض')) {
          fallbackText = '🔔 **ميزة تنبيه انخفاض السعر:**\nيمكنك الضغط على رمز الجرس الموجود على أي فندق ترغب به في القائمة أو المفضلة، وتحديد السعر المستهدف لتصلك إشعارات فورية عبر الواتساب عند انخفاض السعر!';
        } else if (lower.includes('استفسار') || lower.includes('تواصل')) {
          fallbackText = '💬 **الاستفسار المباشر:**\nيمكنك الآن الضغط على زر "استفسار عن السعر والتوفر" بداخل صفحة الفندق لإرسال طلبك مباشرة لإدارة أصحاب الفندق وسيتم الرد عليك خلال دقائق!';
        }

        const assistantMsg: Message = {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          recommendedHotels: matched,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: 'ast_err_' + Date.now(),
        sender: 'assistant',
        text: 'أهلاً بك! يمكنك تصفح أفضل ڤيلوسيتي (Velocity) وحجز إقامتك بكل سهولة. نحن في خدمتك دائماً لأي استفسار.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        recommendedHotels: HOTELS_DATA.slice(0, 2),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 font-sans dir-rtl">
      
      {/* Floating Widget Drawer */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[400px] h-[520px] max-h-[82vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in backdrop-blur-xl">
          
          {/* Header */}
          <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm">المساعد الشخصي الذكي</h3>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.2 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    مباشر
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">ردود فورية على استفسارات الحجز والأسعار 🇸🇦</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 border border-slate-700 text-amber-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-bold rounded-tl-none shadow-md'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tr-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Recommended Hotel Cards inside Chat */}
                  {msg.recommendedHotels && msg.recommendedHotels.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold block">الفنادق الموصى بها:</span>
                      {msg.recommendedHotels.map((hotel, hIdx) => (
                        <div
                          key={`${hotel.id}-${hIdx}`}
                          className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-2.5 rounded-2xl flex items-center gap-2.5 transition-all"
                        >
                          <img loading="lazy" 
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-white text-xs truncate">{hotel.name}</h5>
                            <p className="text-[10px] text-slate-400 truncate">{hotel.city}</p>
                            <span className="text-[11px] font-black text-amber-400 block mt-0.5">
                              {hotel.discountedPrice || hotel.basePricePerNight} ر.س / ليلة
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onSelectHotel(hotel);
                              setIsOpen(false);
                            }}
                            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0"
                          >
                            عرض
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Questions Chips after Initial Welcome Message */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold block">💡 أسئلة شائعة يمكنك اختيارها:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q.query)}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1.5 rounded-xl text-right transition-colors"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800 w-max">
                <Bot className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>المساعد الذكي يكتب الرد الآن...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اسأل المساعد الشخصي عن الفنادق، الأسعار، الحجز..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 hover:border-amber-400 p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="المساعد الشخصي للدردشة"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <MessageSquareText className="w-5 h-5 text-slate-950" />
          </div>
          <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full absolute -top-0.5 -right-0.5 animate-ping" />
          <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full absolute -top-0.5 -right-0.5" />
        </div>

        <div className="text-right hidden sm:block">
          <span className="block text-xs font-black text-white group-hover:text-amber-400 transition-colors">
            المساعد الشخصي
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">
            ردود استفسارات فورية 💬
          </span>
        </div>

        {unreadCount > 0 && !isOpen && (
          <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-rose-400 animate-bounce">
            1
          </span>
        )}
      </button>

    </div>
  );
};
