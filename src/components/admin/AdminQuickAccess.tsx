import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Settings, Users, ArrowRight, LayoutDashboard } from 'lucide-react';

export const AdminQuickAccess: React.FC = () => {
  const { navigateTo, setRole, currentRole } = useApp();

  const handleAdminDashboard = () => {
    setRole('admin');
    navigateTo('admin-management');
  };

  const handleAdminLogin = () => {
    navigateTo('login');
  };

  return (
    <div className="mt-2.5 mb-1 mx-auto max-w-xl bg-gradient-to-r from-[#071B49] via-[#0A2540] to-[#004B87] text-white rounded-xl p-3 sm:p-3.5 shadow-md border border-slate-700/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white">Admin Access Portal</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Administrative management, lead tracking & system controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAdminLogin}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1 border border-white/15"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin Login</span>
          </button>
          <button
            type="button"
            onClick={handleAdminDashboard}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm font-bold"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
