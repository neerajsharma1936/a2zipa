import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  MessageCircle,
  Search,
  Users,
  Calendar,
  Clock,
  Trash2,
  Phone,
  Sparkles,
  Inbox
} from 'lucide-react';

export const ConnectRequestsTable: React.FC = () => {
  const {
    courseInquiries,
    studentRegistrations,
    deleteCourseInquiry,
    deleteRegistration,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Format date and time strictly in Asia/Kolkata timezone
  const formatKolkataDateTime = (isoDateStr: string) => {
    try {
      const d = new Date(isoDateStr);
      if (isNaN(d.getTime())) {
        return { date: '12 Oct 2026', time: '10:30 AM' };
      }

      const dateStr = d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const timeStr = d.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return { date: dateStr, time: timeStr };
    } catch {
      return { date: '12 Oct 2026', time: '10:30 AM' };
    }
  };

  // Check if date is today in Asia/Kolkata
  const isTodayInKolkata = (isoDateStr: string) => {
    try {
      const d = new Date(isoDateStr);
      if (isNaN(d.getTime())) return false;
      const todayKolkata = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const recordKolkata = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      return todayKolkata === recordKolkata;
    } catch {
      return false;
    }
  };

  // Clean WhatsApp number (international format without + or spaces)
  const getWhatsAppUrl = (phoneStr: string) => {
    let digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = '91' + digits; // Default to India country code 91 if 10 digits
    }
    return `https://wa.me/${digits}`;
  };

  // Tel URL
  const getTelUrl = (phoneStr: string) => {
    const clean = phoneStr.replace(/[^\d+]/g, '');
    return `tel:${clean}`;
  };

  // Process Connect Requests from courseInquiries (strictly delinked from Internship Registrations)
  const allConnectRequests = useMemo(() => {
    const items: Array<{
      id: string;
      recordId: string;
      name: string;
      phone: string;
      submittedAt: string;
      source: 'inquiry' | 'registration';
      rawId: string;
    }> = [];

    // 1. Process Course Inquiries / Connect Requests
    (courseInquiries || []).forEach((inq) => {
      items.push({
        id: inq.id,
        recordId: inq.inquiryNumber || `CONN-${inq.id.slice(-6)}`,
        name: inq.name,
        phone: inq.phone,
        submittedAt: inq.submittedAt,
        source: 'inquiry',
        rawId: inq.id
      });
    });

    // Sort newest submissions first
    return items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [courseInquiries, studentRegistrations]);

  // Filtered list by Search Query
  const filteredRequests = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return allConnectRequests;
    return allConnectRequests.filter(
      (req) =>
        req.name.toLowerCase().includes(q) ||
        req.phone.toLowerCase().includes(q) ||
        req.recordId.toLowerCase().includes(q)
    );
  }, [allConnectRequests, searchTerm]);

  // Calculate Metrics
  const totalSubmissions = allConnectRequests.length;
  const todaySubmissions = allConnectRequests.filter((r) => isTodayInKolkata(r.submittedAt)).length;

  const handleDelete = (req: { id: string; source: 'inquiry' | 'registration'; name: string }) => {
    if (confirm(`Are you sure you want to delete connect request from "${req.name}"?`)) {
      if (req.source === 'inquiry') {
        deleteCourseInquiry(req.id);
      } else {
        deleteRegistration(req.id);
      }
      showToast('Connect request deleted.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#071B49] via-[#0E2864] to-[#071B49] p-6 rounded-2xl text-white shadow-lg border border-blue-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Lead Generation</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">A2Z Connect Requests</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time callback submissions from website visitors. Timezone set to Asia/Kolkata (IST).
          </p>
        </div>
      </div>

      {/* KPI Cards: Total Submissions & Today's Submissions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submissions</span>
            <div className="text-3xl font-black text-[#003B6D]">{totalSubmissions}</div>
            <p className="text-[11px] text-slate-500">All-time callback requests</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004B87]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Today's Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Submissions</span>
            <div className="text-3xl font-black text-emerald-600">{todaySubmissions}</div>
            <p className="text-[11px] text-emerald-600 font-medium">IST Timezone (Asia/Kolkata)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Quick Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl p-5 border border-blue-100 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Instant Actions</span>
            <p className="text-xs text-blue-800 leading-relaxed">
              Use <strong className="text-blue-900">Call</strong> to dial directly or <strong className="text-emerald-700">WhatsApp</strong> to open a chat immediately.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 ml-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Search Bar & Table Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name or Mobile Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing <span className="text-slate-900 font-bold">{filteredRequests.length}</span> of {totalSubmissions} requests
          </div>
        </div>

        {/* Responsive Submissions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Mobile Number</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  const { date, time } = formatKolkataDateTime(req.submittedAt);
                  const telUrl = getTelUrl(req.phone);
                  const waUrl = getWhatsAppUrl(req.phone);

                  return (
                    <tr key={req.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* ID Column */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {req.recordId}
                      </td>

                      {/* Name Column */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {req.name}
                      </td>

                      {/* Mobile Number Column */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                          <Phone className="w-3 h-3 text-blue-600" />
                          <span>{req.phone}</span>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{date}</span>
                        </div>
                      </td>

                      {/* Time Column */}
                      <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{time}</span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {/* Call Action Button */}
                          <a
                            href={telUrl}
                            title={`Call ${req.name} at ${req.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          {/* WhatsApp Action Button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Open WhatsApp chat with ${req.name}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(req)}
                            title="Delete Request"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">
                          {searchTerm ? 'No connect requests found' : 'No connect requests submitted yet'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {searchTerm
                            ? `No records matching "${searchTerm}". Try clearing your search.`
                            : 'When visitors submit their details on the Connect page, requests will appear here.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
