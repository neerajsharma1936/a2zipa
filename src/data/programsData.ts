export type ProgramCategory = string;

export interface ProgramCategoryItem {
  id: string;
  label: string;
  description?: string;
  badgeBg?: string;
  badgeBorder?: string;
  badgeText?: string;
  isDefault?: boolean;
}

export const DEFAULT_PROGRAM_CATEGORIES: ProgramCategoryItem[] = [
  {
    id: 'civil',
    label: 'Civil/Civil(Rural)',
    description: 'Structural, highways, surveying, rural infrastructure and sustainable building construction.',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    isDefault: true,
  },
  {
    id: 'cs-it',
    label: 'CS-IT',
    description: 'Software development, AI, cloud computing, cybersecurity, and full-stack engineering.',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    isDefault: true,
  },
  {
    id: 'electrical',
    label: 'Electrical/Electronics',
    description: 'Power systems, microcontrollers, VLSI, smart grids, and electronics circuits.',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700',
    isDefault: true,
  },
  {
    id: 'fire-safety',
    label: 'Fire Safety',
    description: 'Industrial safety, hazard mitigation, fire prevention, and disaster risk management.',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    isDefault: true,
  },
  {
    id: 'mechanical',
    label: 'Mechanical/Automobile',
    description: 'CAD/CAM, electric vehicles, thermal energy, automation, and robotics mechanics.',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
    isDefault: true,
  },
  {
    id: 'non-tech',
    label: 'Non-Technical',
    description: 'Management, analytics, digital business, accounting, and professional growth.',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    isDefault: true,
  },
];

export interface ProgramItem {
  id: string;
  category: string;
  categoryLabel: string;
  degreeType: 'B.Tech' | 'Diploma' | 'ITI / Certificate' | 'Undergraduate (Non-Tech)';
  branch?: string;
  title: string;
  shortDescription?: string;
  description: string;
  duration: string;
  eligibility: string;
  qualification?: string;
  passingYear?: string;
  fee?: string;
  certificateInfo?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    counselor?: string;
  };
  specializations: string[];
  careerOpportunities: string[];
  intakeSeats?: number;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  image: string;
  status?: 'published' | 'draft';
}

