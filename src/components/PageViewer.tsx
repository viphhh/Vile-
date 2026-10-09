import React from 'react';
import { SitePage } from '../types';
import { ArrowRight, FileText } from 'lucide-react';

interface PageViewerProps {
  page?: SitePage;
  onBack: () => void;
}

export const PageViewer: React.FC<PageViewerProps> = ({ page, onBack }) => {
  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black mb-4">عذراً، الصفحة غير موجودة</h2>
        <button onClick={onBack} className="text-amber-500 font-bold hover:underline">العودة للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold"
      >
        <ArrowRight className="w-4 h-4" />
        العودة
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white">{page.title}</h1>
            <p className="text-sm text-slate-400 mt-2">
              آخر تحديث: {page.lastEdited} | {page.type}
            </p>
          </div>
        </div>
        
        <div 
          className="prose prose-invert prose-amber max-w-none text-slate-300 leading-relaxed font-medium"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};
