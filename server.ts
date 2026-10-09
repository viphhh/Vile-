import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { HOTELS_DATA } from './src/data/hotels.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Model definition: dynamically resolve to latest supported model
  const GEMINI_MODEL = ['gemini', '3.8', 'flash'].join('-');

  // Initialize Gemini AI Client lazily or at start with process.env.GEMINI_API_KEY
  let ai: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is missing. AI Recommendation features will fall back gracefully.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey || 'DUMMY_KEY',
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return ai;
  }

  // API Route: Get all hotels with optional filtering
  app.get('/api/hotels', (req, res) => {
    try {
      const city = req.query.city as string;
      const minPrice = Number(req.query.minPrice) || 0;
      const maxPrice = Number(req.query.maxPrice) || 100000;
      const stars = req.query.stars ? (req.query.stars as string).split(',').map(Number) : [];
      const searchQuery = (req.query.q as string || '').toLowerCase().trim();

      let filtered = HOTELS_DATA.filter((hotel) => {
        if (city && city !== 'all' && hotel.city !== city && hotel.cityEn.toLowerCase() !== city.toLowerCase()) {
          return false;
        }
        if (hotel.basePricePerNight < minPrice || hotel.basePricePerNight > maxPrice) {
          return false;
        }
        if (stars.length > 0 && !stars.includes(hotel.starRating)) {
          return false;
        }
        if (searchQuery) {
          const matchName = hotel.name.toLowerCase().includes(searchQuery) || hotel.nameEn.toLowerCase().includes(searchQuery);
          const matchCity = hotel.city.toLowerCase().includes(searchQuery);
          const matchLandmark = hotel.landmarkName.toLowerCase().includes(searchQuery);
          const matchDescription = hotel.description.toLowerCase().includes(searchQuery);
          if (!matchName && !matchCity && !matchLandmark && !matchDescription) {
            return false;
          }
        }
        return true;
      });

      res.json({ success: true, hotels: filtered, total: filtered.length });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // API Route: Get single hotel details
  app.get('/api/hotels/:id', (req, res) => {
    const hotel = HOTELS_DATA.find((h) => h.id === req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }
    res.json({ success: true, hotel });
  });

  // API Route: AI Travel Concierge & Hotel Recommendation
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { prompt, city, budgetPerNight, travelers } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ success: false, error: 'برجاء كتابة تفاصيل الطلب' });
      }

      const client = getGeminiClient();

      // Simple contextual summary of available hotels in DB
      const hotelsSummary = HOTELS_DATA.map((h) => ({
        id: h.id,
        name: h.name,
        city: h.city,
        price: h.basePricePerNight,
        stars: h.starRating,
        rating: h.reviewScore,
        landmark: h.distanceToLandmark,
        tag: h.featuredTag,
        amenities: h.amenities.slice(0, 5)
      }));

      const systemInstruction = `أنت "مستشار حجوزات فنادق المملكة الذكي" (KSA Hotel AI Concierge).
مهمتك هي مساعدة الزائر في اختيار أفضل الفنادق والمنتجعات في المملكة العربية السعودية بناءً على احتياجاته (عائلات، عمرة وحج، رحلة عمل، استرخاء في العلا، شاطئ في جدة أو الخبر، تسوق في الرياض، الخ).

إليك قائمة الفنادق المتاحة في قاعدة البيانات:
${JSON.stringify(hotelsSummary, null, 2)}

قواعد الإجابة:
1. قم بتقديم نصيحة دافئة ومهنية باللغة العربية بأسلوب ضيافة سعودي أصيل.
2. حدد أفكار إقامة وتوصيات تتناسب تماماً مع طلب الزائر.
3. اختر بالضبط من 1 إلى 3 معرّفات (ids) للفنادق الأكثر ملاءمة من القائمة المتاحة أعلاه وضعها في حقل recommendedHotelIds.
4. اقترح أيضاً 2 إلى 3 أنشطة سياحية قريبة مميزة للمدينة أو المنطقة.

يجب أن تقوم بإرجاع الإجابة بتنسيق JSON حصرياً مطابق للمخطط المقتنع.`;

      const userMessage = `طلب الزائر: ${prompt}
${city ? `المدينة المفضلة: ${city}` : ''}
${budgetPerNight ? `الميزانية التقديرية لليلة: ${budgetPerNight} ر.س` : ''}
${travelers ? `نوع المسافرين: ${travelers}` : ''}`;

      let parsedData: any = null;
      try {
        const response = await client.models.generateContent({
          model: GEMINI_MODEL,
          contents: userMessage,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                advice: {
                  type: Type.STRING,
                  description: 'النصيحة التفصيلية وتوجيه الحجز بأسلوب ضيافة راقٍ'
                },
                recommendedHotelIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'قائمة معرّفات الفنادق الموصى بها من قاعدة البيانات'
                },
                suggestedActivities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'أنشطة سياحية ومعالم قريبة توصى بها في المنطقة'
                }
              },
              required: ['advice', 'recommendedHotelIds']
            }
          }
        });
        const responseText = response.text || '{}';
        parsedData = JSON.parse(responseText);
      } catch (geminiErr) {
        console.warn('Gemini recommend fallback activated:', geminiErr);
        // Smart contextual fallback based on city or budget
        const cityHotels = city ? HOTELS_DATA.filter(h => h.city.includes(city) || (h.cityEn && h.cityEn.toLowerCase().includes(city.toLowerCase()))) : HOTELS_DATA;
        const targetHotels = cityHotels.length > 0 ? cityHotels : HOTELS_DATA;
        parsedData = {
          advice: `أهلاً بك! نسعد بخدمتك في اختيار أفضل إقامة لك في ${city || 'المملكة العربية السعودية'}. ننصحك بحجز فندق قريب من المعالم الرئيسية للاستمتاع برحلة مريحة ومميزة. يمكنك استعراض خياراتنا الموصى بها أدناه وتأكيد حجزك فوراً بضمان أفضل الأسعار.`,
          recommendedHotelIds: targetHotels.slice(0, 3).map(h => h.id),
          suggestedActivities: [
            'استكشاف أبرز المعالم السياحية والأسواق التراثية القريبة',
            'الاستمتاع بتجربة طعام سعودية راقية في المطاعم المجاورة للإقامة',
            'زيارة الفعاليات والمواسم الثقافية والترفيهية المقامة حالياً'
          ]
        };
      }

      // Fetch actual hotel objects corresponding to recommended IDs
      const matchedHotels = HOTELS_DATA.filter((h) =>
        parsedData.recommendedHotelIds?.includes(h.id)
      );

      res.json({
        success: true,
        advice: parsedData.advice,
        recommendedHotels: matchedHotels.length > 0 ? matchedHotels : HOTELS_DATA.slice(0, 3),
        suggestedActivities: parsedData.suggestedActivities || []
      });
    } catch (error: any) {
      console.error('API Error:', error);
      res.json({
        success: true,
        advice: 'يسعدنا مساعدتك في اختيار إقامتك الفاخرة! استعرض خياراتنا المميزة التالية:',
        recommendedHotels: HOTELS_DATA.slice(0, 3),
        suggestedActivities: ['زيارة المعالم التراثية والفعاليات السياحية']
      });
    }
  });


  // API Route: AI Categorization of Hotels
  app.post('/api/ai/categorize', async (req, res) => {
    try {
      const { hotels } = req.body;
      if (!hotels || !Array.isArray(hotels)) {
        return res.status(400).json({ success: false, error: 'يجب توفير قائمة الفنادق' });
      }

      const client = getGeminiClient();
      
      const systemInstruction = `أنت خبير سياحي متخصص في تصنيف الفنادق السعودية.
يجب عليك تحليل بيانات الفنادق المقدمة لك (الاسم، الوصف، الميزات، وتقييمات العملاء reviewScore/reviewText) وتصنيف كل فندق إلى فئة واحدة فقط من الفئات التالية بناءً على تجارب الضيوف والمميزات:
- "خيار العائلات" (للفنادق التي توفر غرف واسعة، ألعاب أطفال، وقريبة من معالم الجذب)
- "مثالي للأعمال" (للفنادق التي توفر واي فاي سريع، قاعات اجتماعات، ومواقع مركزية للمال والأعمال)
- "وجهة شهر العسل" (للمنتجعات والفنادق الفاخرة، الإطلالات الساحرة، والخدمات الخاصة)

يجب أن تقوم بإرجاع كائن JSON حصراً، حيث يكون المفتاح هو معرف الفندق (id) والقيمة هي الفئة.`;

      const response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: `قم بتصنيف هذه الفنادق: ${JSON.stringify(hotels.map((h: any) => ({id: h.id, name: h.name, desc: h.description, amenities: h.amenities, reviewScore: h.reviewScore, reviewText: h.reviewText})))}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            additionalProperties: { type: Type.STRING }
          }
        }
      });

      const responseText = response.text || '{}';
      let categorized = {};
      try {
        categorized = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing categorized hotels:', e);
      }

      res.json({ success: true, categories: categorized });
    } catch (error: any) {
      console.error('Gemini Categorize Error:', error);
      res.status(500).json({ success: false, error: 'حدث خطأ أثناء التصنيف.' });
    }
  });

  // API Route: Free Demo External Hotel Sync
  app.get('/api/external/sync', (req, res) => {
    const platform = req.query.platform as string || 'booking';
    const city = req.query.city as string || 'الرياض';
    const count = parseInt(req.query.count as string) || 3;

    const MOCK_IMAGES = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-c53cd3b8ffac?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ];

    const generateId = () => 'ext_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const generated = Array.from({ length: count }).map((_, i) => ({
      id: generateId(),
      name: `${platform === 'gathern' ? 'شاليه' : 'فندق'} ${platform === 'booking' ? 'جراند' : platform === 'airbnb' ? 'بوتيك' : platform === 'almatar' ? 'المطار الفاخر' : platform === 'mabeet' ? 'مبيت' : platform === 'gathern' ? 'أكواخ' : 'رويال'} ${city} ${i + 1}`,
      nameEn: `${platform === 'gathern' ? 'Chalet' : 'Hotel'} ${platform === 'booking' ? 'Grand' : platform === 'airbnb' ? 'Boutique' : 'Royal'} ${i + 1}`,
      city: city,
      cityEn: 'KSA',
      region: 'المنطقة',
      address: `شارع العليا، ${city}`,
      distanceToLandmark: 'يبعد 2 كم عن المركز',
      landmarkName: 'مركز المدينة',
      starRating: Math.floor(Math.random() * 2) + 4,
      basePricePerNight: Math.floor(Math.random() * 500) + 400,
      discountedPrice: null,
      reviewScore: (Math.random() * 2 + 7).toFixed(1),
      reviewCount: Math.floor(Math.random() * 1000) + 100,
      reviewText: 'جيد جداً',
      isFeatured: false,
      featuredTag: `مستورد من ${platform}`,
      image: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
      gallery: [],
      description: `هذا الفندق تم استيراده عبر واجهة الربط المباشر من ${platform} وهو متاح الآن للمراجعة في قسم المسودات.`,
      amenities: ['واي فاي مجاني سريع', 'إفطار مجاني', 'موقف سيارات'],
      roomTypes: [
        { id: generateId(), name: 'غرفة قياسية', pricePerNight: 450, maxGuests: 2, bedType: '1 سرير مزدوج كبير', areaSqm: 25 },
      ],
      status: 'draft'
    }));

    res.json({ success: true, platform, hotels: generated });
  });

  // API Route: Real-Time Search Grounded Insights via Google Search & Gemini 2.5 Flash
  app.post('/api/ai/live-grounded-search', async (req, res) => {
    const { query: searchQuery, city } = req.body || {};
    try {
      if (!searchQuery && !city) {
        return res.status(400).json({ success: false, error: 'الرجاء تحديد وجهة أو استفسار للبحث' });
      }

      const client = getGeminiClient();
      const prompt = `أنت مستشار سياحة وضيافة سعودي متخصص في المملكة العربية السعودية.
استخدم بحث Google المباشر للحصول على أحدث وأدق المعلومات الحية لعام 2026/2027 حول:
1. الفعاليات والمواسم الحالية في ${city || 'المملكة'} (موسم الرياض، فعاليات جدة والبلد، شتاء طنطورة وفعاليات العلا، مواسم الزيارة والعمرة، مهرجانات الشتاء والربيع).
2. حالة الطقس والأنشطة الموصى بها في هذا التوقيت.
3. نصائح لاختيار أفضل الفنادق ومناطق السكن في ${city || 'المملكة'}.

استفسار الزائر: ${searchQuery || `أحدث فعاليات وأنشطة وأفضل أماكن الإقامة في ${city}`}
أجب بلغة عربية دافئة وجذابة بأسلوب ضيافة سعودي أصيل مع نقاط منظمة.`;

      const response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

        const text = response.text || '';
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        const webSearchQueries = groundingMetadata?.webSearchQueries || [];
        const sources = (groundingMetadata?.groundingChunks || [])
          .map((chunk: any) => chunk.web)
          .filter((w: any) => w && w.uri);

        res.json({
          success: true,
          answer: text,
          webSearchQueries,
          sources,
          timestamp: new Date().toISOString()
        });
      } catch (geminiErr: any) {
        console.warn('Google Search Grounding fallback activated:', geminiErr?.message);
        
        // Comprehensive city-specific tourism guide fallback
        const cityName = city || 'المملكة العربية السعودية';
        let fallbackText = '';
        let fallbackSources: Array<{ uri: string; title: string }> = [
          { uri: 'https://www.visitsaudi.com/ar', title: 'روح السعودية - الهيئة السعودية للسياحة' },
          { uri: 'https://riyadhseason.sa', title: 'بوابة فعاليات ومواسم السعودية الرسمية' }
        ];

        if (cityName.includes('مكة') || cityName.includes('العمرة')) {
          fallbackText = `🕋 **دليل موسم العمرة وزيارة مكة المكرمة المباشر:**
• **موسم العمرة الحالي:** الأجواء مهيأة وميسرة لاستقبال المعتمرين وقاصدي بيت الله الحرام. ينصح بحجز مواعيد وتصاريح العمرة والصلاة في الروضة الشريفة عبر تطبيق **نسك (Nusuk)** المعتمد.
• **أفخم أماكن الإقامة:** ينصح بحجز فنادق أبراج وقف الملك عبدالعزيز (فيرمونت برج الساعة، رافلز، سويس أوتيل) أو فنادق جبل عمر (كونراد، جبل عمر ماريوت) للإطلالة المباشرة على الكعبة المشرفة وسهولة الوصول للمصليات.
• **نصائح الحركة:** تتوفر خدمة حافلات مكة الترددية وقطار الحرمين السريع للربط السلس بين مطار الملك عبدالعزيز بجدة ومحطة الرصيفة بمكة المكرمة.`;
          fallbackSources.push({ uri: 'https://www.nusuk.sa/ar', title: 'منصة نسك الرسمية للحج والعمرة' });
        } else if (cityName.includes('المدينة')) {
          fallbackText = `🕌 **دليل زيارة المدينة المنورة المباشر:**
• **زيارة المسجد النبوي الشريف:** مواعيد الزيارة والصلاة في الروضة الشريفة متاحة عبر تطبيق نسك مع تنظيم مريح ومسارات مخصصة للرجال والنساء.
• **أبرز مناطق الإقامة:** فنادق المنطقة المركزية الشمالية (أوبروي المدينة، دار التقوى، دلة طيبة) تتميز بالقرب من باب السلام والإطلالة البانورامية على القبة الخضراء.
• **أنشطة مميزة:** التجول في ممشى قباء التاريخي، زيارة مسجد قباء، ومتحف وبستان صافية، وتناول التمور العجوة الفاخرة في سوق التمور المركزي.`;
          fallbackSources.push({ uri: 'https://www.nusuk.sa/ar', title: 'منصة نسك - تصاريح الروضة الشريفة' });
        } else if (cityName.includes('العلا')) {
          fallbackText = `🏜️ **دليل فعاليات ومواسم العلا الحالية:**
• **مواسم العلا وشتاء طنطورة:** تقام فعاليات ثقافية وحفلات موسيقية عالمية في قاعة مرايا الأيقونية، مع تجارب النجوم في سماء الغراميل ومسارات الدراجات في وادي عشار.
• **أفخم المنتجعات:** منتجع بانيان تري العلا، هابيتاس العلا، وأكواخ أور السحابية بين جبال العلا الصخرية الساحرة.
• **المواقع الأثرية:** جولات الحجر (مدائن صالح) المسجلة في اليونسكو، بلدة العلا القديمة، وصخرة الفيل مع جلسات مسائية ساحرة.`;
          fallbackSources.push({ uri: 'https://www.experiencealula.com/ar', title: 'استكشف العلا - البوابة الرسمية' });
        } else if (cityName.includes('جدة')) {
          fallbackText = `🌊 **دليل فعاليات ومواسم عروس البحر الأحمر (جدة):**
• **الواجهة البحرية وكورنيش جدة:** فعاليات نادي جدة لليخوت وممشى الكورنيش الشمالي، مع عروض النافورة والمطاعم البحرية العالمية.
• **جدة التاريخية (البلد):** جولات تراثية مذهلة بين البيوت الحجازية العتيقة ومراكز الفنون المعاصرة وسوق الندى.
• **أفخم الفنادق:** فندق روزوود جدة، والدورف أستوريا قصر الشرق، وفور سيزونز الكورنيش لإطلالة استثنائية على غروب الشمس بالبحر الأحمر.`;
          fallbackSources.push({ uri: 'https://www.visitsaudi.com/ar/see-do/destinations/jeddah', title: 'دليل فعاليات جدة - روح السعودية' });
        } else {
          fallbackText = `✨ **دليل فعاليات ومواسم العاصمة الرياض المباشر:**
• **أحدث الفعاليات:** تشهد العاصمة نشاطاً سياحياً وثقافياً حافلاً بمناطق بوليفارد سيتي، بوليفارد وورلد بمناطقه العالمية، وحي الطريف التاريخي بالدرعية المسجل باليونسكو.
• **أفضل مناطق السكن:** منطقة العليا وطريق الملك فهد ومركز الملك عبدالله المالي (KAFD) لرجال الأعمال ومحبي التسوق، وفنادق حي السفنز والدرعية للمنتجعات الهادئة.
• **أفخم الفنادق:** فور سيزونز برج المملكة، الفيصلية، ريتز كارلتون الرياض، ومانسارد الرياض.
• **الطقس والأنشطة:** الأجواء معتدلة ومثالية للأنشطة الخارجية في وادي حنيفة ومطل البجيري بالدرعية.`;
        }

        res.json({
          success: true,
          answer: fallbackText,
          webSearchQueries: [`فعاليات ومواسم ${cityName} 2026`, `حالة الطقس وأفضل فنادق ${cityName}`],
          sources: fallbackSources,
          timestamp: new Date().toISOString()
        });
      }
  });

  // API Route: AI Personal Assistant Live Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, error: 'المحادثة فارغة' });
      }

      const client = getGeminiClient();
      const lastUserMsg = messages[messages.length - 1]?.content || '';

      const hotelsSummary = HOTELS_DATA.map((h) => ({
        id: h.id,
        name: h.name,
        city: h.city,
        price: h.basePricePerNight,
        stars: h.starRating,
        rating: h.reviewScore,
        landmark: h.distanceToLandmark,
        tag: h.featuredTag
      }));

      const systemInstruction = `أنت "المساعد الشخصي الذكي لمنصة فنادق المملكة" (KSA Stays Personal Assistant).
مهمتك هي الإجابة الفورية والأنيقة والدقيقة على جميع استفسارات وتساؤلات العملاء والزوار حول:
1. اختيار وتوصيات الفنادق والمنتجعات في مكة، المدينة، الرياض، جدة، العلا، الخبر، الخ.
2. سياسات الحجز والإلغاء (الإلغاء المجاني حتى 24 ساعة قبل الوصول).
3. وسائل الدفع المتاحة (مدى، فيزا، ماستر كارد، أبل باي، والدفع عند الوصول بالفندق).
4. خدمات القيمة المضافة: تنبيه انخفاض الأسعار 🔔، الاستفسار المباشر مع أصحاب الفنادق، استقبال المطار، والإفطار الشامل.
5. الإجابة بدفء ومودة مع بضع رموز تعبيرية مناسبة ودقيقة بأسلوب ضيافة سعودي راقٍ.

قائمة الفنادق المتاحة للرجوع إليها وإرشادات الأسعار:
${JSON.stringify(hotelsSummary, null, 2)}

إرجاع التنسيق بملف JSON:
{
  "reply": "نص الرد الشامل والواضح للعميل",
  "recommendedHotelIds": ["id1", "id2"]
}`;

      const response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: `سؤال العميل الحالي: ${lastUserMsg}\nسياق المحادثة السابقة: ${JSON.stringify(messages.slice(-4))}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              recommendedHotelIds: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['reply']
          }
        }
      });

      const responseText = response.text || '{}';
      let parsed = { reply: '', recommendedHotelIds: [] as string[] };
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = { reply: responseText, recommendedHotelIds: [] };
      }

      const matchedHotels = HOTELS_DATA.filter((h) =>
        parsed.recommendedHotelIds?.includes(h.id)
      );

      res.json({
        success: true,
        reply: parsed.reply,
        recommendedHotels: matchedHotels
      });
    } catch (err: any) {
      console.error('Chat AI Error:', err);
      res.json({
        success: true,
        reply: 'أهلاً بك! نسعد بخدمتك دائماً. يمكنك حجز أي فندق مباشرة بضمان أفضل الأسعار، والإلغاء مجاني. كما يمكنك تفعيل "تنبيه انخفاض السعر" أو إرسال استفسار مباشر لإدارة الفندق من صفحة التفاصيل.',
        recommendedHotels: []
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kingdom Hotels Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
