import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  Send,
  Download,
  Award,
  ShieldCheck,
  Calendar,
  FileCheck,
  TrendingUp,
  Cpu,
  BookOpen,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  Globe
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Student' | 'Institutional' | 'Corporate';
  icon: string;
  description: string;
  features: string[];
  deliverables: string[];
  targetAudience: string;
  ctaText: string;
  badge?: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'service-internships',
    title: 'Industrial Internship & Capstone Project Training',
    subtitle: 'Govt. Recognized & ISO Certified Industrial Projects for B.Tech, Diploma & ITI',
    category: 'Student',
    icon: 'Briefcase',
    badge: 'Most Popular',
    description: 'Practical, industry-aligned internship programs designed to bridge the academic-corporate gap. Students work on live industrial capstone projects under senior tech lead mentorship.',
    features: [
      'Hands-on live project development in Web, AI/ML, Cloud, IoT, and Embedded systems.',
      '1-on-1 weekly code reviews and sprint retrospectives with industry engineers.',
      'Govt./ISO verified internship certificate with instant QR code online verification.',
      'Direct interview fast-tracking with 250+ hiring partner companies.'
    ],
    deliverables: [
      'Official Internship Completion Certificate',
      'Letter of Recommendation (LOR) for Top Performers',
      'Industrial Project Report (synopsis & documentation) for college submission',
      'Git repository portfolio & live project hosting'
    ],
    targetAudience: 'B.Tech / M.Tech / Diploma / BCA / MCA / ITI Students',
    ctaText: 'Register for Internship'
  },
  {
    id: 'service-placements',
    title: 'Campus Placement Drives & Corporate Recruitment',
    subtitle: 'End-to-end pooled campus recruitment & vetted candidate matching',
    category: 'Institutional',
    icon: 'Building2',
    badge: 'For Colleges & TPOs',
    description: 'We partner with colleges and Training & Placement Cells (TPOs) to organize high-volume on-campus and pooled recruitment drives across Tier 1, 2, and 3 engineering institutions.',
    features: [
      'Access to 250+ top tech recruiters, Fortune 500 companies, and high-growth startups.',
      'Automated online aptitude, coding, and behavioral pre-screening simulators.',
      'Transparent shortlisting dashboards and zero-cost institutional placement assistance.',
      'Dedicated placement coordinators and student counseling on drive days.'
    ],
    deliverables: [
      'Comprehensive Student Performance & Skill Analytics Matrix',
      'Placement Offer Letters & Corporate Verification Reports',
      'Post-placement onboarding coordination'
    ],
    targetAudience: 'Colleges, Universities, Polytechnic Institutes, and Corporate HRs',
    ctaText: 'Partner with Us (TPO MoU)'
  },
  {
    id: 'service-certifications',
    title: 'Professional Technology Certification Programs',
    subtitle: 'Industry-standard certifications in Full Stack, Cloud, GenAI & Data Science',
    category: 'Student',
    icon: 'Award',
    description: 'Rigorous modular training curricula taught by working architects. Master production-grade tech stacks from fundamentals to enterprise deployment.',
    features: [
      'Curriculum updated every quarter to match current Silicon Valley & IT demand.',
      'Real-world sandbox labs with cloud credits and Docker environments.',
      'Dedicated doubt clearing channels and active community Discord support.',
      'Mock interview drills with alumni from Google, Microsoft, and Amazon.'
    ],
    deliverables: [
      'Shareable digital certificate with unique ID and verification portal URL',
      'Lifetime access to recorded lectures, slides, and cheat sheets',
      'Resume revamp and LinkedIn optimization checklist'
    ],
    targetAudience: 'Freshers, Career Switchers, Working Developers',
    ctaText: 'Explore All Programs'
  },
  {
    id: 'service-fdp-workshops',
    title: 'Faculty Development Programs (FDP) & College Hackathons',
    subtitle: 'Institutional workshops on Emerging AI, Cloud & Industry 4.0 Technologies',
    category: 'Institutional',
    icon: 'Users',
    description: 'Empowering academic faculty and college departments with the latest industry tooling, Generative AI integration in classrooms, and collaborative university hackathons.',
    features: [
      'Hands-on technical bootcamps for professors and engineering lecturers.',
      'Curriculum benchmarking against National Education Policy (NEP 2020) and AICTE norms.',
      'Co-branded 24-48 hour national hackathons sponsored by corporate partners.',
      'Expert guest lectures and keynote panels.'
    ],
    deliverables: [
      'AICTE/Govt. aligned FDP participation certificates',
      'Lab setup blueprints and open-source teaching repositories',
      'Institutional MoU certificate of recognition'
    ],
    targetAudience: 'University Deans, HODs, Faculty Members, College Student Chapters',
    ctaText: 'Schedule a Workshop'
  },
  {
    id: 'service-mock-labs',
    title: 'AI-Powered Skill Assessment & Mock Interview Lab',
    subtitle: 'Simulated technical coding rounds and HR interview preparation',
    category: 'Student',
    icon: 'Cpu',
    description: 'Transform interview nervousness into rock-solid confidence. Our mock interview labs analyze technical problem-solving, system design, and communication skills.',
    features: [
      'Real-time live coding evaluations on Data Structures & Algorithms.',
      'System design mock rounds for 1+ years experience roles.',
      'Behavioral STAR method coaching and HR salary negotiation masterclasses.',
      'Detailed diagnostic scorecard highlighting strengths and areas of improvement.'
    ],
    deliverables: [
      'Video recording of mock interview with timestamped feedback',
      'Skill benchmark comparison against industry averages',
      'Personalized 30-day interview prep roadmap'
    ],
    targetAudience: 'Students preparing for upcoming campus & off-campus placement drives',
    ctaText: 'Book Mock Interview'
  },
  {
    id: 'service-corporate-upskilling',
    title: 'Custom Corporate Workforce Upskilling (B2B)',
    subtitle: 'Tailored technology bootcamps for IT teams and corporate enterprises',
    category: 'Corporate',
    icon: 'Zap',
    description: 'Upskill your engineering workforce in Cloud Native, DevOps, Microservices, and Generative AI. We deliver measurable business impact and accelerated engineering velocity.',
    features: [
      'Bespoke curriculum aligned with your company’s internal codebase and tech stack.',
      'Flexible delivery models: Instructor-Led Live Online, On-Premises, or Self-Paced.',
      'Pre-training and post-training competency assessments with ROI reporting.',
      'Dedicated enterprise customer success manager.'
    ],
    deliverables: [
      'Enterprise skill heatmaps and mastery metrics',
      'Capstones tailored to corporate domain use cases',
      'Post-training support & office hours'
    ],
    targetAudience: 'CTOs, Engineering Managers, HR Heads, Tech Leads',
    ctaText: 'Request Corporate Proposal'
  }
];

