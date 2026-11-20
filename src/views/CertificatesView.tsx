import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/common/CertificateModal';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  Search,
  ShieldCheck,
  X,
  Calendar,
  FileText,
  ArrowLeft
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { certificates, showToast, navigateTo } = useApp();

  const [certNumber, setCertNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [activeCertificate, setActiveCertificate] = useState<any>(certificates[0] || null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    searched: boolean;
    valid: boolean;
    data?: any;
    message?: string;
  }>({ searched: false, valid: false });

  const handleVerifyWithDob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber.trim() || !dateOfBirth.trim()) {
      showToast('Please enter both Certificate Number and Date of Birth', 'error');
      return;
    }

    const match = certificates.find(
      (c) =>
        c.certificateId.toLowerCase() === certNumber.trim().toLowerCase() &&
        (!c.dateOfBirth || c.dateOfBirth === dateOfBirth.trim())
    );

    if (match) {
      setVerificationResult({
        searched: true,
        valid: true,
        data: match,
      });
      showToast(`Certificate verified for ${match.studentName || match.recipientName}!`, 'success');
    } else {
      setVerificationResult({
        searched: true,
        valid: false,
        message: 'Student is not registered',
      });
      showToast('Student is not registered with these credentials', 'error');
    }
  };

  const handleDownload = (cert: any) => {
    showToast(`Generating official PDF for ${cert.courseTitle || cert.title}...`, 'info');
    setTimeout(() => {
      showToast(`Downloaded: ${cert.certificateId}.pdf`, 'success');
    }, 800);
  };

  const handleShareLinkedIn = (cert: any) => {
    const text = `Excited to have earned my verified certificate in ${cert.courseTitle || cert.title} from A2Z! Certificate ID: ${cert.certificateId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('LinkedIn share announcement copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Back to Home Button */}
        <div>
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Credential Registry</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Certificate Verification & Download Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter your Certificate Number and Date of Birth to verify authenticity and download your secure official PDF credential.
          </p>
        </div>

        {/* Dedicated Verification & Download Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-100 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Certificate Lookup</h2>
              <p className="text-xs text-slate-500">Secure verification backed by A2Z central registry</p>
            </div>
          </div>

          <form onSubmit={handleVerifyWithDob} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Certificate Number
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-2024-9842X"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Verify & Download Certificate</span>
              </button>
            </div>
          </form>

          {/* Verification Result Display */}
          {verificationResult.searched && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              {verificationResult.valid ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Certificate Verified Successfully</p>
                        <p className="text-xs text-emerald-700">Official A2Z accredited record confirmed</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setVerificationResult({ searched: false, valid: false })}
                      className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-emerald-100 space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Name:</span>
                      <span className="font-bold text-slate-900">{verificationResult.data.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Course / Program:</span>
                      <span className="font-bold text-slate-900">{verificationResult.data.courseTitle || verificationResult.data.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Certificate ID:</span>
                      <span className="font-bold text-blue-600">{verificationResult.data.certificateId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Issue Date:</span>
                      <span className="font-bold text-slate-900">{verificationResult.data.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Grade Achieved:</span>
                      <span className="font-bold text-emerald-600">{verificationResult.data.grade}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => handleDownload(verificationResult.data)}
                      className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Official Certificate PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveCertificate(verificationResult.data);
                        setIsViewerOpen(true);
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      View Preview
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-rose-900">Student is not registered</h3>
                    <p className="text-xs sm:text-sm text-rose-700 mt-1 max-w-md mx-auto leading-relaxed">
                      No matching certificate or student record was found with the provided certificate number and date of birth. Please check your credentials and try again.
                    </p>
                  </div>
                  <button
                    onClick={() => setVerificationResult({ searched: false, valid: false })}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FULL CERTIFICATE VIEWER MODAL */}
        {isViewerOpen && activeCertificate && (
          <CertificateModal
            certificate={activeCertificate}
            onClose={() => setIsViewerOpen(false)}
          />
        )}

      </div>
    </div>
  );
};
