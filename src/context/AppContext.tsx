import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Internship,
  Application,
  Course,
  ContactDetails,
  Project,
  Certificate,
  NotificationItem,
  Conversation,
  ChatMessage,
  AuditLog,
  HeroBanner,
  StudentRegistration,
  StudentRegistrationStatus,
  LeadStatus,
  LeadFollowUp,
  LeadActivityLog,
  ConvertedStudent,
  UploadedDocFile,
  CourseInquiry,
  ConnectRequest,
  AdminUser,
  Announcement,
  TickerSettings,
  SuccessStoryItem,
} from '../types';
import {
  mockCurrentUser,
  mockUsersByRole,
  initialAdminUsers,
  initialInternships,
  initialCourses,
  initialBranches,
  initialContactDetails,
  initialApplications,
  initialProjects,
  initialCertificates,
  initialNotifications,
  initialConversations,
  initialAuditLogs,
  initialHeroBanners,
  initialPlacements,
  initialQualifications,
  initialBranchesList,
  initialPassingYears,
  initialColleges,
  initialDurations,
  initialStudentRegistrations,
  initialConvertedStudents,
  initialLeadFollowUps,
  initialLeadActivities,
  initialCourseInquiries,
  initialConnectRequests,
  initialAnnouncements,
  initialTickerSettings,
  initialSuccessStories,
} from '../data/mockData';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  currentView: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateTo: (
    view: string,
    params?: {
      internshipId?: string;
      courseId?: string;
      certId?: string;
      searchQuery?: string;
      selectedCourse?: string;
      tab?: string;
      category?: string;
    }
  ) => void;
  
  // Navigation targets
  currentInternshipId: string | null;
  setCurrentInternshipId: (id: string | null) => void;
  currentCourseId: string | null;
  setCurrentCourseId: (id: string | null) => void;
  currentCertId: string | null;
  setCurrentCertId: (id: string | null) => void;
  
  // Data
  internships: Internship[];
  savedInternshipIds: string[];
  toggleSaveInternship: (id: string) => void;
  addInternship: (internship: Omit<Internship, 'id' | 'postedDaysAgo' | 'postedDate'>) => void;
  
  courses: Course[];
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, moduleId: string, lessonId: string) => void;
  addCourse: (course: Omit<Course, 'id'> | Course) => string;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  
  branches: string[];
  addBranch: (branchName: string) => void;
  removeBranch?: (branchName: string) => void;
  
  contactDetails: ContactDetails;
  updateContactDetails: (details: Partial<ContactDetails>) => void;
  
  applications: Application[];
  applyToInternship: (internshipId: string, coverLetter?: string, resumeName?: string) => boolean;
  updateApplicationStatus: (appId: string, newStatus: Application['status'], nextStep?: string, interviewDate?: string) => void;
  withdrawApplication: (appId: string) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'studentId' | 'studentName'>) => void;
  updateProjectProgress: (projectId: string, progress: number, status?: Project['status']) => void;
  addMentorFeedback: (projectId: string, feedback: string, score: number) => void;
  
  certificates: Certificate[];
  generateCertificate: (
    courseTitle: string,
    studentName?: string,
    startDate?: string,
    endDate?: string
  ) => Certificate;
  updateCertificate: (id: string, updated: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  conversations: Conversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  messages: ChatMessage[];
  sendMessage: (conversationIdOrText: string, textOrAttachment?: any, attachment?: any) => void;
  cancelApplication?: (appId: string) => void;
  
  // Hero Banners (Admin Management & Public Carousel)
  heroBanners: HeroBanner[];
  addHeroBanner: (banner: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHeroBanner: (id: string, updated: Partial<HeroBanner>) => void;
  deleteHeroBanner: (id: string) => void;
  toggleHeroBannerStatus: (id: string) => void;
  reorderHeroBanners: (orderedIds: string[]) => void;
  
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, description: string) => void;
  
  // Lead & Converted Student System
  convertedStudents: ConvertedStudent[];
  leadFollowUps: LeadFollowUp[];
  leadActivities: LeadActivityLog[];
  scheduleLeadFollowUp: (registrationId: string, data: { followUpDate: string; followUpTime: string; note: string; assignedAdmin: string }) => void;
  addLeadActivityLog: (registrationId: string, action: string, notes?: string, statusFrom?: string, statusTo?: string) => void;
  convertLeadToStudent: (registrationId: string, data: { course?: string; batchNumber?: string; studentId?: string }) => ConvertedStudent | null;
  updateConvertedStudentProgress: (studentId: string, progressPercent: number, status?: ConvertedStudent['status']) => void;
  updateConvertedStudentDetails: (studentId: string, updated: Partial<ConvertedStudent>) => void;

  // Student Registrations & Dynamic Form Options
  studentRegistrations: StudentRegistration[];
  addStudentRegistration: (data: Omit<StudentRegistration, 'id' | 'registrationNumber' | 'submittedAt' | 'status'>) => StudentRegistration;
  updateRegistrationStatus: (id: string, status: StudentRegistrationStatus, remarks?: string) => void;
  deleteRegistration: (id: string) => void;

  // Course Inquiries & Contact Applications
  courseInquiries: CourseInquiry[];
  addCourseInquiry: (inquiry: Omit<CourseInquiry, 'id' | 'inquiryNumber' | 'submittedAt' | 'status'>) => CourseInquiry;
  updateCourseInquiryStatus: (id: string, status: CourseInquiry['status']) => void;
  deleteCourseInquiry: (id: string) => void;
  selectedCourseForApplication: string;
  setSelectedCourseForApplication: (course: string) => void;

  // Connect Requests (Isolated Connect Feature)
  connectRequests: ConnectRequest[];
  addConnectRequest: (data: { name: string; phone: string }) => ConnectRequest;
  updateConnectRequestStatus: (id: string, status: ConnectRequest['status']) => void;
  deleteConnectRequest: (id: string) => void;
  
  placements: string[];
  addPlacement: (placement: string) => void;
  updatePlacement: (oldName: string, newName: string) => void;
  removePlacement: (placement: string) => void;
  
  qualifications: string[];
  addQualification: (qualification: string) => void;
  updateQualification: (oldName: string, newName: string) => void;
  removeQualification: (qualification: string) => void;
  
  branchesList: string[];
  addBranchOption: (branchName: string) => void;
  updateBranchOption: (oldName: string, newName: string) => void;
  removeBranchOption: (branchName: string) => void;
  
  passingYears: string[];
  addPassingYear: (year: string) => void;
  removePassingYear: (year: string) => void;

  colleges: string[];
  addCollege: (collegeName: string) => void;
  updateCollege: (oldName: string, newName: string) => void;
  removeCollege: (collegeName: string) => void;

  durations: string[];
  addDuration: (duration: string) => void;
  updateDuration: (oldName: string, newName: string) => void;
  removeDuration: (duration: string) => void;

  // Success Stories & Testimonials Cards Management
  successStories: SuccessStoryItem[];
  addSuccessStory: (story: Omit<SuccessStoryItem, 'id'>) => void;
  updateSuccessStory: (id: string, updated: Partial<SuccessStoryItem>) => void;
  deleteSuccessStory: (id: string) => void;
  toggleSuccessStoryActive: (id: string) => void;
  resetSuccessStories: () => void;
  reorderSuccessStories: (stories: SuccessStoryItem[]) => void;

  // News Ticker & Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnnouncement: (id: string, updated: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementActive: (id: string) => void;
  reorderAnnouncements: (reordered: Announcement[]) => void;
  tickerSettings: TickerSettings;
  updateTickerSettings: (settings: Partial<TickerSettings>) => void;

  // Admin Management (Super Admin)
  adminUsers: AdminUser[];
  addAdminUser: (admin: Omit<AdminUser, 'id' | 'lastActive'>) => void;
  updateAdminUser: (id: string, updated: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  toggleAdminStatus: (id: string) => void;

  // Modals & Feedback
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  activeApplyInternship: Internship | null;
  openApplyModal: (internship: Internship) => void;
  
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null || saved === undefined) return fallback;
    const parsed = JSON.parse(saved);
    if (Array.isArray(fallback)) {
      return (Array.isArray(parsed) ? parsed : fallback) as T;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & User
  const [currentRole, setCurrentRoleState] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<User>(mockUsersByRole.guest);
  
  // View Routing
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentInternshipId, setCurrentInternshipId] = useState<string | null>('int_1');
  const [currentCourseId, setCurrentCourseId] = useState<string | null>('crs_1');
  const [currentCertId, setCurrentCertId] = useState<string | null>('SN-2024-9842X');
  
  // Entities
  const [internships, setInternships] = useState<Internship[]>(() =>
    safeLoad('a2z_internships', initialInternships)
  );
  
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>(() =>
    safeLoad('a2z_saved_internships', ['int_1', 'int_3'])
  );
  
  const [courses, setCourses] = useState<Course[]>(() =>
    safeLoad('a2z_courses', initialCourses)
  );

  const [branches, setBranches] = useState<string[]>(() =>
    safeLoad('a2z_branches', initialBranches)
  );

  const [contactDetails, setContactDetails] = useState<ContactDetails>(() =>
    safeLoad('a2z_contact_details', initialContactDetails)
  );
  
  const [applications, setApplications] = useState<Application[]>(() =>
    safeLoad('a2z_applications', initialApplications)
  );
  
  const [projects, setProjects] = useState<Project[]>(() =>
    safeLoad('a2z_projects', initialProjects)
  );
  
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    safeLoad('a2z_certificates', initialCertificates)
  );
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeLoad('a2z_notifications', initialNotifications)
  );
  
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    safeLoad('a2z_conversations', initialConversations)
  );
  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');
  
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    safeLoad('a2z_audit_logs', initialAuditLogs)
  );

  // Hero Banners
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() =>
    safeLoad('a2z_hero_banners', initialHeroBanners)
  );

  // Student Registrations & Lead Management
  const [studentRegistrations, setStudentRegistrations] = useState<StudentRegistration[]>(() =>
    safeLoad('a2z_student_registrations', initialStudentRegistrations)
  );
  const [convertedStudents, setConvertedStudents] = useState<ConvertedStudent[]>(() =>
    safeLoad('a2z_converted_students', initialConvertedStudents)
  );
  const [leadFollowUps, setLeadFollowUps] = useState<LeadFollowUp[]>(() =>
    safeLoad('a2z_lead_followups', initialLeadFollowUps)
  );
  const [leadActivities, setLeadActivities] = useState<LeadActivityLog[]>(() =>
    safeLoad('a2z_lead_activities', initialLeadActivities)
  );
  const [courseInquiries, setCourseInquiries] = useState<CourseInquiry[]>(() =>
    safeLoad('a2z_course_inquiries', initialCourseInquiries)
  );
  const [connectRequests, setConnectRequests] = useState<ConnectRequest[]>(() =>
    safeLoad('a2z_connect_requests', initialConnectRequests)
  );
  const [selectedCourseForApplication, setSelectedCourseForApplication] = useState<string>('');
  const [placements, setPlacements] = useState<string[]>(() =>
    safeLoad('a2z_placements', initialPlacements)
  );
  const [qualifications, setQualifications] = useState<string[]>(() =>
    safeLoad('a2z_qualifications', initialQualifications)
  );
  const [branchesList, setBranchesList] = useState<string[]>(() =>
    safeLoad('a2z_branches_list', initialBranchesList)
  );
  const [passingYears, setPassingYears] = useState<string[]>(() =>
    safeLoad('a2z_passing_years', initialPassingYears)
  );
  const [colleges, setColleges] = useState<string[]>(() =>
    safeLoad('a2z_colleges', initialColleges)
  );
  const [durations, setDurations] = useState<string[]>(() =>
    safeLoad('a2z_durations', initialDurations)
  );

  // Admin Users State (Super Admin)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    safeLoad('a2z_admin_users', initialAdminUsers)
  );

  useEffect(() => {
    localStorage.setItem('a2z_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  const addAdminUser = (adminData: Omit<AdminUser, 'id' | 'lastActive'>) => {
    const newAdmin: AdminUser = {
      ...adminData,
      id: `adm_${Date.now()}`,
      lastActive: 'Just now',
    };
    setAdminUsers((prev) => [newAdmin, ...prev]);
    addAuditLog(
      'CREATE_ADMIN',
      'SuperAdminManagement',
      `Created admin ${newAdmin.name} (${newAdmin.email}) - Role: ${newAdmin.role}`
    );
    showToast(`Administrator ${newAdmin.name} created successfully`, 'success');
  };

  const updateAdminUser = (id: string, updated: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
    addAuditLog('UPDATE_ADMIN', 'SuperAdminManagement', `Updated administrator details ID: ${id}`);
    showToast('Administrator updated successfully', 'success');
  };

  const deleteAdminUser = (id: string) => {
    const target = adminUsers.find((a) => a.id === id);
    if (target?.email === 'anils9172@gmail.com') {
      showToast('Primary Super Admin account cannot be deleted', 'error');
      return;
    }
    setAdminUsers((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('DELETE_ADMIN', 'SuperAdminManagement', `Removed administrator ${target?.name || id}`);
    showToast('Administrator removed', 'info');
  };

  const toggleAdminStatus = (id: string) => {
    const target = adminUsers.find((a) => a.id === id);
    if (target?.email === 'anils9172@gmail.com') {
      showToast('Primary Super Admin account status cannot be deactivated', 'error');
      return;
    }
    setAdminUsers((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' }
          : a
      )
    );
    showToast(`Admin status updated for ${target?.name}`, 'info');
  };

  // Student Success Stories State
  const [successStories, setSuccessStories] = useState<SuccessStoryItem[]>(() =>
    safeLoad('a2z_success_stories', initialSuccessStories)
  );

  useEffect(() => {
    localStorage.setItem('a2z_success_stories', JSON.stringify(successStories));
  }, [successStories]);

  const addSuccessStory = (story: Omit<SuccessStoryItem, 'id'>) => {
    const newStory: SuccessStoryItem = {
      ...story,
      id: `story_${Date.now()}`,
    };
    setSuccessStories((prev) => [newStory, ...prev]);
  };

  const updateSuccessStory = (id: string, updated: Partial<SuccessStoryItem>) => {
    setSuccessStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteSuccessStory = (id: string) => {
    setSuccessStories((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSuccessStoryActive = (id: string) => {
    setSuccessStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const resetSuccessStories = () => {
    setSuccessStories(initialSuccessStories);
  };

  const reorderSuccessStories = (stories: SuccessStoryItem[]) => {
    setSuccessStories(stories);
  };

  // Announcements & News Ticker Settings State
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    safeLoad('a2z_announcements', initialAnnouncements)
  );
  const [tickerSettings, setTickerSettings] = useState<TickerSettings>(() =>
    safeLoad('a2z_ticker_settings', initialTickerSettings)
  );

  useEffect(() => {
    localStorage.setItem('a2z_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('a2z_ticker_settings', JSON.stringify(tickerSettings));
  }, [tickerSettings]);

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, updated: Partial<Announcement>) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated, updatedAt: new Date().toISOString() } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString() } : a))
    );
  };

  const reorderAnnouncements = (reordered: Announcement[]) => {
    setAnnouncements(reordered);
  };

  const updateTickerSettings = (settings: Partial<TickerSettings>) => {
    setTickerSettings((prev) => ({ ...prev, ...settings }));
  };

  // Modals & Toasts
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeApplyInternship, setActiveApplyInternship] = useState<Internship | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('a2z_internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('a2z_saved_internships', JSON.stringify(savedInternshipIds));
  }, [savedInternshipIds]);

  useEffect(() => {
    localStorage.setItem('a2z_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('a2z_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('a2z_contact_details', JSON.stringify(contactDetails));
  }, [contactDetails]);

  useEffect(() => {
    localStorage.setItem('a2z_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('a2z_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('a2z_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('a2z_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('a2z_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('a2z_hero_banners', JSON.stringify(heroBanners));
  }, [heroBanners]);

  useEffect(() => {
    localStorage.setItem('a2z_student_registrations', JSON.stringify(studentRegistrations));
  }, [studentRegistrations]);

  useEffect(() => {
    localStorage.setItem('a2z_converted_students', JSON.stringify(convertedStudents));
  }, [convertedStudents]);

  useEffect(() => {
    localStorage.setItem('a2z_lead_followups', JSON.stringify(leadFollowUps));
  }, [leadFollowUps]);

  useEffect(() => {
    localStorage.setItem('a2z_lead_activities', JSON.stringify(leadActivities));
  }, [leadActivities]);

  useEffect(() => {
    localStorage.setItem('a2z_course_inquiries', JSON.stringify(courseInquiries));
  }, [courseInquiries]);

  useEffect(() => {
    localStorage.setItem('a2z_connect_requests', JSON.stringify(connectRequests));
  }, [connectRequests]);

  useEffect(() => {
    localStorage.setItem('a2z_placements', JSON.stringify(placements));
  }, [placements]);

  useEffect(() => {
    localStorage.setItem('a2z_qualifications', JSON.stringify(qualifications));
  }, [qualifications]);

  useEffect(() => {
    localStorage.setItem('a2z_branches_list', JSON.stringify(branchesList));
  }, [branchesList]);

  useEffect(() => {
    localStorage.setItem('a2z_passing_years', JSON.stringify(passingYears));
  }, [passingYears]);

  useEffect(() => {
    localStorage.setItem('a2z_colleges', JSON.stringify(colleges));
  }, [colleges]);

  useEffect(() => {
    localStorage.setItem('a2z_durations', JSON.stringify(durations));
  }, [durations]);

  // Synchronize dynamic dropdown options across tabs and windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'a2z_qualifications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setQualifications(parsed);
        } catch {}
      }
      if (e.key === 'a2z_branches_list' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setBranchesList(parsed);
        } catch {}
      }
      if (e.key === 'a2z_colleges' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setColleges(parsed);
        } catch {}
      }
      if (e.key === 'a2z_durations' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDurations(parsed);
        } catch {}
      }
      if (e.key === 'a2z_passing_years' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPassingYears(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentUser(mockUsersByRole[role] || mockUsersByRole.guest);
    showToast(`Switched active role to: ${role.toUpperCase().replace('_', ' ')}`, 'info');
    
    // Auto-navigate to appropriate view if on a restricted dashboard
    if (role === 'student' && currentView.startsWith('admin')) {
      setCurrentView('home');
    } else if (role === 'mentor' && currentView.startsWith('admin')) {
      setCurrentView('all-programs');
    } else if (role === 'employer' && currentView.startsWith('admin')) {
      setCurrentView('all-programs');
    } else if ((role === 'admin' || role === 'super_admin') && !currentView.startsWith('admin')) {
      setCurrentView('admin-management');
    }
  };

  const navigateTo = (
    view: string,
    params?: {
      internshipId?: string;
      courseId?: string;
      certId?: string;
      searchQuery?: string;
      selectedCourse?: string;
      tab?: string;
      category?: string;
    }
  ) => {
    if (params?.internshipId) setCurrentInternshipId(params.internshipId);
    if (params?.courseId) setCurrentCourseId(params.courseId);
    if (params?.certId) setCurrentCertId(params.certId);
    if (params?.searchQuery !== undefined) setSearchQuery(params.searchQuery);
    if (params?.selectedCourse !== undefined) {
      setSelectedCourseForApplication(params.selectedCourse);
    }
    
    // Normalization for application views
    if (view === 'apply' || view === 'application' || view === 'contact') {
      setCurrentView('student-registration');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSaveInternship = (id: string) => {
    setSavedInternshipIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Internship removed from saved items' : 'Internship saved to your list', 'success');
      return updated;
    });
  };

  const addInternship = (newInternshipData: Omit<Internship, 'id' | 'postedDaysAgo' | 'postedDate'>) => {
    const newId = `int_${Date.now()}`;
    const newInternship: Internship = {
      ...newInternshipData,
      id: newId,
      postedDaysAgo: 0,
      postedDate: 'Today',
    };
    setInternships((prev) => [newInternship, ...prev]);
    addAuditLog('Created Internship', 'Internships', `Published "${newInternship.title}" for ${newInternship.company}`);
    showToast(`"${newInternship.title}" has been published live!`, 'success');
  };

  const enrollInCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true, progress: c.progress || 5 } : c))
    );
    showToast('Enrolled in course successfully! Access granted.', 'success');
    setCurrentCourseId(courseId);
  };

  const markLessonComplete = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) return course;
        
        let totalLessons = 0;
        let completedLessons = 0;
        
        const updatedModules = course.modules.map((mod) => {
          const updatedLessons = mod.lessons.map((les) => {
            totalLessons++;
            if (les.id === lessonId || les.isCompleted) {
              completedLessons++;
              return { ...les, isCompleted: true };
            }
            return les;
          });
          return { ...mod, lessons: updatedLessons };
        });

        const newProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 100;
        return {
          ...course,
          modules: updatedModules,
          progress: Math.min(100, Math.max(course.progress || 0, newProgress)),
        };
      })
    );
    showToast('Lesson completed! Progress updated.', 'success');
  };

  const addCourse = (courseData: Omit<Course, 'id'> | Course): string => {
    const newId = 'id' in courseData && courseData.id ? courseData.id : `crs_${Date.now()}`;
    const newCourse: Course = {
      id: newId,
      rating: 4.8,
      reviewCount: 0,
      studentsCount: 0,
      modules: [],
      progress: 0,
      isEnrolled: false,
      status: 'Active',
      branch: 'B.Tech',
      ...courseData,
    };
    setCourses((prev) => [newCourse, ...prev]);
    addAuditLog('ADD_COURSE', 'Course Management', `Added course "${newCourse.title}" (${newCourse.branch || 'General'})`);
    showToast(`Course "${newCourse.title}" created successfully!`, 'success');
    return newId;
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newCourse = { ...c, ...updated };
          return newCourse;
        }
        return c;
      })
    );
    addAuditLog('UPDATE_COURSE', 'Course Management', `Updated course details for ID: ${id}`);
    showToast('Course details saved and updated successfully!', 'success');
  };

  const removeCourse = (id: string) => {
    const target = courses.find((c) => c.id === id);
    const title = target?.title || id;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE_COURSE', 'Course Management', `Deleted course "${title}"`);
    showToast(`Course "${title}" removed successfully.`, 'info');
  };

  const addBranch = (branchName: string) => {
    const trimmed = branchName.trim();
    if (!trimmed) return;
    if (branches.includes(trimmed)) {
      showToast(`Branch "${trimmed}" already exists.`, 'info');
      return;
    }
    setBranches((prev) => [...prev, trimmed]);
    addAuditLog('ADD_BRANCH', 'Branch Management', `Created new educational branch: ${trimmed}`);
    showToast(`Branch "${trimmed}" added successfully!`, 'success');
  };

  const removeBranch = (branchName: string) => {
    setBranches((prev) => prev.filter((b) => b !== branchName));
    addAuditLog('DELETE_BRANCH', 'Branch Management', `Removed branch: ${branchName}`);
    showToast(`Branch "${branchName}" removed.`, 'info');
  };

  const updateContactDetails = (details: Partial<ContactDetails>) => {
    setContactDetails((prev) => ({
      ...prev,
      ...details,
    }));
    addAuditLog('UPDATE_CONTACT', 'Contact Details', 'Updated public contact and admission helpline');
    showToast('Contact and helpline details updated successfully!', 'success');
  };

  const applyToInternship = (internshipId: string, coverLetter?: string, resumeName: string = 'Rahul_Sharma_Resume.pdf'): boolean => {
    const internship = internships.find((i) => i.id === internshipId);
    if (!internship) return false;

    // Prevent duplicate application
    const existing = applications.find(
      (a) => a.internshipId === internshipId && a.studentId === currentUser.id
    );
    if (existing) {
      showToast('You have already applied for this internship.', 'warning');
      return false;
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      internshipId: internship.id,
      internshipTitle: internship.title,
      company: internship.company,
      companyLogo: internship.companyLogo,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentAvatar: currentUser.avatar,
      appliedDate: 'Just now',
      status: 'Applied',
      nextStep: 'Application submitted. Pending review by hiring team.',
      resumeUrl: resumeName,
      coverLetter: coverLetter || 'I am eager to contribute with my skills in software development.',
      stipendText: internship.stipendText,
      location: internship.location,
    };

    setApplications((prev) => [newApp, ...prev]);
    
    // Add student notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Application Submitted',
      description: `Your application for ${internship.title} at ${internship.company} was received.`,
      time: 'Just now',
      category: 'Applications',
      isRead: false,
      actionUrl: 'all-programs',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Application submitted successfully!', 'success');
    return true;
  };

  const updateApplicationStatus = (
    appId: string,
    newStatus: Application['status'],
    nextStep?: string,
    interviewDate?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: newStatus,
          nextStep: nextStep || app.nextStep,
          interviewDate: interviewDate || app.interviewDate,
        };
      })
    );
    
    // Create notification
    const targetApp = applications.find((a) => a.id === appId);
    if (targetApp) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `Application Status: ${newStatus}`,
        description: `${targetApp.company} updated your application for ${targetApp.internshipTitle} to ${newStatus}.`,
        time: 'Just now',
        category: 'Applications',
        isRead: false,
        actionUrl: 'all-programs',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    addAuditLog('Updated Application Status', 'Applications', `Status changed to ${newStatus} for Application #${appId}`);
    showToast(`Application updated to ${newStatus}`, 'success');
  };

  const withdrawApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    showToast('Application withdrawn successfully', 'info');
  };

  const addProject = (projectData: Omit<Project, 'id' | 'studentId' | 'studentName'>) => {
    const newProject: Project = {
      ...projectData,
      id: `prj_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
    };
    setProjects((prev) => [newProject, ...prev]);
    showToast(`Project "${newProject.title}" added to your portfolio!`, 'success');
  };

  const updateProjectProgress = (projectId: string, progress: number, status?: Project['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newStatus = status || (progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started');
        return { ...p, progress, status: newStatus };
      })
    );
    showToast('Project progress updated!', 'success');
  };

  const addMentorFeedback = (projectId: string, feedback: string, score: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          mentorFeedback: feedback,
          mentorScore: score,
          status: 'In Progress',
        };
      })
    );
    
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Mentor Feedback Received',
      description: `Your mentor scored your project (${score}/100) with personalized feedback.`,
      time: 'Just now',
      category: 'Projects',
      isRead: false,
      actionUrl: 'notifications',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Feedback submitted to student successfully', 'success');
  };

  const generateCertificate = (
    courseTitle: string,
    studentName?: string,
    startDate?: string,
    endDate?: string
  ): Certificate => {
    const certNum = Math.floor(10000 + Math.random() * 90000);
    const certLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const newId = `CERT-2026-${certNum}-${certLetter}`;
    
    const issueDt = new Date();
    const defaultStart = startDate || '11 Jan 2025';
    const defaultEnd = endDate || issueDt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newCert: Certificate = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      certificateId: newId,
      studentName: studentName || currentUser.name,
      courseTitle,
      issueDate: defaultEnd,
      startDate: defaultStart,
      endDate: defaultEnd,
      directorName: 'Siddharth Sengupta',
      directorTitle: 'Academic Director & Council Chair',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://a2z.org/verify-certificate/${newId}`,
      skillsAcquired: ['Full Stack Development', 'React Architecture', 'System Design', 'Production Deployment'],
      grade: 'A+ (Distinction)',
      verificationUrl: `/verify-certificate/${newId}`,
    };

    setCertificates((prev) => [newCert, ...prev]);
    
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Certificate Issued!',
      description: `Official Certificate for ${courseTitle} is ready to view & download.`,
      time: 'Just now',
      category: 'System',
      isRead: false,
      actionUrl: 'student-certificates',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Certificate ${newId} generated successfully!`, 'success');
    return newCert;
  };

  const updateCertificate = (id: string, updated: Partial<Certificate>) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id || c.certificateId === id) {
          const newCertId = updated.certificateId || c.certificateId;
          const updatedQr = updated.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://a2z.org/verify-certificate/${newCertId}`;
          return {
            ...c,
            ...updated,
            qrCodeUrl: updatedQr,
          };
        }
        return c;
      })
    );
    addAuditLog('UPDATE_CERTIFICATE', 'Certificates', `Updated certificate details for #${id}`);
    showToast('Certificate details updated successfully!', 'success');
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id && c.certificateId !== id));
    addAuditLog('DELETE_CERTIFICATE', 'Certificates', `Deleted certificate #${id}`);
    showToast('Certificate removed', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const sendMessage = (conversationIdOrText: string, textOrAttachment?: any, attachment?: any) => {
    let targetConvId = activeConversationId;
    let messageText = '';
    let messageAttach: { name: string; size: string; type: string } | undefined = undefined;

    if (typeof textOrAttachment === 'string') {
      targetConvId = conversationIdOrText;
      messageText = textOrAttachment;
      messageAttach = attachment;
    } else {
      messageText = conversationIdOrText;
      messageAttach = textOrAttachment;
    }

    if (!messageText.trim() && !messageAttach) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentRole,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: messageAttach,
      isMine: true,
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== targetConvId) return conv;
        return {
          ...conv,
          lastMessage: messageText.trim() || `Sent an attachment: ${messageAttach?.name}`,
          lastMessageTime: 'Just now',
          messages: [...(conv.messages || []), newMsg],
        };
      })
    );
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages: ChatMessage[] = activeConversation?.messages || [];

  const addAuditLog = (action: string, module: string, description: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      action,
      module,
      description,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '103.21.144.18',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const openApplyModal = (internship: Internship) => {
    setActiveApplyInternship(internship);
    setIsApplyModalOpen(true);
  };

  const addHeroBanner = (bannerData: Omit<HeroBanner, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `banner_${Date.now()}`;
    const now = new Date().toISOString();
    const newBanner: HeroBanner = {
      ...bannerData,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };
    setHeroBanners((prev) => [...prev, newBanner].sort((a, b) => a.order - b.order));
    addAuditLog('Banner Created', 'Hero Banner Management', `Added banner "${newBanner.title}"`);
    showToast(`Banner "${newBanner.title}" added successfully`, 'success');
  };

  const updateHeroBanner = (id: string, updated: Partial<HeroBanner>) => {
    const now = new Date().toISOString();
    setHeroBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: now } : b)).sort((a, b) => a.order - b.order)
    );
    const existing = heroBanners.find((b) => b.id === id);
    addAuditLog('Banner Updated', 'Hero Banner Management', `Updated banner "${existing?.title || id}"`);
    showToast('Banner updated successfully', 'success');
  };

  const deleteHeroBanner = (id: string) => {
    const target = heroBanners.find((b) => b.id === id);
    setHeroBanners((prev) => prev.filter((b) => b.id !== id));
    addAuditLog('Banner Deleted', 'Hero Banner Management', `Deleted banner "${target?.title || id}"`);
    showToast('Banner permanently deleted', 'info');
  };

  const toggleHeroBannerStatus = (id: string) => {
    setHeroBanners((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const newStatus = !b.active;
          showToast(`Banner "${b.title}" is now ${newStatus ? 'Active' : 'Inactive'}`, 'info');
          return { ...b, active: newStatus, updatedAt: new Date().toISOString() };
        }
        return b;
      })
    );
  };

  const reorderHeroBanners = (orderedIds: string[]) => {
    setHeroBanners((prev) => {
      const bannerMap = new Map<string, HeroBanner>();
      prev.forEach((b) => bannerMap.set(b.id, b));
      const result: HeroBanner[] = [];
      orderedIds.forEach((id, index) => {
        const item = bannerMap.get(id);
        if (item) {
          result.push({ ...item, order: index + 1 });
        }
      });
      prev.forEach((b) => {
        if (!orderedIds.includes(b.id)) {
          result.push({ ...b, order: result.length + 1 });
        }
      });
      return result;
    });
    showToast('Banner order updated', 'success');
  };

  // Lead & Converted Student Handlers
  const addLeadActivityLog = (
    registrationId: string,
    action: string,
    notes?: string,
    statusFrom?: string,
    statusTo?: string
  ) => {
    const now = new Date();
    const newLog: LeadActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      registrationId,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name || 'System Admin',
      action,
      notes,
      statusFrom,
      statusTo,
    };
    setLeadActivities((prev) => [newLog, ...prev]);
  };

  const scheduleLeadFollowUp = (
    registrationId: string,
    data: { followUpDate: string; followUpTime: string; note: string; assignedAdmin: string }
  ) => {
    const target = studentRegistrations.find((r) => r.id === registrationId);
    const oldStatus = target?.status || 'New';

    const newFollowUp: LeadFollowUp = {
      id: `fup_${Date.now()}`,
      registrationId,
      followUpDate: data.followUpDate,
      followUpTime: data.followUpTime,
      note: data.note,
      assignedAdmin: data.assignedAdmin || currentUser.name || 'Admin',
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };
    setLeadFollowUps((prev) => [newFollowUp, ...prev]);

    setStudentRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId
          ? {
              ...reg,
              status: 'Follow-up',
              followUpDate: data.followUpDate,
              followUpTime: data.followUpTime,
              followUpNote: data.note,
              assignedAdmin: data.assignedAdmin || currentUser.name || 'Admin',
            }
          : reg
      )
    );

    addLeadActivityLog(
      registrationId,
      'Follow-up Scheduled',
      `Scheduled call for ${data.followUpDate} at ${data.followUpTime}. Note: "${data.note}"`,
      oldStatus,
      'Follow-up'
    );

    addAuditLog('Follow-up Scheduled', 'Lead Management', `Scheduled follow-up call for ${target?.name || registrationId}`);
    showToast('Follow-up call scheduled successfully!', 'success');
  };

  const convertLeadToStudent = (
    registrationId: string,
    data: { course?: string; batchNumber?: string; studentId?: string }
  ): ConvertedStudent | null => {
    const reg = studentRegistrations.find((r) => r.id === registrationId);
    if (!reg) return null;

    const existing = convertedStudents.find((s) => s.registrationId === registrationId);
    if (existing) {
      showToast(`Student ${reg.name} is already converted (${existing.studentId}).`, 'info');
      return existing;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const stuId = data.studentId || `STU-${new Date().getFullYear()}-${randomNum}`;
    const batch = data.batchNumber || `BATCH-${new Date().getFullYear()}-A`;
    const finalCourse = data.course || reg.course || 'Full Stack Web Development (MERN)';

    const newStudent: ConvertedStudent = {
      id: `conv_${Date.now()}`,
      studentId: stuId,
      registrationId: reg.id,
      name: reg.name,
      email: reg.email || '',
      phone: reg.phone || '',
      qualification: reg.qualification,
      branch: reg.branch,
      college: reg.college,
      passingYear: reg.passingYear,
      course: finalCourse,
      placementType: reg.placement || 'Job + Internship',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      batchNumber: batch,
      progressPercent: 15,
      certificatesIssued: [],
      convertedBy: currentUser.name || 'Admin',
      convertedAt: new Date().toISOString(),
      certificateSummer1: reg.certificateSummer1,
      certificateSummer2: reg.certificateSummer2,
      resume: reg.resume,
      aadhaarCard: reg.aadhaarCard,
      adminRemarks: reg.adminRemarks,
    };

    setConvertedStudents((prev) => [newStudent, ...prev]);

    const oldStatus = reg.status;
    setStudentRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId
          ? {
              ...r,
              status: 'Converted',
              course: finalCourse,
            }
          : r
      )
    );

    addLeadActivityLog(
      registrationId,
      'Converted to Student',
      `Candidate converted and enrolled into "${finalCourse}" (${batch}) with Student ID: ${stuId}.`,
      oldStatus,
      'Converted'
    );

    addAuditLog('Lead Converted to Student', 'Student Management', `Converted ${reg.name} (${stuId}) for ${finalCourse}`);
    showToast(`Successfully converted ${reg.name} to Student ID: ${stuId}!`, 'success');
    return newStudent;
  };

  const updateConvertedStudentProgress = (studentId: string, progressPercent: number, status?: ConvertedStudent['status']) => {
    setConvertedStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId && s.studentId !== studentId) return s;
        const newStatus = status || (progressPercent >= 100 ? 'Completed' : s.status);
        return {
          ...s,
          progressPercent,
          status: newStatus,
        };
      })
    );
    showToast('Student course progress updated!', 'success');
  };

  const updateConvertedStudentDetails = (studentId: string, updated: Partial<ConvertedStudent>) => {
    setConvertedStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId && s.studentId !== studentId) return s;
        return {
          ...s,
          ...updated,
        };
      })
    );
    showToast('Student profile details updated successfully!', 'success');
  };

  // Student Registration Handlers
  const addStudentRegistration = (
    data: Omit<StudentRegistration, 'id' | 'registrationNumber' | 'submittedAt' | 'status'>
  ): StudentRegistration => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const regNumber = `REG-${new Date().getFullYear()}-${randomSuffix}`;
    const autoCapturedCourse = data.course || selectedCourseForApplication || 'Full Stack Web Development (MERN)';

    const newReg: StudentRegistration = {
      ...data,
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      registrationNumber: regNumber,
      course: autoCapturedCourse,
      status: 'New',
      submittedAt: new Date().toISOString(),
    };
    setStudentRegistrations((prev) => [newReg, ...prev]);

    addLeadActivityLog(
      newReg.id,
      'Registration Received',
      `Student applied online for "${autoCapturedCourse}" (${data.placement || 'Job + Internship'})`
    );

    addAuditLog('Student Registration Submitted', 'Student Registrations', `New lead ${regNumber} by ${data.name} for ${autoCapturedCourse}`);
    return newReg;
  };

  const updateRegistrationStatus = (id: string, status: StudentRegistrationStatus, remarks?: string) => {
    const target = studentRegistrations.find((r) => r.id === id);
    const oldStatus = target?.status || 'New';

    setStudentRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === id
          ? {
              ...reg,
              status,
              adminRemarks: remarks !== undefined ? remarks : reg.adminRemarks,
            }
          : reg
      )
    );

    if (target) {
      addLeadActivityLog(
        id,
        `Status Changed to ${status}`,
        remarks || `Status updated from ${oldStatus} to ${status}.`,
        oldStatus,
        status
      );
    }

    addAuditLog('Registration Status Updated', 'Student Registrations', `Updated ${target?.registrationNumber || id} to ${status}`);
    showToast(`Lead status updated to ${status}`, 'success');
  };

  const deleteRegistration = (id: string) => {
    const target = studentRegistrations.find((r) => r.id === id);
    setStudentRegistrations((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('Registration Deleted', 'Student Registrations', `Deleted registration ${target?.registrationNumber || id}`);
    showToast('Registration deleted', 'info');
  };

  // Course Inquiry Handlers
  const addCourseInquiry = (
    inquiryData: Omit<CourseInquiry, 'id' | 'inquiryNumber' | 'submittedAt' | 'status'>
  ): CourseInquiry => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inqNumber = `INQ-${new Date().getFullYear()}-${randomSuffix}`;
    const newInquiry: CourseInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      inquiryNumber: inqNumber,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    setCourseInquiries((prev) => [newInquiry, ...prev]);
    addAuditLog(
      'Course Application / Inquiry Submitted',
      'Contact & Applications',
      `New inquiry ${inqNumber} for "${newInquiry.selectedCourse}" by ${newInquiry.name}`
    );
    return newInquiry;
  };

  const updateCourseInquiryStatus = (id: string, status: CourseInquiry['status']) => {
    setCourseInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    const target = courseInquiries.find((i) => i.id === id);
    addAuditLog(
      'Inquiry Status Updated',
      'Contact & Applications',
      `Updated ${target?.inquiryNumber || id} to ${status}`
    );
    showToast(`Inquiry status updated to ${status}`, 'success');
  };

  const deleteCourseInquiry = (id: string) => {
    const target = courseInquiries.find((i) => i.id === id);
    setCourseInquiries((prev) => prev.filter((i) => i.id !== id));
    addAuditLog(
      'Inquiry Deleted',
      'Contact & Applications',
      `Deleted inquiry ${target?.inquiryNumber || id}`
    );
    showToast('Inquiry deleted', 'info');
  };

  // Connect Request Handlers (Isolated Connect Feature)
  const addConnectRequest = (data: { name: string; phone: string }): ConnectRequest => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const connectNum = `CONN-${new Date().getFullYear()}-${randomSuffix}`;
    const newRequest: ConnectRequest = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      connectNumber: connectNum,
      name: data.name.trim(),
      phone: data.phone.trim(),
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    setConnectRequests((prev) => [newRequest, ...prev]);
    addAuditLog(
      'Connect Request Submitted',
      'Public Connect Page',
      `New connect request ${connectNum} received from ${data.name} (${data.phone})`
    );
    showToast('Connect request submitted successfully!', 'success');
    return newRequest;
  };

  const updateConnectRequestStatus = (id: string, status: ConnectRequest['status']) => {
    setConnectRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast(`Connect request status updated to ${status}`, 'success');
  };

  const deleteConnectRequest = (id: string) => {
    setConnectRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('Connect request deleted', 'info');
  };

  // Placement Options Handlers
  const addPlacement = (placementName: string) => {
    const trimmed = placementName.trim();
    if (!trimmed) return;
    if (placements.includes(trimmed)) {
      showToast('Placement option already exists', 'warning');
      return;
    }
    setPlacements((prev) => [...prev, trimmed]);
    addAuditLog('Placement Option Added', 'Admin Options', `Added placement "${trimmed}"`);
    showToast('Placement option added', 'success');
  };

  const updatePlacement = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setPlacements((prev) => prev.map((p) => (p === oldName ? trimmed : p)));
    addAuditLog('Placement Option Renamed', 'Admin Options', `Renamed placement "${oldName}" to "${trimmed}"`);
    showToast('Placement option updated', 'success');
  };

  const removePlacement = (placementName: string) => {
    setPlacements((prev) => prev.filter((p) => p !== placementName));
    addAuditLog('Placement Option Removed', 'Admin Options', `Removed placement "${placementName}"`);
    showToast('Placement option removed', 'info');
  };

  // Qualification Options Handlers
  const addQualification = (qualName: string) => {
    const trimmed = qualName.trim();
    if (!trimmed) return;
    if (qualifications.includes(trimmed)) {
      showToast('Qualification already exists', 'warning');
      return;
    }
    setQualifications((prev) => [...prev, trimmed]);
    addAuditLog('Qualification Option Added', 'Admin Options', `Added qualification "${trimmed}"`);
    showToast('Qualification option added', 'success');
  };

  const updateQualification = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setQualifications((prev) => prev.map((q) => (q === oldName ? trimmed : q)));
    addAuditLog('Qualification Option Renamed', 'Admin Options', `Renamed qualification "${oldName}" to "${trimmed}"`);
    showToast('Qualification option updated', 'success');
  };

  const removeQualification = (qualName: string) => {
    setQualifications((prev) => prev.filter((q) => q !== qualName));
    addAuditLog('Qualification Option Removed', 'Admin Options', `Removed qualification "${qualName}"`);
    showToast('Qualification option removed', 'info');
  };

  // Branches Options Handlers
  const addBranchOption = (branchName: string) => {
    const trimmed = branchName.trim();
    if (!trimmed) return;
    if (branchesList.includes(trimmed)) {
      showToast('Branch already exists', 'warning');
      return;
    }
    setBranchesList((prev) => [...prev, trimmed]);
    addAuditLog('Branch Option Added', 'Admin Options', `Added branch "${trimmed}"`);
    showToast('Branch option added', 'success');
  };

  const updateBranchOption = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setBranchesList((prev) => prev.map((b) => (b === oldName ? trimmed : b)));
    addAuditLog('Branch Option Renamed', 'Admin Options', `Renamed branch "${oldName}" to "${trimmed}"`);
    showToast('Branch option updated', 'success');
  };

  const removeBranchOption = (branchName: string) => {
    setBranchesList((prev) => prev.filter((b) => b !== branchName));
    addAuditLog('Branch Option Removed', 'Admin Options', `Removed branch "${branchName}"`);
    showToast('Branch option removed', 'info');
  };

  // Passing Years Handlers
  const addPassingYear = (year: string) => {
    const trimmed = year.trim();
    if (!trimmed) return;
    if (passingYears.includes(trimmed)) {
      showToast('Year already exists', 'warning');
      return;
    }
    setPassingYears((prev) => [trimmed, ...prev]);
    addAuditLog('Passing Year Added', 'Admin Options', `Added passing year "${trimmed}"`);
    showToast('Passing year added', 'success');
  };

  const removePassingYear = (year: string) => {
    setPassingYears((prev) => prev.filter((y) => y !== year));
    addAuditLog('Passing Year Removed', 'Admin Options', `Removed passing year "${year}"`);
    showToast('Passing year removed', 'info');
  };

  // College / Institute Options Handlers
  const addCollege = (collegeName: string) => {
    const trimmed = collegeName.trim();
    if (!trimmed) return;
    if (colleges.includes(trimmed)) {
      showToast('College already exists in list', 'warning');
      return;
    }
    setColleges((prev) => [...prev, trimmed]);
    addAuditLog('College Option Added', 'Admin Options', `Added college "${trimmed}"`);
    showToast('College added to list', 'success');
  };

  const updateCollege = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setColleges((prev) => prev.map((c) => (c === oldName ? trimmed : c)));
    addAuditLog('College Option Renamed', 'Admin Options', `Renamed college "${oldName}" to "${trimmed}"`);
    showToast('College updated', 'success');
  };

  const removeCollege = (collegeName: string) => {
    setColleges((prev) => prev.filter((c) => c !== collegeName));
    addAuditLog('College Option Removed', 'Admin Options', `Removed college "${collegeName}"`);
    showToast('College removed from list', 'info');
  };

  // Duration Options Handlers
  const addDuration = (durationName: string) => {
    const trimmed = durationName.trim();
    if (!trimmed) return;
    if (durations.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Duration option already exists', 'warning');
      return;
    }
    setDurations((prev) => [...prev, trimmed]);
    addAuditLog('Duration Option Added', 'Admin Options', `Added duration "${trimmed}"`);
    showToast('Duration option added', 'success');
  };

  const updateDuration = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setDurations((prev) => prev.map((d) => (d === oldName ? trimmed : d)));
    addAuditLog('Duration Option Renamed', 'Admin Options', `Renamed duration "${oldName}" to "${trimmed}"`);
    showToast('Duration option updated', 'success');
  };

  const removeDuration = (durationName: string) => {
    setDurations((prev) => prev.filter((d) => d !== durationName));
    addAuditLog('Duration Option Removed', 'Admin Options', `Removed duration "${durationName}"`);
    showToast('Duration option removed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        currentUser,
        currentView,
        navigateTo,
        currentInternshipId,
        setCurrentInternshipId,
        currentCourseId,
        setCurrentCourseId,
        currentCertId,
        setCurrentCertId,
        internships,
        savedInternshipIds,
        toggleSaveInternship,
        addInternship,
        courses,
        enrollInCourse,
        markLessonComplete,
        addCourse,
        updateCourse,
        removeCourse,
        branches,
        addBranch,
        removeBranch,
        contactDetails,
        updateContactDetails,
        applications,
        applyToInternship,
        updateApplicationStatus,
        withdrawApplication,
        cancelApplication: withdrawApplication,
        projects,
        addProject,
        updateProjectProgress,
        addMentorFeedback,
        certificates,
        generateCertificate,
        updateCertificate,
        deleteCertificate,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        heroBanners,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        toggleHeroBannerStatus,
        reorderHeroBanners,
        studentRegistrations,
        addStudentRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        convertedStudents,
        leadFollowUps,
        leadActivities,
        scheduleLeadFollowUp,
        addLeadActivityLog,
        convertLeadToStudent,
        updateConvertedStudentProgress,
        updateConvertedStudentDetails,
        courseInquiries,
        addCourseInquiry,
        updateCourseInquiryStatus,
        deleteCourseInquiry,
        connectRequests,
        addConnectRequest,
        updateConnectRequestStatus,
        deleteConnectRequest,
        selectedCourseForApplication,
        setSelectedCourseForApplication,
        placements,
        addPlacement,
        updatePlacement,
        removePlacement,
        qualifications,
        addQualification,
        updateQualification,
        removeQualification,
        branchesList,
        addBranchOption,
        updateBranchOption,
        removeBranchOption,
        passingYears,
        addPassingYear,
        removePassingYear,
        colleges,
        addCollege,
        updateCollege,
        removeCollege,
        durations,
        addDuration,
        updateDuration,
        removeDuration,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementActive,
        reorderAnnouncements,
        tickerSettings,
        updateTickerSettings,
        successStories,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        toggleSuccessStoryActive,
        resetSuccessStories,
        reorderSuccessStories,
        auditLogs,
        addAuditLog,
        adminUsers,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        toggleAdminStatus,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isLoginOpen,
        setIsLoginOpen,
        isApplyModalOpen,
        setIsApplyModalOpen,
        activeApplyInternship,
        openApplyModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
