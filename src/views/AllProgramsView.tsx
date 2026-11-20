import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCard, PLACEHOLDER_COURSE_IMAGE } from '../components/CourseCard';
import {
  ProgramCategory,
  ProgramItem,
  getStoredPrograms,
  PROGRAMS_UPDATED_EVENT,
} from '../data/programsData';
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const AllProgramsView: React.FC = () => {
  const { navigateTo } = useApp();

  // Load programs with localStorage persistence and cross-component sync
  const [programs, setPrograms] = useState<ProgramItem[]>(() => getStoredPrograms());

  // Listen to live updates from Admin Panel
  useEffect(() => {
    const handleSync = () => {
      setPrograms(getStoredPrograms());
    };
    window.addEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramForDetails, setSelectedProgramForDetails] = useState<ProgramItem | null>(null);

  // Category filter buttons:
  // Desktop Row 1: All Programs | Civil/Civil(Rural) | CS-IT | Electrical/Electronics | Fire Safety
  // Desktop Row 2: Mechanical/Automobile | Non-Technical (Centered)
  const desktopRow1: { id: ProgramCategory; label: string }[] = [
    { id: 'all', label: 'All Programs' },
    { id: 'civil', label: 'Civil/Civil(Rural)' },
    { id: 'cs-it', label: 'CS-IT' },
    { id: 'electrical', label: 'Electrical/Electronics' },
    { id: 'fire-safety', label: 'Fire Safety' },
  ];

  const desktopRow2: { id: ProgramCategory; label: string }[] = [
    { id: 'mechanical', label: 'Mechanical/Automobile' },
    { id: 'non-tech', label: 'Non-Technical' },
  ];

  // Mobile buttons
  const mobileButtons: { id: ProgramCategory; label: string }[] = [
    { id: 'all', label: 'All Programs' },
    { id: 'civil', label: 'Civil/Civil(Rural)' },
    { id: 'cs-it', label: 'CS-IT' },
    { id: 'electrical', label: 'Electrical/Electronics' },
    { id: 'fire-safety', label: 'Fire Safety' },
    { id: 'mechanical', label: 'Mechanical/Automobile' },
    { id: 'non-tech', label: 'Non-Technical' },
  ];

  // Filtered programs for public catalog display (only published courses)
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      const progStatus = prog.status || 'published';
      if (progStatus !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all' && prog.category !== selectedCategory) {
        return false;
      }

      // Keyword search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prog.title.toLowerCase().includes(q);
        const matchCat = (prog.categoryLabel || '').toLowerCase().includes(q);
        const matchBranch = (prog.branch || '').toLowerCase().includes(q);
        const matchDegree = (prog.degreeType || '').toLowerCase().includes(q);
        const matchDesc = (prog.description || '').toLowerCase().includes(q);
        const matchShortDesc = (prog.shortDescription || '').toLowerCase().includes(q);
        const matchSpec = (prog.specializations || []).some((s) => s.toLowerCase().includes(q));
        const matchCareer = (prog.careerOpportunities || []).some((c) => c.toLowerCase().includes(q));
        return (
          matchTitle ||
          matchCat ||
          matchBranch ||
          matchDegree ||
          matchDesc ||
          matchShortDesc ||
          matchSpec ||
          matchCareer
        );
      }
      return true;
    });
  }, [programs, selectedCategory, searchQuery]);

  const handleApplyClick = (prog: ProgramItem) => {
    navigateTo('application', { selectedCourse: prog.title });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] pb-24">
      {/* ====================================================================
          PAGE TOP HERO SECTION: Clean light-blue/white programs area
          ==================================================================== */}
      <section className="pt-6 pb-4 sm:pt-8 sm:pb-5 bg-gradient-to-b from-[#F0F6FF] via-[#F8FAFD] to-[#F8FAFD] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          

          <div className="text-center">
            {/* Main Title: "Our" in dark navy, "All Programs" in strong blue */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">
              <span className="text-[#0F172A]">Our </span>
              <span className="text-[#2563EB]">All Programs</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Explore industry-recognized engineering, polytechnic, technical and management degrees aligned with modern careers.
            </p>
          </div>

          {/* ================================================================
              CATEGORY FILTER BUTTONS AREA
              ================================================================ */}
          <div className="mt-6 sm:mt-7 max-w-5xl mx-auto">
            {/* DESKTOP/LAPTOP VIEW */}
            <div className="hidden md:flex flex-col items-center gap-3">
              {/* Row 1: All Programs | Civil/Civil(Rural) | CS-IT | Electrical/Electronics | Fire Safety */}
              <div className="flex items-center justify-center gap-2.5 lg:gap-3 flex-wrap">
                {desktopRow1.map((item) => {
                  const isActive = selectedCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border border-[#2563EB]'
                          : 'bg-white text-slate-700 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:text-[#2563EB] hover:bg-blue-50/40'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Mechanical/Automobile | Non-Technical (Centered) */}
              <div className="flex items-center justify-center gap-2.5 lg:gap-3 flex-wrap">
                {desktopRow2.map((item) => {
                  const isActive = selectedCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border border-[#2563EB]'
                          : 'bg-white text-slate-700 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:text-[#2563EB] hover:bg-blue-50/40'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden max-w-sm mx-auto px-1">
              <div className="grid grid-cols-2 gap-2">
                {mobileButtons.slice(0, 6).map((item) => {
                  const isActive = selectedCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`w-full min-h-[40px] py-1.5 px-2 text-center rounded-full text-[11px] sm:text-xs font-semibold leading-tight flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border border-[#2563EB]'
                          : 'bg-white text-slate-700 border border-slate-200/90 hover:border-blue-300'
                      }`}
                      title={item.label}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* 7th item centered on mobile */}
              {mobileButtons[6] && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setSelectedCategory(mobileButtons[6].id)}
                    className={`min-h-[40px] py-1.5 px-6 text-center rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
                      selectedCategory === mobileButtons[6].id
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border border-[#2563EB]'
                        : 'bg-white text-slate-700 border border-slate-200/90 hover:border-blue-300'
                    }`}
                  >
                    <span>{mobileButtons[6].label}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4 sm:mt-5 mb-0 max-w-lg mx-auto flex items-center gap-2">
            <div className="relative flex-1 mb-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course name, branch, keywords..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs bg-white mb-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          PUBLIC COURSE CARDS GRID: EXACTLY 4 CARDS IN EVERY ROW ON DESKTOP
          ==================================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No courses match selected filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try choosing "All Programs" or clearing your search term to see all available degree tracks.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Show All Courses
            </button>
          </div>
        ) : (
          /* ====================================================================
              GRID: exactly 4 columns on screens bigger than mobile (md:grid-cols-4, lg:grid-cols-4)
              ==================================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filteredPrograms.map((prog) => (
              <CourseCard
                key={prog.id}
                id={`course-${prog.id}`}
                image={prog.image}
                title={prog.title}
                category={prog.category}
                categoryLabel={prog.categoryLabel}
                branch={prog.branch || prog.categoryLabel}
                degreeType={prog.degreeType}
                shortDescription={prog.shortDescription || prog.description}
                description={prog.description}
                duration={prog.duration}
                eligibility={prog.eligibility}
                qualification={prog.qualification || prog.eligibility}
                fee={prog.fee}
                status={prog.status || 'published'}
                badgeBg={prog.badgeBg}
                badgeBorder={prog.badgeBorder}
                badgeText={prog.badgeText}
                showAdminControls={false}
                onViewDetails={() => setSelectedProgramForDetails(prog)}
                onExploreCourse={() => setSelectedProgramForDetails(prog)}
                onApplyNow={() => handleApplyClick(prog)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ====================================================================
          COURSE DETAILS MODAL (EXPLORE COURSE MODAL)
          ==================================================================== */}
      {selectedProgramForDetails && (
        <div
          id="public-course-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedProgramForDetails(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Image Banner */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-100">
              <img
                src={selectedProgramForDetails.image || PLACEHOLDER_COURSE_IMAGE}
                alt={selectedProgramForDetails.title}
                className="w-full h-full object-cover"
              />
              <button
                id="close-public-course-modal-btn"
                onClick={() => setSelectedProgramForDetails(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${selectedProgramForDetails.badgeBg} ${selectedProgramForDetails.badgeBorder} ${selectedProgramForDetails.badgeText} border`}>
                  {selectedProgramForDetails.categoryLabel}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                  {selectedProgramForDetails.branch || selectedProgramForDetails.degreeType}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Header Title & Credential Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    {selectedProgramForDetails.degreeType} Program
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {selectedProgramForDetails.title}
                  </h3>
                </div>
                {selectedProgramForDetails.fee && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Course Fee</span>
                    <span className="text-base font-extrabold text-emerald-700">{selectedProgramForDetails.fee}</span>
                  </div>
                )}
              </div>

              {/* Short & Full Description */}
              <div className="space-y-2">
                {selectedProgramForDetails.shortDescription && (
                  <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {selectedProgramForDetails.shortDescription}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProgramForDetails.description}
                </p>
              </div>

              {/* Key Course Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-semibold text-slate-800">{selectedProgramForDetails.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Passing Year</span>
                  <span className="font-semibold text-slate-800">{selectedProgramForDetails.passingYear || '2023 - 2026'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligibility</span>
                  <span className="font-semibold text-slate-800 line-clamp-1" title={selectedProgramForDetails.eligibility}>
                    {selectedProgramForDetails.eligibility}
                  </span>
                </div>
              </div>

              {/* Certificate Information */}
              {selectedProgramForDetails.certificateInfo && (
                <div className="flex items-start gap-2.5 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Accredited Certificate:</span>
                    <span>{selectedProgramForDetails.certificateInfo}</span>
                  </div>
                </div>
              )}

              {/* Focus Areas */}
              {selectedProgramForDetails.specializations && selectedProgramForDetails.specializations.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Core Syllabus & Focus Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgramForDetails.specializations.map((spec, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Opportunities */}
              {selectedProgramForDetails.careerOpportunities && selectedProgramForDetails.careerOpportunities.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Career Opportunities & Roles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgramForDetails.careerOpportunities.map((career, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Counselor / Admissions Helpline */}
              {selectedProgramForDetails.contactInfo && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">Academic Counselor Helpline:</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedProgramForDetails.contactInfo.phone || '+91 98765 43210'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedProgramForDetails.contactInfo.email || 'admissions@a2z.edu.in'}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Call to Action Row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProgramForDetails(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>

                <button
                  id="register-course-cta-btn"
                  type="button"
                  onClick={() => {
                    const prog = selectedProgramForDetails;
                    setSelectedProgramForDetails(null);
                    handleApplyClick(prog);
                  }}
                  className="flex-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Register Now for {selectedProgramForDetails.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
