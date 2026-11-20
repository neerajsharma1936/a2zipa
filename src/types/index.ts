export interface HeroBanner {
  id: string;
  title: string;
  desktopImage: string;
  mobileImage?: string;
  heading?: string;
  subtitle?: string;
  offerBadge?: string;
  ctaText?: string;
  ctaLink?: string;
  active: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  overlayMode?: 'clean' | 'gradient' | 'dark' | 'none';
  textColor?: 'dark' | 'light';
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'guest' | 'student' | 'mentor' | 'employer' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  headline?: string;
  phone?: string;
  college?: string;
  company?: string;
  profileCompletion?: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  duration: string; // e.g. "3 months"
  stipend: number; // in INR e.g. 10000
  stipendText: string; // "₹10,000/month"
  category: string; // "Web Development", "Data Science", etc.
  skills: string[];
  postedDaysAgo: number;
  postedDate: string;
  deadline: string;
  startDate: string;
  openings: number;
  certificateProvided: boolean;
  placementOpportunity: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  aboutCompany: string;
  isSaved?: boolean;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  nextStep?: string;
  resumeUrl?: string;
  coverLetter?: string;
  interviewDate?: string;
  interviewNotes?: string;
  stipendText?: string;
  location?: string;
  roleTitle?: string;
  stipend?: string;
  nextInterview?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  isCompleted: boolean;
  description: string;
  resources?: { name: string; url: string; size: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  branch?: string; // e.g. "B.Tech", "Diploma", "ITI", "Non Tech (Graduation)"
  rating: number;
  reviewCount: number;
  studentsCount: number;
  price: number;
  duration: string; // e.g. "40 hours" or "3 months"
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  skills: string[];
  image: string;
  description: string;
  modules: CourseModule[];
  progress?: number; // 0-100 for enrolled student
  isEnrolled?: boolean;
  status?: 'Active' | 'Draft' | 'Archived';
}

export interface ContactDetails {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  supportEmail: string;
  admissionContact: string;
}

export interface Project {
  id: string;
  title: string;
  technologies: string[];
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Under Review' | 'Completed';
  deadline: string;
  image: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  studentId: string;
  studentName: string;
  mentorName?: string;
  mentorFeedback?: string;
  mentorScore?: number;
  tasks?: { id: string; title: string; completed: boolean }[];
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  feedback?: string;
}

export interface Certificate {
  id: string;
  certificateId: string; // e.g. "CERT-2026-90412-A"
  studentName: string;
  courseTitle: string;
  issueDate: string;
  dateOfBirth?: string;
  startDate?: string;
  endDate?: string;
  directorName: string;
  directorTitle: string;
  qrCodeUrl: string;
  skillsAcquired: string[];
  grade: string;
  verificationUrl: string;
  skills?: string[];
  issuer?: string;
  title?: string;
  logoUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'Applications' | 'Courses' | 'Projects' | 'Payments' | 'System';
  isRead: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  attachment?: { name: string; size: string; type: string };
  isMine: boolean;
  isMe?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  module: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar?: string;
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Interested' | 'Converted' | 'Not Interested' | 'Pending' | 'Under Review' | 'Approved' | 'Shortlisted' | 'Rejected';

export type StudentRegistrationStatus = LeadStatus;

export interface UploadedDocFile {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface LeadFollowUp {
  id: string;
  registrationId: string;
  followUpDate: string;
  followUpTime: string;
  note: string;
  assignedAdmin: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface LeadActivityLog {
  id: string;
  registrationId: string;
  timestamp: string;
  date: string;
  time: string;
  user: string;
  action: string;
  notes?: string;
  statusFrom?: string;
  statusTo?: string;
}

export interface ConvertedStudent {
  id: string;
  studentId: string; // e.g. "STU-2026-90412"
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  branch: string;
  college: string;
  passingYear: string;
  course: string;
  placementType: string;
  enrollmentDate: string;
  status: 'Active' | 'Completed' | 'Dropped';
  batchNumber: string; // e.g. "BATCH-2026-A"
  progressPercent: number; // 0 to 100
  certificatesIssued?: string[]; // Array of Certificate ID strings
  convertedBy: string;
  convertedAt: string;
  avatar?: string;
  certificateSummer1?: UploadedDocFile;
  certificateSummer2?: UploadedDocFile;
  resume?: UploadedDocFile;
  aadhaarCard?: UploadedDocFile;
  adminRemarks?: string;
}

export interface StudentRegistration {
  id: string;
  registrationNumber: string; // e.g. "REG-2025-84920"
  placement?: string;
  name: string;
  qualification: string;
  branch: string;
  college: string;
  duration?: string;
  passingYear: string;
  email?: string;
  phone?: string;
  course?: string;
  certificateSummer1?: UploadedDocFile;
  certificateSummer2?: UploadedDocFile;
  resume?: UploadedDocFile;
  aadhaarCard?: UploadedDocFile;
  status: LeadStatus;
  leadStatus?: LeadStatus;
  followUpDate?: string;
  followUpTime?: string;
  followUpNote?: string;
  assignedAdmin?: string;
  submittedAt: string;
  adminRemarks?: string;
}

export interface CourseInquiry {
  id: string;
  inquiryNumber: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  selectedCourse: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed';
}

export interface ConnectRequest {
  id: string;
  connectNumber: string;
  name: string;
  phone: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export type AnnouncementCategory =
  | 'General'
  | 'Internship'
  | 'Placement'
  | 'Training'
  | 'Admission'
  | 'Important Notice';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  link?: string;
  category: AnnouncementCategory;
  startDate?: string;
  expiryDate?: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TickerSettings {
  isVisible: boolean;
  scrollSpeed: 'slow' | 'normal' | 'fast';
  scrollDirection: 'left' | 'right';
  bgColor: string;
  textColor: string;
  labelText: string;
  labelBgColor: string;
  pauseOnHover: boolean;
}

export type StoryTheme = 'blue' | 'purple' | 'emerald' | 'amber' | 'indigo' | 'cyan';

export interface SuccessStoryItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  theme: StoryTheme;
  companyTag?: string;
  rating?: number;
  active: boolean;
  order: number;
}
