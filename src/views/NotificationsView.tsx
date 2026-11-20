import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import {
  Bell,
  Briefcase,
  Award,
  MessageSquare,
  AlertCircle,
  CheckCheck,
  Trash2,
  Clock,
  Sparkles,
  Menu
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications, showToast, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'applications' | 'mentorship'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'applications') return n.type === 'application';
    if (activeTab === 'mentorship') return n.type === 'mentor';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'course':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'mentor':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-[#F4F8FF] flex">
      <DashboardSidebar
        activeTab="notifications"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        returnFocusRef={menuButtonRef}
      />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl bg-[#F4F8FF]">
        <div className="lg:hidden bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
            aria-controls="admin-sidebar-drawer"
            className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-xl bg-[#071B49] text-white hover:bg-[#0E2864] flex items-center justify-center transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-sm text-[#071B49] truncate">Notifications</span>
        </div>
        
        {/* Header matching Screen 14 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Notifications ({notifications.filter((n) => !n.isRead).length} unread)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time updates regarding application progress, reviews, and platform alerts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                markAllNotificationsRead();
                showToast('All notifications marked as read', 'info');
              }}
              className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark All Read</span>
            </button>

            <button
              onClick={() => {
                clearAllNotifications();
                showToast('Cleared all notifications', 'info');
              }}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs matching Screen 14 */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'applications', label: 'Applications' },
            { id: 'mentorship', label: 'Mentorship & Code' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List (Screen 14 Match) */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.link) {
                    const safeLink = ['internships', 'courses', 'admin-analytics', 'student-profile', 'company-profile'].includes(notif.link)
                      ? 'all-programs'
                      : notif.link;
                    navigateTo(safeLink);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  notif.isRead
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-blue-50/40 border-blue-200 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.description}
                  </p>

                  {!notif.isRead && (
                    <span className="inline-block mt-1 text-[10px] text-blue-600 font-bold">
                      ● New Unread Notice
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No notifications in this folder</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
