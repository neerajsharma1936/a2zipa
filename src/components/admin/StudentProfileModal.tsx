import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConvertedStudent, UploadedDocFile, Certificate } from '../../types';
import { CertificateModal } from '../common/CertificateModal';
import {
  X,
  User,
  GraduationCap,
  Award,
  FileText,
  Upload,
  Download,
  Eye,
  Phone,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit2,
  Camera,
  Trash2,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Layers
} from 'lucide-react';

interface StudentProfileModalProps {
  student: ConvertedStudent;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
}) => {
  const {
    updateConvertedStudentDetails,
    updateConvertedStudentProgress,
    generateCertificate,
    certificates,
    leadActivities,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'certificates' | 'activity'>('profile');

  // Local state for interactive editing inside modal
  const [remarks, setRemarks] = useState(student.adminRemarks || '');
  const [progress, setProgress] = useState(student.progressPercent || 0);
  const [status, setStatus] = useState<ConvertedStudent['status']>(student.status || 'Active');
  const [batchCode, setBatchCode] = useState(student.batchNumber || 'BATCH-2026-A');
  const [previewDoc, setPreviewDoc] = useState<{ title: string; doc: UploadedDocFile } | null>(null);
  const [generatedCertForView, setGeneratedCertForView] = useState<Certificate | null>(null);
  const [certEditMode, setCertEditMode] = useState<boolean>(false);

  // File upload handler for student avatar photo
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateConvertedStudentDetails(student.id, { avatar: dataUrl });
      showToast(`Profile photo updated for ${student.name}!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Generic document upload handler (Summer Cert 1, Summer Cert 2, Resume, Aadhaar)
  const handleDocUpload = (
    field: 'certificateSummer1' | 'certificateSummer2' | 'resume' | 'aadhaarCard',
    label: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const docObj: UploadedDocFile = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      };

      updateConvertedStudentDetails(student.id, { [field]: docObj });
      showToast(`${label} uploaded successfully for ${student.name}!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Save profile updates (progress, status, remarks, batch)
  const handleSaveProfileChanges = () => {
    updateConvertedStudentDetails(student.id, {
      adminRemarks: remarks,
      status,
      batchNumber: batchCode,
      progressPercent: progress,
    });
    updateConvertedStudentProgress(student.id, progress, status);
  };

  // Issue new certificate
  const handleIssueCert = () => {
    const startDt = student.enrollmentDate || '11 Jan 2025';
    const endDt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const cert = generateCertificate(student.course, student.name, startDt, endDt);
    if (cert) {
      updateConvertedStudentDetails(student.id, {
        certificatesIssued: [...(student.certificatesIssued || []), cert.certificateId],
        progressPercent: 100,
        status: 'Completed',
      });
      setProgress(100);
      setStatus('Completed');
      setGeneratedCertForView(cert);
    }
  };

  // Certificates for this student
  const studentCerts = (certificates || []).filter(
    (c) =>
      c.studentName.toLowerCase().trim() === student.name.toLowerCase().trim() ||
      (student.certificatesIssued || []).includes(c.certificateId)
  );

  // Student activities
  const studentLogs = (leadActivities || []).filter((a) => a.registrationId === student.registrationId);

  const cleanPhoneNum = student.phone ? student.phone.replace(/[^0-9]/g, '') : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* MODAL HEADER WITH AVATAR & BASIC BADGES */}
        <div className="bg-gradient-to-r from-[#071B49] via-[#0E2864] to-[#146EF5] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
            title="Close Student Profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pr-10">
            {/* Avatar Container with Upload Overlay */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center font-black text-2xl shadow-inner">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-white font-extrabold uppercase">
                    {student.name.slice(0, 2)}
                  </span>
                )}
              </div>
              <label
                htmlFor={`avatar-upload-${student.id}`}
                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer"
                title="Click to Upload Profile Photo"
              >
                <Camera className="w-5 h-5 text-amber-300" />
                <span className="text-[10px] font-bold mt-1">Change Photo</span>
                <input
                  id={`avatar-upload-${student.id}`}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Student Info Overview */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-400 text-slate-900 shadow-xs">
                  {student.studentId}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-white border border-white/20">
                  {batchCode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    student.status === 'Completed'
                      ? 'bg-emerald-500 text-white'
                      : student.status === 'Dropped'
                      ? 'bg-rose-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {student.status || 'Active Enrolled'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white truncate tracking-tight">
                {student.name}
              </h2>

              <p className="text-xs text-blue-200/90 font-medium truncate">
                {student.course}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100/80 pt-0.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span className="truncate max-w-[220px]">{student.college}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span>Enrolled: {student.enrollmentDate}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL TABS BAR */}
        <div className="bg-slate-100 border-b border-slate-200/80 px-4 pt-2 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
          {[
            { id: 'profile', label: 'Student Profile & Details', icon: <User className="w-4 h-4" /> },
            {
              id: 'documents',
              label: 'Uploaded Documents & PDFs',
              icon: <FileText className="w-4 h-4" />,
              badge: [
                student.certificateSummer1,
                student.certificateSummer2,
                student.resume,
                student.aadhaarCard,
              ].filter(Boolean).length,
            },
            {
              id: 'certificates',
              label: 'Issued Certificates',
              icon: <Award className="w-4 h-4" />,
              badge: studentCerts.length,
            },
            { id: 'activity', label: 'Conversion Logs', icon: <Clock className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 border-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* =========================================================================
              TAB 1: STUDENT PROFILE & ACADEMIC DETAILS
              ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Quick Communication Bar */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {student.phone && (
                    <a
                      href={`tel:${student.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {student.phone}</span>
                    </a>
                  )}
                  {cleanPhoneNum && (
                    <a
                      href={`https://wa.me/${cleanPhoneNum}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>WhatsApp Chat</span>
                    </a>
                  )}
                  {student.email && (
                    <a
                      href={`mailto:${student.email}`}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Student</span>
                    </a>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-semibold">
                  Converted by <span className="text-slate-800 font-bold">{student.convertedBy || 'Admin'}</span>
                </div>
              </div>

              {/* Personal & Academic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academic & College Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Academic & College Background</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">College Name</span>
                      <span className="font-bold text-slate-800 block">{student.college || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Qualification</span>
                      <span className="font-bold text-slate-800 block">{student.qualification || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Branch / Stream</span>
                      <span className="font-bold text-slate-800 block">{student.branch || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Passing Year</span>
                      <span className="font-bold text-slate-800 block">{student.passingYear || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Enrollment & Batch Control Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Course & Enrollment Allocation</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold block text-[10px]">Enrolled Course</span>
                      <span className="font-extrabold text-[#071B49] block text-sm">{student.course}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Batch Allocation</span>
                      <input
                        type="text"
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value)}
                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs mt-0.5 focus:outline-none focus:bg-white focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[10px]">Enrollment Status</span>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs mt-0.5 focus:outline-none focus:bg-white focus:border-blue-600 cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Progress Control Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Course Progress Tracker</span>
                  </h4>
                  <span className="font-black text-sm text-blue-700">{progress}% Completed</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#146EF5]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveProfileChanges}
                    className="px-4 py-2 bg-[#146EF5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Progress</span>
                  </button>
                </div>
              </div>

              {/* Admin Remarks & Notes Box */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <label className="font-extrabold text-xs uppercase tracking-wider text-slate-500 block">
                  Admin Remarks & Student Notes
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter administrative notes, student performance feedback, or internal observations..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveProfileChanges}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Remarks</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: UPLOADED DOCUMENTS & PDF FILES
              ========================================================================= */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs text-blue-900">Student Uploaded Documents Directory</h4>
                    <p className="text-[11px] text-blue-700/80">View, download, or replace uploaded certificates, resumes, and Aadhaar card PDFs.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'certificateSummer1' as const,
                    label: 'Summer Internship Certificate 1',
                    desc: 'Primary 1st Summer Training Certificate',
                    doc: student.certificateSummer1,
                  },
                  {
                    key: 'certificateSummer2' as const,
                    label: 'Summer Internship Certificate 2',
                    desc: 'Secondary Summer Training / Completion Letter',
                    doc: student.certificateSummer2,
                  },
                  {
                    key: 'resume' as const,
                    label: 'Curriculum Vitae / Resume PDF',
                    desc: 'Candidate Official Job Resume',
                    doc: student.resume,
                  },
                  {
                    key: 'aadhaarCard' as const,
                    label: 'Aadhaar Card / Government Identity Proof',
                    desc: 'Government ID verification document',
                    doc: student.aadhaarCard,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-xs text-slate-900 block">{item.label}</span>
                        {item.doc ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                            Uploaded
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                            Missing
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>

                      {item.doc ? (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                          <span className="font-bold text-slate-800 block truncate" title={item.doc.name}>
                            {item.doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {(item.doc.size / 1024).toFixed(1)} KB • {item.doc.type || 'PDF'}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400 italic">
                          No document uploaded yet
                        </div>
                      )}
                    </div>

                    {/* Document Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      {item.doc && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ title: item.label, doc: item.doc! })}
                          className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </button>
                      )}

                      <label
                        htmlFor={`doc-upload-${item.key}-${student.id}`}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        <span>{item.doc ? 'Replace File' : 'Upload File'}</span>
                        <input
                          id={`doc-upload-${item.key}-${student.id}`}
                          type="file"
                          accept=".pdf,image/*,.doc,.docx"
                          onChange={(e) => handleDocUpload(item.key, item.label, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: ISSUED CERTIFICATES
              ========================================================================= */}
          {activeTab === 'certificates' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs text-amber-900">Official Verification Certificates</h4>
                    <p className="text-[11px] text-amber-800/80">Issue and view verifiable completion certificates for {student.name}.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleIssueCert}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue New Certificate</span>
                </button>
              </div>

              {studentCerts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                  <Award className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-extrabold text-slate-700 text-sm">No Official Certificate Issued Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click "Issue New Certificate" above to generate a unique QR verifiable completion certificate for {student.name}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {studentCerts.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            {cert.certificateId}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Verified • Grade: {cert.grade || 'A+'}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-slate-900 text-sm">{cert.courseTitle}</h5>
                        <p className="text-[11px] text-slate-500">
                          Issued on {cert.issueDate} • Director: {cert.directorName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setCertEditMode(false);
                            setGeneratedCertForView(cert);
                          }}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCertEditMode(true);
                            setGeneratedCertForView(cert);
                          }}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Certificate</span>
                        </button>

                        <a
                          href={cert.verificationUrl || `#`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Verify QR</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: ACTIVITY LOGS & CONVERSION HISTORY
              ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Conversion & Lead Timeline</span>
                </h4>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Converted to Enrolled Student</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Enrolled into "{student.course}" under batch {student.batchNumber} by {student.convertedBy}.
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        {new Date(student.convertedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {studentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{log.action}</span>
                        {log.notes && <p className="text-[11px] text-slate-600 mt-0.5">{log.notes}</p>}
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {log.date} at {log.time} • By {log.user}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER BAR */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Student Record ID: <span className="font-mono font-bold text-slate-800">{student.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Profile
            </button>
            <button
              type="button"
              onClick={() => {
                handleSaveProfileChanges();
                onClose();
              }}
              className="px-6 py-2.5 bg-[#146EF5] hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Close</span>
            </button>
          </div>
        </div>

      </div>

      {/* DOCUMENT PREVIEW DIALOG MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white">{previewDoc.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{previewDoc.doc.name}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-100 min-h-[300px]">
              {previewDoc.doc.dataUrl ? (
                previewDoc.doc.type.startsWith('image/') ? (
                  <img
                    src={previewDoc.doc.dataUrl}
                    alt={previewDoc.doc.name}
                    className="max-h-[50vh] object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <iframe
                    src={previewDoc.doc.dataUrl}
                    title={previewDoc.doc.name}
                    className="w-full h-[50vh] rounded-xl border border-slate-300"
                  />
                )
              ) : (
                <div className="text-center space-y-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">{previewDoc.doc.name}</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Size: {(previewDoc.doc.size / 1024).toFixed(1)} KB • Type: {previewDoc.doc.type}
                    </p>
                  </div>
                  {previewDoc.doc.dataUrl && (
                    <a
                      href={previewDoc.doc.dataUrl}
                      download={previewDoc.doc.name}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Document</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Uploaded: {new Date(previewDoc.doc.uploadedAt).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATED OFFICIAL CERTIFICATE MODAL */}
      {generatedCertForView && (
        <CertificateModal
          certificate={generatedCertForView}
          initialEditMode={certEditMode}
          onClose={() => setGeneratedCertForView(null)}
        />
      )}

    </div>
  );
};
