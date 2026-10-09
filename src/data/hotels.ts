import { Hotel, CityInfo } from '../types';

export const CITIES_DATA: CityInfo[] = [
  {
    id: 'makkah',
    name: 'مكة المكرمة',
    nameEn: 'Makkah',
    tagline: 'قبلة المسلمين وقرب المسجد الحرام',
    description: 'استمتع بإقامة إيمانية استثنائية بجوار الحرم المكي الشريف مع أرقى الخدمات الفندقية للإقامة والعمرة.',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 142,
    popularFor: ['إطلالة الحرم', 'برج الساعة', 'توصيل مباشر', 'بوفيه إفطار']
  },
  {
    id: 'madinah',
    name: 'المدينة المنورة',
    nameEn: 'Madinah',
    tagline: 'طيبة الطيبة وجوار المسجد النبوي',
    description: 'سكينة واطمئنان في جوار الحرم النبوي الشريف مع فنادق فاخرة بطلات مباشرة وأرقى درجات الضيافة.',
    image: 'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 98,
    popularFor: ['المنطقة المركزية', 'ساحة الحرم', 'تسوق', 'أجواء روحانية']
  },
  {
    id: 'riyadh',
    name: 'الرياض',
    nameEn: 'Riyadh',
    tagline: 'عاصمة المستقبل والفعاليات العالمية',
    description: 'أرقى الفنادق والأبراج الفاخرة في قلب العاصمة القريبة من البوليفارد ومراكز الأعمال وأفخم المطاعم.',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 210,
    popularFor: ['موسم الرياض', 'مركز الأعمال', 'فنادق 5 نجوم', 'تسوق فاخر']
  },
  {
    id: 'jeddah',
    name: 'جدة',
    nameEn: 'Jeddah',
    tagline: 'عروس البحر الأحمر وسحر الكورنيش',
    description: 'استمتع بالإطلالات البحرية الخلابة والشواطئ الفاخرة والفنادق المطلة على نافورة الملك فهد وبلد جدة التاريخية.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 165,
    popularFor: ['إطلالة بحرية', 'الكورنيش', 'منتجعات خاصة', 'البلد التاريخية']
  },
  {
    id: 'alula',
    name: 'العلا',
    nameEn: 'AlUla',
    tagline: 'متحف العالم المفتوح والواحات الغناء',
    description: 'منتجعات صحراوية عالمية ساحرة بين الجبال الرملية التاريخية وآثار الحجر ومسرح مرايا الفاخر.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 34,
    popularFor: ['منتجعات صحراوية', 'مسرح مرايا', 'آثار الحجر', 'استرخاء فاخر']
  },
  {
    id: 'alkhobar',
    name: 'الخبر والدمام',
    nameEn: 'Al Khobar & Dammam',
    tagline: 'لؤلؤة الخليج العربي والوجهات البحرية',
    description: 'فنادق ومنتجعات ساحلية متميزة على كورنيش الخبر والقريبة من المجمعات التجارية الكبرى.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 88,
    popularFor: ['شاطئ نسيج', 'الكورنيش', 'سياحة عائلية', 'مطاعم فاخرة']
  },
  {
    id: 'abha',
    name: 'أبها وعسير',
    nameEn: 'Abha',
    tagline: 'عروس الجبل والأجواء الباردة الساحرة',
    description: 'منتجعات جبلية وأجواء ضبابية معطلة في قمم السودة والقرى التراثية الأبهاوية.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    hotelCount: 52,
    popularFor: ['جبال السودة', 'أجواء معتدلة', 'إطلالات ضبابية', 'طبيعة غناء']
  }
];

