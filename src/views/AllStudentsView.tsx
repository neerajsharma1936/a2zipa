import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { AllStudentsDirectory } from '../components/admin/AllStudentsDirectory';
import { Menu } from 'lucide-react';

export const AllStudentsView: React.FC = () => {
  const { navigateTo } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      <DashboardSidebar
        activeTab="all-students"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        returnFocusRef={menuButtonRef}
        onTabChange={(tabId) => {
          const adminTabMap: Record<string, string> = {
            'admins-mgmt': 'admins',
            'connect-requests': 'connect-requests',
            programs: 'programs',
            'registrations-mgmt': 'registrations',
            'ticker-mgmt': 'ticker',
            'banners-mgmt': 'banners',
            'stories-mgmt': 'stories',
            'dropdowns-mgmt': 'dropdowns',
          };
          if (tabId === 'dashboard') navigateTo('dashboard');
          else if (tabId === 'all-students') navigateTo('all-students');
          else if (tabId === 'converted-students') navigateTo('converted-students');
          else if (adminTabMap[tabId]) {
            sessionStorage.setItem('a2z_admin_tab', adminTabMap[tabId]);
            navigateTo('admin-management');
          } else if (tabId === 'all-programs') navigateTo('all-programs');
          else if (tabId === 'student-registration') navigateTo('student-registration');
          else if (tabId === 'student-certificates' || tabId === 'certificates') navigateTo('student-certificates');
        }}
      />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#FAF7F0]">
        {/* Mobile/Tablet Top Bar */}
        <div className="lg:hidden bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
            aria-controls="admin-sidebar-drawer"
            className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-xl bg-[#071B49] text-white hover:bg-[#0E2864] flex items-center justify-center transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-sm text-[#071B49] truncate">All Students</span>
        </div>

        <AllStudentsDirectory />
      </main>
    </div>
  );
};
