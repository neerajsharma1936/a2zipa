import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRegistration, CourseInquiry } from '../../types';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { LeadManagementTable } from './LeadManagementTable';
import { LeadDetailsModal } from './LeadDetailsModal';
import { ConvertStudentModal } from './ConvertStudentModal';
import { ConvertedStudentsDirectory } from './ConvertedStudentsDirectory';
import {
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FileText,
  ShieldCheck,
  FileCheck,
  Download,
  AlertCircle,
  Eye,
  Settings,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Award,
  Inbox,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,
  Printer,
  Sparkles,
  LayoutGrid
} from 'lucide-react';

export const StudentRegistrationsManagement: React.FC = () => {
  const {
    courseInquiries,
    updateCourseInquiryStatus,
    deleteCourseInquiry,
    placements,
    addPlacement,
    updatePlacement,
    removePlacement,
    qualifications,
    addQualification,
    updateQualification,
    removeQualification,
    branchesList,
    addBranchOption,
    updateBranchOption,
    removeBranchOption,
    passingYears,
    addPassingYear,
    removePassingYear,
    colleges,
    addCollege,
    updateCollege,
    removeCollege,
    showToast,
  } = useApp();

  // Primary System View Sub-Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'converted-students' | 'inquiries'>('dashboard');

  // Modals State
  const [selectedLeadForView, setSelectedLeadForView] = useState<StudentRegistration | null>(null);
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<StudentRegistration | null>(null);

  // Lead Filter Preset passed from Dashboard KPI card click
  const [leadStatusFilterPreset, setLeadStatusFilterPreset] = useState<string>('All');

  // Inquiries Filter & Search
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('All');

  // Form Options Editing States
  const [newPlacementInput, setNewPlacementInput] = useState('');
  const [newQualInput, setNewQualInput] = useState('');
  const [newBranchInput, setNewBranchInput] = useState('');
  const [newCollegeInput, setNewCollegeInput] = useState('');

  return (
    <div className="space-y-6">

      {/* SUB-TAB 1: ADMIN DASHBOARD */}
      {activeTab === 'dashboard' && (
        <AdminDashboardOverview
          onSelectLeadStatusFilter={(st) => setLeadStatusFilterPreset(st)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onViewLead={(reg) => setSelectedLeadForView(reg)}
          onConvertLead={(reg) => setSelectedLeadForConvert(reg)}
        />
      )}

      {/* SUB-TAB 2: NEW REQUESTS / LEAD MANAGEMENT TABLE */}
      {activeTab === 'leads' && (
        <LeadManagementTable
          initialStatusFilter={leadStatusFilterPreset}
          onViewLead={(reg) => setSelectedLeadForView(reg)}
          onConvertLead={(reg) => setSelectedLeadForConvert(reg)}
        />
      )}

      {/* SUB-TAB 3: CONVERTED ENROLLED STUDENTS DIRECTORY */}
      {activeTab === 'converted-students' && <ConvertedStudentsDirectory />}

      {/* SUB-TAB 4: COURSE INQUIRIES & APPLICATIONS */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries by name, course, phone, email, subject..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"
              >
                <option value="All">All Inquiries</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-extrabold uppercase tracking-wider text-slate-500 text-[11px]">
                    <th className="px-5 py-3.5">Inquiry #</th>
                    <th className="px-5 py-3.5">Applicant Name</th>
                    <th className="px-5 py-3.5">Applied Course</th>
                    <th className="px-5 py-3.5">Subject & Message</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courseInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No course inquiries found</p>
                      </td>
                    </tr>
                  ) : (
                    courseInquiries
                      .filter((inq) => {
                        const q = inquirySearch.toLowerCase().trim();
                        const matchesSearch =
                          !q ||
                          inq.name.toLowerCase().includes(q) ||
                          inq.inquiryNumber.toLowerCase().includes(q) ||
                          inq.email.toLowerCase().includes(q) ||
                          inq.phone.toLowerCase().includes(q) ||
                          inq.selectedCourse.toLowerCase().includes(q);
                        const matchesStatus =
                          inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-5 font-mono font-extrabold text-slate-900 text-xs">
                            {inq.inquiryNumber}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">{inq.name}</span>
                            <span className="text-xs text-slate-500">{inq.phone} • {inq.email}</span>
                          </td>
                          <td className="py-3.5 px-5 font-bold text-blue-700 text-xs">
                            {inq.selectedCourse}
                          </td>
                          <td className="py-3.5 px-5 max-w-xs">
                            <div className="font-bold text-slate-800 text-xs truncate">{inq.subject}</div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{inq.message}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <select
                              value={inq.status}
                              onChange={(e) => updateCourseInquiryStatus(inq.id, e.target.value as CourseInquiry['status'])}
                              className="text-xs font-semibold rounded-lg px-2.5 py-1 bg-white border border-slate-200 cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-slate-500 whitespace-nowrap font-medium">
                            {new Date(inq.submittedAt || Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: DYNAMIC FORM DROPDOWNS CUSTOMIZER */}
      {activeTab === 'form-options' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. PLACEMENT TRACKS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" /> 1. Placement Tracks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Placement options shown in the registration form</p>
              </div>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                {placements.length}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPlacementInput}
                onChange={(e) => setNewPlacementInput(e.target.value)}
                placeholder="Add new placement track option..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newPlacementInput.trim()) {
                    addPlacement(newPlacementInput.trim());
                    setNewPlacementInput('');
                  }
                }}
                className="px-4 py-2 bg-[#146EF5] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {placements.map((p) => (
                <div key={p} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs">
                  <span className="font-bold text-slate-800">{p}</span>
                  <button
                    type="button"
                    onClick={() => removePlacement(p)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. QUALIFICATIONS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" /> 2. Qualifications
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Qualifications list on student registration form</p>
              </div>
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                {qualifications.length}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newQualInput}
                onChange={(e) => setNewQualInput(e.target.value)}
                placeholder="Add qualification (e.g. BTech, Diploma, ITI)..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newQualInput.trim()) {
                    addQualification(newQualInput.trim());
                    setNewQualInput('');
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {qualifications.map((q) => (
                <div key={q} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs">
                  <span className="font-bold text-slate-800">{q}</span>
                  <button
                    type="button"
                    onClick={() => removeQualification(q)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEAD DETAILS MODAL */}
      {selectedLeadForView && (
        <LeadDetailsModal
          registration={selectedLeadForView}
          onClose={() => setSelectedLeadForView(null)}
          onConvert={(reg) => {
            setSelectedLeadForView(null);
            setSelectedLeadForConvert(reg);
          }}
        />
      )}

      {/* CONVERT TO STUDENT MODAL */}
      {selectedLeadForConvert && (
        <ConvertStudentModal
          registration={selectedLeadForConvert}
          onClose={() => setSelectedLeadForConvert(null)}
          onConvertedSuccess={() => {
            setActiveTab('converted-students');
          }}
        />
      )}
    </div>
  );
};
