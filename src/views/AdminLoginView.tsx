import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  KeyRound,
  UserCheck,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const { currentRole, setRole, navigateTo, showToast } = useApp();
  
  const [email, setEmail] = useState('admin@a2zinfotech.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Determine admin level based on email
      const isSuper = email.toLowerCase().includes('super') || email.toLowerCase().includes('anil') || email.toLowerCase().includes('admin');
      const roleToSet = isSuper ? 'super_admin' : 'admin';
      
      setRole(roleToSet);
      showToast(`Welcome back! Authenticated as ${roleToSet.replace('_', ' ').toUpperCase()}`, 'success');
      navigateTo('admin-management');
    }, 600);
  };

  const handleQuickDemoLogin = (type: 'super_admin' | 'admin') => {
    setIsLoading(true);
    setErrorMessage('');
    
    if (type === 'super_admin') {
      setEmail('admin@a2zinfotech.com');
      setPassword('admin123');
    } else {
      setEmail('operations@a2zinfotech.com');
      setPassword('admin123');
    }

    setTimeout(() => {
      setIsLoading(false);
      setRole(type);
      showToast(`Logged in successfully as ${type === 'super_admin' ? 'Super Admin' : 'Admin'}`, 'success');
      navigateTo('admin-management');
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0F5FA] via-[#F8FAFC] to-[#EEF4FB] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-sky-200/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Navigation breadcrumb / return */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#004B87] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Homepage</span>
        </button>

        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure SSL Portal</span>
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-300/40 border border-slate-200/90 overflow-hidden relative">
        {/* Top Branding Header */}
        <div className="bg-gradient-to-r from-[#002D54] via-[#004B87] to-[#0066B2] p-7 text-white text-center relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl ring-1 ring-white/25 shadow-inner mb-3">
              <Logo size={48} className="drop-shadow-md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[11px] font-bold tracking-wider uppercase mb-2 border border-white/20">
              <Shield className="w-3 h-3 text-amber-300" />
              <span>Admin Control Panel</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              Administrator Login
            </h1>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xs mx-auto">
              Authorized credentials required to access system settings, registrations, and analytics.
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* If already logged in as admin notice */}
          {(currentRole === 'admin' || currentRole === 'super_admin') && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Currently active as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong></span>
              </div>
              <button
                onClick={() => navigateTo('admin-management')}
                className="font-bold text-blue-700 hover:text-blue-900 underline whitespace-nowrap cursor-pointer"
              >
                Go to Dashboard →
              </button>
            </div>
          )}

          {/* Error alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Email / Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@a2zinfotech.com"
                  required
                  className="w-full text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/20 transition-all bg-slate-50/50 hover:bg-white text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to admin recovery email', 'info')}
                  className="text-xs font-semibold text-[#004B87] hover:text-[#002D54] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-sm pl-10 pr-11 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/20 transition-all bg-slate-50/50 hover:bg-white text-slate-900 placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#004B87] focus:ring-[#004B87] cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
              </label>

              <span className="text-[11px] text-slate-400 font-medium">Session: 24h</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-admin-signin-submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-[#003B6D] via-[#004B87] to-[#0066B2] hover:from-[#002D54] hover:to-[#004B87] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick Demo Access:</span>
              </span>
              <span className="text-[10px] text-slate-400">One-click login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-quick-super-admin"
                onClick={() => handleQuickDemoLogin('super_admin')}
                className="py-2 px-2.5 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Super Admin</span>
              </button>

              <button
                type="button"
                id="btn-quick-admin"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-2.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Operations Admin</span>
              </button>
            </div>
          </div>

          {/* Link to Student Sign Up / Registration */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500">
              Not an Administrator? Looking for student training or internship?
            </p>
            <button
              type="button"
              id="btn-admin-to-signup"
              onClick={() => navigateTo('student-registration')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#004B87]/30 bg-blue-50/60 hover:bg-blue-100/80 text-[#004B87] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-[#004B87]" />
              <span>Go to Student Registration & Sign Up</span>
            </button>
          </div>
        </div>

        {/* Card Footer Security Tag */}
        <div className="bg-slate-50 py-3 px-6 border-t border-slate-100 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Restricted Portal • All activity logged for security compliance</span>
        </div>
      </div>
    </div>
  );
};