export const PRESET_PROGRAM_IMAGES = [
  { label: 'Civil / Construction', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80' },
  { label: 'Coding / Software', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mechanical / CAD', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80' },
  { label: 'Electrical / Automation', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
  { label: 'Fire Safety / Protection', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80' },
  { label: 'Automobile / EV Tech', url: 'https://images.unsplash.com/photo-1558441719-8b489c634a10?w=800&auto=format&fit=crop&q=80' },
  { label: 'Data Science / AI', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
  { label: 'Business / Management', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80' },
];

export const ALL_PROGRAMS_LIST: ProgramItem[] = [
  // 1. Civil / Civil (Rural)
  {
    id: 'btech-civil-eng',
    category: 'civil',
    categoryLabel: 'Civil/Civil(Rural)',
    degreeType: 'B.Tech',
    title: 'B.Tech in Civil Engineering',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics, Mathematics & Chemistry (Min 55%)',
    description: 'Comprehensive engineering degree covering structural design, earthquake engineering, environmental hydrology, and smart city infrastructure.',
    specializations: ['Structural Design & BIM', 'Transportation & Highways', 'Geotechnical Engineering'],
    careerOpportunities: ['Structural Engineer', 'Project Site Manager', 'Urban Planning Consultant'],
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'btech-civil-rural',
    category: 'civil',
    categoryLabel: 'Civil/Civil(Rural)',
    degreeType: 'B.Tech',
    title: 'B.Tech in Civil & Rural Infrastructure Development',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 50%)',
    description: 'Specialized program focused on sustainable rural construction, watershed management, rural road connectivity, and renewable rural utility grids.',
    specializations: ['Rural Roads (PMGSY)', 'Water Shed Management', 'Sustainable Materials'],
    careerOpportunities: ['Rural Development Officer', 'Irrigation Engineer', 'Govt. Infrastructure Supervisor'],
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'diploma-civil-eng',
    category: 'civil',
    categoryLabel: 'Civil/Civil(Rural)',
    degreeType: 'Diploma',
    title: 'Diploma in Civil Engineering (Polytechnic)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10th Standard Pass with Science & Math (Min 50%)',
    description: 'Practical, job-oriented training in building estimation, total station surveying, concrete quality testing, and CAD drafting.',
    specializations: ['Total Station Surveying', 'AutoCAD Civil 3D', 'Concrete Quality Assurance'],
    careerOpportunities: ['Junior Site Engineer', 'Draftsperson / Surveyor', 'Quantity Estimator'],
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },

  // 2. CS-IT
  {
    id: 'btech-cse-core',
    category: 'cs-it',
    categoryLabel: 'CS-IT',
    degreeType: 'B.Tech',
    title: 'B.Tech in Computer Science & Engineering',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 60%)',
    description: 'Core computer science curriculum covering data structures, operating systems, cloud architecture, compiler design, and full-stack software development.',
    specializations: ['Full Stack Development', 'Cloud & Microservices', 'Cyber Security'],
    careerOpportunities: ['Software Development Engineer', 'Cloud Architect', 'Backend Developer'],
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'btech-aiml-data',
    category: 'cs-it',
    categoryLabel: 'CS-IT',
    degreeType: 'B.Tech',
    title: 'B.Tech in AI & Machine Learning',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM & Computer/Electronics (Min 60%)',
    description: 'Cutting-edge program in deep learning, computer vision, natural language processing, generative AI models, and big data engineering.',
    specializations: ['Deep Neural Networks', 'Computer Vision & NLP', 'Large Language Models'],
    careerOpportunities: ['AI Engineer', 'Machine Learning Scientist', 'Data Science Consultant'],
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'diploma-cse-poly',
    category: 'cs-it',
    categoryLabel: 'CS-IT',
    degreeType: 'Diploma',
    title: 'Diploma in Computer Science & IT',
    duration: '3 Years (6 Semesters)',
    eligibility: '10th Standard Pass (Min 50%)',
    description: 'Practical training in web development (HTML/CSS/JS, React), relational databases, Python programming, and hardware maintenance.',
    specializations: ['Web App Development', 'Python & Database Systems', 'Network Admin Basics'],
    careerOpportunities: ['Frontend Developer', 'Technical Support Specialist', 'Database Support Assistant'],
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'btech-it-systems',
    category: 'cs-it',
    categoryLabel: 'CS-IT',
    degreeType: 'B.Tech',
    title: 'B.Tech in Information Technology',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 60%)',
    description: 'Focuses on enterprise networking, database management, mobile application engineering, and information systems security.',
    specializations: ['Enterprise Networks', 'Mobile App Development', 'DevOps & CI/CD'],
    careerOpportunities: ['IT Solutions Architect', 'DevOps Engineer', 'Systems Analyst'],
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },

  // 3. Electrical / Electronics
  {
    id: 'btech-eee',
    category: 'electrical',
    categoryLabel: 'Electrical/Electronics',
    degreeType: 'B.Tech',
    title: 'B.Tech in Electrical & Electronics Engineering (EEE)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 55%)',
    description: 'In-depth study of power generation, smart grids, electrical machines, microcontrollers, renewable solar/wind integration, and power electronics.',
    specializations: ['Smart Grid & Renewable Energy', 'Power Electronics & Drives', 'PLC & Industrial Automation'],
    careerOpportunities: ['Electrical Design Engineer', 'Substation Engineer', 'Power Systems Consultant'],
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'btech-ece',
    category: 'electrical',
    categoryLabel: 'Electrical/Electronics',
    degreeType: 'B.Tech',
    title: 'B.Tech in Electronics & Communication (ECE)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 55%)',
    description: 'Explores digital signal processing, VLSI chip design, embedded systems, wireless communications (5G/6G), and IoT sensor networks.',
    specializations: ['VLSI & Semiconductor Design', 'Embedded Systems & IoT', 'Wireless & RF Communications'],
    careerOpportunities: ['VLSI Verification Engineer', 'Embedded Hardware Developer', 'RF Telecom Specialist'],
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'diploma-electrical',
    category: 'electrical',
    categoryLabel: 'Electrical/Electronics',
    degreeType: 'Diploma',
    title: 'Diploma in Electrical Engineering',
    duration: '3 Years (6 Semesters)',
    eligibility: '10th Standard Pass with Science & Math (Min 50%)',
    description: 'Hands-on training in switchgear operation, electrical blueprint reading, motor rewinding, panel wiring, and industrial safety codes.',
    specializations: ['Industrial Motor Rewinding', 'Switchboard Assembly', 'Solar Rooftop Installation'],
    careerOpportunities: ['Electrical Maintenance Supervisor', 'Panel Testing Tech', 'Solar Installation Tech'],
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'iti-electrician-cert',
    category: 'electrical',
    categoryLabel: 'Electrical/Electronics',
    degreeType: 'ITI / Certificate',
    title: 'ITI Electrician (NCVT Certified Trade)',
    duration: '2 Years (4 Semesters)',
    eligibility: '10th Standard Pass',
    description: 'Government certified vocational program in residential and industrial wiring, transformer repair, and earthing protocols.',
    specializations: ['Domestic & Industrial Wiring', 'AC/DC Motors Servicing', 'Safety & Protective Relays'],
    careerOpportunities: ['Certified Electrician', 'Railway Technical Staff', 'Public Sector Utility Tech'],
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },

  // 4. Fire Safety
  {
    id: 'btech-fire-safety',
    category: 'fire-safety',
    categoryLabel: 'Fire Safety',
    degreeType: 'B.Tech',
    title: 'B.Tech in Fire & Safety Engineering',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 55%)',
    description: 'Advanced curriculum in fire hydraulics, explosion prevention, industrial hazardous materials management, building evacuation design, and environmental safety.',
    specializations: ['Fire Protection System Design', 'Hazard Identification & HAZOP', 'Industrial Disaster Management'],
    careerOpportunities: ['Fire & Safety Officer', 'EHS (Environmental Health & Safety) Manager', 'Safety Auditor'],
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'diploma-fire-safety',
    category: 'fire-safety',
    categoryLabel: 'Fire Safety',
    degreeType: 'Diploma',
    title: 'Diploma in Industrial Safety & Fire Protection',
    duration: '3 Years / 1 Year Post-Diploma',
    eligibility: '10th / 12th / Science Graduate',
    description: 'Applied technical program covering firefighting equipment operations, breathing apparatus handling, emergency drills, and factory act safety compliance.',
    specializations: ['Fire Extinguisher & Sprinkler Systems', 'Factory Act Compliance', 'First Aid & Emergency Drills'],
    careerOpportunities: ['Safety Inspector', 'Fire Station Officer', 'Plant Safety Supervisor'],
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    image: 'https://images.unsplash.com/photo-1599818818585-64906f35eb27?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'cert-occupational-safety',
    category: 'fire-safety',
    categoryLabel: 'Fire Safety',
    degreeType: 'ITI / Certificate',
    title: 'Certificate in Occupational Health & Fire Safety Management',
    duration: '1 Year (2 Semesters)',
    eligibility: '10th or 12th Standard Pass',
    description: 'Comprehensive occupational certificate focusing on construction site hazard mitigation, chemical emergency response, and PPE compliance.',
    specializations: ['Chemical Hazchem Response', 'Construction Site Safety', 'Safety Inspection Reporting'],
    careerOpportunities: ['Site Safety Supervisor', 'Emergency Response Crew', 'Risk Assessment Associate'],
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-700',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },

  // 5. Mechanical / Automobile
  {
    id: 'btech-mech-smart',
    category: 'mechanical',
    categoryLabel: 'Mechanical/Automobile',
    degreeType: 'B.Tech',
    title: 'B.Tech in Mechanical Engineering',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 60%)',
    description: 'Blends classic thermodynamics, fluid mechanics, and machine design with modern CNC tooling, robotics, 3D printing, and Industry 4.0 automation.',
    specializations: ['Robotics & Mechatronics', 'CAD/CAM & FEA Simulation', 'Thermal & Fluid Systems'],
    careerOpportunities: ['Mechanical Design Engineer', 'Production Manager', 'Automation Specialist'],
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'btech-auto-ev',
    category: 'mechanical',
    categoryLabel: 'Mechanical/Automobile',
    degreeType: 'B.Tech',
    title: 'B.Tech in Automobile Engineering (EV Technology)',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with PCM (Min 55%)',
    description: 'Focused on vehicle dynamics, internal combustion engines, battery management systems (BMS), electric powertrains, and autonomous driving telemetry.',
    specializations: ['Electric Powertrain Design', 'Battery Management Systems (BMS)', 'Vehicle Aerodynamics & Crash Testing'],
    careerOpportunities: ['EV Development Engineer', 'Automotive Systems Designer', 'Vehicle Testing Engineer'],
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'diploma-mech-prod',
    category: 'mechanical',
    categoryLabel: 'Mechanical/Automobile',
    degreeType: 'Diploma',
    title: 'Diploma in Mechanical Engineering (Production)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10th Standard Pass (Min 50%)',
    description: 'Hands-on workshop practice with lathes, milling machines, welding technologies, hydraulic presses, and statistical quality control.',
    specializations: ['CNC Milling & Turning', 'Tool & Die Design', 'Industrial Maintenance'],
    careerOpportunities: ['CNC Programmer', 'Maintenance Supervisor', 'Quality Assurance Inspector'],
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'diploma-auto-tech',
    category: 'mechanical',
    categoryLabel: 'Mechanical/Automobile',
    degreeType: 'Diploma',
    title: 'Diploma in Automobile Engineering',
    duration: '3 Years (6 Semesters)',
    eligibility: '10th Standard Pass (Min 50%)',
    description: 'Practical training on engine overhauling, computerized wheel alignment, electronic fuel injection (EFI), and hybrid vehicle servicing.',
    specializations: ['Engine Overhauling & Tuning', 'Auto Electrical Diagnostics', 'Service Station Management'],
    careerOpportunities: ['Service Workshop Manager', 'Automobile Diagnostic Tech', 'Fleet Maintenance Engineer'],
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-orange-700',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },

  // 6. Non-Technical / Graduation
  {
    id: 'grad-bca-app',
    category: 'non-tech',
    categoryLabel: 'Non-Technical',
    degreeType: 'Undergraduate (Non-Tech)',
    title: 'BCA - Bachelor of Computer Applications',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 Any Stream (Min 50% with English & Math/Stats)',
    description: 'Comprehensive software application degree covering Java/Python, database administration, modern web technologies, and mobile app design.',
    specializations: ['Full Stack Web Technologies', 'Database Administration', 'Software Quality Testing'],
    careerOpportunities: ['Application Developer', 'QA Automation Engineer', 'Web Developer'],
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'grad-bba-mgmt',
    category: 'non-tech',
    categoryLabel: 'Non-Technical',
    degreeType: 'Undergraduate (Non-Tech)',
    title: 'BBA - Bachelor of Business Administration',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 Any Stream (Min 50%)',
    description: 'Dynamic business degree developing leadership skills across digital marketing, financial management, business analytics, and human resources.',
    specializations: ['Digital Marketing & E-Commerce', 'Financial Analysis & Banking', 'Human Resource Management'],
    careerOpportunities: ['Business Development Associate', 'Marketing Executive', 'Operations Analyst'],
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'grad-bcom-fin',
    category: 'non-tech',
    categoryLabel: 'Non-Technical',
    degreeType: 'Undergraduate (Non-Tech)',
    title: 'B.Com (Honours in Finance, Banking & Accounting)',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with Commerce / Math (Min 50%)',
    description: 'Rigorous foundation in corporate taxation, forensic auditing, investment banking fundamentals, GST filing, and financial accounting software.',
    specializations: ['Corporate Accounting & Tally', 'Taxation & GST Compliance', 'Investment & Wealth Management'],
    careerOpportunities: ['Financial Analyst', 'Accountant / Tax Consultant', 'Banking Operations Officer'],
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  },
  {
    id: 'grad-bsc-analytics',
    category: 'non-tech',
    categoryLabel: 'Non-Technical',
    degreeType: 'Undergraduate (Non-Tech)',
    title: 'B.Sc in Computer Science & Data Analytics',
    duration: '3 Years (6 Semesters)',
    eligibility: '10+2 with Science & Mathematics (Min 50%)',
    description: 'Focuses on applied mathematical modeling, probability statistics, scientific Python programming, and business intelligence dashboards.',
    specializations: ['Statistical Modeling with R & Python', 'Data Visualization (PowerBI)', 'Applied Mathematics'],
    careerOpportunities: ['Data Analyst', 'Market Research Associate', 'Statistical Modeler'],
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    status: 'published'
  }
];

export const PROGRAMS_STORAGE_KEY = 'a2z_all_programs_catalog_v2';
export const PROGRAMS_UPDATED_EVENT = 'a2z_programs_updated';

export function getStoredPrograms(): ProgramItem[] {
  const enrichItem = (p: any): ProgramItem => {
    const deg = p.degreeType || 'B.Tech';
    const defaultFee =
      deg === 'B.Tech'
        ? '₹75,000 / Year'
        : deg === 'Diploma'
        ? '₹35,000 / Year'
        : deg === 'ITI / Certificate'
        ? '₹18,000 / Year'
        : '₹42,000 / Year';

    return {
      ...p,
      status: p.status || 'published',
      branch: p.branch || p.categoryLabel || deg,
      shortDescription: p.shortDescription || p.description || 'Professional training curriculum with hands-on lab projects.',
      qualification: p.qualification || p.eligibility || '10+2 / 10th / Diploma',
      passingYear: p.passingYear || '2023 - 2026',
      fee: p.fee || defaultFee,
      certificateInfo: p.certificateInfo || 'Govt. Recognized & ISO 9001:2015 QR-Verified Industry Certificate',
      contactInfo: p.contactInfo || {
        phone: '+91 98765 43210',
        email: 'admissions@a2z.edu.in',
        counselor: 'Senior Academic Counselor',
      },
    };
  };

  try {
    const saved = localStorage.getItem(PROGRAMS_STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((p: any) => p && p.id !== 'diploma-civil-rural')
          .map(enrichItem);
      }
    }
  } catch (e) {
    console.error('Error reading programs from storage', e);
  }
  return ALL_PROGRAMS_LIST.map(enrichItem);
}

export function saveStoredPrograms(programs: ProgramItem[]): void {
  try {
    localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programs));
    window.dispatchEvent(new CustomEvent(PROGRAMS_UPDATED_EVENT, { detail: programs }));
  } catch (e) {
    console.error('Error saving programs to storage', e);
  }
}

export function resetStoredPrograms(): ProgramItem[] {
  const defaults = ALL_PROGRAMS_LIST.map((p) => ({ ...p, status: 'published' as const }));
  saveStoredPrograms(defaults);
  return defaults;
}

export const CATEGORIES_STORAGE_KEY = 'a2z_program_categories_data';
export const CATEGORIES_UPDATED_EVENT = 'a2z:categories_updated';

export function getStoredCategories(): ProgramCategoryItem[] {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading categories from storage', e);
  }
  return DEFAULT_PROGRAM_CATEGORIES;
}

export function saveStoredCategories(categories: ProgramCategoryItem[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent(CATEGORIES_UPDATED_EVENT, { detail: categories }));
  } catch (e) {
    console.error('Error saving categories to storage', e);
  }
}

export function resetStoredCategories(): ProgramCategoryItem[] {
  saveStoredCategories(DEFAULT_PROGRAM_CATEGORIES);
  return DEFAULT_PROGRAM_CATEGORIES;
}

