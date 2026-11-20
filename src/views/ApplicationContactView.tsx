import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopBannerBackground } from '../components/ui/TopBannerBackground';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  UserCheck,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Headphones,
  Loader2
} from 'lucide-react';

export const ApplicationContactView: React.FC = () => {
  const {
    addConnectRequest,
    navigateTo,
    showToast,
  } = useApp();

  // Form Fields State (STRICTLY ONLY Name and Mobile Number)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Form Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  // Form Validation Logic
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required.';
    } else {
      const cleanPhone = phone.replace(/[\s\-+()]/g, '');
      const phoneRegex = /^(?:91)?[6789]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission with duplicate click protection & loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isSubmitted) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate server processing delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const cleanPhone = phone.trim();
      const cleanName = name.trim();

      // Add to isolated connectRequests collection
      const newReq = addConnectRequest({
        name: cleanName,
        phone: cleanPhone,
      });

      setSubmittedInquiryId(newReq.connectNumber);
      setIsSubmitted(true);
    } catch {
      showToast('Error submitting connect request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setIsSubmitted(false);
    setSubmittedInquiryId(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows & Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Top Header Badge & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Headphones className="w-4 h-4 text-blue-400" />
            <span>Instant Connect Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">With Us</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Have questions or need academic guidance? Enter your name and mobile number below. Our academic counselors will get back to you immediately.
          </p>
        </div>



        {/* Main Connect Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-10 backdrop-blur-md max-w-xl mx-auto">
          {isSubmitted ? (
            /* Submission Success View */
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Connect Request Received!</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Thank you! Our academic team has logged your callback request. An advisor will call you shortly on your provided mobile number.
                </p>
              </div>

              {submittedInquiryId && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono inline-block">
                  Request Ref ID: <span className="text-blue-400 font-bold">{submittedInquiryId}</span>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Submit Another Request
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('all-programs')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Connect Form (Strictly Name & Mobile Number Only) */
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="border-b border-slate-700/80 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-blue-400" />
                  <span>Request an Immediate Callback</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details below to connect directly with our experts.
                </p>
              </div>

              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="connect-name-input"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.name;
                        return next;
                      });
                    }
                  }}
                  className={`w-full h-12 px-4 rounded-xl border text-sm text-white placeholder:text-slate-500 bg-slate-900/90 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500/20 bg-red-950/20'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="connect-phone-input"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.phone;
                        return next;
                      });
                    }
                  }}
                  className={`w-full h-12 px-4 rounded-xl border text-sm text-white placeholder:text-slate-500 bg-slate-900/90 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500/20 bg-red-950/20'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="connect-submit-button"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Connect Now</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 pt-1">
                By clicking "Connect Now", you agree to receive a callback from our academic counseling team.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
