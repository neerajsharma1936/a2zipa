import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { NewsTicker } from './components/layout/NewsTicker';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { LoginModal } from './components/modals/LoginModal';
import { ApplyInternshipModal } from './components/modals/ApplyInternshipModal';

// Views
import { HomeView } from './views/HomeView';
import { CertificatesView } from './views/CertificatesView';
import { CertificateVerificationView } from './views/CertificateVerificationView';
import { NotificationsView } from './views/NotificationsView';
import { MessagesView } from './views/MessagesView';
import { AllProgramsView } from './views/AllProgramsView';
import { AdminManagementView } from './views/AdminManagementView';
import { ConvertedStudentsView } from './views/ConvertedStudentsView';
import { AllStudentsView } from './views/AllStudentsView';
import { StudentRegistrationView } from './views/StudentRegistrationView';
import { ApplicationContactView } from './views/ApplicationContactView';
import { DashboardView } from './views/DashboardView';
import { CareerView } from './views/CareerView';
import { ServicesView } from './views/ServicesView';
import { LoginView } from './views/LoginView';
import { AdmissionFormView } from './views/AdmissionFormView';
import { PlacementFormView } from './views/PlacementFormView';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'login':
      case 'admin-login':
      case 'signin':
        return <LoginView />;
      case 'dashboard':
      case 'overview':
        return <DashboardView />;
      case 'career':
      case 'careers':
      case 'jobs':
        return <CareerView />;
      case 'services':
      case 'our-services':
      case 'corporate-services':
        return <ServicesView />;
      case 'internship-registration':
      case 'internship':
      case 'student-registration':
      case 'registration':
      case 'get-started':
        return <StudentRegistrationView />;
      case 'application':
      case 'apply':
      case 'contact':
      case 'contact-us':
      case 'student-application':
        return <ApplicationContactView />;
      case 'all-programs':
      case 'programs':
        return <AllProgramsView />;
      case 'student-certificates':
        return <CertificatesView />;
      case 'verify-certificate':
      case 'download-certificate':
      case 'certificate-download':
        return <CertificateVerificationView />;
      case 'notifications':
        return <NotificationsView />;
      case 'messages':
        return <MessagesView />;
      case 'converted-students':
      case 'converted':
        return <ConvertedStudentsView />;
      case 'all-students':
        return <AllStudentsView />;
      case 'admin-management':
      case 'admin-dashboard':
      case 'admin':
        return <AdminManagementView />;
      case 'admission-form':
      case 'admission':
        return <AdmissionFormView />;
      case 'placement-form':
      case 'placement':
        return <PlacementFormView />;
      default:
        return <HomeView />;
    }
  };

  const isLMSFullscreen = false;
  const isDashboardView = [
    'dashboard',
    'overview',
    'converted-students',
    'converted',
    'all-students',
    'admin-management',
    'admin-dashboard',
    'admin',
    'student-certificates',
    'messages',
    'notifications',
  ].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Primary Navigation Header */}
      {!isLMSFullscreen && <Header />}

      {/* Dynamic News Ticker Bar */}
      {!isLMSFullscreen && <NewsTicker />}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col bg-[#F5F9FF]">
        {renderCurrentView()}
      </div>

      {/* Footer for public pages */}
      {!isDashboardView && <Footer />}

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <LoginModal />
      <ApplyInternshipModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
