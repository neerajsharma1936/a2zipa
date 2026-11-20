import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Certificate } from '../types';
import { CertificateModal } from '../components/common/CertificateModal';
import {
  ShieldCheck,
  Award,
  Calendar,
  Search,
  Download,
  Printer,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  GraduationCap,
  Sparkles,
  QrCode,
  ArrowRight,
  FileText,
  UserCheck
} from 'lucide-react';

export const VerifyCertificateView: React.FC = () => {
  const { certificates, navigateTo, showToast } = useApp();

  const [certificateNumber, setCertificateNumber] = useState('');
  const [dob, setDob] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedCertificate, setMatchedCertificate] = useState<Certificate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Helper to normalize various date formats (YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, etc.)
  const normalizeDate = (d: string): string => {
    if (!d) return '';
    const clean = d.trim().replace(/\//g, '-');
    const parts = clean.split('-');
    if (parts.length === 3) {
      // If YYYY-MM-DD
      if (parts[0].length === 4) {
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
      // If DD-MM-YYYY
      if (parts[2].length === 4) {
        const y = parts[2];
        const m = parts[1].padStart(2, '0');
        const day = parts[0].padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
    }
    return clean.toLowerCase();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCertNo = certificateNumber.trim();
    const trimmedDob = dob.trim();

    if (!trimmedCertNo) {
      showToast('Please enter your Certificate Number', 'error');
      return;
    }
    if (!trimmedDob) {
      showToast('Please select or enter your Date of Birth', 'error');
      return;
    }

    setIsVerifying(true);
    setHasSearched(true);

    setTimeout(() => {
      setIsVerifying(false);

      const normUserDob = normalizeDate(trimmedDob);
      const cleanCertInput = trimmedCertNo.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Search in central certificate records
      const found = certificates.find((cert) => {
        const cleanCertId = cert.certificateId.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idMatches = cleanCertId === cleanCertInput;

        if (!idMatches) return false;

        // If certificate has a DOB recorded, verify it
        if (cert.dob) {
          const normCertDob = normalizeDate(cert.dob);
          return normCertDob === normUserDob;
        }

        // If certificate doesn't have an explicit DOB, allow verification on ID match
        return true;
      });

      if (found) {
        setMatchedCertificate(found);
        setErrorMessage(null);
        showToast('Certificate verified successfully!', 'success');
      } else {
        setMatchedCertificate(null);
        setErrorMessage('Student is not registered');
        showToast('Student is not registered', 'error');
      }
    }, 450);
  };

  const handleReset = () => {
    setCertificateNumber('');
    setDob('');
    setHasSearched(false);
    setMatchedCertificate(null);
    setErrorMessage(null);
  };

  const handleApplyDemo = (demoCertId: string, demoDob: string) => {
    setCertificateNumber(demoCertId);
    setDob(demoDob);
    setHasSearched(false);
    setMatchedCertificate(null);
    setErrorMessage(null);
  };

  const handleDownload = () => {
    if (!matchedCertificate) return;
    showToast(`Generating official PDF for ${matchedCertificate.certificateId}...`, 'info');
    setTimeout(() => {
      // Simulate real browser PDF file download
      const element = document.createElement('a');
      const textContent = `
=====================================================
A2Z ACADEMY & INSTITUTE - OFFICIAL STUDENT CERTIFICATE
=====================================================
Certificate ID  : ${matchedCertificate.certificateId}
Student Name    : ${matchedCertificate.studentName}
Course Title    : ${matchedCertificate.courseTitle}
Grade           : ${matchedCertificate.grade}
Issue Date      : ${matchedCertificate.issueDate}
Date of Birth   : ${matchedCertificate.dob || 'Registered on file'}
Director        : ${matchedCertificate.directorName} (${matchedCertificate.directorTitle})
Verification URL: https://a2z.org/verify-certificate/${matchedCertificate.certificateId}
Govt. Recognized & ISO 9001:2015 Verified
=====================================================
      `.trim();
      const file = new Blob([textContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `A2Z_Certificate_${matchedCertificate.certificateId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showToast(`Downloaded certificate: ${matchedCertificate.certificateId}`, 'success');
    }, 700);
  };

  const handlePrint = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Download Certificate</span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#003B6D] via-[#004B87] to-[#0077D4] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-blue-100 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Official Student Credential Verification Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Download Student Certificate
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Enter your official Certificate Verification Number and Date of Birth as registered with A2Z Institute to access and download your accredited certificate.
            </p>
          </div>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">
                  Search & Verify Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Provide your registered certificate number and date of birth
                </p>
              </div>
            </div>

            {hasSearched && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Field 1: Certificate Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Certificate Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-2024-9842X"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Found on your training completion slip or admission document
                </span>
              </div>

              {/* Field 2: Date of Birth */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Date of birth matching your student enrollment record
                </span>
              </div>

            </div>

            {/* Quick Demo Pre-fills for testing */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">Quick Test Records:</span>
              <button
                type="button"
                onClick={() => handleApplyDemo('SN-2024-9842X', '2002-08-15')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors cursor-pointer"
              >
                Rahul Sharma (SN-2024-9842X • 15/08/2002)
              </button>
              <button
                type="button"
                onClick={() => handleApplyDemo('A2Z-2025-7721A', '2003-11-20')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                Pooja Verma (A2Z-2025-7721A • 20/11/2003)
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Download Certificate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ERROR STATE: "student is not registered" */}
        {hasSearched && errorMessage && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-black text-rose-900 tracking-tight">
                  student is not registered
                </h3>
                <p className="text-xs sm:text-sm text-rose-800 leading-relaxed font-medium">
                  No active student registration or certificate was found matching Certificate Number{' '}
                  <span className="font-mono font-bold bg-rose-100 px-1.5 py-0.5 rounded text-rose-950">
                    {certificateNumber}
                  </span>{' '}
                  and Date of Birth{' '}
                  <span className="font-semibold bg-rose-100 px-1.5 py-0.5 rounded text-rose-950">
                    {dob}
                  </span>.
                </p>
                <div className="pt-2 text-xs text-rose-700 space-y-1">
                  <p className="font-semibold">• Please check your certificate number for typos.</p>
                  <p className="font-semibold">• Ensure your date of birth matches your official enrollment form.</p>
                  <p className="font-semibold">
                    • Need help? Contact our verification helpdesk at{' '}
                    <a href="tel:+917903328407" className="underline font-bold">
                      +91 79033 28407
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STATE: SHOW THE CERTIFICATE TO DOWNLOAD */}
        {hasSearched && matchedCertificate && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {/* Success Banner */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    Certificate Verified & Ready for Download
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Student: <span className="font-bold">{matchedCertificate.studentName}</span> • Certificate No:{' '}
                    <span className="font-mono font-bold">{matchedCertificate.certificateId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>View / Print</span>
                </button>
              </div>
            </div>

            {/* Certificate Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Official Accredited Credential
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {matchedCertificate.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-serif italic mt-0.5">
                    Awarded to {matchedCertificate.studentName}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Grade Awarded
                  </span>
                  <span className="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 inline-block mt-0.5">
                    {matchedCertificate.grade}
                  </span>
                </div>
              </div>

              {/* Student and Certificate Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Student Name</span>
                  <span className="font-bold text-slate-800 text-sm">{matchedCertificate.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Certificate No.</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">{matchedCertificate.certificateId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{matchedCertificate.dob || dob}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Issue Date</span>
                  <span className="font-semibold text-slate-800">{matchedCertificate.issueDate}</span>
                </div>
              </div>

              {/* Framed Certificate Canvas Preview */}
              <div className="border-4 border-double border-amber-600/40 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center relative overflow-hidden shadow-inner space-y-5">
                <div className="flex items-start justify-between border-b border-amber-200/70 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#071B49] text-white flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="font-black text-slate-900 text-xs block">A2Z ACADEMY & INSTITUTE</span>
                      <span className="text-[9px] font-bold text-amber-800 uppercase block">ISO 9001:2015 Verified</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Verification No.</span>
                    <span className="font-mono font-black text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {matchedCertificate.certificateId}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">
                    Certificate of Completion
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#071B49]">
                    {matchedCertificate.studentName}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto pt-1 leading-relaxed">
                    has successfully fulfilled all requirements and completed the comprehensive course in
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-900 bg-amber-100/70 py-1.5 px-4 rounded-xl border border-amber-200 inline-block mt-2">
                    {matchedCertificate.courseTitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-200/70 flex items-center justify-between text-xs text-slate-600">
                  <div className="text-left">
                    <p className="font-serif italic font-bold text-slate-900">{matchedCertificate.directorName}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{matchedCertificate.directorTitle}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://a2z.org/verify-certificate/${matchedCertificate.certificateId}`}
                      alt="QR"
                      className="w-12 h-12"
                    />
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">QR Verified</span>
                  </div>
                  <div className="text-right">
                    <p className="font-serif italic font-bold text-slate-900">Academic Council</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Authorized Seal</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Publicly verifiable credential stored on permanent records</span>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open High-Res Certificate</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* High-Resolution Certificate Modal */}
      {isModalOpen && matchedCertificate && (
        <CertificateModal
          certificate={matchedCertificate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
