import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { TopBannerBackground } from '../components/ui/TopBannerBackground';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Home
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { setRole, navigateTo, showToast } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Determine target role based on email
      let targetRole: UserRole = 'student';
      let destView = 'dashboard';
      let toastMsg = 'Logged in successfully!';

      if (email.includes('admin') || email.includes('anil')) {
        targetRole = 'super_admin';
        destView = 'admin-management';
        toastMsg = 'Logged in as Admin! Full access granted to Admin Dashboard.';
      } else if (email.includes('employer') || email.includes('techcorp')) {
        targetRole = 'employer';
        destView = 'dashboard';
        toastMsg = 'Logged in as Hiring Employer!';
      } else if (email.includes('mentor')) {
        targetRole = 'mentor';
        destView = 'dashboard';
        toastMsg = 'Logged in as Industry Mentor!';
      } else {
        targetRole = 'student';
        destView = 'dashboard';
        toastMsg = 'Welcome back! Accessing Student Portal.';
      }

      setRole(targetRole);
      setIsSubmitting(false);
      navigateTo(destView);
      showToast(toastMsg, 'success');
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#F4F9FF] py-3 sm:py-6 overflow-hidden flex flex-col justify-center">
      {/* Top Banner Background Graphic */}
      <TopBannerBackground className="opacity-100" heightClass="h-[360px] sm:h-[440px]" />

      <div className="relative z-10 max-w-md mx-auto px-4 w-full">
        
        {/* Main Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-[#041235] via-[#004B87] to-[#0066B3] py-4 px-6 text-white text-center overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-400/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

            <div className="relative z-10">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-xs">
                Welcome Back Admin
              </h1>
            </div>
          </div>



          {/* Form Body */}
          <div className="p-4 sm:p-5">

            {/* Quick Demo Credentials Assistant */}
            <div className="mb-4 p-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs">
              <p className="font-bold text-[#004B87] mb-1.5 flex items-center justify-between">
                <span>Quick Demo Login Credentials:</span>
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@a2z.com');
                    setPassword('admin123');
                  }}
                  className="px-2 py-1.5 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <p className="font-bold text-[#071B49] text-[11px]">Admin Access</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">admin@a2z.com</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#071B49] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@a2z.com"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/15 text-slate-900 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#071B49]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Enter your account password', 'info')}
                    className="text-[11px] text-[#004B87] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/15 text-slate-900 bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004B87] focus:ring-[#004B87] border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-login-submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#004B87] hover:bg-[#003B6D] active:bg-[#002D54] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-3 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Homepage</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
