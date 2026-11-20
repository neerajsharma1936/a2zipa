import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Shield, Sparkles, Users, UserCheck, Briefcase, GraduationCap, Eye } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setRole, currentView, navigateTo } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'guest', label: 'Guest', icon: <Eye className="w-3.5 h-3.5" />, color: 'bg-slate-100 text-slate-700' },
    { role: 'student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'bg-blue-100 text-blue-800' },
    { role: 'mentor', label: 'Mentor', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-emerald-100 text-emerald-800' },
    { role: 'employer', label: 'Employer', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'bg-indigo-100 text-indigo-800' },
    { role: 'admin', label: 'Admin', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-800' },
    { role: 'super_admin', label: 'Super Admin', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-800' },
  ];

  const screens = [
    { id: 'home', label: '1. Homepage' },
    { id: 'student-certificates', label: '2. Certificates' },
    { id: 'admin-management', label: '3. Admin Dashboard' },
    { id: 'admin-login', label: '4. Admin Login' },
  ];

  return (
    <div id="role-switcher-banner" className="no-print bg-[#002D54] text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-sky-950/80 z-50 sticky top-0 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium text-[#7CC4FA] text-[13px]">
          <span>Change Role Switcher:</span>
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          {roles.map((r) => {
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                id={`btn-role-${r.role}`}
                onClick={() => {
                  setRole(r.role);
                  if (r.role !== 'guest') {
                    navigateTo('dashboard');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                  isActive
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#001F3B]/60'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-300 text-xs font-medium">Screen Jump:</span>
        <select
          id="screen-select-dropdown"
          value={currentView}
          onChange={(e) => navigateTo(e.target.value)}
          className="bg-[#0F1E36] text-slate-200 border border-slate-700/80 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {screens.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
