import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  HelpCircle,
  X,
  Send,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';

interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'AI & Data Science' | 'Training & Academics' | 'Design & Product' | 'Sales & Operations';
  location: string;
  type: 'Full-time' | 'Internship-to-Hire' | 'Contract' | 'Part-time';
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  experience: string;
  salary: string;
  openings: number;
  featured?: boolean;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
}

const CAREER_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Web Developer (React + Node.js)',
    department: 'Engineering',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    workMode: 'Hybrid',
    experience: '2 - 5 Years',
    salary: '₹12 - ₹18 LPA',
    openings: 3,
    featured: true,
    postedDate: '2 days ago',
    description: 'Lead development of next-generation student portal and learning management systems. Architect robust REST & GraphQL APIs and modern high-performance React frontends.',
    responsibilities: [
      'Architect, build, and deploy scalable microservices and web applications.',
      'Mentor junior software engineers and conduct comprehensive code reviews.',
      'Collaborate closely with UI/UX designers and product managers to deliver world-class experiences.'
    ],
    requirements: [
      'Strong proficiency in React 18+, TypeScript, Tailwind CSS, and Next.js.',
      'Solid backend expertise in Node.js, Express, PostgreSQL, and Redis caching.',
      'Experience with AWS or Google Cloud CI/CD pipelines and Docker containers.'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS']
  },
  {
    id: 'job-2',
    title: 'Generative AI & Python Instructor / Lead Mentor',
    department: 'Training & Academics',
    location: 'Noida / Remote',
    type: 'Full-time',
    workMode: 'Hybrid',
    experience: '1 - 4 Years',
    salary: '₹8 - ₹14 LPA',
    openings: 2,
    featured: true,
    postedDate: 'Just now',
    description: 'Train aspiring engineers in cutting-edge Python, Deep Learning, LLM fine-tuning, Prompt Engineering, and Generative AI application development.',
    responsibilities: [
      'Deliver interactive live coding bootcamps and hands-on capstone project training.',
      'Curate state-of-the-art curriculum on Gemini, OpenAI, LangChain, and Hugging Face.',
      'Evaluate student projects, conduct technical mock interviews, and assist in placements.'
    ],
    requirements: [
      'Demonstrated expertise in Python, PyTorch/TensorFlow, and LangChain/LlamaIndex.',
      'Strong passion for teaching, public speaking, and code mentorship.',
      'Prior experience with Vector Databases (Pinecone, ChromaDB, Weaviate).'
    ],
    skills: ['Python', 'Generative AI', 'LLMs', 'LangChain', 'PyTorch', 'Prompt Engineering']
  },
  {
    id: 'job-3',
    title: 'Industrial Project Mentor – Embedded Systems & IoT',
    department: 'Training & Academics',
    location: 'Hyderabad / On-site',
    type: 'Full-time',
    workMode: 'On-site',
    experience: '2 - 6 Years',
    salary: '₹7 - ₹12 LPA',
    openings: 2,
    postedDate: '3 days ago',
    description: 'Guide B.Tech & Diploma engineering students through real-world IoT hardware prototyping, microcontrollers (ESP32, STM32, Arduino), and embedded C/C++ firmware.',
    responsibilities: [
      'Supervise hands-on hardware laboratory sessions and circuit debugging.',
      'Guide students in sensor interfacing, MQTT communication protocols, and cloud IoT dashboards.',
      'Review thesis, industrial reports, and final year capstone submissions.'
    ],
    requirements: [
      'Degree in ECE/EEE/Mechatronics with strong Embedded C and RTOS knowledge.',
      'Hands-on experience with PCB designing (KiCAD/Eagle) and IoT hardware.'
    ],
    skills: ['Embedded C', 'IoT', 'ESP32', 'Arduino', 'RTOS', 'PCB Design', 'MQTT']
  },
  {
    id: 'job-4',
    title: 'Machine Learning & Data Analytics Associate',
    department: 'AI & Data Science',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    workMode: 'Remote',
    experience: '1 - 3 Years',
    salary: '₹9 - ₹15 LPA',
    openings: 4,
    featured: true,
    postedDate: '1 week ago',
    description: 'Work with vast academic and industrial placement datasets to build recommendation algorithms, skill-gap analysis models, and automated grading pipelines.',
    responsibilities: [
      'Build end-to-end data analytics dashboards using Tableau, PowerBI, and Streamlit.',
      'Develop predictive models for student job placement matchmaking.',
      'Maintain automated data ETL pipelines in SQL and Python.'
    ],
    requirements: [
      'B.Tech/M.Tech in CS/IT/Data Science or equivalent.',
      'Proficiency in Pandas, NumPy, Scikit-Learn, SQL, and PowerBI/Tableau.'
    ],
    skills: ['Python', 'SQL', 'Scikit-Learn', 'PowerBI', 'Data Analytics', 'Pandas']
  },
  {
    id: 'job-5',
    title: 'Junior Frontend Developer (Internship-to-Hire)',
    department: 'Engineering',
    location: 'Delhi NCR / Remote',
    type: 'Internship-to-Hire',
    workMode: 'Remote',
    experience: 'Fresher / 0-1 Year',
    salary: '₹25,000/mo Stipend (₹6 LPA on Conversion)',
    openings: 6,
    postedDate: '4 days ago',
    description: 'Ideal for recent graduates and final-year students with sharp frontend fundamentals who want to transition into full-time core software engineering roles.',
    responsibilities: [
      'Develop pixel-perfect, responsive UI components in React and Tailwind CSS.',
      'Integrate frontend user journeys with backend REST APIs.',
      'Write unit tests and optimize website performance for speed and mobile responsiveness.'
    ],
    requirements: [
      'B.Tech/BCA/MCA/B.Sc IT (Passing Year 2024, 2025, or 2026).',
      'Strong portfolio projects showcasing clean React code and modern responsive design.'
    ],
    skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS', 'Git']
  },
  {
    id: 'job-6',
    title: 'Campus Relationship & Placement Officer (TPO Liaison)',
    department: 'Sales & Operations',
    location: 'Pune / Mumbai',
    type: 'Full-time',
    workMode: 'On-site',
    experience: '2 - 5 Years',
    salary: '₹6 - ₹10 LPA + Incentives',
    openings: 2,
    postedDate: '5 days ago',
    description: 'Drive university tie-ups, sign MoUs with top engineering colleges, and organize campus recruitment and internship drives with corporate hiring partners.',
    responsibilities: [
      'Build long-term relationships with College Directors, Principals, and Training & Placement Heads.',
      'Coordinate pooled campus placement drives and corporate student interviews.',
      'Manage end-to-end placement documentation and offer letter rollouts.'
    ],
    requirements: [
      'Strong communication, negotiation, and university networking skills.',
      'Prior experience in EdTech, higher education, or university placement relations.'
    ],
    skills: ['Campus Relations', 'Placement Coordination', 'B2B Sales', 'Client Servicing']
  }
];

