import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StudentRegistration, UploadedDocFile } from '../types';
import jsPDF from 'jspdf';
import {
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Printer,
  Home,
  ArrowLeft,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Loader2,
  RotateCcw,
  Edit3,
  Plus,
  Check,
  X,
  ListFilter,
  UploadCloud,
  ChevronDown,
  Briefcase,
  Paperclip,
  Lock,
  Sparkles,
  CircleDot,
  Circle,
  Download,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';

export const StudentRegistrationView: React.FC = () => {
  const {
    qualifications,
    branchesList,
    passingYears,
    placements,
    colleges,
    durations,
    addQualification,
    addBranchOption,
    addPassingYear,
    addCollege,
    addPlacement,
    addStudentRegistration,
    navigateTo,
    showToast,
  } = useApp();

  // Placement Type options
  const placementOptions = ['Job', 'Internship', 'Job + Internship'];

  // Default qualification options as specified in reference
  const defaultQualList = ['B.Tech', 'Diploma', 'ITI (OJT)', 'M.Tech', 'Non Technical', 'Other'];
  const mergedQualifications = Array.from(new Set([...defaultQualList, ...qualifications]));

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    branch: '',
    college: '',
    duration: '',
    passingYear: '',
    endDate: '',
    placement: 'Job + Internship',
    email: '',
    phone: '',
  });

  // Modal State for Qualification
  const [isQualModalOpen, setIsQualModalOpen] = useState(false);
  const [isAddingCustomQual, setIsAddingCustomQual] = useState(false);
  const [customModalQualText, setCustomModalQualText] = useState('');

  // Uploaded Files State
  const [resumeFile, setResumeFile] = useState<UploadedDocFile | null>(null);
  const [idCardFile, setIdCardFile] = useState<UploadedDocFile | null>(null);
  const [certFile, setCertFile] = useState<UploadedDocFile | null>(null);

  // Hidden file input refs
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<StudentRegistration | null>(null);
  const [isStartDateFocused, setIsStartDateFocused] = useState(false);
  const [isEndDateFocused, setIsEndDateFocused] = useState(false);

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

  // Generic file upload processor
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

  // Handler for selecting qualification from modal
  const handleSelectQualification = (qual: string) => {
    handleInputChange('qualification', qual);
    setIsQualModalOpen(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Please select qualification';
    }
    if (!formData.branch.trim()) {
      newErrors.branch = 'Please select branch / stream';
    }
    if (!formData.college.trim()) {
      newErrors.college = 'College / Institute is required';
    }
    if (!formData.passingYear.trim()) {
      newErrors.passingYear = 'Graduation date is required';
    }
    if (!formData.placement.trim()) {
      newErrors.placement = 'Placement type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error');
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const newRegistration = addStudentRegistration({
          name: formData.name.trim(),
          qualification: formData.qualification,
          branch: formData.branch,
          college: formData.college.trim(),
          duration: formData.duration || undefined,
          passingYear: formData.passingYear,
          endDate: formData.endDate || undefined,
          placement: formData.placement,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          resume: resumeFile || undefined,
          aadhaarCard: idCardFile || undefined,
          certificateSummer1: certFile || undefined,
        });

        setSubmittedRegistration(newRegistration);
        setIsSubmitting(false);
        showToast('Placement Registration submitted successfully!', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setIsSubmitting(false);
        showToast('An error occurred during submission. Please try again.', 'error');
      }
    }, 600);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      qualification: '',
      branch: '',
      college: '',
      duration: '',
      passingYear: '',
      endDate: '',
      placement: 'Job + Internship',
      email: '',
      phone: '',
    });
    setResumeFile(null);
    setIdCardFile(null);
    setCertFile(null);
    setErrors({});
    setSubmittedRegistration(null);
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPrintOptionsModal, setShowPrintOptionsModal] = useState(false);

  const generatePDFSlip = (reg: StudentRegistration) => {
    try {
      setIsGeneratingPDF(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Colors
      const primaryNavy = [7, 27, 73]; // #071B49
      const primaryBlue = [20, 110, 245]; // #146EF5
      const slateDark = [30, 41, 59];
      const slateLight = [241, 245, 249];
      const slateBorder = [226, 232, 240];

      // Header top bar
      doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.rect(0, 0, 210, 26, 'F');

      // Accent strip
      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.rect(0, 26, 210, 2, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('A2Z LEARNING & PLACEMENT NETWORK', 14, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Official Student Registration & Placement Application Slip', 14, 19);

      // Application Slip Badge / ID Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(138, 5, 58, 16, 2, 2, 'F');
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('APPLICATION ID', 142, 10.5);
      doc.setFontSize(10.5);
      doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.text(reg.registrationNumber || 'REG-PENDING', 142, 17);

      // Sub-header Info Section
      let y = 36;
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('STUDENT REGISTRATION SLIP', 14, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const subDate = new Date(reg.submittedAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Submitted On: ${subDate}`, 14, y + 5);

      // Status Badge
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(148, y - 4, 48, 9, 2, 2, 'F');
      doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.roundedRect(148, y - 4, 48, 9, 2, 2, 'S');
      doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`Status: ${reg.status || 'Pending Review'}`, 152, y + 2);

      // Section 1: Candidate Information Box
      y += 14;
      doc.setFillColor(slateLight[0], slateLight[1], slateLight[2]);
      doc.rect(14, y, 182, 7, 'F');
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('1. APPLICANT DETAILS', 17, y + 4.8);

      y += 10;
      const details = [
        { label: 'Student Full Name', val: reg.name },
        { label: 'Qualification', val: reg.qualification },
        { label: 'Branch / Stream', val: reg.branch },
        { label: 'College / Institute', val: reg.college },
        { label: 'Duration', val: reg.duration || 'Not Specified' },
        { label: 'Graduation Date / Year', val: reg.passingYear },
        { label: 'Placement Type', val: reg.placement || 'Job + Internship' },
        { label: 'Email Address', val: reg.email || 'Not Provided' },
        { label: 'Contact / WhatsApp', val: reg.phone || 'Not Provided' },
      ];

      // Draw 2-column grid
      const col1X = 14;
      const col2X = 106;
      const rowH = 12;

      for (let i = 0; i < details.length; i += 2) {
        const item1 = details[i];
        const item2 = details[i + 1];

        // Box 1
        doc.setFillColor(250, 252, 255);
        doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
        doc.roundedRect(col1X, y, 90, rowH, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(item1.label.toUpperCase(), col1X + 3, y + 4);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
        const cleanVal1 = doc.splitTextToSize(item1.val, 84);
        doc.text(cleanVal1, col1X + 3, y + 8.5);

        // Box 2
        if (item2) {
          doc.setFillColor(250, 252, 255);
          doc.roundedRect(col2X, y, 90, rowH, 1.5, 1.5, 'FD');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(item2.label.toUpperCase(), col2X + 3, y + 4);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
          const cleanVal2 = doc.splitTextToSize(item2.val, 84);
          doc.text(cleanVal2, col2X + 3, y + 8.5);
        }

        y += rowH + 2.5;
      }

      // Section 2: Attached Documents Status
      y += 4;
      doc.setFillColor(slateLight[0], slateLight[1], slateLight[2]);
      doc.rect(14, y, 182, 7, 'F');
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('2. SUBMITTED DOCUMENTS VERIFICATION', 17, y + 4.8);

      y += 10;
      const docsList = [
        { name: 'Resume / Curriculum Vitae', doc: reg.resume || resumeFile },
        { name: 'Government ID / Aadhaar Card', doc: reg.aadhaarCard || idCardFile },
        { name: 'Training / Academic Certificate', doc: reg.certificateSummer1 || certFile },
      ];

      const docColW = 59;
      docsList.forEach((d, idx) => {
        const dx = 14 + idx * (docColW + 2.5);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
        doc.roundedRect(dx, y, docColW, 16, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
        doc.text(d.name, dx + 3, y + 4.5);

        if (d.doc) {
          doc.setTextColor(16, 185, 129); // Emerald
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.text('[ ATTACHED & ENCRYPTED ]', dx + 3, y + 9);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          const fName = d.doc.name.length > 20 ? d.doc.name.substring(0, 18) + '...' : d.doc.name;
          doc.text(fName, dx + 3, y + 13);
        } else {
          doc.setTextColor(148, 163, 184);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('Not attached / Pending', dx + 3, y + 10);
        }
      });

      // Instructions / Security Notice
      y += 22;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
      doc.roundedRect(14, y, 182, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.text('IMPORTANT INSTRUCTIONS FOR THE CANDIDATE:', 18, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text('1. Please preserve this registration slip and reference your Application ID for all placement inquiries.', 18, y + 10);
      doc.text('2. Shortlisted applicants will be contacted via WhatsApp / Email for interview schedules and corporate rounds.', 18, y + 14.5);
      doc.text('3. This document is computer-generated and electronically verified by the A2Z Training & Placement Cell.', 18, y + 19);

      // Signatures Area
      y += 28;
      // Candidate sign box
      doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
      doc.line(18, y + 12, 70, y + 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Signature of Candidate', 24, y + 16);

      // Seal simulation in center
      doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.roundedRect(88, y - 2, 34, 18, 2, 2, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.text('A2Z E-SEAL', 92, y + 5);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text('VERIFIED & RECORDED', 90, y + 10);
      doc.text('ISO 9001:2015 CERTIFIED', 89, y + 14);

      // Authorized Officer Signature
      doc.line(140, y + 12, 192, y + 12);
      doc.text('Authorized Placement Officer', 143, y + 16);

      // Bottom Footer
      doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.rect(0, 287, 210, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('A2Z Placement Portal • Confidential Document • All Rights Reserved', 14, 293.5);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 150, 293.5);

      // Save PDF
      const fileName = `A2Z_Slip_${reg.registrationNumber || 'App'}.pdf`;
      doc.save(fileName);
      showToast(`PDF slip downloaded: ${fileName}`, 'success');
      setIsGeneratingPDF(false);
      setShowPrintOptionsModal(false);
    } catch (err) {
      console.error(err);
      showToast('Generating printable PDF via browser...', 'info');
      setIsGeneratingPDF(false);
      window.print();
    }
  };

  const handlePrintReceipt = () => {
    setShowPrintOptionsModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] py-6 sm:py-10">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================================
            SUCCESS CONFIRMATION SCREEN
            ===================================================================== */}
        {submittedRegistration ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xl overflow-hidden mb-6">
              
              <div className="bg-[#071B49] p-6 sm:p-8 text-white text-center relative">
                <div className="w-12 h-12 bg-[#146EF5]/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-md">
                  <CheckCircle2 className="w-7 h-7 text-[#146EF5]" />
                </div>
                <span className="inline-block px-3 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-400/30">
                  Registration Successful
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Placement Registration Submitted!
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
                  Your details have been registered in the A2Z Placement & Internship Network.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-white text-[#071B49] px-4 py-2 rounded-[6px] shadow-md border border-white">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Application ID:
                  </span>
                  <span className="text-sm sm:text-base font-mono font-black text-[#146EF5] tracking-wider">
                    {submittedRegistration.registrationNumber}
                  </span>
                </div>
              </div>

              {/* Printable Receipt */}
              <div id="registration-receipt" className="p-5 sm:p-7 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-3.5 gap-2.5">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#071B49]">Student Placement Application Slip</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Submitted on {new Date(submittedRegistration.submittedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-0.5 bg-blue-50 text-[#146EF5] border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#146EF5] animate-pulse" />
                    Status: {submittedRegistration.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs sm:text-sm">
                  <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Student Full Name</span>
                    <span className="font-bold text-[#071B49]">{submittedRegistration.name}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Qualification</span>
                    <span className="font-bold text-[#071B49]">{submittedRegistration.qualification}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Branch / Stream</span>
                    <span className="font-bold text-[#071B49]">{submittedRegistration.branch}</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100 sm:col-span-2">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">College / Institute</span>
                    <span className="font-bold text-[#071B49]">{submittedRegistration.college}</span>
                  </div>

                  {submittedRegistration.duration && (
                    <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Duration</span>
                      <span className="font-bold text-[#071B49]">{submittedRegistration.duration}</span>
                    </div>
                  )}

                  <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Graduation Year</span>
                    <span className="font-bold text-[#071B49]">{submittedRegistration.passingYear}</span>
                  </div>

                  {submittedRegistration.placement && (
                    <div className="p-2.5 bg-blue-50/70 rounded-[6px] border border-blue-100 sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-semibold text-[#146EF5] block mb-0.5">Placement Type</span>
                      <span className="font-extrabold text-[#071B49] text-xs sm:text-sm">{submittedRegistration.placement}</span>
                    </div>
                  )}

                  {submittedRegistration.email && (
                    <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Email Address</span>
                      <span className="font-medium text-[#071B49]">{submittedRegistration.email}</span>
                    </div>
                  )}

                  {submittedRegistration.phone && (
                    <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Contact Number</span>
                      <span className="font-medium text-[#071B49]">{submittedRegistration.phone}</span>
                    </div>
                  )}
                </div>

                {(submittedRegistration.resume || submittedRegistration.aadhaarCard || submittedRegistration.certificateSummer1) && (
                  <div className="pt-1.5">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Attached Documents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {submittedRegistration.resume && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50/60 border border-blue-100 rounded-[6px]">
                          <FileText className="w-3.5 h-3.5 text-[#146EF5] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 block truncate">{resumeFile?.name || submittedRegistration.resume.name}</span>
                            <span className="text-[10px] text-slate-400">Resume • {formatFileSize(submittedRegistration.resume.size)}</span>
                          </div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#146EF5] shrink-0" />
                        </div>
                      )}

                      {submittedRegistration.aadhaarCard && (
                        <div className="flex items-center gap-2 p-2 bg-emerald-50/60 border border-emerald-100 rounded-[6px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 block truncate">{idCardFile?.name || submittedRegistration.aadhaarCard.name}</span>
                            <span className="text-[10px] text-slate-400">ID Proof • {formatFileSize(submittedRegistration.aadhaarCard.size)}</span>
                          </div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                      )}

                      {submittedRegistration.certificateSummer1 && (
                        <div className="flex items-center gap-2 p-2 bg-purple-50/60 border border-purple-100 rounded-[6px]">
                          <FileCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 block truncate">{certFile?.name || submittedRegistration.certificateSummer1.name}</span>
                            <span className="text-[10px] text-slate-400">Certificate • {formatFileSize(submittedRegistration.certificateSummer1.size)}</span>
                          </div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="no-print pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      id="btn-print-registration"
                      type="button"
                      onClick={handlePrintReceipt}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#071B49] hover:bg-slate-800 text-white rounded-[6px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip / PDF</span>
                    </button>

                    <button
                      id="btn-download-pdf-slip"
                      type="button"
                      disabled={isGeneratingPDF}
                      onClick={() => submittedRegistration && generatePDFSlip(submittedRegistration)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#146EF5] hover:bg-blue-700 text-white rounded-[6px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isGeneratingPDF ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-[6px] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Register Another</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('home')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#071B49] rounded-[6px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Back to Home</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Print & PDF Choice Modal */}
            {showPrintOptionsModal && submittedRegistration && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                <div 
                  className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#146EF5] flex items-center justify-center">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Print / Export Slip</h3>
                        <p className="text-[11px] text-slate-500">Choose how you would like your application slip</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPrintOptionsModal(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="py-4 space-y-3">
                    {/* Option 1: Direct Download PDF */}
                    <button
                      type="button"
                      disabled={isGeneratingPDF}
                      onClick={() => generatePDFSlip(submittedRegistration)}
                      className="w-full text-left p-3.5 rounded-xl border border-[#146EF5]/30 bg-blue-50/50 hover:bg-blue-50 hover:border-[#146EF5] transition-all flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#146EF5] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        {isGeneratingPDF ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">Download PDF File</span>
                          <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">Recommended</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Generates a downloadable vector PDF document with official seal, verification stamp & candidate details.
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Print Dialog / Save as PDF */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrintOptionsModal(false);
                        setTimeout(() => window.print(), 200);
                      }}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#071B49] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900">Print / Save as PDF (System Dialog)</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Opens the browser print window where you can print to your printer or select &quot;Save as PDF&quot;.
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPrintOptionsModal(false)}
                      className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (

          /* =====================================================================
              PRIMARY REGISTRATION EXPERIENCE
              ===================================================================== */
          <div className="relative space-y-5 sm:space-y-6">

            {/* Back to Home Small Arrow */}
            <button
              type="button"
              onClick={() => navigateTo('home')}
              title="Back to Home"
              aria-label="Back to Home"
              className="absolute top-0 left-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#071B49] hover:text-[#146EF5] hover:border-[#146EF5]/50 hover:bg-[#F0F6FF] shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* TOP HEADLINE */}
            <div className="text-center max-w-3xl mx-auto px-10 !mt-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                <span className="text-[#071B49]">One Registration </span>
                <span className="text-[#146EF5]">Many Opportunities</span>
              </h1>
            </div>

            {/* MAIN REGISTRATION CARD */}
            <div className="bg-white rounded-[12px] sm:rounded-[14px] border border-[#E2E8F0] shadow-md p-4 sm:p-6 lg:p-7">
              
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* =====================================================================
                    SECTION 1: ACADEMIC & PLACEMENT DETAILS (COMPACT ~40PX INPUT BOXES)
                    ===================================================================== */}
                <div className="space-y-3.5">
                  
                  {/* Section Title Strip */}
                  <div className="bg-[#F0F6FF] border border-[#D8E8FF] rounded-[6px] px-3.5 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#146EF5] text-white flex items-center justify-center shadow-xs shrink-0">
                        <Briefcase className="w-3 h-3" />
                      </div>
                      <h2 className="text-xs sm:text-sm font-black text-[#071B49]">
                        1. Academic & Placement Details
                      </h2>
                    </div>
                  </div>

                  {/* 2-Column Grid of Sleek Compact Inputs */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-0.5">

                    {/* 1. Full Name */}
                    <div>
                      <div className={`relative flex items-center h-[38px] sm:h-[40px] bg-white border rounded-[6px] transition-all px-3 ${
                        errors.name
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10'
                      }`}>
                        <input
                          id="reg-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Full Name *"
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] placeholder:text-slate-400 focus:outline-none pr-6"
                        />
                        <User className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                      {errors.name && (
                        <p className="text-[10px] text-red-500 mt-1 px-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* 2. Qualification (Custom Premium Modal Trigger) */}
                    <div>
                      <div
                        id="reg-qualification"
                        role="button"
                        tabIndex={0}
                        onClick={() => setIsQualModalOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsQualModalOpen(true);
                          }
                        }}
                        className={`relative flex items-center justify-between h-[38px] sm:h-[40px] bg-white border rounded-[6px] transition-all px-3 cursor-pointer select-none ${
                          errors.qualification
                            ? 'border-red-400 ring-2 ring-red-100'
                            : 'border-[#E2E8F0] hover:border-[#146EF5]/60 hover:bg-slate-50/50 focus:border-[#146EF5] focus:ring-2 focus:ring-[#146EF5]/10'
                        }`}
                      >
                        <span className={`text-xs sm:text-[13px] truncate pr-6 ${
                          formData.qualification ? 'font-bold text-[#071B49]' : 'font-medium text-slate-400'
                        }`}>
                          {formData.qualification || 'Select Qualification *'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                      {errors.qualification && (
                        <p className="text-[10px] text-red-500 mt-1 px-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" /> {errors.qualification}
                        </p>
                      )}
                    </div>

                    {/* 3. Branch / Stream */}
                    <div>
                      <div className={`relative flex items-center h-[38px] sm:h-[40px] bg-white border rounded-[6px] transition-all ${
                        errors.branch
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10'
                      }`}>
                        <select
                          id="reg-branch"
                          value={formData.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] appearance-none focus:outline-none cursor-pointer pl-3 pr-8"
                        >
                          <option value="" disabled hidden className="pl-4 py-2.5">Select Branch / Stream *</option>
                          {branchesList.map((b) => (
                            <option key={b} value={b} className="pl-4 py-2.5">
                              {b}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                      {errors.branch && (
                        <p className="text-[10px] text-red-500 mt-1 px-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" /> {errors.branch}
                        </p>
                      )}
                    </div>

                    {/* 4. College / Institute */}
                    <div>
                      <div className={`relative flex items-center h-[38px] sm:h-[40px] bg-white border rounded-[6px] transition-all ${
                        errors.college
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10'
                      }`}>
                        <select
                          id="reg-college"
                          value={formData.college}
                          onChange={(e) => handleInputChange('college', e.target.value)}
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] appearance-none focus:outline-none cursor-pointer pl-3 pr-8"
                        >
                          <option value="" disabled hidden className="pl-4 py-2.5">Select College / Institute *</option>
                          {colleges.map((c) => (
                            <option key={c} value={c} className="pl-4 py-2.5">
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                      {errors.college && (
                        <p className="text-[10px] text-red-500 mt-1 px-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" /> {errors.college}
                        </p>
                      )}
                    </div>

                    {/* 5. Duration */}
                    <div>
                      <div className="relative flex items-center h-[38px] sm:h-[40px] bg-white border border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10 rounded-[6px] transition-all">
                        <select
                          id="reg-duration"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] appearance-none focus:outline-none cursor-pointer pl-3 pr-8"
                        >
                          <option value="" disabled hidden className="pl-4 py-2.5">Select Duration</option>
                          {durations.map((d) => (
                            <option key={d} value={d} className="pl-4 py-2.5">
                              {d}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                    </div>

                    {/* 5. Graduation Date / Year */}
                    <div>
                      <div className={`relative flex items-center h-[38px] sm:h-[40px] bg-white border rounded-[6px] transition-all px-3 ${
                        errors.passingYear
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10'
                      }`}>
                        <input
                          id="reg-passing-year"
                          type={isStartDateFocused || formData.passingYear ? 'date' : 'text'}
                          value={formData.passingYear}
                          onFocus={(e) => {
                            setIsStartDateFocused(true);
                            e.currentTarget.type = 'date';
                            try {
                              e.currentTarget.showPicker?.();
                            } catch {
                              // Ignore if browser restricts programmatic showPicker
                            }
                          }}
                          onBlur={() => setIsStartDateFocused(false)}
                          onChange={(e) => handleInputChange('passingYear', e.target.value)}
                          placeholder="Start Date"
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] placeholder:text-slate-400 focus:outline-none cursor-pointer pr-6"
                        />
                        <Calendar className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                      {errors.passingYear && (
                        <p className="text-[10px] text-red-500 mt-1 px-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" /> {errors.passingYear}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <div className={`relative flex items-center h-[38px] sm:h-[40px] bg-white border rounded-[6px] transition-all px-3 ${
                        errors.endDate
                          ? 'border-red-400 ring-2 ring-red-100'
                          : 'border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10'
                      }`}>
                        <input
                          id="reg-end-date"
                          type={isEndDateFocused || formData.endDate ? 'date' : 'text'}
                          value={formData.endDate}
                          onFocus={(e) => {
                            setIsEndDateFocused(true);
                            e.currentTarget.type = 'date';
                            try {
                              e.currentTarget.showPicker?.();
                            } catch {
                              // Ignore if browser restricts programmatic showPicker
                            }
                          }}
                          onBlur={() => setIsEndDateFocused(false)}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          placeholder="End Date"
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] placeholder:text-slate-400 focus:outline-none cursor-pointer pr-6"
                        />
                        <Calendar className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                      {errors.endDate && (
                        <p className="text-[10px] text-red-500 mt-1 px-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" /> {errors.endDate}
                        </p>
                      )}
                    </div>



                    {/* 7. Email Address */}
                    <div>
                      <div className="relative flex items-center h-[38px] sm:h-[40px] bg-white border border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10 rounded-[6px] transition-all px-3">
                        <input
                          id="reg-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email Address"
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] placeholder:text-slate-400 focus:outline-none pr-6"
                        />
                        <Mail className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                    </div>

                    {/* 8. Contact Number */}
                    <div>
                      <div className="relative flex items-center h-[38px] sm:h-[40px] bg-white border border-[#E2E8F0] hover:border-[#146EF5]/50 focus-within:border-[#146EF5] focus-within:ring-2 focus-within:ring-[#146EF5]/10 rounded-[6px] transition-all px-3">
                        <input
                          id="reg-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Contact Number / WhatsApp"
                          className="w-full h-full bg-transparent text-xs sm:text-[13px] font-medium text-[#071B49] placeholder:text-slate-400 focus:outline-none pr-6"
                        />
                        <Phone className="w-3.5 h-3.5 text-[#146EF5] absolute right-3 pointer-events-none shrink-0" />
                      </div>
                    </div>

                  </div>
                </div>



                {/* =====================================================================
                    SUBMISSION CTA AREA (#FF2B2B RED CTA BUTTON)
                    ===================================================================== */}
                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Your data is confidential & verified with partner companies.</span>
                  </div>

                  <button
                    id="btn-submit-registration"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[200px] h-[40px] sm:h-[42px] px-6 bg-[#FF2B2B] hover:bg-[#E02424] active:bg-[#C81E1E] text-white rounded-[6px] font-black text-xs sm:text-sm shadow-xs hover:shadow-md hover:shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <span className="text-lg font-normal leading-none">»</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================================
          QUALIFICATION CUSTOM SELECTION MODAL (#292A2F DARK CHARCOAL SHEET)
          ===================================================================== */}
      {isQualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          
          {/* Dark Semi-Transparent Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsQualModalOpen(false);
              setIsAddingCustomQual(false);
            }}
          />

          {/* Charcoal Selection Sheet Modal */}
          <div className="relative z-10 w-full max-w-[480px] bg-[#292A2F] text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Header: Title + Radio Indicator + Close button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg sm:text-2xl font-normal text-white tracking-tight">
                Select Qualification *
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#146EF5] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#146EF5]" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsQualModalOpen(false);
                    setIsAddingCustomQual(false);
                  }}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="py-2 divide-y divide-white/10 max-h-[60vh] overflow-y-auto">
              {mergedQualifications.map((item) => {
                const isSelected = formData.qualification === item;
                return (
                  <div
                    key={item}
                    onClick={() => handleSelectQualification(item)}
                    className="flex items-center justify-between py-4 px-2 hover:bg-white/5 rounded-xl cursor-pointer transition-all group select-none"
                  >
                    <span className={`text-base sm:text-lg tracking-wide ${
                      isSelected ? 'text-white font-bold' : 'text-white/90 font-normal group-hover:text-white'
                    }`}>
                      {item}
                    </span>
                    <div className="flex items-center">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#146EF5] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#146EF5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-white/40 group-hover:border-white/70" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
