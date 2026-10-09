const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPageFormModal.tsx', 'utf8');

const updatedTemplates = `
const TEMPLATES = [
  // --- Full Page Templates ---
  {
    category: 'قوالب صفحات كاملة',
    items: [
      {
        id: 'page-modern',
        name: 'تصميم عصري (Modern)',
        icon: <LayoutTemplate className="w-5 h-5" />,
        content: \\\`
<div class="space-y-16">
  <!-- Modern Hero -->
  <div class="py-24 text-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
    <div class="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full translate-y-1/2 opacity-50"></div>
    <div class="relative z-10 px-4">
      <span class="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold tracking-wider mb-6 inline-block">عصري ومبتكر</span>
      <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">عنوان رئيسي عصري هنا</h1>
      <p class="text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">نص وصفي يوضح فكرة الموقع أو الخدمة التي تقدمها بتصميم عصري وأنيق يجذب الانتباه.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="px-8 py-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 hover:scale-105 transition-all shadow-xl shadow-amber-500/20">ابدأ الآن</button>
        <button class="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all border border-slate-700">اكتشف المزيد</button>
      </div>
    </div>
  </div>

  <!-- Modern Features Grid -->
  <div>
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-black text-white mb-4">مميزاتنا</h2>
      <p class="text-slate-400 text-lg">ما الذي يجعلنا الخيار الأفضل لك؟</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-amber-500/50 transition-colors group">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">🚀</div>
        <h3 class="text-xl font-bold text-white mb-3">سرعة فائقة</h3>
        <p class="text-slate-400 leading-relaxed">أداء استثنائي يضمن تجربة مستخدم سلسة وسريعة في جميع الأوقات.</p>
      </div>
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-colors group">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">💎</div>
        <h3 class="text-xl font-bold text-white mb-3">تصميم أنيق</h3>
        <p class="text-slate-400 leading-relaxed">واجهات عصرية مصممة بعناية لتعكس هوية علامتك التجارية بوضوح.</p>
      </div>
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-colors group">
        <div class="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">🔒</div>
        <h3 class="text-xl font-bold text-white mb-3">حماية تامة</h3>
        <p class="text-slate-400 leading-relaxed">أعلى معايير الأمان لحماية بياناتك ومعلومات عملائك بشكل دائم.</p>
      </div>
    </div>
  </div>

  <!-- Modern Image & Text -->
  <div class="flex flex-col md:flex-row items-center gap-12 bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800">
    <div class="flex-1 space-y-6">
      <h2 class="text-3xl md:text-4xl font-black text-white leading-tight">حلول مبتكرة لعملك</h2>
      <p class="text-slate-300 text-lg leading-relaxed">نقدم لك أحدث التقنيات لتحسين إنتاجيتك وتطوير أعمالك بطريقة ذكية وعصرية.</p>
      <ul class="space-y-4 text-slate-300">
        <li class="flex items-center gap-3"><span class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs">✓</span> ميزة تنافسية قوية</li>
        <li class="flex items-center gap-3"><span class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs">✓</span> دعم فني مستمر</li>
      </ul>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl blur-2xl opacity-20 -z-10"></div>
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="صورة عصرية" class="rounded-3xl shadow-2xl border border-slate-700/50" />
    </div>
  </div>
</div>\\\`
      },
      {
        id: 'page-classic',
        name: 'تصميم كلاسيكي (Classic)',
        icon: <LayoutTemplate className="w-5 h-5" />,
        content: \\\`
<div class="space-y-12">
  <!-- Classic Hero -->
  <div class="py-20 text-center border-b border-slate-800">
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">العنوان الرئيسي للموقع</h1>
    <hr class="w-24 border-amber-500 mx-auto my-6 border-2" />
    <p class="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">نقدم خدمات متميزة بخبرة طويلة وموثوقية عالية. هذا النص هو مثال لنص كلاسيكي يعبر عن الأصالة.</p>
    <button class="px-8 py-3 bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors uppercase tracking-widest text-sm">تواصل معنا</button>
  </div>

  <!-- Classic Text Section -->
  <div class="max-w-4xl mx-auto py-8">
    <h2 class="text-3xl font-bold text-white mb-6 text-center font-serif">عن الشركة</h2>
    <div class="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose text-justify">
      <p>نحن شركة رائدة في مجال تقديم الخدمات المميزة، نسعى دائماً لتلبية احتياجات عملائنا بأعلى معايير الجودة والمصداقية. تأسست شركتنا على مبادئ الثقة والشفافية، ونحن نفخر بتاريحنا الحافل بالنجاحات.</p>
      <p>فريق العمل لدينا يضم نخبة من الخبراء والمتخصصين الذين يعملون بتفانٍ لضمان رضاكم التام عن كافة الخدمات التي نقدمها.</p>
    </div>
  </div>

  <!-- Classic Services Grid -->
  <div class="py-12 bg-slate-900/50 rounded-lg p-8 border border-slate-800">
    <h2 class="text-3xl font-bold text-white mb-10 text-center font-serif">خدماتنا الرئيسية</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center shrink-0 border border-slate-700">1</div>
        <div>
          <h3 class="text-xl font-bold text-white mb-2">الاستشارات المتخصصة</h3>
          <p class="text-slate-400">نقدم استشارات دقيقة وموثوقة لمساعدتكم في اتخاذ القرارات الصائبة.</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center shrink-0 border border-slate-700">2</div>
        <div>
          <h3 class="text-xl font-bold text-white mb-2">التنفيذ والمتابعة</h3>
          <p class="text-slate-400">نقوم بتنفيذ المشاريع بدقة عالية مع متابعة مستمرة لضمان الجودة.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Classic Image Gallery -->
  <div class="py-8 text-center">
    <h2 class="text-3xl font-bold text-white mb-8 font-serif">معرض الصور</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=400&q=80" class="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
      <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80" class="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" class="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
      <img src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=400&q=80" class="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
    </div>
  </div>
</div>\\\`
      }
    ]
  },
`;

code = code.replace("const TEMPLATES = [", updatedTemplates);

fs.writeFileSync('src/components/AdminPageFormModal.tsx', code);
