import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectRequest } from '../../types';
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Clock,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const ConnectRequestsManagement: React.FC = () => {
  const { connectRequests, updateConnectRequestStatus, deleteConnectRequest, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filtered connect requests (newest first)
  const filteredRequests = useMemo(() => {
    return (connectRequests || []).filter((req) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        req.name.toLowerCase().includes(q) ||
        req.phone.toLowerCase().includes(q) ||
        (req.connectNumber && req.connectNumber.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [connectRequests, search, statusFilter]);

  // Today's lead count in Asia/Kolkata timezone
  const todayConnectCount = useMemo(() => {
    try {
      const kolkataToday = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      return (connectRequests || []).filter((r) => {
        if (!r.submittedAt) return false;
        const rDate = new Date(r.submittedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        return rDate === kolkataToday;
      }).length;
    } catch {
      return 0;
    }
  }, [connectRequests]);

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

  const getCleanPhoneNum = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `91${digits}`;
    }
    return digits;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Connect Requests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{connectRequests.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Received Today (IST)</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{todayConnectCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Follow-ups</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {connectRequests.filter((r) => r.status === 'New').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Connect Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Connect Requests & Leads</h3>
            <p className="text-xs text-slate-500">Submissions strictly from the public Connect page (Name & Mobile only).</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            Showing {filteredRequests.length} of {connectRequests.length}
          </span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No connect requests found</p>
            <p className="text-xs text-slate-500">Connect submissions will appear here instantly when visitors submit the Connect form.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">Submission Date & Time (IST)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredRequests.map((req) => {
                  const cleanNum = getCleanPhoneNum(req.phone);
                  return (
                    <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-blue-600 font-bold">
                        {req.connectNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {req.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {req.phone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatKolkataDateTime(req.submittedAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={req.status}
                          onChange={(e) => updateConnectRequestStatus(req.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                            req.status === 'New'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : req.status === 'Contacted'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Call Action */}
                          <a
                            href={`tel:${req.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                            title="Call Mobile Number"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          {/* WhatsApp Action */}
                          <a
                            href={`https://wa.me/${cleanNum}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                            title="Open WhatsApp Chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Delete Action */}
                          <button
                            onClick={() => deleteConnectRequest(req.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
