import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentRegistration } from '../types';
import { ShieldCheck, User, Phone, Mail, FileText, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';

export const AdmissionFormView: React.FC = () => {
  const { addStudentRegistration, navigateTo, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    fathersName: '',
    email: '',
    aadhaarNo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAdmission, setSubmittedAdmission] = useState<StudentRegistration | null>(null);

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

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) errs.phone = 'Contact number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) errs.phone = 'Enter valid 10-digit mobile number';
    if (!formData.fathersName.trim()) errs.fathersName = "Father's name is required";
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter valid email address';
    if (!formData.aadhaarNo.trim()) errs.aadhaarNo = 'Aadhaar number is required';
    else if (!/^\d{12}$/.test(formData.aadhaarNo.replace(/\s+/g, ''))) errs.aadhaarNo = 'Enter valid 12-digit Aadhaar number';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please correct the highlighted errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const regNumber = `ADM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newRecord: StudentRegistration = {
        id: `adm_${Date.now()}`,
        registrationNumber: regNumber,
        placement: 'Direct Admission',
        name: formData.name,
        qualification: 'General Admission',
        branch: 'General',
        college: `Father: ${formData.fathersName} | Aadhaar: ${formData.aadhaarNo}`,
        passingYear: '2026',
        email: formData.email,
        phone: formData.phone,
        course: 'Direct Admission Program',
        status: 'New',
        submittedAt: new Date().toISOString(),
        adminRemarks: `Direct Admission Form | Father: ${formData.fathersName} | Aadhaar: ${formData.aadhaarNo}`,
      };

      addStudentRegistration(newRecord);
      setSubmittedAdmission(newRecord);
      setIsSubmitting(false);
      showToast('Admission application submitted successfully!', 'success');
    }, 800);
  };

  if (submittedAdmission) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-200/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Admission Successful
            </span>
            <h2 className="text-2xl font-black text-slate-900">Application Submitted!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your admission request has been successfully registered with Reference Number <strong className="font-mono text-blue-700">{submittedAdmission.registrationNumber}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 max-w-lg mx-auto text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Applicant Name:</span>
              <span className="font-bold text-slate-900">{submittedAdmission.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Contact Number:</span>
              <span className="font-bold text-slate-900">{submittedAdmission.phone}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Father's Name:</span>
              <span className="font-bold text-slate-900">{formData.fathersName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Email Address:</span>
              <span className="font-bold text-slate-900">{submittedAdmission.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Aadhaar No:</span>
              <span className="font-bold font-mono text-slate-900">{formData.aadhaarNo}</span>
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
                setSubmittedAdmission(null);
                setFormData({ name: '', phone: '', fathersName: '', email: '', aadhaarNo: '' });
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
            <h1 className="text-xl sm:text-2xl font-black text-white">Student Admission Form</h1>
            <p className="text-xs text-blue-100/90">
              Fill out your details to apply for direct institute admission.
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
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter student full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none ${
                    errors.name ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.name && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.name}</span>}
            </div>

            {/* Contact No */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Contact No <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none ${
                    errors.phone ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.phone && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.phone}</span>}
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

            {/* Email ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none ${
                    errors.email ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>
              {errors.email && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.email}</span>}
            </div>
          </div>

          {/* Aadhaar No (Full Width) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Aadhaar No <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="12-digit Aadhaar card number"
                maxLength={14}
                value={formData.aadhaarNo}
                onChange={(e) => handleInputChange('aadhaarNo', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none font-mono ${
                  errors.aadhaarNo ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
            </div>
            {errors.aadhaarNo && <span className="text-[11px] text-rose-500 mt-1 block font-semibold">{errors.aadhaarNo}</span>}
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
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Admission</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
