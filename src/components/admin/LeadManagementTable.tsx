import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRegistration, LeadStatus } from '../../types';
import jsPDF from 'jspdf';
import {
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  Phone,
  Mail,
  Clock,
  Download,
  Trash2,
  CheckSquare,
  Square,
  ArrowUpDown,
  BookOpen,
  MessageCircle,
  Sparkles,
  Plus
} from 'lucide-react';

interface LeadManagementTableProps {
  initialStatusFilter?: string;
  onViewLead: (reg: StudentRegistration) => void;
  onConvertLead: (reg: StudentRegistration) => void;
}

export const LeadManagementTable: React.FC<LeadManagementTableProps> = ({
  initialStatusFilter = 'All',
  onViewLead,
  onConvertLead,
}) => {
  const {
    studentRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
    qualifications,
    branchesList,
    colleges,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [placementFilter, setPlacementFilter] = useState('All');
  const [qualFilter, setQualFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtered registrations
  const filtered = useMemo(() => {
    return (studentRegistrations || []).filter((reg) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        reg.name.toLowerCase().includes(q) ||
        reg.registrationNumber.toLowerCase().includes(q) ||
        (reg.phone && reg.phone.toLowerCase().includes(q)) ||
        (reg.email && reg.email.toLowerCase().includes(q)) ||
        reg.college.toLowerCase().includes(q) ||
        (reg.course && reg.course.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || reg.status === statusFilter;
      const matchesPlacement = placementFilter === 'All' || reg.placement === placementFilter;
      const matchesQual = qualFilter === 'All' || reg.qualification === qualFilter;

      return matchesSearch && matchesStatus && matchesPlacement && matchesQual;
    }).sort((a, b) => {
      if (sortOrder === 'oldest') {
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      } else if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [studentRegistrations, search, statusFilter, placementFilter, qualFilter, sortOrder]);

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadgeClass = (st: LeadStatus) => {
    switch (st) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-300 shadow-xs';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 border-purple-300 shadow-xs';
      case 'Follow-up':
        return 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs';
      case 'Interested':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300 shadow-xs';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs';
      case 'Not Interested':
        return 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 shadow-xs';
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Student Name',
      'Applied Course',
      'Qualification',
      'Branch',
      'College',
      'Graduation Date',
      'Placement Type',
      'Mobile',
      'Email',
      'Request Date',
      'Lead Status',
    ];

    const rows = filtered.map((r) => [
      `"${r.registrationNumber || ''}"`,
      `"${r.name || ''}"`,
      `"${r.course || 'General Track'}"`,
      `"${r.qualification || ''}"`,
      `"${r.branch || ''}"`,
      `"${r.college || ''}"`,
      `"${r.passingYear || ''}"`,
      `"${r.placement || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${new Date(r.submittedAt).toLocaleDateString()}"`,
      `"${r.status || 'New'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student leads exported to CSV successfully', 'success');
  };

  // Format date and time in Asia/Kolkata timezone
  const formatKolkataDateTime = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // Today's lead count in Asia/Kolkata timezone
  const todayLeadCount = useMemo(() => {
    try {
      const kolkataToday = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      return (studentRegistrations || []).filter((reg) => {
        if (!reg.submittedAt) return false;
        const regDate = new Date(reg.submittedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        return regDate === kolkataToday;
      }).length;
    } catch {
      return 0;
    }
  }, [studentRegistrations]);

  return (
    <div className="space-y-4">
      {/* Lead Counts Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Leads</span>
            <span className="text-xl font-black text-slate-900">{studentRegistrations.length}</span>
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Today's Leads (IST)</span>
            <span className="text-xl font-black text-emerald-700">{todayLeadCount}</span>
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New / Uncontacted</span>
            <span className="text-xl font-black text-purple-700">
              {studentRegistrations.filter((r) => r.status === 'New').length}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Converted</span>
            <span className="text-xl font-black text-amber-700">
              {studentRegistrations.filter((r) => r.status === 'Converted').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by Name, Mobile, Email, Request ID, College, Course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#146EF5]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
          >
            <option value="All">All Lead Statuses</option>
            <option value="New">New Requests</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up">Follow-up Scheduled</option>
            <option value="Interested">Interested</option>
            <option value="Converted">Converted</option>
            <option value="Not Interested">Not Interested</option>
          </select>

          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
          >
            <option value="All">All Placement Tracks</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
            <option value="Job + Internship">Job + Internship</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            title="Export leads to CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Leads Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Showing {filtered.length} of {studentRegistrations.length} student leads</span>
          {selectedIds.length > 0 && (
            <span className="text-blue-600 font-extrabold">{selectedIds.length} selected</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 select-none">
                <th className="px-3 py-3 w-8 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-blue-600 cursor-pointer"
                  >
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Request ID & Date (IST)</th>
                <th className="px-4 py-3">Candidate Name</th>
                <th className="px-4 py-3">Mobile No</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Applied Course</th>
                <th className="px-4 py-3">Academic Info</th>
                <th className="px-4 py-3">Placement</th>
                <th className="px-4 py-3">Lead Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No student leads found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => {
                  const isSelected = selectedIds.includes(reg.id);
                  const digitsOnly = reg.phone ? reg.phone.replace(/[^0-9]/g, '') : '';
                  const cleanPhoneNum = digitsOnly.startsWith('91') ? digitsOnly : `91${digitsOnly}`;
                  return (
                    <tr
                      key={reg.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="px-3 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(reg.id)}
                          className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-black text-slate-900 block text-xs">
                          {reg.registrationNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          {formatKolkataDateTime(reg.submittedAt)}
                        </span>
                      </td>

                      {/* Candidate Name Column */}
                      <td className="px-4 py-3.5">
                        <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                          {reg.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block max-w-[150px] truncate" title={reg.college}>
                          {reg.college}
                        </span>
                      </td>

                      {/* Separate Mobile No Column with Call + Active WhatsApp Link */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {reg.phone ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${reg.phone.replace(/[^0-9+]/g, '')}`}
                              className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 hover:underline text-xs"
                              title="Call Mobile"
                            >
                              <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{reg.phone}</span>
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
                        {reg.email ? (
                          <a
                            href={`mailto:${reg.email}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-blue-600 hover:underline text-xs truncate max-w-[170px]"
                            title="Send Email"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{reg.email}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic block">No email</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#071B49] text-xs block max-w-[170px] truncate" title={reg.course}>
                          {reg.course || 'General Track'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800 text-xs block">
                          {reg.qualification} ({reg.passingYear})
                        </span>
                        <span className="text-[11px] text-slate-500 block max-w-[150px] truncate" title={reg.college}>
                          {reg.college}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold border border-slate-200">
                          {reg.placement || 'Job + Internship'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={reg.status || 'New'}
                          onChange={(e) => updateRegistrationStatus(reg.id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                            reg.status || 'New'
                          )}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Interested">Interested</option>
                          <option value="Converted">Converted</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>
                        {reg.followUpDate && (
                          <span className="block text-[9px] font-bold text-amber-700 mt-0.5">
                            Follow-up: {reg.followUpDate}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewLead(reg)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="View Complete Lead Application Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onConvertLead(reg)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                            title="Convert Lead to Enrolled Student"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Convert</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete lead request for ${reg.name}?`)) {
                                deleteRegistration(reg.id);
                                showToast('Lead deleted', 'info');
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
