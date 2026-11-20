import React, { useState } from 'react';
import { Certificate } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Award,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
  initialEditMode?: boolean;
  allowEdit?: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  initialEditMode = false,
  allowEdit = false,
}) => {
  const { updateCertificate, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(initialEditMode);

  // Local state for certificate editing
  const [formData, setFormData] = useState({
    studentName: certificate.studentName || '',
    courseTitle: certificate.courseTitle || '',
    startDate: certificate.startDate || '11 Jan 2025',
    endDate: certificate.endDate || certificate.issueDate || '11 Apr 2025',
    certificateId: certificate.certificateId || '',
    directorName: certificate.directorName || 'Siddharth Sengupta',
    directorTitle: certificate.directorTitle || 'Academic Director',
    grade: certificate.grade || 'A+',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (!formData.studentName.trim()) {
      showToast('Student name cannot be empty', 'error');
      return;
    }
    if (!formData.courseTitle.trim()) {
      showToast('Course name cannot be empty', 'error');
      return;
    }

    updateCertificate(certificate.id, {
      studentName: formData.studentName,
      courseTitle: formData.courseTitle,
      startDate: formData.startDate,
      endDate: formData.endDate,
      certificateId: formData.certificateId,
      directorName: formData.directorName,
      directorTitle: formData.directorTitle,
      grade: formData.grade,
      issueDate: formData.endDate,
    });

    setIsEditing(false);
  };

  const handleReset = () => {
    setFormData({
      studentName: certificate.studentName || '',
      courseTitle: certificate.courseTitle || '',
      startDate: certificate.startDate || '11 Jan 2025',
      endDate: certificate.endDate || certificate.issueDate || '11 Apr 2025',
      certificateId: certificate.certificateId || '',
      directorName: certificate.directorName || 'Siddharth Sengupta',
      directorTitle: certificate.directorTitle || 'Academic Director',
      grade: certificate.grade || 'A+',
    });
  };

  return (
    <div className="fixed inset-0 z-80 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl relative space-y-6 my-auto max-h-[94vh] flex flex-col overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Official Student Certificate
              </h3>
              <p className="text-[11px] text-slate-500">
                QR-Verified Accredited Certificate • Admin Customizable
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allowEdit && (<button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isEditing
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Viewing Live Preview' : 'Edit Certificate'}</span>
            </button>)}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ADMIN EDIT CERTIFICATE FORM PANEL */}
        {isEditing && (
          <div className="bg-amber-50/90 border-2 border-amber-300 p-4 sm:p-5 rounded-2xl space-y-4 shrink-0 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-700" />
                <h4 className="font-black text-xs uppercase tracking-wider text-amber-900">
                  Admin Certificate Editor
                </h4>
              </div>
              <span className="text-[10px] text-amber-800 font-semibold">
                Changes update in live preview instantly below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Full Student Name"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Enrolled Course Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseTitle}
                  onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Certificate Verification No.
                </label>
                <input
                  type="text"
                  value={formData.certificateId}
                  onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                  placeholder="CERT-2026-XXXX"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Course Starting Date
                </label>
                <input
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="e.g. 11 Jan 2025"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Course Ending Date
                </label>
                <input
                  type="text"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="e.g. 11 Apr 2025"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Grade / Distinction
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g. A+ (Distinction)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Director Name
                </label>
                <input
                  type="text"
                  value={formData.directorName}
                  onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                  placeholder="Director Name"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] block mb-1">
                  Director Designation
                </label>
                <input
                  type="text"
                  value={formData.directorTitle}
                  onChange={(e) => setFormData({ ...formData, directorTitle: e.target.value })}
                  placeholder="Academic Director"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/80">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Certificate Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* ELEGANT CERTIFICATE BOARD (CANVAS) */}
        <div
          id="printable-certificate"
          className="border-8 border-double border-amber-600/40 p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 text-center relative overflow-hidden shadow-inner space-y-6"
        >
          {/* HEADER ROW: TOP-LEFT LOGO & TOP-RIGHT CERTIFICATE VERIFICATION NUMBER */}
          <div className="flex items-start justify-between gap-4 text-left border-b border-amber-200/80 pb-4">
            
            {/* 1. LOGO ON TOP LEFT SIDE */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#071B49] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 border border-blue-400/30">
                <GraduationCap className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="font-black text-slate-900 text-sm tracking-tight block">
                  A2Z ACADEMY & INSTITUTE
                </span>
                <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase block">
                  Govt. Recognized & ISO 9001:2015 Verified
                </span>
              </div>
            </div>

            {/* 5. CERTIFICATE NO TO VERIFY THE CERTIFICATE */}
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                Certificate Verification No.
              </span>
              <span className="font-mono font-black text-xs text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md block mt-1 shadow-2xs">
                {formData.certificateId}
              </span>
            </div>
          </div>

          {/* CERTIFICATE TITLE */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-widest block">
              Official Credential of Achievement
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-500 font-serif italic">This certificate is proudly awarded to</p>
          </div>

          {/* 2. NAME OF THE STUDENT */}
          <div className="py-2 border-b-2 border-amber-400/80 max-w-md mx-auto">
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#071B49] tracking-tight">
              {formData.studentName}
            </h1>
          </div>

          {/* 3. SELECTED COURSE NAME & 4. COURSE STARTING AND ENDING DATE */}
          <div className="space-y-3 max-w-lg mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="text-slate-600">
              for successfully fulfilling all academic requirements, practical training, and mastering
            </p>
            
            {/* SELECTED COURSE NAME */}
            <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-300/80 inline-block w-full shadow-2xs">
              <span className="font-black text-slate-900 text-sm sm:text-base block">
                {formData.courseTitle}
              </span>
            </div>

            {/* COURSE STARTING AND ENDING DATE */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-700 bg-white/90 p-2.5 rounded-xl border border-slate-200 shadow-xs max-w-md mx-auto">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Course Start Date</span>
                  <span className="font-extrabold text-slate-900">{formData.startDate}</span>
                </div>
              </div>

              <span className="text-slate-300 font-black text-base">•</span>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Course End Date</span>
                  <span className="font-extrabold text-slate-900">{formData.endDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIGNATURES & QR CODE FOR VERIFICATION */}
          <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-left space-y-0.5">
              <p className="font-serif italic text-base font-bold text-slate-900">{formData.directorName}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{formData.directorTitle}</p>
            </div>

            {/* QR CODE FOR VERIFICATION */}
            <div className="text-center p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://a2z.org/verify-certificate/${formData.certificateId}`}
                alt="QR Verification"
                className="w-14 h-14 object-contain"
              />
              <span className="text-[9px] font-mono font-black text-blue-900 block mt-1">
                Verify ID: {formData.certificateId}
              </span>
            </div>

            <div className="text-right space-y-0.5">
              <p className="font-serif italic text-base font-bold text-slate-900">Dr. Priya Patel</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Council Chairperson</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Certificate Issued & Publicly Verifiable</span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#146EF5] hover:bg-blue-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
