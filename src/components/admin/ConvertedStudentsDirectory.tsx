import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConvertedStudent, Certificate } from '../../types';
import { StudentProfileModal } from './StudentProfileModal';
import { CertificateModal } from '../common/CertificateModal';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  Award,
  BookOpen,
  Clock,
  Phone,
  Mail,
  Sliders,
  ChevronRight,
  Sparkles,
  Download,
  Users,
  Eye,
  FileText,
  User,
  Calendar,
  X
} from 'lucide-react';

export const ConvertedStudentsDirectory: React.FC = () => {
  const {
    convertedStudents,
    updateConvertedStudentProgress,
    generateCertificate,
    certificates,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [datePreset, setDatePreset] = useState<'All' | 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Custom'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<ConvertedStudent | null>(null);
  const [issuedCertModal, setIssuedCertModal] = useState<Certificate | null>(null);

  // Helper function to check if enrollmentDate matches selected date filter
  const matchesDateFilter = (enrollmentDateStr?: string) => {
    if (datePreset === 'All') return true;
    if (!enrollmentDateStr) return false;

    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);

    if (datePreset === 'Today') {
      return enrollmentDateStr === todayISO;
    }

    if (datePreset === 'This Week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      const stuDate = new Date(enrollmentDateStr);
      return stuDate >= sevenDaysAgo && stuDate <= today;
    }

    if (datePreset === 'This Month') {
      const currentYearMonth = todayISO.slice(0, 7); // YYYY-MM
      return enrollmentDateStr.startsWith(currentYearMonth);
    }

    if (datePreset === 'This Year') {
      const currentYear = todayISO.slice(0, 4); // YYYY
      return enrollmentDateStr.startsWith(currentYear);
    }

    if (datePreset === 'Custom') {
      if (startDate && enrollmentDateStr < startDate) return false;
      if (endDate && enrollmentDateStr > endDate) return false;
      return true;
    }

    return true;
  };

  // Filtered converted students
  const filtered = (convertedStudents || []).filter((stu) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      stu.name.toLowerCase().includes(q) ||
      stu.studentId.toLowerCase().includes(q) ||
      stu.email.toLowerCase().includes(q) ||
      stu.phone.toLowerCase().includes(q) ||
      stu.college.toLowerCase().includes(q) ||
      stu.course.toLowerCase().includes(q);

    const matchesCourse = courseFilter === 'All' || stu.course === courseFilter;
    const matchesStatus = statusFilter === 'All' || stu.status === statusFilter;
    const matchesDate = matchesDateFilter(stu.enrollmentDate);

    return matchesSearch && matchesCourse && matchesStatus && matchesDate;
  });

  const uniqueCourses = Array.from(
    new Set((convertedStudents || []).map((s) => s.course))
  ).filter(Boolean);

  const handleIssueCertificate = (student: ConvertedStudent) => {
    const startDt = student.enrollmentDate || '11 Jan 2025';
    const endDt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const cert = generateCertificate(student.course, student.name, startDt, endDt);
    if (cert) {
      updateConvertedStudentProgress(student.id, 100, 'Completed');
      setIssuedCertModal(cert);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Full Name',
      'Enrolled Course',
      'Batch Number',
      'Mobile',
      'Email',
      'College',
      'Enrollment Date',
      'Course Progress (%)',
      'Status',
    ];

    const rows = filtered.map((s) => [
      `"${s.studentId || ''}"`,
      `"${s.name || ''}"`,
      `"${s.course || ''}"`,
      `"${s.batchNumber || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.email || ''}"`,
      `"${s.college || ''}"`,
      `"${s.enrollmentDate || ''}"`,
      `"${s.progressPercent || 0}%"`,
      `"${s.status || 'Active'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Enrolled_Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Enrolled students directory exported to CSV successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-[#071B49] text-white p-5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#146EF5] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Converted Enrolled Students & Course Portal
            </h2>
            <p className="text-xs text-blue-200/80">
              Track course progress, batch assignments, and issue official certificates to converted students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-semibold">Total Enrolled</span>
            <span className="text-lg font-black text-white">{convertedStudents.length}</span>
          </div>
          <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 block font-semibold">Completed Courses</span>
            <span className="text-lg font-black text-emerald-300">
              {convertedStudents.filter((s) => s.status === 'Completed' || s.progressPercent >= 100).length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enrolled students by Name, Student ID, Course, Mobile, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:border-blue-600 focus:outline-none"
          >
            <option value="All">All Courses</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:border-blue-600 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>

          {/* Date Selector Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-blue-600 focus-within:bg-white transition-colors">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              title="Filter by Enrollment Date"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
              <option value="Custom">Custom Date Range</option>
            </select>
          </div>

          {/* Custom Date Inputs when 'Custom' Date Preset is active */}
          {datePreset === 'Custom' && (
            <div className="flex items-center gap-1.5 bg-white border border-blue-200 rounded-xl px-2.5 py-1.5 shadow-xs animate-in fade-in duration-200">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                title="Start Enrollment Date"
              />
              <span className="text-xs text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                title="End Enrollment Date"
              />
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 transition-colors cursor-pointer"
                  title="Clear custom date filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ml-auto md:ml-0"
            title="Export enrolled students directory to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3.5">Student ID & Batch</th>
                <th className="px-4 py-3.5">Candidate Name</th>
                <th className="px-4 py-3.5">Mobile No</th>
                <th className="px-4 py-3.5">Email Address</th>
                <th className="px-4 py-3.5">Enrolled Course</th>
                <th className="px-4 py-3.5">Progress %</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Enrollment Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No enrolled students found</p>
                    <p className="text-xs text-slate-400 mt-1">Convert a lead from New Requests to see them listed here.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((stu) => {
                  const currentStatus = stu.status || (stu.progressPercent >= 100 ? 'Completed' : 'Active');
                  const cleanPhoneNum = stu.phone ? stu.phone.replace(/[^0-9]/g, '') : '';
                  const getStatusBadgeStyle = (st: string) => {
                    switch (st) {
                      case 'Completed':
                        return 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs';
                      case 'Dropped':
                        return 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs';
                      case 'Active':
                      default:
                        return 'bg-blue-100 text-blue-800 border-blue-300 shadow-xs';
                    }
                  };

                  return (
                    <tr key={stu.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* CSS Selector 1: Student ID & Batch Number Column - Click to Open Profile */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForProfile(stu)}
                          className="text-left cursor-pointer group-hover:underline focus:outline-none"
                          title="Click to view full student profile, uploaded documents & certificates"
                        >
                          <span className="font-mono font-black text-blue-700 group-hover:text-blue-900 block text-xs">
                            {stu.studentId}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 block mt-0.5">
                            {stu.batchNumber || 'BATCH-2026-A'}
                          </span>
                        </button>
                      </td>

                      {/* CSS Selector 2: Candidate Name Column - Click to Open Profile */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForProfile(stu)}
                          className="text-left cursor-pointer flex items-center gap-2.5 focus:outline-none"
                          title="Click to view full student profile & uploaded documents"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-200 shadow-xs">
                            {stu.avatar ? (
                              <img src={stu.avatar} alt={stu.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{stu.name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 group-hover:text-blue-600 block text-xs sm:text-sm transition-colors">
                              {stu.name}
                            </span>
                            <span className="text-[11px] text-slate-500 block">{stu.college}</span>
                            {stu.qualification && (
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {stu.qualification} • {stu.branch}
                              </span>
                            )}
                          </div>
                        </button>
                      </td>

                      {/* Separate Mobile No Column with Call + Active WhatsApp Link */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {stu.phone ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${stu.phone.replace(/[^0-9+]/g, '')}`}
                              className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 hover:underline text-xs"
                              title="Call Student Mobile"
                            >
                              <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{stu.phone}</span>
                            </a>

                            <a
                              href={`https://wa.me/${cleanPhoneNum}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                              title="Chat on WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5 fill-current text-emerald-600" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                              </svg>
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic block">No phone</span>
                        )}
                      </td>

                      {/* Separate Email Address Column */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {stu.email ? (
                          <a
                            href={`mailto:${stu.email}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-blue-600 hover:underline text-xs truncate max-w-[180px]"
                            title="Send Email"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{stu.email}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic block">No email</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#071B49] block text-xs max-w-[200px] truncate" title={stu.course}>
                          {stu.course}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                          Track: {stu.placementType || 'Job + Internship'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 w-44">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={stu.progressPercent || 0}
                            onChange={(e) => updateConvertedStudentProgress(stu.id, parseInt(e.target.value, 10))}
                            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#146EF5]"
                          />
                          <span className="font-bold text-xs text-slate-700 min-w-[32px]">
                            {stu.progressPercent || 0}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border inline-block ${getStatusBadgeStyle(
                            currentStatus
                          )}`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-xs font-medium text-slate-600">
                        {stu.enrollmentDate}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForProfile(stu)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          title="View Full Student Profile & Uploaded Documents"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleIssueCertificate(stu)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          title="Issue Official Verification Certificate"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Issue Cert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE & DOCUMENTS MODAL */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}

      {/* GENERATED OFFICIAL CERTIFICATE MODAL */}
      {issuedCertModal && (
        <CertificateModal
          certificate={issuedCertModal}
          onClose={() => setIssuedCertModal(null)}
        />
      )}
    </div>
  );
};