export const CareerView: React.FC = () => {
  const { navigateTo, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantExperience, setApplicantExperience] = useState('Fresher (0 Years)');
  const [applicantLinkedin, setApplicantLinkedin] = useState('');
  const [applicantResumeName, setApplicantResumeName] = useState('');
  const [applicantCoverNote, setApplicantCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ['All', 'Engineering', 'AI & Data Science', 'Training & Academics', 'Sales & Operations'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

  const filteredJobs = useMemo(() => {
    return CAREER_OPENINGS.filter((job) => {
      const matchQuery =
        searchQuery.trim() === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = selectedDept === 'All' || job.department === selectedDept;
      const matchMode = selectedWorkMode === 'All' || job.workMode === selectedWorkMode;

      return matchQuery && matchDept && matchMode;
    });
  }, [searchQuery, selectedDept, selectedWorkMode]);

  const handleOpenApply = (job: JobOpening) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApplicantResumeName(file.name);
      showToast(`Resume "${file.name}" attached successfully`, 'success');
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) {
      showToast('Please fill in all required contact details.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      showToast('Application submitted successfully! Our HR team will reach out within 48 hours.', 'success');
      // Reset form
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setApplicantLinkedin('');
      setApplicantResumeName('');
      setApplicantCoverNote('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#002D54] via-[#003B6D] to-[#004B87] text-white py-16 sm:py-24 overflow-hidden border-b border-[#001F3B]">
        {/* Background decorative circles & grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0077D4]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#004B87]/35 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0077D4]/20 border border-[#7CC4FA]/30 text-[#BAE0FD] text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>We are hiring top tech talent & student trainers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Build Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAE0FD] via-[#E0EFFF] to-[#7CC4FA]">A2Z</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-[#E0EFFF] max-w-2xl mx-auto font-normal leading-relaxed">
            Join India's leading industrial skills, technology training, and career accelerator platform. Empower students, build world-class products, and grow your career.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">15,000+</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Students Placed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">250+</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Hiring Partners</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">₹18.5 LPA</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Highest Package</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">4.8 / 5</div>
              <div className="text-xs sm:text-sm text-[#BAE0FD] font-medium mt-1">Workplace Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, skills (e.g. React, Python, IoT, Data Science)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004B87] font-medium text-sm text-slate-800"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full lg:w-48 px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004B87]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Departments' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Mode Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full lg:w-40 px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004B87]"
              >
                {workModes.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Work Modes' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JOB OPENINGS LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Open Positions ({filteredJobs.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore opportunities to teach, build, and innovate with our team.
            </p>
          </div>

          <button
            onClick={() => navigateTo('internship-registration')}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Looking for Student Internship? Register Here</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching positions found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your keyword search or department filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedWorkMode('All');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                      {job.department}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {job.postedDate}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Key Details Tags */}
                  <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location} ({job.workMode})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-700">
                      <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{job.openings} Openings</span>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Type: <strong className="text-slate-800">{job.type}</strong>
                  </span>
                  <button
                    onClick={() => handleOpenApply(job)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY JOIN SKILL NEST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-blue-900 to-[#004B87] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
              Why You'll Love Working at A2Z
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <div className="w-12 h-12 rounded-xl bg-blue-500/30 text-amber-300 flex items-center justify-center font-bold text-xl mb-4">
                  🚀
                </div>
                <h3 className="text-lg font-bold mb-2">Exponential Growth</h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Fast-paced environment where your direct contributions touch the lives of thousands of aspiring engineering students nationwide.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <div className="w-12 h-12 rounded-xl bg-blue-500/30 text-amber-300 flex items-center justify-center font-bold text-xl mb-4">
                  💡
                </div>
                <h3 className="text-lg font-bold mb-2">Cutting-Edge Tech Stack</h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Work directly with modern AI models, cloud infrastructure, real-time analytics, and scalable React web applications.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <div className="w-12 h-12 rounded-xl bg-blue-500/30 text-amber-300 flex items-center justify-center font-bold text-xl mb-4">
                  🤝
                </div>
                <h3 className="text-lg font-bold mb-2">People-First Culture</h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Flexible work arrangements (Remote/Hybrid), competitive market compensation, health benefits, and annual learning credits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. APPLY MODAL */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-blue-600 tracking-wider">
                  Applying For Role
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {selectedJob.title}
                </h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitApplication} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
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
                    placeholder="name@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Experience Level
                  </label>
                  <select
                    value={applicantExperience}
                    onChange={(e) => setApplicantExperience(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium cursor-pointer"
                  >
                    <option value="Fresher (0 Years)">Fresher (0 Years)</option>
                    <option value="1-2 Years">1 - 2 Years</option>
                    <option value="3-5 Years">3 - 5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    LinkedIn / Portfolio URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={applicantLinkedin}
                    onChange={(e) => setApplicantLinkedin(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Attach Resume / CV (PDF / DOCX)
                </label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleResumeUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">
                    {applicantResumeName ? applicantResumeName : 'Click to upload your resume'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Max file size 5MB (PDF or Word)</p>
                </div>
              </div>

              {/* Cover Note */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Why are you a great fit for this role? (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a brief overview of your background, key projects, and availability..."
                  value={applicantCoverNote}
                  onChange={(e) => setApplicantCoverNote(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
