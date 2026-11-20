import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRegistration, LeadStatus } from '../../types';
import jsPDF from 'jspdf';
import {
  X,
  Phone,
  Mail,
  User,
  BookOpen,
  Calendar,
  Building2,
  Briefcase,
  FileText,
  ShieldCheck,
  FileCheck,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  UserCheck,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';

interface LeadDetailsModalProps {
  registration: StudentRegistration;
  onClose: () => void;
  onConvert: (reg: StudentRegistration) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  registration,
  onClose,
  onConvert,
}) => {
  const {
    updateRegistrationStatus,
    scheduleLeadFollowUp,
    addLeadActivityLog,
    leadActivities,
    leadFollowUps,
    showToast,
    currentUser,
  } = useApp();

  // Status Changer State
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(registration.status || 'New');
  const [statusRemark, setStatusRemarks] = useState('');

  // Schedule Follow-Up State
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [followUpTime, setFollowUpTime] = useState('18:00');
  const [followUpNote, setFollowUpNote] = useState('');

  // Admin Note State
  const [newNote, setNewNote] = useState('');

  // Filter activities for this lead
  const regActivities = (leadActivities || []).filter(
    (a) => a.registrationId === registration.id
  );

  const handleStatusChange = (status: LeadStatus) => {
    setCurrentStatus(status);
    updateRegistrationStatus(registration.id, status, statusRemark);
    showToast(`Lead status updated to ${status}`, 'success');
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate || !followUpNote.trim()) {
      showToast('Please provide date and follow-up note', 'error');
      return;
    }
    scheduleLeadFollowUp(registration.id, {
      followUpDate,
      followUpTime,
      note: followUpNote.trim(),
      assignedAdmin: currentUser.name || 'Admin',
    });
    setFollowUpNote('');
    setShowFollowUpForm(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadActivityLog(
      registration.id,
      'Admin Note Added',
      newNote.trim(),
      currentStatus,
      currentStatus
    );
    setNewNote('');
    showToast('Admin note added to timeline', 'info');
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(7, 27, 73);
      doc.text('A2Z Institute - Application Slip', 14, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Request ID: ${registration.registrationNumber}`, 14, 28);
      doc.text(`Applied Date: ${new Date(registration.submittedAt).toLocaleDateString()}`, 14, 34);

      doc.setFont('helvetica', 'bold');
      doc.text('1. APPLICANT INFORMATION', 14, 46);
      doc.setFont('helvetica', 'normal');
      doc.text(`Full Name: ${registration.name}`, 14, 54);
      doc.text(`Qualification: ${registration.qualification}`, 14, 60);
      doc.text(`Branch / Stream: ${registration.branch}`, 14, 66);
      doc.text(`College / Institute: ${registration.college}`, 14, 72);
      doc.text(`Graduation Date: ${registration.passingYear}`, 14, 78);

      doc.setFont('helvetica', 'bold');
      doc.text('2. APPLICATION DETAILS', 14, 90);
      doc.setFont('helvetica', 'normal');
      doc.text(`Applied Course: ${registration.course || 'General Track'}`, 14, 98);
      doc.text(`Duration: ${registration.duration || 'Not Specified'}`, 14, 104);
      doc.text(`Placement Type: ${registration.placement || 'Job + Internship'}`, 14, 110);
      doc.text(`Mobile: ${registration.phone || 'N/A'}`, 14, 116);
      doc.text(`Email: ${registration.email || 'N/A'}`, 14, 122);
      doc.text(`Current Status: ${registration.status}`, 14, 128);

      doc.save(`Application_${registration.registrationNumber}.pdf`);
      showToast('Downloaded PDF slip successfully', 'success');
    } catch {
      showToast('Failed to generate PDF slip', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#071B49] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#146EF5] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              {registration.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {registration.name}
                </h3>
                <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-400/40 text-blue-200 rounded-md text-[10px] font-mono font-bold">
                  {registration.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5 flex items-center gap-2">
                <span>Applied: {new Date(registration.submittedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className="font-medium text-amber-300">{registration.course || 'General Track'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onConvert(registration)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Convert to Student</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Contact & Action Buttons Strip */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {registration.phone && (
                <>
                  <a
                    href={`tel:${registration.phone.replace(/[^0-9+]/g, '')}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Student ({registration.phone})</span>
                  </a>

                  <a
                    href={`https://wa.me/${registration.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(registration.name)},%20regarding%20your%20registration%20for%20${encodeURIComponent(registration.course || 'A2Z')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </>
              )}

              {registration.email && (
                <a
                  href={`mailto:${registration.email}?subject=Regarding%20your%20A2Z%20Registration&body=Dear%20${encodeURIComponent(registration.name)},`}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Student</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={generatePDF}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Slip</span>
              </button>
            </div>
          </div>

          {/* 3-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Student Information */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
              <h4 className="font-extrabold text-[#071B49] text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <User className="w-3.5 h-3.5 text-[#146EF5]" /> Student Information
              </h4>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Full Name</span>
                <span className="font-bold text-slate-800 text-sm">{registration.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Qualification</span>
                <span className="font-semibold text-slate-800">{registration.qualification}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Branch / Stream</span>
                <span className="font-semibold text-slate-800">{registration.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">College / Institute</span>
                <span className="font-semibold text-slate-800">{registration.college}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Graduation Date</span>
                <span className="font-semibold text-slate-800">{registration.passingYear}</span>
              </div>
            </div>

            {/* Application Information */}
            <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl space-y-2">
              <h4 className="font-extrabold text-[#071B49] text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-blue-200">
                <BookOpen className="w-3.5 h-3.5 text-[#146EF5]" /> Application Details
              </h4>
              <div>
                <span className="text-blue-600 block text-[10px] font-semibold">Applied Course / Program</span>
                <span className="font-black text-[#071B49] text-sm block">{registration.course || 'General Placement Track'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Placement Type</span>
                <span className="font-bold text-slate-800">{registration.placement || 'Job + Internship'}</span>
              </div>
              {registration.duration && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">Duration</span>
                  <span className="font-bold text-slate-800">{registration.duration}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Registration Date</span>
                <span className="font-medium text-slate-800">{new Date(registration.submittedAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Current Lead Status</span>
                <span className="inline-block px-2.5 py-0.5 bg-blue-600 text-white rounded-md font-bold text-[11px] mt-0.5">
                  {registration.status}
                </span>
              </div>
            </div>

            {/* Contact & Follow-up Information */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
              <h4 className="font-extrabold text-[#071B49] text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <Phone className="w-3.5 h-3.5 text-[#146EF5]" /> Contact & Follow-up
              </h4>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Mobile Number</span>
                <span className="font-bold text-slate-800">{registration.phone || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold">Email Address</span>
                <span className="font-semibold text-slate-800 break-all">{registration.email || 'Not Provided'}</span>
              </div>
              {registration.followUpDate && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-amber-800 block text-[10px] font-bold">Active Scheduled Follow-up</span>
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {registration.followUpDate} at {registration.followUpTime}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 italic">"{registration.followUpNote}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Lead Status Transition & Follow-up Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#071B49] uppercase tracking-wider">
                Update Lead Status:
              </span>
              <button
                type="button"
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Schedule Follow-up Call</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {(['New', 'Contacted', 'Follow-up', 'Interested', 'Converted', 'Not Interested'] as LeadStatus[]).map((st) => {
                const isActive = currentStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#146EF5] text-white border-[#146EF5] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            {/* Follow-up Scheduler Form Drawer */}
            {showFollowUpForm && (
              <form onSubmit={handleScheduleFollowUp} className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                <h5 className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Schedule Lead Follow-up Call
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Follow-up Time</label>
                    <input
                      type="time"
                      value={followUpTime}
                      onChange={(e) => setFollowUpTime(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Follow-up Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Student requested a call after 6 PM regarding fee structure"
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFollowUpForm(false)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-amber-700"
                  >
                    Save Follow-up
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Submitted Verification Documents */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#071B49] mb-3">
              Submitted Verification Documents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Resume */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-800 block truncate">Resume / CV</span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {registration.resume?.name || 'Uploaded'}
                    </span>
                  </div>
                </div>
                {registration.resume?.dataUrl && (
                  <a
                    href={registration.resume.dataUrl}
                    download={registration.resume.name}
                    className="p-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Aadhaar */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-800 block truncate">Aadhaar Card</span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {registration.aadhaarCard?.name || 'Uploaded'}
                    </span>
                  </div>
                </div>
                {registration.aadhaarCard?.dataUrl && (
                  <a
                    href={registration.aadhaarCard.dataUrl}
                    download={registration.aadhaarCard.name}
                    className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Summer Cert */}
              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-800 block truncate">Summer Internship</span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {registration.certificateSummer1?.name || 'Uploaded'}
                    </span>
                  </div>
                </div>
                {registration.certificateSummer1?.dataUrl && (
                  <a
                    href={registration.certificateSummer1.dataUrl}
                    download={registration.certificateSummer1.name}
                    className="p-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Activity Timeline & Add Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#071B49] flex items-center justify-between">
              <span>Complete Activity Timeline</span>
              <span className="text-[10px] font-normal text-slate-400">{regActivities.length} logs recorded</span>
            </h4>

            {/* Add Quick Admin Note */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add internal admin note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#146EF5] hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Note
              </button>
            </form>

            {/* Activity Stream */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl max-h-60 overflow-y-auto space-y-3">
              {regActivities.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-2">No activity timeline recorded yet.</p>
              ) : (
                regActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs border-b border-slate-200/60 pb-2.5 last:border-none last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-[#146EF5] mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{act.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{act.date} {act.time}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{act.notes}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">By: {act.user}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
