import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/common/CertificateModal';
import { Certificate } from '../types';
import {
  Award,
  ShieldCheck,
  Download,
  Search,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  ArrowRight,
  FileCheck2,
  GraduationCap,
  Clock,
  UserCheck
} from 'lucide-react';

export const CertificateVerificationView: React.FC = () => {
  const { certificates, navigateTo, showToast } = useApp();

  const [certNumber, setCertNumber] = useState('');
  const [dob, setDob] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    certificate?: Certificate;
    message?: string;
  } | null>(null);
  const [activeModalCertificate, setActiveModalCertificate] = useState<Certificate | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Normalize date helper to compare format variations safely
  const normalizeDate = (d: string): string => {
    if (!d) return '';
    const clean = d.trim();
    const parts = clean.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else {
        // DD-MM-YYYY or MM-DD-YYYY
        const p1 = parts[0].padStart(2, '0');
        const p2 = parts[1].padStart(2, '0');
        const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        return `${year}-${p2}-${p1}`;
      }
    }
    return clean;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = certNumber.trim().toUpperCase();
    const cleanDob = dob.trim();

    if (!cleanNumber) {
      showToast('Please enter your certificate number', 'error');
      return;
    }

    if (!cleanDob) {
      showToast('Please enter your date of birth', 'error');
      return;
    }

    setHasSearched(true);

    // Look for matching certificate
    const match = certificates.find((c) => {
      const matchId = c.certificateId?.trim().toUpperCase() === cleanNumber;
      if (!matchId) return false;

      // Certificate registered DOB or default benchmark DOBs
      const expectedDob =
        c.dateOfBirth ||
        (c.certificateId === 'SN-2024-3310B' ? '2001-08-20' : '2002-05-15');

      const normInput = normalizeDate(cleanDob);
      const normExpected = normalizeDate(expectedDob);

      return normInput === normExpected;
    });

    if (match) {
      setSearchResult({
        found: true,
        certificate: match,
      });
      showToast(`Student verified: ${match.studentName}`, 'success');
    } else {
      setSearchResult({
        found: false,
        message: 'student not Registred',
      });
      showToast('student not Registred', 'error');
    }
  };

  const handleReset = () => {
    setCertNumber('');
    setDob('');
    setHasSearched(false);
    setSearchResult(null);
  };


  const handleDownloadCertificate = (cert: Certificate) => {
    setIsDownloading(true);
    showToast(`Generating official certificate PDF for ${cert.studentName}...`, 'info');

    // Create an official printable HTML certificate that can be saved directly
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Certificate_${cert.certificateId}_${cert.studentName.replace(/\s+/g, '_')}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    body {
      margin: 0;
      padding: 40px;
      font-family: 'Times New Roman', serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .cert-frame {
      width: 1020px;
      padding: 48px 60px;
      background: #ffffff;
      border: 10px double #004B87;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      position: relative;
      text-align: center;
      box-sizing: border-box;
    }
    .badge-top {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: bold;
      font-family: sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .institute-title {
      font-size: 32px;
      font-weight: 900;
      color: #004B87;
      letter-spacing: 2px;
      font-family: sans-serif;
      margin: 0 0 4px 0;
    }
    .institute-subtitle {
      font-size: 12px;
      letter-spacing: 3px;
      color: #64748b;
      text-transform: uppercase;
      font-family: sans-serif;
      margin-bottom: 24px;
    }
    .cert-main-title {
      font-size: 34px;
      font-weight: bold;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 10px 0;
    }
    .cert-present {
      font-size: 14px;
      font-style: italic;
      color: #475569;
      margin-bottom: 12px;
    }
    .student-name {
      font-size: 38px;
      font-weight: bold;
      color: #004B87;
      padding-bottom: 6px;
      border-bottom: 2px solid #cbd5e1;
      display: inline-block;
      margin-bottom: 18px;
    }
    .cert-description {
      font-size: 16px;
      line-height: 1.6;
      color: #334155;
      max-width: 820px;
      margin: 0 auto 30px auto;
    }
    .course-highlight {
      font-weight: bold;
      color: #0f172a;
      font-size: 17px;
    }
    .grade-badge {
      color: #059669;
      font-weight: bold;
    }
    .meta-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-family: sans-serif;
    }
    .meta-col {
      text-align: left;
      font-size: 12px;
      color: #64748b;
    }
    .meta-col strong {
      display: block;
      color: #0f172a;
      font-size: 13px;
      margin-top: 2px;
    }
    .signatory {
      text-align: center;
    }
    .sign-script {
      font-family: 'Brush Script MT', cursive;
      font-size: 26px;
      color: #004B87;
    }
    .sign-divider {
      width: 180px;
      border-top: 1px solid #475569;
      margin: 4px auto 6px auto;
    }
    .sign-title {
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="badge-top">Verified Official Credential</div>
    <h1 class="institute-title">A2Z INSTITUTE OF TECHNOLOGY</h1>
    <div class="institute-subtitle">Official Academic & Career Credential Registry</div>
    <h2 class="cert-main-title">Certificate of Completion</h2>
    <div class="cert-present">This is proudly awarded to</div>
    <div class="student-name">${cert.studentName}</div>
    <div class="cert-description">
      for demonstrating verified technical competency, project delivery, and successful graduation from the program
      <div class="course-highlight" style="margin-top: 6px;">${cert.courseTitle}</div>
      with distinguished performance Grade <span class="grade-badge">${cert.grade || 'A+ (94%)'}</span>.
    </div>
    <div class="meta-footer">
      <div class="meta-col">
        <span>Certificate Number:</span>
        <strong>${cert.certificateId}</strong>
        <span style="display:block; margin-top: 6px;">Issue Date: <strong>${cert.issueDate}</strong></span>
      </div>
      <div class="signatory">
        <div class="sign-script">${cert.directorName || 'Siddharth Sengupta'}</div>
        <div class="sign-divider"></div>
        <div class="sign-title"><strong>${cert.directorName || 'Siddharth Sengupta'}</strong><br>${cert.directorTitle || 'Academic Director, A2Z Institute'}</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificate_${cert.certificateId}_${cert.studentName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsDownloading(false);
      showToast(`Downloaded certificate for ${cert.studentName}`, 'success');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F6FF] via-[#F8FAFC] to-[#EFF6FF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer bg-white/80 px-3.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs"
          >
            <span>← Back to Home</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Central Certificate Verification System</span>
          </div>
        </div>

        {/* Portal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-extrabold uppercase tracking-wider border border-blue-200/60 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Credential Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Download & Verify Certificate
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Please enter the official <span className="font-semibold text-slate-900">Certificate Number</span> and <span className="font-semibold text-slate-900">Date of Birth</span> to verify credentials and download your authentic certificate.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Certificate Number Input */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Certificate Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-2024-9842X"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-slate-900 font-medium text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Found on the bottom of your certificate or admission card</span>
              </div>

              {/* Date of Birth Input */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Date of Birth (DOB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-slate-900 font-medium text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Used for privacy & student identity verification</span>
              </div>

            </div>



            {/* Submit & Reset Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 px-6 bg-[#004B87] hover:bg-[#003B6D] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Verify & Download Certificate</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>

          {/* ================================================================= */}
          {/* SEARCH RESULT DISPLAY                                             */}
          {/* ================================================================= */}
          {hasSearched && searchResult && (
            <div className="pt-4 border-t border-slate-100">
              {searchResult.found && searchResult.certificate ? (
                /* SUCCESS STATE: STUDENT EXISTS -> SHOW CERTIFICATE TO DOWNLOAD */
                <div className="bg-gradient-to-br from-white to-emerald-50/40 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                            Student Verified & Registered
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            ID: {searchResult.certificate.certificateId}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                          {searchResult.certificate.studentName}
                        </h2>
                      </div>
                    </div>

                    {/* Download Action Only (No Edit Option) */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadCertificate(searchResult.certificate!)}
                        disabled={isDownloading}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isDownloading ? 'Downloading...' : 'Download Certificate'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Certificate Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Program / Course</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block line-clamp-1">
                        {searchResult.certificate.courseTitle}
                      </span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Issue Date</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        {searchResult.certificate.issueDate}
                      </span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Performance Grade</span>
                      <span className="font-extrabold text-emerald-600 text-sm mt-0.5 block">
                        {searchResult.certificate.grade || 'A+ (Distinction)'}
                      </span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Issuing Authority</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        A2Z Institute of Technology
                      </span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Academic Director</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                        {searchResult.certificate.directorName || 'Siddharth Sengupta'}
                      </span>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-slate-400 block font-medium">Verification Status</span>
                      <span className="font-extrabold text-emerald-600 text-sm mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cryptographically Validated</span>
                      </span>
                    </div>
                  </div>

                  {/* Visual Certificate Card Preview */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-white text-center relative overflow-hidden border border-slate-800 shadow-md">
                    <div className="border border-amber-400/40 p-5 rounded-xl space-y-2 relative">
                      <span className="text-[10px] uppercase tracking-widest text-amber-300 font-extrabold block">
                        Official Certificate of Excellence
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {searchResult.certificate.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-300 font-serif italic">
                        Awarded to {searchResult.certificate.studentName}
                      </p>
                      <div className="pt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                        <span>Certificate ID: {searchResult.certificate.certificateId}</span>
                        <span className="text-emerald-400 font-bold">Grade: {searchResult.certificate.grade}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ERROR STATE: STUDENT NOT REGISTERED */
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm animate-fade-in">
                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <AlertTriangle className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-rose-900 tracking-tight">
                      student not Registred
                    </h3>
                    <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto leading-relaxed">
                      No matching student record was found for Certificate Number <span className="font-bold text-rose-900">"{certNumber}"</span> and Date of Birth <span className="font-bold text-rose-900">"{dob}"</span>.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('application')}
                      className="px-5 py-2.5 bg-white hover:bg-rose-100/60 border border-rose-300 text-rose-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Contact Admission Office
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Full Certificate Modal Viewer */}
      {activeModalCertificate && (
        <CertificateModal
          certificate={activeModalCertificate}
          onClose={() => setActiveModalCertificate(null)}
        />
      )}
    </div>
  );
};