export const HOTELS_DATA: Hotel[] = [
  {
    id: 'fairmont-makkah',
    name: 'فندق فيرمونت برج الساعة مكة',
    nameEn: 'Makkah Clock Royal Tower, A Fairmont Hotel',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    region: 'منطقة مكة',
    address: 'أبراج البيت، أمام باب الملك عبد العزيز، مكة المكرمة',
    lat: 21.4199,
    lng: 39.8262,
    starRating: 5,
    reviewScore: 9.6,
    reviewCount: 3420,
    reviewText: 'استثنائي جداً',
    basePricePerNight: 1450,
    discountedPrice: 1290,
    isFeatured: true,
    featuredTag: 'إطلالة مباشرة على الكعبة الشريفة',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548625361-e8ab667a4253?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'يقع فندق فيرمونت برج الساعة المكون من 76 طابقاً والمجاور للمسجد الحرام مباشرة، ويقدم إطلالات بانورامية لا مثيل لها على الكعبة المشرفة مع 9 مطاعم عالمية ومصاعد فائقة السرعة.',
    distanceToLandmark: 'مباشرة على ساحة المسجد الحرام',
    landmarkName: 'المسجد الحرام',
    amenities: [
      'إطلالة مباشرة على الكعبة',
      'مصعد مباشر للحرم',
      'بوفيه إفطار فاخر',
      'نادي صحي وسبا',
      'خدمة خادم شخصي',
      'إنترنت عالي السرعة',
      'مركز أعمال',
      'غرف عائلية واسعة'
    ],
    roomTypes: [
      {
        id: 'fairmont-kaaba-view',
        name: 'جناح فيرمونت مطرّز بإطلالة مباشرة على الكعبة',
        description: 'غرفة فاخرة بسرير ملكي وتصميم إسلامي معشّق مع إطلالة كاشفة ومباشرة على صحن المطاف والكعبة المشرفة.',
        pricePerNight: 1850,
        maxGuests: 3,
        bedType: 'سرير كينج ملكي',
        areaSqm: 52,
        perks: ['إفطار بوفيه مجاني', 'إلغاء مجاني حتى قبل 24 ساعة', 'سماعات صوتية للأذان من الحرم'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'fairmont-haram-view',
        name: 'غرفة ديلوكس بإطلالة على ساحة الحرم',
        description: 'غرفة واسعة ومصممة بأحدث وسائل الراحة مع إطلالة على الساحات الخارجية للمسجد الحرام.',
        pricePerNight: 1290,
        maxGuests: 2,
        bedType: 'سريران منفصلان أو كينج',
        areaSqm: 42,
        perks: ['إفطار مجاني', 'واي فاي مجاني high-speed'],
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      }
    ],
    reviewsList: [
      {
        id: 'r1',
        userName: 'عبدالله السبيعي',
        date: 'منذ يومين',
        rating: 10,
        comment: 'الإقامة كانت تفوق الخيال! إطلالة الغرفة على الكعبة والمطاف كانت تجربة إيمانية لا تُنسى، والنظافة والخدمة على أعلى مستوى.',
        travelerType: 'عائلات'
      },
      {
        id: 'r2',
        userName: 'د. سارة الغامدي',
        date: 'منذ أسبوع',
        rating: 9.5,
        comment: 'القرب من الحرم والمصاعد المباشرة جعلت أداء الصلوات والعمرة سهلاً جداً وخصوصاً لوالدي كبار السن.',
        travelerType: 'عائلات'
      }
    ]
  },
  {
    id: 'raffles-makkah',
    name: 'قصر رافلز مكة المكرمة',
    nameEn: 'Raffles Makkah Palace',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    region: 'منطقة مكة',
    address: 'مجمع أبراج البيت، مكة المكرمة',
    lat: 21.418,
    lng: 39.825,
    starRating: 5,
    reviewScore: 9.8,
    reviewCount: 1890,
    reviewText: 'ممتاز فوق العادة',
    basePricePerNight: 2100,
    discountedPrice: 1950,
    isFeatured: true,
    featuredTag: 'أجنحة فاخرة بالكامل بخدمة بتلر',
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'فندق أجنحة حصري بالكامل يقع في قلب مكة مع خادم شخصي خاص لكل جناح، ومطاعم أرابيسك راقية وإطلالات مهيبة على الحرم الشريف.',
    distanceToLandmark: '50 متر عن باب الملك عبدالعزيز',
    landmarkName: 'المسجد الحرام',
    amenities: [
      'أجنحة فقط',
      'خادم شخصي (بتلر) 24 ساعة',
      'إطلالة مباشرة على الكعبة',
      'سبا فاخر للرجال والسيدات',
      'بوفيه الشاي الملكي',
      'مواقف خاصة'
    ],
    roomTypes: [
      {
        id: 'raffles-presidential-suite',
        name: 'الجناح الرئاسي الملكي بإطلالة على الكعبة',
        description: 'جناح فسيح يتضمن غرفة نوم معيشة وغرفة طعام منفصلة وحمام رخامي مزود بجاكوزي وإطلالة بانورامية كاملة.',
        pricePerNight: 2800,
        maxGuests: 4,
        bedType: 'سرير كينج + صالة فسيحة',
        areaSqm: 85,
        perks: ['إفطار ملكي خاص داخل الجناح', 'خدمة بتلر خاصة', 'سيارة توصيل خاصة'],
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'swissotel-makkah',
    name: 'فندق سويس أوتيل مكة المكرمة',
    nameEn: 'Swissôtel Makkah',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    region: 'منطقة مكة',
    address: 'تقاطع شارع أجياد، مجمع أبراج البيت، مكة المكرمة',
    lat: 21.4175,
    lng: 39.827,
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 2890,
    reviewText: 'ممتاز جداً',
    basePricePerNight: 980,
    discountedPrice: 850,
    isFeatured: true,
    featuredTag: 'إطلالة سحرية على ساحة المسجد الحرام والشعائر',
    image: '/images/swissotel_makkah_real.jpg',
    gallery: [
      '/images/swissotel_makkah_real.jpg',
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'يُعتبر سويس أوتيل مكة من أفخم الفنادق المطلة على المسجد الحرام، ويتميز بمداخل خاصة تتيح لضيوف الرحمن الوصول المباشر لصحن الحرم الشريف لأداء الشعائر والصلوات بكل يسر وسهولة.',
    distanceToLandmark: '100 متر عن ساحة الحرم الشريف',
    landmarkName: 'المسجد الحرام',
    amenities: [
      'إطلالة على ساحة الحرم',
      'دخول مباشر للمسجد الحرام',
      'بوفيه إفطار فاخر',
      'مصاعد سريعة',
      'واي فاي مجاني',
      'خدمات معتمرين خاصة'
    ],
    roomTypes: [
      {
        id: 'swiss-classic-haram',
        name: 'غرفة كلاسيك بإطلالة على ساحة المسجد الحرام',
        description: 'غرفة أنيقة بألوان دافئة وتجهيزات حديثة تطل مباشرة على ساحات المسجد الحرام الخارجية والشعائر.',
        pricePerNight: 850,
        maxGuests: 3,
        bedType: 'سريران منفصلان كبيران',
        areaSqm: 38,
        perks: ['إفطار بوفيه متكامل', 'إلغاء مجاني حتى 48 ساعة'],
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
      }
    ],
    reviewsList: [
      {
        id: 'r3',
        userName: 'محمد بن علي الشهري',
        date: 'منذ 3 أيام',
        rating: 10,
        comment: 'موقع الفندق ممتاز جداً والدخول للحرم مباشر ومريح كلياً مع كبار السن، والرؤية الخارجية للشعائر والمصلين من النافذة مبهرة.',
        travelerType: 'عائلات'
      }
    ]
  },
  {
    id: 'dar-al-taqwa-madinah',
    name: 'فندق دار التقوى المدينة المنورة',
    nameEn: 'Dar Al Taqwa Hotel Madinah',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    region: 'منطقة المدينة',
    address: 'شارع الملك فهد، مقابل باب النساء للمسجد النبوي',
    lat: 24.4682,
    lng: 39.61,
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 2150,
    reviewText: 'استثنائي',
    basePricePerNight: 1100,
    discountedPrice: 980,
    isFeatured: true,
    featuredTag: 'خطوات معدودة عن ساحة المسجد النبوي',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'من أرقى فنادق المنطقة المركزية الشمالية بالمدينة المنورة، يبعد بضع خطوات عن باب المسجد النبوي الشريف ويتميز بأجواء هادئة وخدمة راقية.',
    distanceToLandmark: 'مقابل ساحة الحرم النبوي مباشرة (باب فهد)',
    landmarkName: 'المسجد النبوي',
    amenities: [
      'مقابل باب المسجد النبوي',
      'إفطار بوفيه مع أصناف مدينية عريقة',
      'واي فاي مجاني',
      'خدمة ضيافة الشاي الترحيبية',
      'خدمة الغرف 24 ساعة'
    ],
    roomTypes: [
      {
        id: 'taqwa-haram-view',
        name: 'غرفة تنفيذية بإطلالة على المسجد النبوي والقبة الخضراء',
        description: 'تصميم راقٍ بألوان دافئة مع إطلالة هادئة ومباشرة على ساحات المسجد النبوي.',
        pricePerNight: 1250,
        maxGuests: 2,
        bedType: 'سرير كينج إضافي',
        areaSqm: 38,
        perks: ['إفطار بوفيه فاخر', 'مشروبات ترحيبية مجانية'],
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'shaza-madinah',
    name: 'فندق شذا المدينة المنورة',
    nameEn: 'Shaza Madinah',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    region: 'منطقة المدينة',
    address: 'المنطقة المركزية الشمالية، المدينة المنورة',
    lat: 24.4695,
    lng: 39.608,
    starRating: 5,
    reviewScore: 9.3,
    reviewCount: 1740,
    reviewText: 'ممتاز جداً',
    basePricePerNight: 890,
    discountedPrice: 780,
    isFeatured: false,
    featuredTag: 'تصميم أندلسي فاخر وأجواء هادئة',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'يعكس فندق شذا روح طريق الحرير والشرق بحفاوة ضيافة عربية أصيلة، وديكورات مذهبة مع إطلالة على ساحة الحرم النبوي الشريف.',
    distanceToLandmark: '150 متر عن المسجد النبوي',
    landmarkName: 'المسجد النبوي',
    amenities: [
      'تصميم شرقي وأندلسي',
      'مطعم شاليمار الراقي',
      'نادي أطفال شذا',
      'واي فاي مجاني',
      'خدمات الكونسيرج'
    ],
    roomTypes: [
      {
        id: 'shaza-deluxe',
        name: 'غرفة ديلوكس شذا',
        description: 'غرفة أنيقة بإضاءة هادئة وأثاث خشبي فاخر مزودة بأحدث وسائل الراحة.',
        pricePerNight: 780,
        maxGuests: 3,
        bedType: 'سريران منفصلان كبيران',
        areaSqm: 36,
        perks: ['إفطار بوفيه متكامل', 'إلغاء مجاني'],
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'faisaliah-riyadh',
    name: 'فندق الفايصلية الرياض',
    nameEn: 'Al Faisaliah Hotel, A Mandarin Oriental Hotel',
    city: 'الرياض',
    cityEn: 'Riyadh',
    region: 'منطقة الرياض',
    address: 'طريق الملك فهد، حي العليا، الرياض',
    lat: 24.69,
    lng: 46.6853,
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 2980,
    reviewText: 'استثنائي',
    basePricePerNight: 1650,
    discountedPrice: 1480,
    isFeatured: true,
    featuredTag: 'قلب العاصمة ومطعم الكرة الزجاجية الشاهق',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'رمز الفخامة والضيافة العريقة في الرياض بقيادة ماندارين أورينتال. يضم مطعم البلورة الشهير وسبا حائز على جوائز عالمية وموقع حيوي في مركز العليا.',
    distanceToLandmark: '10 دقائق عن بوليفارد الرياض سيتي',
    landmarkName: 'برج الفايصلية وحي العليا',
    amenities: [
      'خدمة بتلر شخصي',
      'مطعم البلورة الفاخر',
      'مسبح داخلي مغلق',
      'سبا ماندارين أورينتال',
      'قريب من أرقى المجمعات التجارية',
      'مواقف مجانية مع خدمة صف السيارات'
    ],
    roomTypes: [
      {
        id: 'faisaliah-deluxe-room',
        name: 'غرفة ديلوكس كينج الفايصلية',
        description: 'غرفة تنفيذي واسعة بأثاث عصري فاخر، حمام رخامي مستقل، وإطلالة على أفق مدينة الرياض.',
        pricePerNight: 1480,
        maxGuests: 2,
        bedType: 'سرير كينج فاخر',
        areaSqm: 50,
        perks: ['إفطار فاخر', 'خدمة الكي المجاني لقطعتين', 'واي فاي سريع'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'four-seasons-riyadh',
    name: 'فندق فورسيزونز الرياض في برج المملكة',
    nameEn: 'Four Seasons Hotel Riyadh at Kingdom Centre',
    city: 'الرياض',
    cityEn: 'Riyadh',
    region: 'منطقة الرياض',
    address: 'برج المملكة، طريق الملك فهد، الرياض',
    lat: 24.7114,
    lng: 46.6745,
    starRating: 5,
    reviewScore: 9.7,
    reviewCount: 3100,
    reviewText: 'قمة الفخامة',
    basePricePerNight: 2200,
    discountedPrice: 1980,
    isFeatured: true,
    featuredTag: 'داخل برج المملكة مع الوصول لجسر المشاهدة',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'يقع الفندق داخل برج المملكة الشهير مع إمكانية الوصول إلى مركز التسوق الملكي المكون من 3 طوابق وجسر المشاهدة البانورامي المعلق.',
    distanceToLandmark: 'قلب طريق الملك فهد',
    landmarkName: 'برج المملكة',
    amenities: [
      'مسبح خارجي فاخر',
      'ملعب تنس وملاعب مكشوفة',
      'وصول مباشر لمركز المملكة للتسوق',
      'مطاعم راقية بإشراف طهاة عالميين',
      'مركز لياقة بدنية حديث 24/7'
    ],
    roomTypes: [
      {
        id: 'fs-premiere-suite',
        name: 'جناح فورسيزونز المطور بإطلالة بانورامية',
        description: 'جناح فسيح في الأدوار العليا مع إطلالة ساحرة على أضواء العاصمة ليلاً.',
        pricePerNight: 2350,
        maxGuests: 3,
        bedType: 'سرير فورسيزونز الخاص',
        areaSqm: 68,
        perks: ['تذاكر مجانية لجسر مشاهدة برج المملكة', 'إفطار بوفيه عالمي'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'rosewood-jeddah',
    name: 'فندق روزوود جدة',
    nameEn: 'Rosewood Jeddah',
    city: 'جدة',
    cityEn: 'Jeddah',
    region: 'منطقة مكة',
    address: 'شارع الكورنيش، حي الشاطئ، جدة',
    lat: 21.583,
    lng: 39.108,
    starRating: 5,
    reviewScore: 9.6,
    reviewCount: 2450,
    reviewText: 'استثنائي على البحر',
    basePricePerNight: 1550,
    discountedPrice: 1390,
    isFeatured: true,
    featuredTag: 'مسبح بانورامي على السطح يطل على البحر الأحمر',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'فندق فاخر على الكورنيش الشمالي لجدة يجمع بين الأناقة الحديثة والإطلالات الخلابة على غروب الشمس فوق مياه البحر الأحمر.',
    distanceToLandmark: 'مباشرة على كورنيش جدة الشمالي',
    landmarkName: 'كورنيش جدة وواجهة جدة البحرية',
    amenities: [
      'مسبح السطح البانورامي',
      'إطلالة بحرية مباشرة 100%',
      'خدمة البتلر الشخصي',
      'مطعم الهابانو والنادي الصحي',
      'قريب من رد سي مول'
    ],
    roomTypes: [
      {
        id: 'rosewood-sea-view',
        name: 'غرفة ديلوكس مطلة بالكامل على البحر الأحمر',
        description: 'شباك زجاجي ممتد من السقف للأرضية يتيح لك رؤية الأمواج وغروب الشمس من سريرك.',
        pricePerNight: 1390,
        maxGuests: 2,
        bedType: 'سرير كينج فاخر',
        areaSqm: 48,
        perks: ['إفطار فاخر يطل على البحر', 'خدمة صف السيارات مجاناً'],
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'assila-jeddah',
    name: 'فندق أصيلة جدة (مجموعة لوكسري)',
    nameEn: 'Assila Hotel, a Luxury Collection Hotel, Jeddah',
    city: 'جدة',
    cityEn: 'Jeddah',
    region: 'منطقة مكة',
    address: 'طريق الأمير محمد بن عبدالعزيز (التحلية)، جدة',
    lat: 21.554,
    lng: 39.162,
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 1620,
    reviewText: 'ممتاز جداً',
    basePricePerNight: 980,
    discountedPrice: 860,
    isFeatured: false,
    featuredTag: 'في قلب شارع التحلية الشهير للتسوق',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'أول فندق مصمّم بأعمال فنية سعودية أصيلة تحكي قصة الثقافة والفن في قلب شارع التحلية النابض بالحياة.',
    distanceToLandmark: 'قلب شارع التحلية',
    landmarkName: 'شارع التحلية والمراكز التجارية',
    amenities: [
      'معرض فني سعودي داخلي',
      'مسبح سباحة مكشوف',
      'مطعم أرجنتيني إيطالي فاخر',
      'سبا ومساج متكامل'
    ],
    roomTypes: [
      {
        id: 'assila-deluxe',
        name: 'غرفة أصيلة الفاخرة',
        description: 'تصميم فني راقٍ مزود بلوحات جدارية سعودية أصلية وأثاث إيطالي مريح.',
        pricePerNight: 860,
        maxGuests: 2,
        bedType: 'سرير كينج',
        areaSqm: 44,
        perks: ['إفطار بوفيه شامل', 'واي فاي مجاني'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'habitas-alula',
    name: 'منتجع هابيتاس العلا',
    nameEn: 'Our Habitas AlUla',
    city: 'العلا',
    cityEn: 'AlUla',
    region: 'منطقة المدينة',
    address: 'وادي أشار، العلا',
    lat: 26.702,
    lng: 37.957,
    starRating: 5,
    reviewScore: 9.9,
    reviewCount: 940,
    reviewText: 'تجربة ساحرة استثنائية',
    basePricePerNight: 2800,
    discountedPrice: 2450,
    isFeatured: true,
    featuredTag: 'في قلب وادي أشار وبين الجبال الرملية',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'منتجع بيئي فاخر مصمم بانسجام تام مع جبال العلا الصخرية. يضم فلل خشبية فاخرة ومسبحاً يتوسط الجبال وجلسات يوجا وتأمل تحت النجوم.',
    distanceToLandmark: '10 دقائق عن مسرح مرايا وقريب من الحجر',
    landmarkName: 'وادي أشار ومسرح مرايا',
    amenities: [
      'فلل صحراوية خاصة',
      'مسبح بين الجبال الصخرية',
      'جلسات يوجا وتأمل مجانية',
      'مطعم تاما العضوي',
      'جولات رصد النجوم ليلاً',
      'دراجات كهربائية للضيوف'
    ],
    roomTypes: [
      {
        id: 'habitas-canyon-villa',
        name: 'فيلا الوادي الصخري (Canyon Villa)',
        description: 'فيلا خشبية صديقة للبيئة تحيط بها الصخور الرملية مع شرفة خاصة لمشاهدة شروق وغروب الشمس.',
        pricePerNight: 2450,
        maxGuests: 2,
        bedType: 'سرير كينج طبيعي',
        areaSqm: 55,
        perks: ['إفطار عضوي كامل', 'جلسة تأمل مجانية', 'جلسة رصد النجوم مع مرشد'],
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'kempinski-khobar',
    name: 'فندق كيمبينسكي العثمان الخبر',
    nameEn: 'Grand Hyatt & Kempinski Al Othman Hotel Al Khobar',
    city: 'الخبر والدمام',
    cityEn: 'Al Khobar',
    region: 'المنطقة الشرقية',
    address: 'طريق الملك سعود، الخبر',
    lat: 26.294,
    lng: 50.2171,
    starRating: 5,
    reviewScore: 9.3,
    reviewCount: 1820,
    reviewText: 'ممتاز جداً',
    basePricePerNight: 750,
    discountedPrice: 680,
    isFeatured: false,
    featuredTag: 'فخامة أوروبية في قلب الخبر',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'يقدم الفندق تجربة ضيافة أوروبية فاخرة في موقع استراتيجي بين الخبر والدمام مع مطاعم فاخرة وسبا متكامل.',
    distanceToLandmark: '8 دقائق عن كورنيش الخبر',
    landmarkName: 'كورنيش الخبر والظهران',
    amenities: [
      'مسبح داخلي دافئ',
      'سبا وساونا متكاملة',
      'مطعم إيطالي ومقهى ديوان',
      'مركز أعمال متطور'
    ],
    roomTypes: [
      {
        id: 'kempinski-deluxe',
        name: 'غرفة فاخرة كينج',
        description: 'غرفة أنيقة بأثاث أوروبي كلاسيكي وحمام رخامي مزود بدش استوائي.',
        pricePerNight: 680,
        maxGuests: 2,
        bedType: 'سرير كينج',
        areaSqm: 42,
        perks: ['إفطار بوفيه فاخر', 'مواقف مجانية'],
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'al-foursan-abha',
    name: 'منتجع الفرسان الجبلي أبها',
    nameEn: 'Abha Mountain Foursan Resort',
    city: 'أبها وعسير',
    cityEn: 'Abha',
    region: 'منطقة عسير',
    address: 'طريق السودة السريع، أبها',
    lat: 18.212,
    lng: 42.502,
    starRating: 4,
    reviewScore: 9.2,
    reviewCount: 1100,
    reviewText: 'رائع جداً',
    basePricePerNight: 620,
    discountedPrice: 550,
    isFeatured: false,
    featuredTag: 'إطلالات ضبابية على جبال عسير الخضراء',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'منتجع جبلي يقع على طريق السودة بين أشجار العرعر والغيوم المتناثرة، يمنحك تجربة استرخاء هادئة وطبيعة بكر في الجنوب.',
    distanceToLandmark: '15 دقيقة عن قمة جبل السودة',
    landmarkName: 'السودة ومتنزه السحاب',
    amenities: [
      'إطلالات جبلية وتهامة',
      'جلسات خارجية وموقد نار',
      'مطعم أكلات شعبية وجنوبية',
      'حدائق ومساحات خضراء'
    ],
    roomTypes: [
      {
        id: 'abha-mountain-suite',
        name: 'شاليه جبل بمنتزه السودة مع مدفأة',
        description: 'شاليه من طابقين بإطلالة كاشفة على الوديان والغيوم مع مدفأة خشبية دافئة.',
        pricePerNight: 550,
        maxGuests: 4,
        bedType: 'سرير كينج + سريران منفصلان',
        areaSqm: 65,
        perks: ['إفطار عسيري محلي', 'حطب مجاني للمدفأة ليلاً'],
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const AMENITIES_LIST = [
  'إطلالة مباشرة على الكعبة',
  'قريب من الحرم النبوي',
  'إطلالة بحرية',
  'مسبح',
  'بوفيه إفطار',
  'مناسب للعائلات',
  'مواقف مجانية',
  'واي فاي مجاني',
  'خدمة الغرف 24/7',
  'نادي صحي وسبا',
  'منتجع صحراوي',
  'خادم شخصي'
];
