import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Bell,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setRole,
    currentUser,
    currentView,
    navigateTo,
    notifications,
    conversations,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = React.useMemo(() => {
    // Admin roles see full administrative suite
    if (currentRole === 'admin' || currentRole === 'super_admin') {
      return [
        { label: 'Home', view: 'home' },
        { label: 'Dashboard', view: 'dashboard' },
        { label: 'Programs', view: 'all-programs' },
        { label: 'Internship Registration', view: 'student-registration' },
        { label: 'Connect', view: 'application' },
        { label: 'Admin Console', view: 'admin-management' },
      ];
    }

    // Authenticated non-admin roles (e.g. students, mentors, employers)
    if (currentRole !== 'guest') {
      return [
        { label: 'Home', view: 'home' },
        { label: 'Dashboard', view: 'dashboard' },
        { label: 'Programs', view: 'all-programs' },
        { label: 'Internship Registration', view: 'student-registration' },
        { label: 'Connect', view: 'application' },
      ];
    }

    // Public Guest Mode: Login is rendered directly as a sibling link
    return [
      { label: 'Home', view: 'home' },
      { label: 'Programs', view: 'all-programs' },
      { label: 'Internship Registration', view: 'student-registration' },
      { label: 'Connect', view: 'application' },
      { label: 'Login', view: 'login' },
    ];
  }, [currentRole]);

  // Comprehensive view active checking considering route aliases
  const isViewActive = (targetView: string) => {
    if (currentView === targetView) return true;
    if (
      (targetView === 'student-registration' || targetView === 'internship-registration') &&
      ['student-registration', 'internship-registration', 'internship', 'registration'].includes(currentView)
    ) {
      return true;
    }
    if (targetView === 'all-programs' && ['all-programs', 'programs'].includes(currentView)) return true;
    if (targetView === 'student-certificates' && ['student-certificates', 'verify-certificate'].includes(currentView)) return true;
    if (targetView === 'application' && ['application', 'connect', 'contact', 'contact-us'].includes(currentView)) return true;
    if (targetView === 'admin-management' && ['admin-management', 'admin-dashboard', 'admin'].includes(currentView)) return true;
    if (targetView === 'dashboard' && ['dashboard', 'overview'].includes(currentView)) return true;
    if (targetView === 'login' && ['login', 'admin-login', 'signin'].includes(currentView)) return true;
    return false;
  };

  const handleNavClick = (view: string) => {
    navigateTo(view);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Brand Logo and Name */}
          <div className="flex items-center shrink-0">
            <button
              id="header-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0"
            >
              <Logo size={52} className="mr-1 transition-transform group-hover:scale-105 duration-300 drop-shadow-sm" />
              <div className="flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-[#004B87] via-[#005A9C] to-[#0077D4] bg-clip-text text-transparent select-none uppercase drop-shadow-xs ml-1">
                  A2Z
                </span>
              </div>
            </button>
          </div>

          {/* Right: All Navbar Navigation Texts & Actions */}
          <div className="flex items-center gap-2 sm:gap-4 justify-end">
            {/* Desktop Navigation Links (Azure Blue Text on White - All Siblings Identical) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const active = isViewActive(link.view);
                return (
                  <button
                    key={link.label}
                    id={`nav-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleNavClick(link.view)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'text-[#004B87] bg-blue-50/90 font-bold border border-blue-100/80 shadow-xs'
                        : 'text-[#004B87] hover:text-[#003B6D] hover:bg-blue-50/60 font-semibold'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Prominent Apply / Connect CTA Button */}
            <button
              id="header-apply-cta-btn"
              onClick={() => handleNavClick('application')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#0077D4] hover:from-[#003B6D] hover:to-[#005A9C] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <span>Apply Now</span>
            </button>

            {/* Authenticated / User Action Buttons */}
            {currentRole !== 'guest' && (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Notifications Bell */}
                <button
                  id="btn-header-notifs"
                  onClick={() => handleNavClick('notifications')}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                      {unreadNotifs}
                    </span>
                  )}
                </button>

                {/* Messages Chat Icon */}
                <button
                  id="btn-header-messages"
                  onClick={() => handleNavClick('messages')}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    id="btn-user-profile-menu"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                      <span className="text-[10px] font-medium text-blue-600 capitalize bg-blue-50 px-1.5 py-0.5 rounded">
                        {currentRole.replace('_', ' ')}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        id="menu-my-dashboard"
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>My Dashboard</span>
                      </button>

                      <button
                        id="menu-my-certificates"
                        onClick={() => handleNavClick('student-certificates')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>My Certificates</span>
                      </button>

                      {(currentRole === 'admin' || currentRole === 'super_admin') && (
                        <button
                          id="menu-admin-management"
                          onClick={() => handleNavClick('admin-management')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        id="menu-logout"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setRole('guest');
                          navigateTo('home');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out (Guest Mode)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation overlay drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 border-t border-slate-200 bg-white text-[#004B87] px-4 pt-3 pb-5 space-y-1.5 shadow-2xl rounded-b-2xl animate-in slide-in-from-top-2 duration-200 border-b">
          
          {/* User info banner if logged in */}
          {currentRole !== 'guest' && (
            <div className="p-3 mb-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <span className="text-[10px] font-medium text-blue-600 capitalize bg-blue-100/60 px-1.5 py-0.5 rounded">
                    {currentRole.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleNavClick('notifications')}
                  className="relative p-1.5 text-slate-600 hover:bg-slate-200/60 rounded-lg"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifs}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('messages')}
                  className="relative p-1.5 text-slate-600 hover:bg-slate-200/60 rounded-lg"
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links - All Siblings Rendered Uniformly */}
          {navLinks.map((link) => {
            const active = isViewActive(link.view);
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                  active
                    ? 'bg-[#004B87] text-white shadow-md shadow-blue-800/20'
                    : 'text-[#004B87] hover:text-[#003B6D] hover:bg-blue-50/80'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}

          {currentRole !== 'guest' && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setRole('guest');
                  navigateTo('home');
                }}
                className="w-full text-center px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out (Switch to Guest)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
