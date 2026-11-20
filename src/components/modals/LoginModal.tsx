import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  ArrowRight,
  Lock,
  Mail,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, setIsLoginOpen, setRole, navigateTo, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Detect role or default to student
    let role: UserRole = 'student';
    if (email.includes('mentor')) role = 'mentor';
    else if (email.includes('employer') || email.includes('techcorp')) role = 'employer';
    else if (email.includes('admin') || email.includes('anil')) role = 'super_admin';

    setRole(role);
    setIsLoginOpen(false);
    navigateTo('dashboard');
    showToast(`Logged in successfully as ${email}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Sign In to A2Z</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your email and password to access your account
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLoginOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Only Email and Password Section */}
        <div className="p-6">
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to email', 'info')}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-signin"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
