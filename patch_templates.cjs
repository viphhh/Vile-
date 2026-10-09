const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPageFormModal.tsx', 'utf8');

const updatedTemplates = `
const TEMPLATES = [
  // --- Layouts ---
  {
    category: 'التصميم والهيكل',
    items: [
      {
        id: 'hero',
        name: 'قسم رئيسي (Hero)',
        icon: <LayoutTemplate className="w-5 h-5" />,
        content: \`
<div class="py-20 text-center bg-slate-900 rounded-3xl mb-8 border border-slate-800">
  <h1 class="text-4xl md:text-6xl font-black text-white mb-6">عنوان رئيسي جذاب</h1>
  <p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">نص وصفي يوضح فكرة الموقع أو الخدمة التي تقدمها.</p>
  <button class="px-8 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400">ابدأ الآن</button>
</div>\`
      },
      {
        id: 'grid-2',
        name: 'عمودين (نص وصورة)',
        icon: <Grid className="w-5 h-5" />,
        content: \`
<div class="py-12 flex flex-col md:flex-row items-center gap-10">
  <div class="flex-1 space-y-4">
    <h2 class="text-3xl font-black text-white">نص توضيحي</h2>
    <p class="text-slate-300">أضف تفاصيل الخدمة أو المنتج هنا.</p>
  </div>
  <div class="flex-1">
    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="صورة" class="rounded-2xl shadow-xl w-full" />
  </div>
</div>\`
      }
    ]
  },
  // --- Texts ---
  {
    category: 'النصوص والعناوين',
    items: [
      {
        id: 'title',
        name: 'عنوان رئيسي',
        icon: <Type className="w-5 h-5" />,
        content: \`<h2 class="text-3xl md:text-4xl font-black text-white mb-4 text-center">عنوان القسم</h2>\`
      },
      {
        id: 'paragraph',
        name: 'فقرة نصية',
        icon: <FileText className="w-5 h-5" />,
        content: \`<p class="text-slate-300 leading-relaxed mb-6 text-lg">اكتب النص هنا بطريقة واضحة ومبسطة للزوار...</p>\`
      }
    ]
  },
  // --- Images ---
  {
    category: 'الصور والوسائط',
    items: [
      {
        id: 'image-full',
        name: 'صورة عرض كامل',
        icon: <ImageIcon className="w-5 h-5" />,
        content: \`<img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&w=1200&q=80" alt="صورة بانورامية" class="w-full rounded-3xl shadow-xl my-8 object-cover h-64 md:h-96" />\`
      },
      {
        id: 'image-grid',
        name: 'معرض صور (شبكة)',
        icon: <Grid className="w-5 h-5" />,
        content: \`
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
  <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" class="rounded-xl w-full h-40 object-cover" />
  <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" class="rounded-xl w-full h-40 object-cover" />
  <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&w=400&q=80" class="rounded-xl w-full h-40 object-cover hidden md:block" />
</div>\`
      }
    ]
  },
  // --- Icons ---
  {
    category: 'الأيقونات والمميزات',
    items: [
      {
        id: 'features-icons',
        name: 'بطاقات أيقونات',
        icon: <Grid className="w-5 h-5" />,
        content: \`
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 text-center">
  <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
    <div class="text-4xl mb-4">🌟</div>
    <h3 class="text-lg font-bold text-white mb-2">جودة عالية</h3>
    <p class="text-sm text-slate-400">نضمن لك أفضل الخدمات بجودة لا تضاهى.</p>
  </div>
  <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
    <div class="text-4xl mb-4">⏱️</div>
    <h3 class="text-lg font-bold text-white mb-2">سرعة الإنجاز</h3>
    <p class="text-sm text-slate-400">تنفيذ فوري لجميع طلباتك بمرونة عالية.</p>
  </div>
  <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
    <div class="text-4xl mb-4">🛡️</div>
    <h3 class="text-lg font-bold text-white mb-2">أمان وثقة</h3>
    <p class="text-sm text-slate-400">منصتنا موثوقة ومحمية بأحدث التقنيات.</p>
  </div>
</div>\`
      },
      {
        id: 'contact',
        name: 'أيقونات التواصل',
        icon: <Phone className="w-5 h-5" />,
        content: \`
<div class="flex flex-wrap justify-center gap-4 my-8">
  <a href="#" class="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors">
    <span class="text-xl">📞</span> <span class="font-bold">اتصل بنا</span>
  </a>
  <a href="#" class="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors">
    <span class="text-xl">📧</span> <span class="font-bold">راسلنا</span>
  </a>
  <a href="#" class="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors">
    <span class="text-xl">📍</span> <span class="font-bold">الموقع</span>
  </a>
</div>\`
      }
    ]
  }
];
`;

const regex = /const TEMPLATES = \[\s*\{[\s\S]*?\}\s*\];/m;
code = code.replace(regex, updatedTemplates);

// python to the rescue for replacing exactly what I want
fs.writeFileSync('src/components/AdminPageFormModal.tsx', code);
