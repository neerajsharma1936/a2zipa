import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { getStoredPrograms, ProgramItem, PROGRAMS_UPDATED_EVENT } from '../data/programsData';
import {
  BookOpen,
  Sparkles,
  Eye,
  Phone,
  Layers,
  Sliders,
  Inbox,
  Quote,
  Menu,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    heroBanners,
    branches,
    qualifications,
    branchesList,
    passingYears,
    colleges,
    courseInquiries,
    successStories,
    navigateTo,
  } = useApp();

  // Programs sync state for count badge
  const [storedProgramsList, setStoredProgramsList] = useState<ProgramItem[]>(() => getStoredPrograms());

  useEffect(() => {
    const handleProgramsSync = () => {
      setStoredProgramsList(getStoredPrograms());
    };
    window.addEventListener(PROGRAMS_UPDATED_EVENT, handleProgramsSync);
    window.addEventListener('storage', handleProgramsSync);
    return () => {
      window.removeEventListener(PROGRAMS_UPDATED_EVENT, handleProgramsSync);
      window.removeEventListener('storage', handleProgramsSync);
    };
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      {/* Desktop Sidebar / Mobile Drawer */}
      <DashboardSidebar
        activeTab="dashboard"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        returnFocusRef={menuButtonRef}
      />

      {/* Main Dashboard Content Area */}
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
          <span className="font-extrabold text-sm text-[#071B49] truncate">Dashboard Overview</span>
        </div>
        {/* =====================================================================
            ALL 6 CONSOLIDATED MANAGEMENT CARDS ON DASHBOARD PAGE
            1. Programs & Courses Management (Unified Catalog, Degree Tracks, Fees & Curriculum)
            2. Hero Banner Management (1920x250)
            3. Form Dropdowns (Qualifications, Branches, Years, Placements)
            4. Branch Management
            5. Contact Details
            6. Website Preview
            ===================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
          {/* Card 1: Programs & Courses Management */}
          <button
            id="admin-tab-all-programs"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'programs');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-500 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                {storedProgramsList.length}
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">1. All Programs</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-blue-100/90 font-medium">
              Catalog & syllabus
            </p>
          </button>

          {/* Card 2: Hero Banner Management */}
          <button
            id="admin-tab-hero-banners"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'banners');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-amber-500 to-orange-600 text-white border border-amber-400 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                {heroBanners.length}
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">2. Hero Banners</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-amber-100/90 font-medium">
              1920×250 promotions
            </p>
          </button>

          {/* Card 3: Form Input Fields & Dropdowns */}
          <button
            id="admin-tab-form-dropdowns"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'dropdowns');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-emerald-600 to-teal-700 text-white border border-emerald-500 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                {qualifications.length + branchesList.length + passingYears.length + colleges.length}
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">3. Form Dropdowns</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-emerald-100/90 font-medium">
              Input fields & lists
            </p>
          </button>

          {/* Card 4: Branch Management */}
          <button
            id="admin-tab-branches"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'branches');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-teal-600 to-cyan-700 text-white border border-teal-500 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                {branches.length}
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">4. Branches</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-teal-100/90 font-medium">
              Academic streams
            </p>
          </button>

          {/* Card 5: Contact Details */}
          <button
            id="admin-tab-contact"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'contact');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-rose-600 to-pink-700 text-white border border-rose-500 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                Live
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">5. Contact Info</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-rose-100/90 font-medium">
              Helpline & support
            </p>
          </button>

          {/* Card 6: Live Preview */}
          <button
            id="admin-tab-preview"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'preview');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-purple-600 to-violet-700 text-white border border-purple-500 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                Preview
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">6. Live Preview</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-purple-100/90 font-medium">
              Verify public site
            </p>
          </button>

          {/* Card 7: Course Inquiries */}
          <button
            id="admin-tab-inquiries"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'registrations');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-sky-600 to-blue-700 text-white border border-sky-500 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Inbox className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                {courseInquiries?.length || 0}
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">7. Course Inquiries</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-sky-100/90 font-medium">
              Messages & Applications
            </p>
          </button>

          {/* Card 8: Success Stories & Testimonial Cards */}
          <button
            id="admin-tab-success-stories"
            onClick={() => {
              sessionStorage.setItem('a2z_admin_tab', 'stories');
              navigateTo('admin-management');
            }}
            className="p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white border border-amber-400 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold bg-white/20 text-white backdrop-blur-xs">
                <Quote className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs">
                {successStories.length} Cards
              </span>
            </div>
            <p className="font-extrabold text-xs leading-tight text-white">8. Story Cards</p>
            <p className="text-[10px] mt-0.5 line-clamp-1 text-amber-100/90 font-medium">
              Testimonials & carousel
            </p>
          </button>
        </div>
      </main>
    </div>
  );
};
