import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, UploadCloud, FileText, Send, Building2, MapPin, DollarSign, Clock } from 'lucide-react';

export const ApplyInternshipModal: React.FC = () => {
  const {
    isApplyModalOpen,
    setIsApplyModalOpen,
    activeApplyInternship,
    currentUser,
    currentRole,
    setRole,
    applyToInternship,
    navigateTo,
  } = useApp();

  const [coverLetter, setCoverLetter] = useState(
    'I have built several React & JavaScript projects and I am excited to contribute to this role. Please review my portfolio and attached resume.'
  );
  const [selectedResume, setSelectedResume] = useState('Rahul_Sharma_Resume_2025.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isApplyModalOpen || !activeApplyInternship) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // If guest, auto-promote to student role
    if (currentRole === 'guest') {
      setRole('student');
    }

    setTimeout(() => {
      const success = applyToInternship(activeApplyInternship.id, coverLetter, selectedResume);
      setIsSubmitting(false);
      if (success) {
        setIsApplyModalOpen(false);
        navigateTo('all-programs');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={activeApplyInternship.companyLogo}
              alt={activeApplyInternship.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
            />
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Application Form
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                {activeApplyInternship.title}
              </h3>
              <p className="text-xs text-slate-500">
                {activeApplyInternship.company} • {activeApplyInternship.location}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApplyModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Summary Strip */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>Stipend: <strong>{activeApplyInternship.stipendText}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Duration: <strong>{activeApplyInternship.duration}</strong></span>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.name}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Resume Selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Resume to attach
            </label>
            <div className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50/30 rounded-xl">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{selectedResume}</p>
                  <p className="text-[10px] text-slate-500">Updated 2 days ago • PDF (420 KB)</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-medium">Default</span>
            </div>
          </div>

          {/* Cover Note */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Why should {activeApplyInternship.company} hire you?
            </label>
            <textarea
              rows={3}
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
              placeholder="Highlight relevant skills and past projects..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
