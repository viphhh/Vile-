import sys

content = """import React, { useState, useEffect } from 'react';
import { X, Check, FileText, LayoutTemplate, Type, Image as ImageIcon, Grid, Phone, Code } from 'lucide-react';
import { SitePage } from '../types';

interface AdminPageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: SitePage) => void;
  pageToEdit: SitePage | null;
}

export const AdminPageFormModal: React.FC<AdminPageFormModalProps> = ({ isOpen, onClose, onSave, pageToEdit }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [type, setType] = useState<'أساسية' | 'فرعية' | 'قانونية'>('فرعية');
  const [templateType, setTemplateType] = useState<'custom' | 'modern' | 'classic'>('custom');
  
  // Modern Template State
  const [modernData, setModernData] = useState({
    heroTitle: 'عنوان رئيسي عصري هنا',
    heroSubtitle: 'نص وصفي يوضح فكرة الموقع أو الخدمة التي تقدمها بتصميم عصري وأنيق يجذب الانتباه.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    heroButton: 'ابدأ الآن',
    feature1Title: 'سرعة فائقة',
    feature1Desc: 'أداء استثنائي يضمن تجربة مستخدم سلسة وسريعة في جميع الأوقات.',
    feature1Icon: '🚀',
    feature2Title: 'تصميم أنيق',
    feature2Desc: 'واجهات عصرية مصممة بعناية لتعكس هوية علامتك التجارية بوضوح.',
    feature2Icon: '💎',
    feature3Title: 'حماية تامة',
    feature3Desc: 'أعلى معايير الأمان لحماية بياناتك ومعلومات عملائك بشكل دائم.',
    feature3Icon: '🔒'
  });

  // Classic Template State
  const [classicData, setClassicData] = useState({
    mainTitle: 'العنوان الرئيسي للموقع',
    mainDesc: 'نقدم خدمات متميزة بخبرة طويلة وموثوقية عالية. هذا النص هو مثال لنص كلاسيكي يعبر عن الأصالة.',
    aboutTitle: 'عن الشركة',
    aboutText: 'نحن شركة رائدة في مجال تقديم الخدمات المميزة، نسعى دائماً لتلبية احتياجات عملائنا بأعلى معايير الجودة والمصداقية.\\n\\nفريق العمل لدينا يضم نخبة من الخبراء والمتخصصين الذين يعملون بتفانٍ لضمان رضاكم التام عن كافة الخدمات التي نقدمها.',
    service1Title: 'الاستشارات المتخصصة',
    service1Desc: 'نقدم استشارات دقيقة وموثوقة لمساعدتكم في اتخاذ القرارات الصائبة.',
    service2Title: 'التنفيذ والمتابعة',
    service2Desc: 'نقوم بتنفيذ المشاريع بدقة عالية مع متابعة مستمرة لضمان الجودة.'
  });

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title);
      setSlug(pageToEdit.slug);
      setContent(pageToEdit.content);
      setStatus(pageToEdit.status);
      setType(pageToEdit.type);
      setTemplateType(pageToEdit.templateType || 'custom');
      
      if (pageToEdit.templateType === 'modern' && pageToEdit.templateData) {
        setModernData(pageToEdit.templateData);
      } else if (pageToEdit.templateType === 'classic' && pageToEdit.templateData) {
        setClassicData(pageToEdit.templateData);
      }
    } else {
      setTitle('');
      setSlug('');
      setContent('');
      setStatus('draft');
      setType('فرعية');
      setTemplateType('custom');
    }
  }, [pageToEdit, isOpen]);

  // Generate HTML when modern/classic data changes
  useEffect(() => {
    if (templateType === 'modern') {
      const generatedHtml = \`<div class="space-y-16">
  <div class="py-24 text-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
    <div class="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full translate-y-1/2 opacity-50"></div>
    <div class="relative z-10 px-4">
      <span class="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold tracking-wider mb-6 inline-block">عصري ومبتكر</span>
      <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">\${modernData.heroTitle}</h1>
      <p class="text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">\${modernData.heroSubtitle}</p>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="px-8 py-4 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 hover:scale-105 transition-all shadow-xl shadow-amber-500/20">\${modernData.heroButton}</button>
      </div>
    </div>
  </div>

  <div>
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-black text-white mb-4">مميزاتنا</h2>
      <p class="text-slate-400 text-lg">ما الذي يجعلنا الخيار الأفضل لك؟</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-amber-500/50 transition-colors group">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">\${modernData.feature1Icon}</div>
        <h3 class="text-xl font-bold text-white mb-3">\${modernData.feature1Title}</h3>
        <p class="text-slate-400 leading-relaxed">\${modernData.feature1Desc}</p>
      </div>
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-colors group">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">\${modernData.feature2Icon}</div>
        <h3 class="text-xl font-bold text-white mb-3">\${modernData.feature2Title}</h3>
        <p class="text-slate-400 leading-relaxed">\${modernData.feature2Desc}</p>
      </div>
      <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-colors group">
        <div class="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">\${modernData.feature3Icon}</div>
        <h3 class="text-xl font-bold text-white mb-3">\${modernData.feature3Title}</h3>
        <p class="text-slate-400 leading-relaxed">\${modernData.feature3Desc}</p>
      </div>
    </div>
  </div>

  <div class="flex flex-col md:flex-row items-center gap-12 bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800">
    <div class="flex-1 space-y-6">
      <h2 class="text-3xl md:text-4xl font-black text-white leading-tight">حلول مبتكرة لعملك</h2>
      <p class="text-slate-300 text-lg leading-relaxed">نقدم لك أحدث التقنيات لتحسين إنتاجيتك وتطوير أعمالك بطريقة ذكية وعصرية.</p>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl blur-2xl opacity-20 -z-10"></div>
      <img src="\${modernData.heroImage}" alt="صورة عصرية" class="rounded-3xl shadow-2xl border border-slate-700/50" />
    </div>
  </div>
</div>\`;
      setContent(generatedHtml);
    } else if (templateType === 'classic') {
      const formattedAboutText = classicData.aboutText.split('\\n').map(p => \`<p>\${p}</p>\`).join('');
      const generatedHtml = \`<div class="space-y-12">
  <div class="py-20 text-center border-b border-slate-800">
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">\${classicData.mainTitle}</h1>
    <hr class="w-24 border-amber-500 mx-auto my-6 border-2" />
    <p class="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">\${classicData.mainDesc}</p>
  </div>

  <div class="max-w-4xl mx-auto py-8">
    <h2 class="text-3xl font-bold text-white mb-6 text-center font-serif">\${classicData.aboutTitle}</h2>
    <div class="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose text-justify">
      \${formattedAboutText}
    </div>
  </div>

  <div class="py-12 bg-slate-900/50 rounded-lg p-8 border border-slate-800">
    <h2 class="text-3xl font-bold text-white mb-10 text-center font-serif">خدماتنا الرئيسية</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center shrink-0 border border-slate-700">1</div>
        <div>
          <h3 class="text-xl font-bold text-white mb-2">\${classicData.service1Title}</h3>
          <p class="text-slate-400">\${classicData.service1Desc}</p>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center shrink-0 border border-slate-700">2</div>
        <div>
          <h3 class="text-xl font-bold text-white mb-2">\${classicData.service2Title}</h3>
          <p class="text-slate-400">\${classicData.service2Desc}</p>
        </div>
      </div>
    </div>
  </div>
</div>\`;
      setContent(generatedHtml);
    }
  }, [templateType, modernData, classicData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage: SitePage = {
      id: pageToEdit ? pageToEdit.id : \`page-\${Date.now()}\`,
      title,
      slug,
      content,
      status,
      type,
      templateType,
      templateData: templateType === 'modern' ? modernData : templateType === 'classic' ? classicData : null,
      lastEdited: new Date().toISOString().split('T')[0]
    };
    onSave(newPage);
  };

  const handleModernChange = (field: keyof typeof modernData, value: string) => {
    setModernData(prev => ({ ...prev, [field]: value }));
  };

  const handleClassicChange = (field: keyof typeof classicData, value: string) => {
    setClassicData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{pageToEdit ? 'تعديل الصفحة' : 'إضافة صفحة جديدة'}</h2>
              <p className="text-xs text-slate-400">اختر القالب وقم بتعديل المحتوى بكل سهولة.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="page-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">عنوان الصفحة</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                  placeholder="مثال: من نحن"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">رابط الصفحة (Slug)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600 text-left"
                  dir="ltr"
                  placeholder="مثال: /about-us"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">نوع الصفحة</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                >
                  <option value="أساسية">أساسية</option>
                  <option value="فرعية">فرعية</option>
                  <option value="قانونية">قانونية</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">حالة النشر</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                >
                  <option value="published">منشورة</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <h3 className="text-lg font-black text-white mb-4">اختر قالب التصميم</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTemplateType('modern')}
                  className={\`p-4 rounded-2xl border-2 text-right transition-all \${templateType === 'modern' ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}\`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={\`w-10 h-10 rounded-xl flex items-center justify-center \${templateType === 'modern' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}\`}>
                      <LayoutTemplate className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">تصميم عصري</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">يتميز بألوان متدرجة، صور كبيرة عالية الدقة، وتأثيرات بصرية جذابة.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateType('classic')}
                  className={\`p-4 rounded-2xl border-2 text-right transition-all \${templateType === 'classic' ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}\`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={\`w-10 h-10 rounded-xl flex items-center justify-center \${templateType === 'classic' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}\`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">تصميم كلاسيكي</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">يركز على النصوص الواضحة، التنسيق التقليدي، ويناسب الصفحات التعريفية والمقالات.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateType('custom')}
                  className={\`p-4 rounded-2xl border-2 text-right transition-all \${templateType === 'custom' ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}\`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={\`w-10 h-10 rounded-xl flex items-center justify-center \${templateType === 'custom' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}\`}>
                      <Code className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">مخصص (HTML)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">استخدم كود HTML مباشر لكتابة التصميم الخاص بك من الصفر.</p>
                </button>
              </div>
            </div>

            {/* Dynamic Template Fields */}
            {templateType === 'modern' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 animate-in fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-amber-500" /> محتوى التصميم العصري
                </h3>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2">القسم الرئيسي (Hero)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">العنوان الرئيسي</label>
                      <input type="text" value={modernData.heroTitle} onChange={e => handleModernChange('heroTitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">نص الزر</label>
                      <input type="text" value={modernData.heroButton} onChange={e => handleModernChange('heroButton', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">الوصف الفرعي</label>
                      <textarea rows={2} value={modernData.heroSubtitle} onChange={e => handleModernChange('heroSubtitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">رابط صورة عالية الدقة (قسم الصورة والنص)</label>
                      <div className="flex gap-2">
                        <input type="text" value={modernData.heroImage} onChange={e => handleModernChange('heroImage', e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white dir-ltr text-left" />
                        {modernData.heroImage && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                            <img src={modernData.heroImage} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2">المميزات (3 بطاقات)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <input type="text" value={modernData.feature1Icon} onChange={e => handleModernChange('feature1Icon', e.target.value)} className="w-12 h-12 text-center text-xl bg-slate-900 border border-slate-700 rounded-xl" placeholder="أيقونة" />
                      <input type="text" value={modernData.feature1Title} onChange={e => handleModernChange('feature1Title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="العنوان" />
                      <textarea rows={3} value={modernData.feature1Desc} onChange={e => handleModernChange('feature1Desc', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="الوصف" />
                    </div>
                    {/* Feature 2 */}
                    <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <input type="text" value={modernData.feature2Icon} onChange={e => handleModernChange('feature2Icon', e.target.value)} className="w-12 h-12 text-center text-xl bg-slate-900 border border-slate-700 rounded-xl" placeholder="أيقونة" />
                      <input type="text" value={modernData.feature2Title} onChange={e => handleModernChange('feature2Title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="العنوان" />
                      <textarea rows={3} value={modernData.feature2Desc} onChange={e => handleModernChange('feature2Desc', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="الوصف" />
                    </div>
                    {/* Feature 3 */}
                    <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <input type="text" value={modernData.feature3Icon} onChange={e => handleModernChange('feature3Icon', e.target.value)} className="w-12 h-12 text-center text-xl bg-slate-900 border border-slate-700 rounded-xl" placeholder="أيقونة" />
                      <input type="text" value={modernData.feature3Title} onChange={e => handleModernChange('feature3Title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="العنوان" />
                      <textarea rows={3} value={modernData.feature3Desc} onChange={e => handleModernChange('feature3Desc', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="الوصف" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {templateType === 'classic' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 animate-in fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> محتوى التصميم الكلاسيكي
                </h3>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2">المقدمة</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">العنوان الرئيسي</label>
                      <input type="text" value={classicData.mainTitle} onChange={e => handleClassicChange('mainTitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-serif" />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">وصف قصير</label>
                      <textarea rows={2} value={classicData.mainDesc} onChange={e => handleClassicChange('mainDesc', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2">النص الطويل (مثل: من نحن، الشروط، سياسة الخصوصية)</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">عنوان القسم</label>
                      <input type="text" value={classicData.aboutTitle} onChange={e => handleClassicChange('aboutTitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-serif" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">المحتوى النصي (يمكنك استخدام زر الإدخال Enter لفصل الفقرات)</label>
                      <textarea rows={6} value={classicData.aboutText} onChange={e => handleClassicChange('aboutText', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2">الخدمات أو القوائم</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <label className="text-xs font-bold text-amber-500">العنصر الأول</label>
                      <input type="text" value={classicData.service1Title} onChange={e => handleClassicChange('service1Title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-serif" placeholder="عنوان العنصر" />
                      <textarea rows={2} value={classicData.service1Desc} onChange={e => handleClassicChange('service1Desc', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="وصف العنصر" />
                    </div>
                    <div className="space-y-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <label className="text-xs font-bold text-amber-500">العنصر الثاني</label>
                      <input type="text" value={classicData.service2Title} onChange={e => handleClassicChange('service2Title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-serif" placeholder="عنوان العنصر" />
                      <textarea rows={2} value={classicData.service2Desc} onChange={e => handleClassicChange('service2Desc', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="وصف العنصر" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {templateType === 'custom' && (
              <div className="space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">محتوى الصفحة (HTML)</label>
                  <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md font-bold">المحرر المتقدم</span>
                </div>
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600 resize-y font-mono dir-ltr text-left"
                  placeholder="اكتب كود HTML هنا..."
                />
              </div>
            )}

            {/* Live Preview Toggle */}
            <div className="mt-4 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2"><ImageIcon className="w-4 h-4 text-amber-500" /> معاينة مباشرة للصفحة</span>
              </div>
              <div 
                className="p-6 prose prose-invert max-w-none preview-container overflow-hidden"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-800 bg-slate-950 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="page-form"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الصفحة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
"""

with open('src/components/AdminPageFormModal.tsx', 'w') as f:
    f.write(content)
