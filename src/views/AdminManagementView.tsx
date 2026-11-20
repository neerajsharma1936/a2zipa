import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { HeroBannerManagement } from '../components/admin/HeroBannerManagement';
import { StudentRegistrationsManagement } from '../components/admin/StudentRegistrationsManagement';
import { AllProgramsManagement } from '../components/admin/AllProgramsManagement';
import { NewsTickerManagement } from '../components/admin/NewsTickerManagement';
import { FormDropdownsManagement } from '../components/admin/FormDropdownsManagement';
import { SuccessStoriesManagement } from '../components/admin/SuccessStoriesManagement';
import { AdminUsersManagement } from '../components/admin/AdminUsersManagement';
import { ConvertedStudentsDirectory } from '../components/admin/ConvertedStudentsDirectory';
import { ConnectRequestsManagement } from '../components/admin/ConnectRequestsManagement';
import { getStoredPrograms, ProgramItem, PROGRAMS_UPDATED_EVENT } from '../data/programsData';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Eye,
  Shield,
  Upload,
  Image,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Users,
  GraduationCap,
  Save,
  HelpCircle,
  LayoutGrid,
  Sliders,
  Menu
} from 'lucide-react';

export const AdminManagementView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    branches,
    addBranch,
    removeBranch,
    contactDetails,
    updateContactDetails,
    adminUsers,
    heroBanners,
    studentRegistrations,
    connectRequests,
    convertedStudents,
    successStories,
    announcements,
    qualifications,
    branchesList,
    passingYears,
    placements,
    colleges,
    navigateTo,
    showToast,
    setRole,
    setIsLoginOpen,
  } = useApp();

  // Guard: Restricted access for Admin & Super Admin only
  if (currentRole !== 'admin' && currentRole !== 'super_admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FAF7F0]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-200/60 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Admin Access Restricted</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Admin Dashboard, Student Registrations, and Management Tools are restricted. Please sign in as an Administrator to proceed.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigateTo('admin-login')}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#003B6D] to-[#004B87] hover:from-[#002D54] hover:to-[#003B6D] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Log In as Administrator</span>
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active top tab in the Admin Dashboard
  const [activeAdminTab, setActiveAdminTab] = useState<'admins' | 'programs' | 'banners' | 'registrations' | 'connect-requests' | 'converted' | 'stories' | 'ticker' | 'dropdowns' | 'branches' | 'contact' | 'preview'>(() => {
    const saved = sessionStorage.getItem('a2z_admin_tab');
    if (saved && ['admins', 'programs', 'banners', 'registrations', 'connect-requests', 'converted', 'stories', 'ticker', 'dropdowns', 'branches', 'contact', 'preview'].includes(saved)) {
      return saved as any;
    }
    return 'admins';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleAdminTabChange = (tab: 'admins' | 'programs' | 'banners' | 'registrations' | 'connect-requests' | 'converted' | 'stories' | 'ticker' | 'dropdowns' | 'branches' | 'contact' | 'preview') => {
    setActiveAdminTab(tab);
    sessionStorage.setItem('a2z_admin_tab', tab);
  };

  // Stored programs for count and branch linkage
  const [storedProgramsList, setStoredProgramsList] = useState<ProgramItem[]>(() => getStoredPrograms());

  useEffect(() => {
    const handleSync = () => {
      setStoredProgramsList(getStoredPrograms());
    };
    window.addEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Branch management form
  const [newBranchName, setNewBranchName] = useState('');
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null);

  // Contact details form state
  const [contactForm, setContactForm] = useState(contactDetails);
  const [isContactSaved, setIsContactSaved] = useState(false);

  // Add new branch
  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      showToast('Please enter a branch name', 'error');
      return;
    }
    addBranch(newBranchName.trim());
    setNewBranchName('');
  };

  // Remove branch
  const handleConfirmBranchDelete = () => {
    if (branchToDelete && removeBranch) {
      removeBranch(branchToDelete);
      setBranchToDelete(null);
    }
  };

  // Save contact details
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactDetails(contactForm);
    setIsContactSaved(true);
    setTimeout(() => setIsContactSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      {/* Responsive Sidebar / Drawer */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        returnFocusRef={menuButtonRef}
        activeTab={
          activeAdminTab === 'admins'
            ? 'admins-mgmt'
            : activeAdminTab === 'connect-requests'
            ? 'connect-requests'
            : activeAdminTab === 'stories'
            ? 'stories-mgmt'
            : activeAdminTab === 'ticker'
            ? 'ticker-mgmt'
            : activeAdminTab === 'converted'
            ? 'converted-students'
            : activeAdminTab === 'dropdowns' || activeAdminTab === 'branches' || activeAdminTab === 'contact'
            ? 'dropdowns-mgmt'
            : activeAdminTab === 'registrations'
            ? 'registrations-mgmt'
            : activeAdminTab === 'banners'
            ? 'banners-mgmt'
            : 'programs'
        }
        onTabChange={(tabId) => {
          if (tabId === 'dashboard') navigateTo('dashboard');
          else if (tabId === 'all-students') navigateTo('all-students');
          else if (tabId === 'admins-mgmt') handleAdminTabChange('admins');
          else if (tabId === 'connect-requests') handleAdminTabChange('connect-requests');
          else if (tabId === 'converted-students') handleAdminTabChange('converted');
          else if (tabId === 'stories-mgmt') handleAdminTabChange('stories');
          else if (tabId === 'ticker-mgmt') handleAdminTabChange('ticker');
          else if (tabId === 'dropdowns-mgmt') handleAdminTabChange('dropdowns');
          else if (tabId === 'registrations-mgmt') handleAdminTabChange('registrations');
          else if (tabId === 'banners-mgmt') handleAdminTabChange('banners');
          else if (tabId === 'programs' || tabId === 'admin-mgmt') handleAdminTabChange('programs');
        }}
      />

      {/* Main Admin Content Area */}
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#FAF7F0]">
        {/* Top Navigation Bar with Mobile/Tablet Drawer Toggle & Horizontal Tab Strip */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
            aria-controls="admin-sidebar-drawer"
            className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-xl bg-[#071B49] text-white hover:bg-[#0E2864] flex items-center justify-center transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'admins', label: 'Admin Management', count: adminUsers.length },
              { id: 'converted', label: 'Converted Students', count: convertedStudents.length },
              { id: 'programs', label: 'All Programs', count: storedProgramsList.length },
              { id: 'banners', label: 'Hero Banners', count: heroBanners.length },
              { id: 'stories', label: 'Success Story Cards', count: successStories.length },
              { id: 'ticker', label: 'News Ticker', count: announcements.length },
              { id: 'registrations', label: 'Registrations', count: studentRegistrations.length },
              { id: 'connect-requests', label: 'Connect Requests', count: connectRequests.length },
              { id: 'dropdowns', label: 'Form Options' },
              { id: 'branches', label: 'Branches', count: branches.length },
              { id: 'contact', label: 'Contact Info' },
              { id: 'preview', label: 'Live Preview' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleAdminTabChange(tab.id as any)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeAdminTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      activeAdminTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================================
            SUPER ADMIN: ADMIN USERS & PERMISSIONS MANAGEMENT (Tab: admins)
            ===================================================================== */}
        {activeAdminTab === 'admins' && (
          <div className="animate-in fade-in duration-200">
            <AdminUsersManagement />
          </div>
        )}

        {/* =====================================================================
            CONVERTED ENROLLED STUDENTS DASHBOARD (Tab: converted)
            ===================================================================== */}
        {activeAdminTab === 'converted' && (
          <div className="animate-in fade-in duration-200">
            <ConvertedStudentsDirectory />
          </div>
        )}

        {/* =====================================================================
            SUCCESS STORIES & TESTIMONIAL CARDS MANAGEMENT (Tab: stories)
            ===================================================================== */}
        {activeAdminTab === 'stories' && (
          <div className="animate-in fade-in duration-200">
            <SuccessStoriesManagement />
          </div>
        )}
        


        {/* =====================================================================
            UNIFIED PROGRAMS & COURSES MANAGEMENT (Tab 1)
            ===================================================================== */}
        {activeAdminTab === 'programs' && (
          <div className="animate-in fade-in duration-200">
            <AllProgramsManagement />
          </div>
        )}

        {/* =====================================================================
            NEWS TICKER & LATEST UPDATES MANAGEMENT (Tab 2)
            ===================================================================== */}
        {activeAdminTab === 'ticker' && (
          <div className="animate-in fade-in duration-200">
            <NewsTickerManagement />
          </div>
        )}

        {/* =====================================================================
            HERO BANNER MANAGEMENT SECTION (Tab 3)
            ===================================================================== */}
        {activeAdminTab === 'banners' && (
          <div className="animate-in fade-in duration-200">
            <HeroBannerManagement />
          </div>
        )}

        {/* =====================================================================
            STUDENT REGISTRATIONS SECTION (Tab 4)
            ===================================================================== */}
        {activeAdminTab === 'registrations' && (
          <div className="animate-in fade-in duration-200">
            <StudentRegistrationsManagement />
          </div>
        )}

        {/* =====================================================================
            CONNECT REQUESTS SECTION (Tab - Connect Leads)
            ===================================================================== */}
        {activeAdminTab === 'connect-requests' && (
          <div className="animate-in fade-in duration-200">
            <ConnectRequestsManagement />
          </div>
        )}

        {/* =====================================================================
            FORM INPUT FIELDS & DROPDOWN LISTS MANAGEMENT (Tab 4)
            ===================================================================== */}
        {activeAdminTab === 'dropdowns' && (
          <div className="animate-in fade-in duration-200">
            <FormDropdownsManagement />
          </div>
        )}

        {/* =====================================================================
            BRANCH MANAGEMENT SECTION (Tab 5)
            ===================================================================== */}
        {activeAdminTab === 'branches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Introduction Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Branch Category Management</h2>
              </div>

              {/* Add New Branch Input Form */}
              <form onSubmit={handleAddBranchSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Enter branch name (e.g. B.Tech, Diploma, ITI, Management)"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Branch</span>
                </button>
              </form>
            </div>

            {/* Configured Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => {
                const branchProgramsCount = storedProgramsList.filter(
                  (p) => p.degreeType === branch || p.branch === branch || p.categoryLabel === branch
                ).length;
                return (
                  <div
                    key={branch}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          <Layers className="w-4 h-4" />
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {branchProgramsCount} {branchProgramsCount === 1 ? 'Program' : 'Programs'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{branch}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Programs and courses tagged with this branch are surfaced to students in the public course directory.
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setActiveAdminTab('programs');
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View in Catalog</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {branches.length > 1 && (
                        <button
                          onClick={() => setBranchToDelete(branch)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold p-1 transition-colors cursor-pointer"
                          title="Remove branch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 6: CONTACT & ADMISSION DETAILS
            ===================================================================== */}
        {activeAdminTab === 'contact' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Institute & Support Contact Info</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Update official phone numbers, addresses, admission desks, and support email displayed on the footer & contact page.
                </p>
              </div>
              {isContactSaved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes Saved Live!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Helpline Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admission Desk Contact
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={contactForm.admissionContact}
                      onChange={(e) => setContactForm({ ...contactForm, admissionContact: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    General Inquiries Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Support Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={contactForm.supportEmail}
                      onChange={(e) => setContactForm({ ...contactForm, supportEmail: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office Working Hours
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactForm.workingHours}
                    onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact Info</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================================
            SECTION 7: LIVE PUBLIC PREVIEW
            ===================================================================== */}
        {activeAdminTab === 'preview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  Live Sync
                </span>
                <h2 className="text-lg font-bold mt-2">Public Catalog & Programs Page Preview</h2>
                <p className="text-xs text-blue-100 max-w-xl mt-1">
                  This preview shows how students and visitors view the public programs & courses based on your current admin configuration.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo('all-programs')}
                  className="px-4 py-2 bg-white text-blue-700 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Public Page</span>
                </button>
              </div>
            </div>

            {/* Mock browser preview container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Browser bar */}
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 max-w-lg mx-auto bg-white px-3 py-1 rounded-md text-[11px] text-slate-500 font-mono text-center truncate border border-slate-200">
                  https://a2z.edu.in/all-programs
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-6 bg-slate-50/50">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full">
                    Live Public Directory
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Explore Industry Certified Programs & Courses</h3>
                  <p className="text-xs text-slate-500">
                    Live offerings currently visible to enrolled and guest students
                  </p>
                </div>

                {/* Programs Grid Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {storedProgramsList
                    .filter((p) => (p.status || 'published') === 'published')
                    .slice(0, 6)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="h-40 overflow-hidden relative">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                              <span className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-800">
                                {p.categoryLabel || p.category}
                              </span>
                              {p.degreeType && (
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                                  {p.degreeType}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.shortDescription || p.description}</p>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                              <span>{p.duration}</span>
                              <span className="font-bold text-slate-800">{p.fee || '₹45,000 / Year'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => {
                              showToast(`Navigating to application for ${p.title}`, 'info');
                              navigateTo('application', { selectedCourse: p.title });
                            }}
                            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl text-center cursor-pointer"
                          >
                            Apply for Admission
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =====================================================================
          DELETE BRANCH CONFIRMATION MODAL
          ===================================================================== */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Branch Category?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong className="text-slate-700">"{branchToDelete}"</strong> from the branches list?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setBranchToDelete(null)}
                className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBranchDelete}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
