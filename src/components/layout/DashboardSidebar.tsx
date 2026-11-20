import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  LogOut,
  Building2,
  ShieldCheck,
  GraduationCap,
  Radio,
  Sparkles,
  Quote,
  PhoneCall,
  X,
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen = false,
  onClose,
  returnFocusRef,
}) => {
  const { currentRole, currentView, navigateTo, setRole } = useApp();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Body scroll lock while mobile/tablet drawer is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-close if resized to desktop width (>= 1024px)
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  // Focus management when drawer opens/closes on <1024px
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      const timer = window.setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => window.clearTimeout(timer);
    }
    if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      if (window.innerWidth < 1024) {
        returnFocusRef?.current?.focus();
      }
    }
  }, [isOpen, returnFocusRef]);

  // Define sidebar menu items based on role
  let menuItems: { id: string; label: string; icon: React.ReactNode; viewTarget?: string }[] = [];

  if (currentRole === 'student') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, viewTarget: 'dashboard' },
      { id: 'all-students', label: 'All Students', icon: <Users className="w-4 h-4 text-sky-400" />, viewTarget: 'all-students' },
      { id: 'converted-students', label: 'Converted Students', icon: <GraduationCap className="w-4 h-4 text-emerald-400" />, viewTarget: 'converted-students' },
      { id: 'programs', label: 'All Programs', icon: <BookOpen className="w-4 h-4" />, viewTarget: 'all-programs' },
      { id: 'registration', label: 'Student Registration', icon: <Users className="w-4 h-4" />, viewTarget: 'student-registration' },
      { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" />, viewTarget: 'student-certificates' },
    ];
  } else if (currentRole === 'mentor') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, viewTarget: 'dashboard' },
      { id: 'all-students', label: 'All Students', icon: <Users className="w-4 h-4 text-sky-400" />, viewTarget: 'all-students' },
      { id: 'converted-students', label: 'Converted Students', icon: <GraduationCap className="w-4 h-4 text-emerald-400" />, viewTarget: 'converted-students' },
      { id: 'programs', label: 'All Programs', icon: <BookOpen className="w-4 h-4" />, viewTarget: 'all-programs' },
      { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" />, viewTarget: 'student-certificates' },
    ];
  } else if (currentRole === 'employer') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, viewTarget: 'dashboard' },
      { id: 'all-students', label: 'All Students', icon: <Users className="w-4 h-4 text-sky-400" />, viewTarget: 'all-students' },
      { id: 'converted-students', label: 'Converted Students', icon: <GraduationCap className="w-4 h-4 text-emerald-400" />, viewTarget: 'converted-students' },
      { id: 'programs', label: 'All Programs', icon: <BookOpen className="w-4 h-4" />, viewTarget: 'all-programs' },
    ];
  } else {
    // Admin / Super Admin
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, viewTarget: 'dashboard' },
      { id: 'admins-mgmt', label: 'Admin Management', icon: <ShieldCheck className="w-4 h-4 text-amber-400" />, viewTarget: 'admin-management' },
      { id: 'connect-requests', label: 'Connect Requests', icon: <PhoneCall className="w-4 h-4 text-cyan-400" />, viewTarget: 'admin-management' },
      { id: 'all-students', label: 'All Students', icon: <Users className="w-4 h-4 text-sky-400" />, viewTarget: 'all-students' },
      { id: 'converted-students', label: 'Converted Students', icon: <GraduationCap className="w-4 h-4 text-emerald-400" />, viewTarget: 'converted-students' },
      { id: 'programs', label: 'All Programs', icon: <BookOpen className="w-4 h-4" />, viewTarget: 'admin-management' },
      { id: 'registrations-mgmt', label: 'Student Registrations', icon: <Users className="w-4 h-4" />, viewTarget: 'admin-management' },
      { id: 'ticker-mgmt', label: 'News Ticker / Updates', icon: <Radio className="w-4 h-4" />, viewTarget: 'admin-management' },
      { id: 'banners-mgmt', label: 'Hero Banners', icon: <Sparkles className="w-4 h-4" />, viewTarget: 'admin-management' },
      { id: 'stories-mgmt', label: 'Success Story Cards', icon: <Quote className="w-4 h-4" />, viewTarget: 'admin-management' },
      { id: 'dropdowns-mgmt', label: 'Form Options', icon: <Building2 className="w-4 h-4" />, viewTarget: 'admin-management' },
      { id: 'certificates', label: 'Certificates Verification', icon: <Award className="w-4 h-4" />, viewTarget: 'student-certificates' },
    ];
  }

  return (
    <>
      {/* Mobile / Tablet Dark Backdrop Overlay (<1024px) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-[55] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        id="admin-sidebar-drawer"
        aria-label="Admin sidebar navigation"
        className={`fixed inset-y-0 left-0 z-[60] w-[280px] max-w-[85vw] bg-[#071B49] text-white border-r border-[#0E2864] flex flex-col justify-between select-none shadow-2xl transition-[transform,visibility] duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 visible' : '-translate-x-full invisible lg:visible'
        } lg:translate-x-0 lg:sticky lg:top-[97px] lg:h-[calc(100vh-97px)] lg:w-64 lg:max-w-none lg:shrink-0 lg:z-30 lg:shadow-md lg:transition-none`}
      >
        {/* Mobile Drawer Header with Close (X) Button (<1024px) */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 lg:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-extrabold tracking-wide text-white">Navigation Menu</span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Menu List */}
        <div className="flex-1 overflow-y-auto py-4 lg:py-5 px-3 space-y-1">
          {menuItems.map((item) => {
            const isSelected = activeTab
              ? activeTab === item.id
              : currentView === item.viewTarget;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                type="button"
                onClick={() => {
                  if (onTabChange) onTabChange(item.id);
                  if (item.viewTarget && currentView !== item.viewTarget) navigateTo(item.viewTarget);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#146EF5] text-white font-bold shadow-md shadow-blue-600/30 border border-blue-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 font-medium bg-transparent border border-transparent'
                }`}
              >
                <div className={isSelected ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Pinned Bottom Action */}
        <div className="shrink-0 pt-4 pb-5 px-5 border-t border-white/10 bg-[#071B49]">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              setRole('guest');
              navigateTo('home');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Guest Home</span>
          </button>
        </div>
      </aside>
    </>
  );
};
