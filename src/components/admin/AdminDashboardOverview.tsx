import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRegistration, ConvertedStudent, LeadStatus, CourseInquiry } from '../../types';
import {
  Users,
  Clock,
  CheckCircle2,
  UserCheck,
  GraduationCap,
  Award,
  BookOpen,
  Filter,
  Calendar,
  ChevronRight,
  Phone,
  Mail,
  Building2,
  Sparkles,
  TrendingUp,
  FileText,
  Inbox
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onSelectLeadStatusFilter: (status: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'leads' | 'converted-students' | 'inquiries') => void;
  onViewLead: (reg: StudentRegistration) => void;
  onConvertLead: (reg: StudentRegistration) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onSelectLeadStatusFilter,
  onNavigateTab,
  onViewLead,
  onConvertLead,
}) => {
  const {
    studentRegistrations,
    convertedStudents,
    courses,
    certificates,
    leadActivities,
    qualifications,
    branchesList,
    colleges,
    courseInquiries,
    updateCourseInquiryStatus,
  } = useApp();

  // Filters State
  const [timeframe, setTimeframe] = useState<'all' | 'today' | 'this-week' | 'this-month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [filterQual, setFilterQual] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterCollege, setFilterCollege] = useState('All');
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterPlacement, setFilterPlacement] = useState('All');
  const [filterLeadStatus, setFilterLeadStatus] = useState('All');

  // Filter registrations by timeframe and attributes
  const filteredRegistrations = useMemo(() => {
    return (studentRegistrations || []).filter((reg) => {
      const submitted = new Date(reg.submittedAt || Date.now());
      const now = new Date();

      // Timeframe Filter
      if (timeframe === 'today') {
        if (submitted.toDateString() !== now.toDateString()) return false;
      } else if (timeframe === 'this-week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (submitted < weekAgo) return false;
      } else if (timeframe === 'this-month') {
        if (submitted.getMonth() !== now.getMonth() || submitted.getFullYear() !== now.getFullYear()) return false;
      } else if (timeframe === 'custom') {
        if (customStartDate && new Date(customStartDate) > submitted) return false;
        if (customEndDate && new Date(customEndDate) < submitted) return false;
      }

      // Attribute Filters
      if (filterQual !== 'All' && reg.qualification !== filterQual) return false;
      if (filterBranch !== 'All' && reg.branch !== filterBranch) return false;
      if (filterCollege !== 'All' && reg.college !== filterCollege) return false;
      if (filterCourse !== 'All' && reg.course !== filterCourse) return false;
      if (filterPlacement !== 'All' && reg.placement !== filterPlacement) return false;
      if (filterLeadStatus !== 'All' && reg.status !== filterLeadStatus) return false;

      return true;
    });
  }, [
    studentRegistrations,
    timeframe,
    customStartDate,
    customEndDate,
    filterQual,
    filterBranch,
    filterCollege,
    filterCourse,
    filterPlacement,
    filterLeadStatus,
  ]);

  // KPI Calculations
  const newRequestsCount = filteredRegistrations.filter((r) => r.status === 'New' || r.status === 'Pending').length;
  const contactedCount = filteredRegistrations.filter((r) => r.status === 'Contacted').length;
  const followUpsCount = filteredRegistrations.filter((r) => r.status === 'Follow-up' || r.followUpDate).length;
  const interestedCount = filteredRegistrations.filter((r) => r.status === 'Interested').length;
  const convertedCount = filteredRegistrations.filter((r) => r.status === 'Converted').length;

  const activeStudentsCount = (convertedStudents || []).filter((s) => s.status === 'Active' && s.progressPercent < 100).length;
  const completedStudentsCount = (convertedStudents || []).filter((s) => s.status === 'Completed' || s.progressPercent >= 100).length;
  const totalCoursesCount = (courses || []).length;
  const totalCertificatesCount = (certificates || []).length;

  const uniqueCourseTitles = Array.from(
    new Set((studentRegistrations || []).map((r) => r.course).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-6">


      {/* 9 Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {/* 1. New Requests */}
        <div
          onClick={() => {
            onSelectLeadStatusFilter('New');
            onNavigateTab('leads');
          }}
          className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-xs border border-blue-600 hover:border-blue-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider block">New Requests</span>
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{newRequestsCount}</div>
          <span className="text-[10px] text-blue-100/90 block mt-0.5 font-medium">Fresh leads</span>
        </div>

        {/* 2. Contacted */}
        <div
          onClick={() => {
            onSelectLeadStatusFilter('Contacted');
            onNavigateTab('leads');
          }}
          className="p-3.5 bg-purple-600 text-white rounded-2xl shadow-xs border border-purple-600 hover:border-purple-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-purple-100 uppercase tracking-wider block">Contacted</span>
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{contactedCount}</div>
          <span className="text-[10px] text-purple-100/90 block mt-0.5 font-medium">Initial outreach</span>
        </div>

        {/* 3. Follow-ups */}
        <div
          onClick={() => {
            onSelectLeadStatusFilter('Follow-up');
            onNavigateTab('leads');
          }}
          className="p-3.5 bg-amber-500 text-white rounded-2xl shadow-xs border border-amber-500 hover:border-amber-600 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider block">Follow-ups</span>
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{followUpsCount}</div>
          <span className="text-[10px] text-amber-100/90 block mt-0.5 font-medium">Scheduled calls</span>
        </div>

        {/* 4. Interested */}
        <div
          onClick={() => {
            onSelectLeadStatusFilter('Interested');
            onNavigateTab('leads');
          }}
          className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xs border border-indigo-600 hover:border-indigo-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider block">Interested</span>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{interestedCount}</div>
          <span className="text-[10px] text-indigo-100/90 block mt-0.5 font-medium">Warm prospects</span>
        </div>

        {/* 5. Converted */}
        <div
          onClick={() => {
            onSelectLeadStatusFilter('Converted');
            onNavigateTab('leads');
          }}
          className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xs border border-emerald-600 hover:border-emerald-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">Converted</span>
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{convertedCount}</div>
          <span className="text-[10px] text-emerald-100/90 block mt-0.5 font-medium">To enrolled</span>
        </div>

        {/* 6. Active Students */}
        <div
          onClick={() => onNavigateTab('converted-students')}
          className="p-3.5 bg-sky-600 text-white rounded-2xl shadow-xs border border-sky-600 hover:border-sky-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wider block">Active Students</span>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{activeStudentsCount}</div>
          <span className="text-[10px] text-sky-100/90 block mt-0.5 font-medium">In batch courses</span>
        </div>

        {/* 7. Completed Students */}
        <div
          onClick={() => onNavigateTab('converted-students')}
          className="p-3.5 bg-teal-600 text-white rounded-2xl shadow-xs border border-teal-600 hover:border-teal-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-teal-100 uppercase tracking-wider block">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{completedStudentsCount}</div>
          <span className="text-[10px] text-teal-100/90 block mt-0.5 font-medium">Course finished</span>
        </div>

        {/* 8. Total Courses */}
        <div className="p-3.5 bg-violet-600 text-white rounded-2xl shadow-xs border border-violet-600">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-violet-100 uppercase tracking-wider block">Total Courses</span>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{totalCoursesCount}</div>
          <span className="text-[10px] text-violet-100/90 block mt-0.5 font-medium">Active catalog</span>
        </div>

        {/* 9. Certificates Issued */}
        <div className="p-3.5 bg-amber-600 text-white rounded-2xl shadow-xs border border-amber-600">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider block">Certificates</span>
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black">{totalCertificatesCount}</div>
          <span className="text-[10px] text-amber-100/90 block mt-0.5 font-medium">Official issued</span>
        </div>
      </div>

      {/* Grid of 4 Operational Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: Recent Requests (Leads) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-[#071B49] text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#146EF5]" /> Recent Requests (Leads)
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-bold text-[#146EF5] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({filteredRegistrations.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {filteredRegistrations.slice(0, 4).map((reg) => (
              <div key={reg.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{reg.name}</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-mono font-bold">
                      {reg.registrationNumber}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px] block truncate mt-0.5">
                    Course: <strong className="text-slate-800">{reg.course || 'General Track'}</strong>
                  </span>
                  <span className="text-slate-400 text-[10px] block">{reg.college}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewLead(reg)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onConvertLead(reg)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Convert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Widget 3: Course Inquiries Stream */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-[#071B49] text-sm flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#146EF5]" /> Course Inquiries ({courseInquiries?.length || 0})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Direct candidate applications & messages</span>
          </div>

          <div className="space-y-2.5">
            {(!courseInquiries || courseInquiries.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No course inquiries recorded yet.</p>
            ) : (
              courseInquiries.slice(0, 5).map((inq) => (
                <div key={inq.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{inq.name}</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-mono font-bold">
                        {inq.inquiryNumber}
                      </span>
                      <span className="font-bold text-blue-600 text-[11px]">• {inq.selectedCourse}</span>
                    </div>
                    <p className="text-slate-600 font-medium line-clamp-1">{inq.subject} - {inq.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      {inq.phone && (
                        <a href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`} className="hover:underline font-bold text-blue-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {inq.phone}
                        </a>
                      )}
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {inq.email}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => updateCourseInquiryStatus(inq.id, e.target.value as CourseInquiry['status'])}
                      className="text-xs font-bold rounded-lg px-2.5 py-1 bg-white border border-slate-200 cursor-pointer text-slate-700"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Widget 4: Real-Time Lead Activity Stream */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-[#071B49] text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Lead Activity Timeline Stream
            </h3>
            <span className="text-xs text-slate-400 font-medium">Real-time audit log</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(leadActivities || []).slice(0, 6).map((act) => (
              <div key={act.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 truncate">{act.action}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{act.time}</span>
                </div>
                <p className="text-[#071B49] font-medium text-[11px] line-clamp-2">{act.notes}</p>
                <span className="text-[9px] text-slate-400 block pt-1 border-t border-slate-200/50">By: {act.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
