import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HeroBannerCarousel } from '../components/HeroBannerCarousel';
import { SuccessStoriesCarousel } from '../components/SuccessStoriesCarousel';
import { AllPrograms } from '../components/AllPrograms';
import { GetStartedButton } from '../components/common/GetStartedButton';
import { CourseCard, PLACEHOLDER_COURSE_IMAGE } from '../components/CourseCard';
import {
  ProgramItem,
  getStoredPrograms,
  PROGRAMS_UPDATED_EVENT,
} from '../data/programsData';
import { getStoryThemeConfig, initialSuccessStories } from '../data/mockData';
import {
  Star,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Sparkles,
  BookOpen,
  Code2,
  Award,
  CheckCircle2,
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigateTo } = useApp();

  // 1. DIRECT CONNECTION TO "ALL PROGRAMS" DATA (Single source of truth)
  const [allPrograms, setAllPrograms] = useState<ProgramItem[]>(() => getStoredPrograms());
  const [selectedProgramForDetails, setSelectedProgramForDetails] = useState<ProgramItem | null>(null);

  // Sync live with Admin Panel & All Programs updates
  useEffect(() => {
    const handleSync = () => {
      setAllPrograms(getStoredPrograms());
    };
    window.addEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // 2. TOP 4 PUBLISHED COURSES FROM ALL PROGRAMS (Same order, exclude draft/unpublished/deleted)
  const top4FeaturedCourses = useMemo(() => {
    return allPrograms
      .filter((p) => (p.status || 'published') === 'published')
      .slice(0, 4);
  }, [allPrograms]);

  const handleApplyClick = (prog: ProgramItem) => {
    navigateTo('application', { selectedCourse: prog.title });
  };

  const handleChooseProgramClick = () => {
    navigateTo('all-programs');
  };

  return (
    <div className="min-h-screen bg-[#EBF3FE]">
      
      {/* 1. HERO BANNER CAROUSEL (Directly below navbar, full width, 1920x250 promotional banner) */}
      <HeroBannerCarousel />

      {/* 2. TYPOGRAPHIC HERO SECTION (Centered & Compact Size) */}
      <section id="hero-statement-section" className="relative w-full bg-gradient-to-b from-[#FAF7F0] via-[#FFFDF7] to-[#FAF7F0] pt-3 sm:pt-4 md:pt-5 pb-6 sm:pb-8 md:pb-10 border-b border-amber-200/50 overflow-hidden">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="max-w-4xl text-center flex flex-col items-center">
            {/* Centered headline styled responsively: clean on small screens, refined & elegant on big screens */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[40px] lg:text-[46px] font-extrabold tracking-tight leading-[1.14] text-center max-w-3xl mx-auto break-words overflow-hidden px-2">
              <span className="text-[#111827] block">Build Skills. Gain</span>
              <span className="block"><span className="text-[#111827]">Experience. </span><span className="bg-gradient-to-r from-[#004B87] via-[#0077D4] to-indigo-600 bg-clip-text text-transparent">Launch</span></span>
              <span className="bg-gradient-to-r from-[#004B87] via-[#0077D4] to-indigo-600 bg-clip-text text-transparent block">Your Career.</span>
            </h1>


            {/* Supporting paragraph: smaller, centered, comfortable line-height */}
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-[#4B5563] font-normal leading-relaxed max-w-xl mx-auto text-center break-words px-3">
              Discover internships, industry-ready courses, hands-on projects and career opportunities — all in one place.
            </p>

            {/* Premium 3-Button Action Bar (All in One Div) */}
            <div className="mt-3 sm:mt-4 flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full max-w-xl px-2">
              <button
                type="button"
                onClick={() => navigateTo('admission-form')}
                className="flex-1 min-w-[100px] max-w-[150px] px-3 py-2 sm:py-2.5 bg-blue-50/60 hover:bg-[#004B87] border border-blue-200/80 hover:border-transparent text-[#004B87] hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Admission</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('student-registration')}
                className="flex-1 min-w-[100px] max-w-[150px] px-3 py-2 sm:py-2.5 bg-emerald-50/60 hover:bg-[#10B981] border border-emerald-200/80 hover:border-transparent text-[#047857] hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Internship</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('student-registration')}
                className="flex-1 min-w-[100px] max-w-[150px] px-3 py-2 sm:py-2.5 bg-amber-50/60 hover:bg-[#F59E0B] border border-amber-200/80 hover:border-transparent text-[#b45309] hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Placement</span>
              </button>
            </div>

            {/* Additional Explore button */}
            <div className="mt-4.5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleChooseProgramClick}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 border border-orange-400/30"
              >
                <span>View All Programs</span>
                <ArrowRight className="w-4 h-4 text-white/95" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 ALL PROGRAMS SECTION */}
      <AllPrograms />

      {/* 5. FEATURED COURSES SECTION (Directly connected to All Programs top 4 published courses) */}
      <section id="featured-courses-section" className="pt-2 sm:pt-3 lg:pt-4 pb-3 sm:pb-4 lg:pb-5 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          


          {/* 
            FEATURED COURSES GRID:
            - Big Screen / Desktop / Medium (md: & lg:): Exactly 4 in ONE ROW (4 columns)
            - Mobile: 1 card per row vertically stacked
          */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {top4FeaturedCourses.map((prog) => (
              <CourseCard
                key={prog.id}
                id={prog.id}
                image={prog.image}
                title={prog.title}
                category={prog.category}
                categoryLabel={prog.categoryLabel}
                branch={prog.branch}
                degreeType={prog.degreeType}
                shortDescription={prog.shortDescription}
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

          {/* Bottom Link to Explore Full Catalog */}
          <div className="mt-6 sm:mt-8 text-center">
            <button
              onClick={() => navigateTo('all-programs')}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-200" />
              <span>Explore All Engineering, Diploma & Vocational Programs</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. HOW A2Z WORKS (REDESIGNED PREMIUM THREE-STEP ROADMAP) */}
      <section className="relative pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-5 lg:pb-6 bg-gradient-to-b from-[#F8FAFC] via-[#F0F7FF] to-[#F8FAFC] overflow-hidden border-t border-slate-200/80">
        {/* Subtle Dotted Decorative Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Subtle Ambient Curved Gradient Blobs */}
        <div className="absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-300/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] rounded-full bg-purple-300/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-emerald-300/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto mt-0 pt-0 px-4 sm:px-6 lg:px-8 text-center relative z-10">
          


          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight mb-3 text-[#0F172A]">
            How <span className="bg-gradient-to-r from-[#004B87] via-[#7C3AED] to-[#10B981] bg-clip-text text-transparent">A2Z Works</span>
          </h2>

          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
            A seamless three-step journey to turn academic ambition into industry success.
          </p>

          {/* Three-Step Cards Grid with Connecting Arrows (Single Row on md and lg screens) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 relative items-stretch mt-6 sm:mt-8 mb-0 text-left">
            
            {/* Connecting Arrow: Step 01 -> 02 (Visible on 3-column screens) */}
            <div className="hidden md:flex absolute top-1/3 left-[30.5%] -translate-y-1/2 z-20 pointer-events-none w-10 md:w-12 lg:w-16 xl:w-20 items-center justify-center">
              <svg className="w-full text-blue-300/80" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C16 3 38 3 54 10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                <path d="M46 5L56 10L48 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Connecting Arrow: Step 02 -> 03 (Visible on 3-column screens) */}
            <div className="hidden md:flex absolute top-1/3 left-[63.8%] -translate-y-1/2 z-20 pointer-events-none w-10 md:w-12 lg:w-16 xl:w-20 items-center justify-center">
              <svg className="w-full text-purple-300/80" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C16 3 38 3 54 10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                <path d="M46 5L56 10L48 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* CARD 01 — LEARN */}
            <div className="group relative flex flex-col justify-start bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#FFFFFF] rounded-[24px] p-6 sm:p-7 lg:p-8 border border-[#BFDBFE] shadow-[0_4px_20px_rgba(37,99,235,0.06)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Subtle background gradient tint */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-200/40 via-blue-100/20 to-transparent rounded-full blur-2xl pointer-events-none -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-125" />

              <div>
                {/* Header Row: Number + Badge + Illustration */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#2563EB] font-black text-lg flex items-center justify-center border border-[#BFDBFE] shadow-xs">
                      01
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white text-[#2563EB] text-[11px] font-bold uppercase tracking-wider border border-[#BFDBFE]">
                      LEARN
                    </span>
                  </div>

                  {/* Education / Learning Illustration */}
                  <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <div className="absolute inset-0 bg-blue-400/15 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 stroke-[2.2]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                  Upskill with Experts
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal mb-0">
                  Take modular, hands-on courses covering full-stack web, data science, and design with video lessons and live mentor support.
                </p>
              </div>

              {/* Bottom Feature Badges (Single Row - tight spacing) */}
              <div className="pt-3 mt-3 border-t border-blue-100/80 grid grid-cols-2 gap-2">
                <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-blue-100 px-2 py-1 rounded-lg shadow-xs whitespace-nowrap truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span className="truncate">Video Lessons</span>
                </span>
                <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-blue-100 px-2 py-1 rounded-lg shadow-xs whitespace-nowrap truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span className="truncate">Live Mentorship</span>
                </span>
              </div>
            </div>

            {/* CARD 02 — PRACTICE */}
            <div className="group relative flex flex-col justify-start bg-gradient-to-b from-[#F5F3FF] via-[#FAF5FF] to-[#FFFFFF] rounded-[24px] p-6 sm:p-7 lg:p-8 border border-[#DDD6FE] shadow-[0_4px_20px_rgba(124,58,237,0.06)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Subtle background gradient tint */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-purple-200/40 via-purple-100/20 to-transparent rounded-full blur-2xl pointer-events-none -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-125" />

              <div>
                {/* Header Row: Number + Badge + Illustration */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#7C3AED] font-black text-lg flex items-center justify-center border border-[#DDD6FE] shadow-xs">
                      02
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white text-[#7C3AED] text-[11px] font-bold uppercase tracking-wider border border-[#DDD6FE]">
                      PRACTICE
                    </span>
                  </div>

                  {/* Coding / Projects Illustration */}
                  <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED] shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <div className="absolute inset-0 bg-purple-400/15 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                    <Code2 className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 stroke-[2.2]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2 group-hover:text-[#7C3AED] transition-colors">
                  Build Real Projects
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal mb-0">
                  Complete capstone applications, submit Git repos for code review, and earn cryptographically verified credentials.
                </p>
              </div>

              {/* Bottom Feature Badges (Single Row - tight spacing) */}
              <div className="pt-3 mt-3 border-t border-purple-100/80 grid grid-cols-2 gap-2">
                <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-purple-100 px-2 py-1 rounded-lg shadow-xs whitespace-nowrap truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                  <span className="truncate">Capstone Apps</span>
                </span>
                <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-purple-100 px-2 py-1 rounded-lg shadow-xs whitespace-nowrap truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                  <span className="truncate">Verified Certs</span>
                </span>
              </div>
            </div>

            {/* CARD 03 — PLACEMENT */}
            <div className="group relative flex flex-col justify-start bg-gradient-to-b from-[#ECFDF5] via-[#F0FDF4] to-[#FFFFFF] rounded-[24px] p-6 sm:p-7 lg:p-8 border border-[#A7F3D0] shadow-[0_4px_20px_rgba(22,163,74,0.06)] hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Subtle background gradient tint */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-emerald-200/40 via-emerald-100/20 to-transparent rounded-full blur-2xl pointer-events-none -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-125" />

              <div>
                {/* Header Row: Number + Badge + Illustration */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#16A34A] font-black text-lg flex items-center justify-center border border-[#A7F3D0] shadow-xs">
                      03
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white text-[#16A34A] text-[11px] font-bold uppercase tracking-wider border border-[#A7F3D0]">
                      PLACEMENT
                    </span>
                  </div>

                  {/* Professional / Placement Illustration */}
                  <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-[#A7F3D0] flex items-center justify-center text-[#16A34A] shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <div className="absolute inset-0 bg-emerald-400/15 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                    <Award className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 stroke-[2.2]" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2 group-hover:text-[#16A34A] transition-colors">
                  Apply & Get Hired
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal mb-0">
                  Connect directly with 500+ verified corporate recruiters, track interview stages, and secure high-paying internships.
                </p>
              </div>

              {/* Bottom Feature Badges (Single Row - tight spacing) */}
              <div className="pt-3 mt-3 border-t border-emerald-100/80 grid grid-cols-2 gap-2">
                <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-emerald-100 px-2 py-1 rounded-lg shadow-xs whitespace-nowrap truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span className="truncate">500+ Recruiters</span>
                </span>
                <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-emerald-100 px-2 py-1 rounded-lg shadow-xs whitespace-nowrap truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span className="truncate">Direct Pipeline</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

            {/* 7. STUDENT SUCCESS STORIES (TRUE INFINITE SCROLLING) */}
      <SuccessStoriesCarousel />



      {/* 8. CALL TO ACTION SECTION */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Launch Your Professional Career?
          </h2>
          <p className="text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Create your student profile today, explore vetted internships, and access industry courses for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <GetStartedButton className="shadow-2xl" />
            <button
              onClick={() => navigateTo('all-programs')}
              className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Explore All Programs
            </button>
            <button
              onClick={() => navigateTo('verify-certificate')}
              className="px-6 py-3.5 bg-blue-600/60 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl border border-blue-400/40 transition-all cursor-pointer"
            >
              Verify Certificates
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          COURSE DETAILS MODAL (EXPLORE COURSE MODAL)
          ==================================================================== */}
      {selectedProgramForDetails && (
        <div
          id="featured-course-details-modal"
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
                id="close-featured-course-modal-btn"
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
                    {selectedProgramForDetails.careerOpportunities.map((role, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Counselor Contact Info */}
              {selectedProgramForDetails.contactInfo && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-slate-700">Course Advisor / Helpdesk:</span>
                  <div className="flex items-center gap-3 text-slate-600">
                    {selectedProgramForDetails.contactInfo.phone && (
                      <a href={`tel:${selectedProgramForDetails.contactInfo.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{selectedProgramForDetails.contactInfo.phone}</span>
                      </a>
                    )}
                    {selectedProgramForDetails.contactInfo.email && (
                      <a href={`mailto:${selectedProgramForDetails.contactInfo.email}`} className="flex items-center gap-1 hover:text-blue-600">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>{selectedProgramForDetails.contactInfo.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProgramForDetails(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProgramForDetails(null);
                    handleApplyClick(selectedProgramForDetails);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Admission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
