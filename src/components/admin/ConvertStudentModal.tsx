import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRegistration } from '../../types';
import {
  X,
  UserCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ConvertStudentModalProps {
  registration: StudentRegistration;
  onClose: () => void;
  onConvertedSuccess?: () => void;
}

export const ConvertStudentModal: React.FC<ConvertStudentModalProps> = ({
  registration,
  onClose,
  onConvertedSuccess,
}) => {
  const { convertLeadToStudent, courses, showToast } = useApp();

  const [studentId] = useState(() => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `STU-${new Date().getFullYear()}-${num}`;
  });

  const [batchNumber, setBatchNumber] = useState(`BATCH-${new Date().getFullYear()}-A`);
  const [selectedCourse, setSelectedCourse] = useState(
    registration.course || 'Full Stack Web Development (MERN)'
  );

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse.trim()) {
      showToast('Please select a course', 'error');
      return;
    }

    const converted = convertLeadToStudent(registration.id, {
      course: selectedCourse,
      batchNumber: batchNumber.trim() || `BATCH-${new Date().getFullYear()}-A`,
      studentId,
    });

    if (converted) {
      if (onConvertedSuccess) onConvertedSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Convert Request to Enrolled Student
              </h3>
              <p className="text-xs text-emerald-100/80">
                Official enrollment & course activation for {registration.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 text-emerald-100 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConvertSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Candidate Summary</span>
            <span className="font-extrabold text-slate-900 text-sm block">{registration.name}</span>
            <span className="text-slate-600 block">{registration.college} • {registration.branch}</span>
            <span className="text-slate-500 block">Mobile: {registration.phone || 'N/A'} | Email: {registration.email || 'N/A'}</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Generated Student ID</label>
            <input
              type="text"
              readOnly
              value={studentId}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Enrolled Course / Program</label>
            <input
              type="text"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              placeholder="e.g. Full Stack Web Development (MERN)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Batch Allocation Code</label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. BATCH-2026-A"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Student Enrollment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