export const ServicesView: React.FC = () => {
  const { navigateTo, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Student' | 'Institutional' | 'Corporate'>('All');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryService, setInquiryService] = useState('Industrial Internship & Capstone Project Training');
  const [inquiryOrg, setInquiryOrg] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredServices = SERVICES_DATA.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  const handleServiceCTA = (service: ServiceItem) => {
    if (service.id === 'service-internships') {
      navigateTo('internship-registration');
    } else if (service.id === 'service-certifications') {
      navigateTo('all-programs');
    } else {
      setInquiryService(service.title);
      const formEl = document.getElementById('service-inquiry-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) {
      showToast('Please fill in your name, email, and phone number.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Service inquiry received! Our academic coordinator will contact you within 24 hours.', 'success');
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryOrg('');
      setInquiryMessage('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#002D54] via-[#003B6D] to-[#004B87] text-white py-16 sm:py-24 overflow-hidden border-b border-[#001F3B]">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0077D4]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#004B87]/35 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0077D4]/20 border border-[#7CC4FA]/30 text-[#BAE0FD] text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Comprehensive Solutions for Students, Colleges & Corporates</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAE0FD] via-[#E0EFFF] to-[#7CC4FA]">Services & Offerings</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-[#E0EFFF] max-w-2xl mx-auto font-normal leading-relaxed">
            From industrial project internships and university campus placement drives to enterprise technology workforce upskilling, we deliver industry-tested excellence.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Hands-on Practical Labs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">65+</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">College MoUs Signed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">94.8%</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Placement Success</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">ISO 9001</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Certified Credentials</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 sm:p-3 flex items-center justify-center gap-2 max-w-2xl mx-auto">
          {(['All', 'Student', 'Institutional', 'Corporate'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                activeCategory === cat
                  ? 'bg-[#004B87] text-white shadow-md'
                  : 'text-[#004B87] hover:text-[#003B6D] hover:bg-blue-50/70'
              }`}
            >
              {cat === 'All' ? 'All Services' : cat === 'Student' ? 'Student & Internships' : cat === 'Institutional' ? 'Colleges & TPOs' : 'Corporate B2B'}
            </button>
          ))}
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Header with Category Badge & Optional Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {service.category} Service
                  </span>
                  {service.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  {service.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Key Highlights:
                  </h4>
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Deliverables */}
                <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Deliverables:
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {service.deliverables.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-5 border-t border-slate-100">
                <button
                  onClick={() => handleServiceCTA(service)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{service.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INSTITUTIONAL & CORPORATE PARTNERSHIP FORM */}
      <section id="service-inquiry-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-slate-900 to-[#071B49] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Express Service Inquiry</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                Request a Customized Proposal or Workshop for Your Institution
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Whether you are a university placement cell seeking corporate hiring drives, a student club wanting an AI bootcamp, or a corporate HR team seeking custom tech training, our team will deliver a tailored action plan.
              </p>

              <div className="space-y-3 mt-6 text-sm text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Custom MoU agreements & AICTE credit alignment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>On-campus or virtual delivery by senior engineering architects</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Dedicated corporate placement support and internship quotas</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-6">
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Helpline (Mon - Sat):</span>
                  <a href="tel:+919876543210" className="text-sm font-bold text-amber-300 hover:underline">
                    +91 98765 43210
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Official Email:</span>
                  <a href="mailto:partnerships@a2z.edu.in" className="text-sm font-bold text-sky-300 hover:underline">
                    partnerships@a2z.edu.in
                  </a>
                </div>
              </div>
            </div>

            {/* Right Form Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 shadow-xl border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Inquire About a Service
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Fill out the quick form below and our team will get in touch.
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Name / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Arvind Mehta / Dr. Sunita"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tpo@college.edu.in"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Service of Interest
                    </label>
                    <select
                      value={inquiryService}
                      onChange={(e) => setInquiryService(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium cursor-pointer"
                    >
                      {SERVICES_DATA.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      College / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. National Institute of Tech"
                      value={inquiryOrg}
                      onChange={(e) => setInquiryOrg(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Requirements / Special Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide details such as student batch size, preferred dates, or specific technology stack..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Service Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
