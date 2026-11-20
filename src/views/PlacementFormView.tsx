import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StudentRegistration, UploadedDocFile } from '../types';
import {
  GraduationCap,
  User,
  FileCheck,
  CheckCircle2,
  ArrowLeft,
  UploadCloud,
  X,
  FileText,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export const PlacementFormView: React.FC = () => {
  const { addStudentRegistration, navigateTo, showToast, qualifications } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    fathersName: '',
    qualification: '',
  });

  const [cert1File, setCert1File] = useState<UploadedDocFile | null>(null);
  const [cert2File, setCert2File] = useState<UploadedDocFile | null>(null);

  const cert1InputRef = useRef<HTMLInputElement>(null);
  const cert2InputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPlacement, setSubmittedPlacement] = useState<StudentRegistration | null>(null);

  const defaultQualList = ['B.Tech', 'Diploma', 'ITI (OJT)', 'M.Tech', 'Non Technical', 'Other'];
  const mergedQualifications = Array.from(new Set([...defaultQualList, ...qualifications]));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const processFileUpload = (
    file: File,
    setter: (doc: UploadedDocFile | null) => void,
    label: string,
    maxSizeMB: number = 10
  ) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      showToast(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max limit is ${maxSizeMB}MB.`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const doc: UploadedDocFile = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      };
      setter(doc);
      showToast(`${label} attached: ${file.name}`, 'success');
    };
    reader.onerror = () => {
      showToast(`Failed to read file ${file.name}`, 'error');
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.fathersName.trim()) errs.fathersName = "Father's Name is required";
    if (!formData.qualification.trim()) errs.qualification = 'Qualification is required';
    if (!cert1File) errs.cert1 = 'Internship Certificate 1 is required';
    if (!cert2File) errs.cert2 = 'Internship Certificate 2 is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fill in all required fields and upload both certificates', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const regNumber = `PLC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newRecord: StudentRegistration = {
        id: `plc_${Date.now()}`,
        registrationNumber: regNumber,
        placement: 'Job + Internship Placement',
        name: formData.name.trim(),
        qualification: formData.qualification,
        branch: 'Placement Track',
        college: `Father: ${formData.fathersName.trim()}`,
        passingYear: new Date().getFullYear().toString(),
        status: 'New',
        submittedAt: new Date().toISOString(),
        certificateSummer1: cert1File || undefined,
        certificateSummer2: cert2File || undefined,
        adminRemarks: `Placement Registration Form | Father: ${formData.fathersName.trim()}`,
      };

      addStudentRegistration(newRecord);
      setSubmittedPlacement(newRecord);
      setIsSubmitting(false);
      showToast('Placement application submitted successfully!', 'success');
    }, 800);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (submittedPlacement) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-200/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Placement Registration Successful
            </span>
            <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your placement application has been successfully recorded with Reference Number <strong className="font-mono text-blue-700">{submittedPlacement.registrationNumber}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 max-w-lg mx-auto text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Applicant Name:</span>
              <span className="font-bold text-slate-900">{submittedPlacement.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Father's Name:</span>
              <span className="font-bold text-slate-900">{formData.fathersName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Qualification:</span>
              <span className="font-bold text-slate-900">{submittedPlacement.qualification}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Internship Certificate 1:</span>
              <span className="font-bold text-emerald-700 truncate max-w-[200px]">{cert1File?.name || 'Attached'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Internship Certificate 2:</span>
              <span className="font-bold text-emerald-700 truncate max-w-[200px]">{cert2File?.name || 'Attached'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3 bg-[#004B87] hover:bg-[#003B6D] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => {
                setSubmittedPlacement(null);
                setFormData({ name: '', fathersName: '', qualification: '' });
                setCert1File(null);
                setCert2File(null);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#003B6D] to-[#005FA3] text-white p-6 sm:p-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-amber-400" />
              <span>Placement Application Form</span>
            </h1>
            <p className="text-xs text-blue-100/95">
              Submit your candidate details and internship certificates for corporate placement shortlisting.
            </p>
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none ${
                    errors.name ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.name && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.name}</span>}
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Father's Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter father's full name"
                  value={formData.fathersName}
                  onChange={(e) => handleInputChange('fathersName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none ${
                    errors.fathersName ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.fathersName && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.fathersName}</span>}
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Qualification <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none cursor-pointer ${
                  errors.qualification ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                }`}
              >
                <option value="" disabled hidden>Select your qualification</option>
                {mergedQualifications.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            {errors.qualification && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.qualification}</span>}
          </div>

          {/* Certificate Uploads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Internship Certificate 1 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Internship Certificate 1 <span className="text-rose-500">*</span>
              </label>
              {cert1File ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800 block truncate">{cert1File.name}</span>
                      <span className="text-[10px] text-slate-500">{formatFileSize(cert1File.size)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCert1File(null)}
                    className="w-6 h-6 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-slate-200 shrink-0"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => cert1InputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-blue-50/50 group ${
                    errors.cert1 ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 hover:border-blue-500'
                  }`}
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mx-auto mb-1 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 block">Upload Certificate 1</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">PDF, JPG, PNG (Max 10MB)</span>
                </div>
              )}
              <input
                ref={cert1InputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFileUpload(e.target.files[0], setCert1File, 'Internship Certificate 1', 10);
                  }
                }}
              />
              {errors.cert1 && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.cert1}</span>}
            </div>

            {/* Internship Certificate 2 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Internship Certificate 2 <span className="text-rose-500">*</span>
              </label>
              {cert2File ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800 block truncate">{cert2File.name}</span>
                      <span className="text-[10px] text-slate-500">{formatFileSize(cert2File.size)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCert2File(null)}
                    className="w-6 h-6 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center border border-slate-200 shrink-0"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => cert2InputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-blue-50/50 group ${
                    errors.cert2 ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 hover:border-blue-500'
                  }`}
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mx-auto mb-1 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 block">Upload Certificate 2</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">PDF, JPG, PNG (Max 10MB)</span>
                </div>
              )}
              <input
                ref={cert2InputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processFileUpload(e.target.files[0], setCert2File, 'Internship Certificate 2', 10);
                  }
                }}
              />
              {errors.cert2 && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.cert2}</span>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#003B6D] to-[#005FA3] hover:from-[#002D54] hover:to-[#003B6D] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <span>Submit Placement Form</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
