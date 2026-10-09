import React, { useState } from 'react';
import { Building2, User, Mail, Lock, LogIn, UserPlus, X, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../services/firebaseService';

interface AuthScreenProps {
  onLogin: (user: { role: 'customer' | 'host'; name: string; email: string; id?: string; photoURL?: string }) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  isModal?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onLogin, 
  onClose,
  title,
  subtitle,
  isModal = false 
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'customer' | 'host'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleRoleChange = (newRole: 'customer' | 'host') => {
    setRole(newRole);
    if (newRole === 'host') {
      setEmail('p@gmail.com');
      setPassword('111');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      const appUser = await signInWithGoogle();
      if (appUser) {
        onLogin({
          role: appUser.role === 'admin' || appUser.role === 'host' ? 'host' : 'customer',
          name: appUser.name,
          email: appUser.email,
          id: appUser.id,
          photoURL: appUser.photoURL
        });
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthError('تعذر تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (isLogin || name)) {
      onLogin({ role, name: isLogin ? email.split('@')[0] : name, email });
    }
  };

  const content = (
    <div className={`w-full max-w-md bg-slate-900/95 backdrop-blur-xl py-7 px-5 sm:px-8 shadow-2xl rounded-3xl border border-slate-700/80 relative text-right dir-rtl ${
      isModal ? 'm-4 max-h-[90vh] overflow-y-auto' : ''
    }`}>
      
      {/* Optional Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 mb-3">
          <Building2 className="w-7 h-7 text-slate-950 font-bold" />
        </div>
        <h2 className="text-2xl font-black text-white">
          {title || 'ڤيلوسيتي (Velocity)'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {subtitle || 'بوابتك لأرقى تجارب الضيافة وحجز الفنادق في السعودية'}
        </p>
      </div>

      {/* Firebase Google Sign-In Hero Button */}
      <div className="mb-5 space-y-3">
        <button
          type="button"
          disabled={googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-xl shadow-white/10 active:scale-98 transition-all cursor-pointer border border-slate-200"
        >
          {googleLoading ? (
            <span className="flex items-center gap-2 text-slate-700">
              <span className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
              جاري تسجيل الدخول الآمن...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>تسجيل الدخول السريع عبر Google</span>
            </>
          )}
        </button>

        {authError && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">أو تسجيل الدخول التقليدي</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>
      </div>

      {/* Tabs Switcher: Login / Register */}
      <div className="flex p-1 bg-slate-950/80 rounded-2xl mb-5 border border-slate-800">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            isLogin 
              ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            !isLogin 
              ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          حساب جديد
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Role Selector */}
        <div className="flex gap-3 mb-2">
          <button
            type="button"
            onClick={() => handleRoleChange('customer')}
            className={`flex-1 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
              role === 'customer'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-bold text-xs">عميل / نزيل</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleRoleChange('host')}
            className={`flex-1 p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
              role === 'host'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-bold text-xs">مضيف / إدارة فندق</span>
          </button>
        </div>

        {role === 'host' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-center">
            <p className="text-[11px] text-amber-400 font-bold mb-0.5">بيانات الدخول معبأة مسبقاً للتجربة</p>
            <p className="text-[10px] text-slate-300 font-mono">p@gmail.com / 111</p>
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              الاسم الكامل
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pr-10 pl-3 py-2.5 border border-slate-700 rounded-xl bg-slate-950/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pr-10 pl-3 py-2.5 border border-slate-700 rounded-xl bg-slate-950/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            كلمة المرور
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pr-10 pl-3 py-2.5 border border-slate-700 rounded-xl bg-slate-950/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-black text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>إنشاء الحساب ومتابعة</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>بياناتك وحجوزاتك محمية ومحفوظة سحابياً عبر Firebase Firestore</span>
        </div>

      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 w-full flex justify-center">
        {content}
      </div>
    </div>
  );
};
