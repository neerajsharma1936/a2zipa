import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConvertedStudent, StudentRegistration } from '../../types';
import { StudentProfileModal } from './StudentProfileModal';
import { LeadDetailsModal } from './LeadDetailsModal';
import { ConvertStudentModal } from './ConvertStudentModal';
import {
  Users,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Search,
  Download,
  Eye,
  Phone,
  Mail,
  UserCheck,
  Clock,
  Calendar,
  X,
} from 'lucide-react';

type StudentCategoryTab = 'all' | 'studying' | 'completed' | 'enrolled';

const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

interface UnifiedStudentRow {
  key: string;
  source: 'converted' | 'registration';
  displayId: string;
  batchOrTrack: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  qualification: string;
  branch: string;
  course: string;
  placementType: string;
  date: string;
  avatar?: string;
  progressPercent?: number;
  categoryLabel: 'Currently Studying' | 'Completed' | 'Enrolled' | 'Registered';
  isEnrolled: boolean;
  isCurrentlyStudying: boolean;
  isCompleted: boolean;
  convertedRecord?: ConvertedStudent;
  registrationRecord?: StudentRegistration;
}

export const AllStudentsDirectory: React.FC = () => {
  const {
    convertedStudents,
    studentRegistrations,
    updateConvertedStudentProgress,
    showToast,
  } = useApp();

  const [categoryTab, setCategoryTab] = useState<StudentCategoryTab>('all');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [exactDate, setExactDate] = useState('');

  const [selectedConvertedStudent, setSelectedConvertedStudent] = useState<ConvertedStudent | null>(null);
  const [selectedRegistrationLead, setSelectedRegistrationLead] = useState<StudentRegistration | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<StudentRegistration | null>(null);

  // Merge converted/enrolled students with unconverted registered students (deduplicated)
  const unifiedStudents = useMemo<UnifiedStudentRow[]>(() => {
    const convertedByRegId = new Set(
      (convertedStudents || []).map((s) => s.registrationId).filter(Boolean)
    );

    const convertedRows: UnifiedStudentRow[] = (convertedStudents || []).map((stu) => {
      const progress = stu.progressPercent ?? 0;
      const isCompleted = stu.status === 'Completed' || progress >= 100;
      const isStudying = stu.status === 'Active' && !isCompleted;
      const isEnrolled = stu.status !== 'Dropped';

      let categoryLabel: UnifiedStudentRow['categoryLabel'] = 'Enrolled';
      if (isCompleted) categoryLabel = 'Completed';
      else if (isStudying) categoryLabel = 'Currently Studying';

      return {
        key: `conv_${stu.id}`,
        source: 'converted',
        displayId: stu.studentId,
        batchOrTrack: stu.batchNumber || 'BATCH-2026-A',
        name: stu.name,
        email: stu.email || '',
        phone: stu.phone || '',
        college: stu.college || '',
        qualification: stu.qualification || '',
        branch: stu.branch || '',
        course: stu.course || 'General Program',
        placementType: stu.placementType || 'Job + Internship',
        date: stu.enrollmentDate || stu.convertedAt?.slice(0, 10) || '',
        avatar: stu.avatar,
        progressPercent: progress,
        categoryLabel,
        isEnrolled,
        isCurrentlyStudying: isStudying,
        isCompleted,
        convertedRecord: stu,
      };
    });

    const registrationRows: UnifiedStudentRow[] = (studentRegistrations || [])
      .filter((reg) => !convertedByRegId.has(reg.id))
      .map((reg) => {
        const isConvertedStatus = reg.status === 'Converted';
        return {
          key: `reg_${reg.id}`,
          source: 'registration',
          displayId: reg.registrationNumber,
          batchOrTrack: reg.placement || 'Job + Internship',
          name: reg.name,
          email: reg.email || '',
          phone: reg.phone || '',
          college: reg.college || '',
          qualification: reg.qualification || '',
          branch: reg.branch || '',
          course: reg.course || 'General Track',
          placementType: reg.placement || 'Job + Internship',
          date: reg.submittedAt ? reg.submittedAt.slice(0, 10) : '',
          categoryLabel: isConvertedStatus ? 'Enrolled' : 'Registered',
          isEnrolled: isConvertedStatus,
          isCurrentlyStudying: false,
          isCompleted: false,
          registrationRecord: reg,
        };
      });

    return [...convertedRows, ...registrationRows];
  }, [convertedStudents, studentRegistrations]);

  const counts = useMemo(() => {
    return {
      all: unifiedStudents.length,
      studying: unifiedStudents.filter((s) => s.isCurrentlyStudying).length,
      completed: unifiedStudents.filter((s) => s.isCompleted).length,
      enrolled: unifiedStudents.filter((s) => s.isEnrolled).length,
    };
  }, [unifiedStudents]);

  const uniqueCourses = useMemo(
    () => Array.from(new Set(unifiedStudents.map((s) => s.course).filter(Boolean))),
    [unifiedStudents]
  );

  const uniqueYears = useMemo(
    () =>
      Array.from(
        new Set<string>(
          unifiedStudents
            .map((s) => s.date?.slice(0, 4))
            .filter((y): y is string => Boolean(y && /^\d{4}$/.test(y)))
        )
      ).sort((a, b) => b.localeCompare(a)),
    [unifiedStudents]
  );

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    return unifiedStudents.filter((stu) => {
      if (categoryTab === 'studying' && !stu.isCurrentlyStudying) return false;
      if (categoryTab === 'completed' && !stu.isCompleted) return false;
      if (categoryTab === 'enrolled' && !stu.isEnrolled) return false;

      if (courseFilter !== 'All' && stu.course !== courseFilter) return false;
      if (yearFilter !== 'All' && (!stu.date || stu.date.slice(0, 4) !== yearFilter)) return false;
      if (monthFilter !== 'All' && (!stu.date || stu.date.slice(5, 7) !== monthFilter)) return false;
      if (exactDate && stu.date !== exactDate) return false;

      if (q) {
        const match =
          stu.name.toLowerCase().includes(q) ||
          stu.displayId.toLowerCase().includes(q) ||
          stu.email.toLowerCase().includes(q) ||
          stu.phone.toLowerCase().includes(q) ||
          stu.college.toLowerCase().includes(q) ||
          stu.course.toLowerCase().includes(q) ||
          stu.batchOrTrack.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [unifiedStudents, categoryTab, courseFilter, yearFilter, monthFilter, exactDate, search]);

  const handleExportCSV = () => {
    const headers = [
      'Student / Reg ID',
      'Name',
      'Status Category',
      'Course',
      'Batch / Track',
      'Progress (%)',
      'Phone',
      'Email',
      'College',
      'Date',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.displayId}"`,
      `"${s.name}"`,
      `"${s.categoryLabel}"`,
      `"${s.course}"`,
      `"${s.batchOrTrack}"`,
      `"${s.progressPercent !== undefined ? `${s.progressPercent}%` : 'N/A'}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.college}"`,
      `"${s.date}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `All_Students_${categoryTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Students list exported to CSV successfully', 'success');
  };

  const getCategoryBadgeStyle = (label: UnifiedStudentRow['categoryLabel']) => {
    switch (label) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Currently Studying':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Enrolled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Registered':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#071B49] text-white p-5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#146EF5] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              All Students Directory
            </h2>
            <p className="text-xs text-blue-200/80">
              Complete list of all students — currently studying, completed, and enrolled
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-semibold">All Students</span>
            <span className="text-lg font-black text-white">{counts.all}</span>
          </div>
          <div className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-sky-300 block font-semibold">Studying</span>
            <span className="text-lg font-black text-sky-300">{counts.studying}</span>
          </div>
          <div className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 block font-semibold">Completed</span>
            <span className="text-lg font-black text-emerald-300">{counts.completed}</span>
          </div>
          <div className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-indigo-200 block font-semibold">Enrolled</span>
            <span className="text-lg font-black text-indigo-200">{counts.enrolled}</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            id: 'all' as StudentCategoryTab,
            label: 'All Students',
            count: counts.all,
            icon: <Users className="w-4 h-4" />,
            activeStyle: 'bg-[#146EF5] text-white border-[#146EF5] shadow-md',
          },
          {
            id: 'studying' as StudentCategoryTab,
            label: 'Currently Studying',
            count: counts.studying,
            icon: <BookOpen className="w-4 h-4" />,
            activeStyle: 'bg-sky-600 text-white border-sky-600 shadow-md',
          },
          {
            id: 'completed' as StudentCategoryTab,
            label: 'Completed',
            count: counts.completed,
            icon: <CheckCircle2 className="w-4 h-4" />,
            activeStyle: 'bg-emerald-600 text-white border-emerald-600 shadow-md',
          },
          {
            id: 'enrolled' as StudentCategoryTab,
            label: 'Enrolled',
            count: counts.enrolled,
            icon: <GraduationCap className="w-4 h-4" />,
            activeStyle: 'bg-indigo-600 text-white border-indigo-600 shadow-md',
          },
        ].map((tab) => {
          const isActive = categoryTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryTab(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isActive
                  ? tab.activeStyle
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="font-extrabold text-xs sm:text-sm truncate">{tab.label}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black shrink-0 ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all students by Name, ID, Course, College, Mobile, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            aria-label="Filter by course"
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
            aria-label="Filter by year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:border-blue-600 focus:outline-none"
          >
            <option value="All">All Years</option>
            {uniqueYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:border-blue-600 focus:outline-none"
          >
            <option value="All">All Months</option>
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-blue-600 focus-within:bg-white transition-colors">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <input
              type="date"
              aria-label="Search by exact date"
              value={exactDate}
              onChange={(e) => setExactDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              title="Search by exact date"
            />
            {exactDate && (
              <button
                type="button"
                onClick={() => setExactDate('')}
                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                title="Clear date"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {(yearFilter !== 'All' || monthFilter !== 'All' || exactDate) && (
            <button
              type="button"
              onClick={() => {
                setYearFilter('All');
                setMonthFilter('All');
                setExactDate('');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Reset Dates
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0 ml-auto md:ml-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* All Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3.5">Student / Reg ID</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Course / Track</th>
                <th className="px-4 py-3.5">Progress</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No students found in this category</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try switching tabs or adjusting your search filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.key} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-black text-blue-700 block text-xs">
                        {stu.displayId}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                        {stu.batchOrTrack}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-200 shadow-xs">
                          {stu.avatar ? (
                            <img src={stu.avatar} alt={stu.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{stu.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                            {stu.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block">{stu.college}</span>
                          {stu.qualification && (
                            <span className="text-[10px] text-slate-400 font-medium block">
                              {stu.qualification}{stu.branch ? ` • ${stu.branch}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="space-y-1">
                        {stu.phone ? (
                          <a
                            href={`tel:${stu.phone.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline text-xs"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{stu.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic block">No phone</span>
                        )}
                        {stu.email && (
                          <a
                            href={`mailto:${stu.email}`}
                            className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-blue-600 text-[11px] truncate max-w-[180px]"
                          >
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{stu.email}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#071B49] block text-xs max-w-[200px] truncate" title={stu.course}>
                        {stu.course}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                        Track: {stu.placementType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 w-40">
                      {stu.source === 'converted' && stu.convertedRecord ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={stu.progressPercent || 0}
                            onChange={(e) => {
                              const nextVal = parseInt(e.target.value, 10);
                              updateConvertedStudentProgress(
                                stu.convertedRecord!.id,
                                nextVal,
                                nextVal >= 100 ? 'Completed' : 'Active'
                              );
                            }}
                            className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#146EF5]"
                          />
                          <span className="font-bold text-xs text-slate-700 min-w-[32px]">
                            {stu.progressPercent || 0}%
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Pending Enrollment</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border inline-block ${getCategoryBadgeStyle(
                          stu.categoryLabel
                        )}`}
                      >
                        {stu.categoryLabel}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-xs font-medium text-slate-600">
                      {stu.date || 'N/A'}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {stu.source === 'converted' && stu.convertedRecord ? (
                          <button
                            type="button"
                            onClick={() => setSelectedConvertedStudent(stu.convertedRecord!)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Profile</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedRegistrationLead(stu.registrationRecord!)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setLeadToConvert(stu.registrationRecord!)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Enroll</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedConvertedStudent && (
        <StudentProfileModal
          student={selectedConvertedStudent}
          onClose={() => setSelectedConvertedStudent(null)}
        />
      )}

      {selectedRegistrationLead && (
        <LeadDetailsModal
          registration={selectedRegistrationLead}
          onClose={() => setSelectedRegistrationLead(null)}
          onConvert={(reg) => {
            setSelectedRegistrationLead(null);
            setLeadToConvert(reg);
          }}
        />
      )}

      {leadToConvert && (
        <ConvertStudentModal
          registration={leadToConvert}
          onClose={() => setLeadToConvert(null)}
          onConvertedSuccess={() => setLeadToConvert(null)}
        />
      )}
    </div>
  );
};
