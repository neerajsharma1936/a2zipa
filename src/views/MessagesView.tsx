import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Video,
  Phone,
  MoreVertical,
  CheckCheck,
  Building2,
  GraduationCap,
  Sparkles,
  Menu
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { conversations = [], messages = [], sendMessage, showToast, activeConversationId, setActiveConversationId } = useApp();

  const [activeContactId, setActiveContactId] = useState<string>(activeConversationId || 'conv_1');
  const [inputText, setInputText] = useState<string>('');
  const [searchContact, setSearchContact] = useState<string>('');

  const fallbackContacts = [
    {
      id: 'conv_1',
      participantId: 'usr_mentor_1',
      participantName: 'Sarah Jenkins',
      participantRole: 'Full Stack Mentor',
      participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Awesome job on Milestone 2! Let me know if you need help with JWT.',
      lastMessageTime: '11:42 AM',
      unreadCount: 1,
      isOnline: true,
      messages: [
        {
          id: 'm_1',
          senderId: 'usr_mentor_1',
          senderName: 'Sarah Jenkins',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          senderRole: 'mentor' as const,
          text: 'Hi Rahul! Reviewed your latest pull request on GitHub. Code structure is clean.',
          timestamp: '11:40 AM',
          isMine: false,
          isMe: false,
        },
        {
          id: 'm_2',
          senderId: 'usr_mentor_1',
          senderName: 'Sarah Jenkins',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          senderRole: 'mentor' as const,
          text: 'Awesome job on Milestone 2! Let me know if you need help with JWT.',
          timestamp: '11:42 AM',
          isMine: false,
          isMe: false,
        },
      ],
    },
    {
      id: 'conv_2',
      participantId: 'usr_employer_1',
      participantName: 'TechCorp HR Team',
      participantRole: 'Employer Recruiter',
      participantAvatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Hi Rahul, we have scheduled your technical interview for tomorrow.',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: 'm_3',
          senderId: 'usr_employer_1',
          senderName: 'TechCorp HR Team',
          senderAvatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
          senderRole: 'employer' as const,
          text: 'Hi Rahul, we have scheduled your technical interview for tomorrow.',
          timestamp: 'Yesterday, 3:00 PM',
          isMine: false,
          isMe: false,
        },
      ],
    },
    {
      id: 'conv_3',
      participantId: 'usr_mentor_2',
      participantName: 'Dr. Priya Patel',
      participantRole: 'Course Instructor',
      participantAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=100&auto=format&fit=crop&q=80',
      lastMessage: 'Your capstone project score has been officially updated.',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 'm_4',
          senderId: 'usr_mentor_2',
          senderName: 'Dr. Priya Patel',
          senderAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=100&auto=format&fit=crop&q=80',
          senderRole: 'mentor' as const,
          text: 'Your capstone project score has been officially updated.',
          timestamp: '3 days ago',
          isMine: false,
          isMe: false,
        },
      ],
    },
  ];

  const contactList = (conversations && conversations.length > 0) ? conversations : fallbackContacts;
  const filteredContacts = contactList.filter((c) =>
    (c.participantName || '').toLowerCase().includes(searchContact.toLowerCase()) ||
    (c.participantRole || '').toLowerCase().includes(searchContact.toLowerCase())
  );

  const activeContact = contactList.find((c) => c.id === activeContactId) || contactList[0] || fallbackContacts[0];
  const activeMessages = activeContact?.messages || (messages && messages.length > 0 ? messages : []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeContact.id, inputText.trim());
    setInputText('');

    // Simulate instant reply from mentor or recruiter after 1.5s
    setTimeout(() => {
      showToast(`${activeContact.participantName} received your message.`, 'info');
    }, 1200);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-[#F4F8FF] flex">
      <DashboardSidebar
        activeTab="messages"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        returnFocusRef={menuButtonRef}
      />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-4 h-[calc(100vh-100px)] bg-[#F4F8FF]">
        <div className="lg:hidden bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 shrink-0">
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
          <span className="font-extrabold text-sm text-[#071B49] truncate">Messages</span>
        </div>
        
        {/* Messages Container 2-Panel Card matching Screen 15 */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex overflow-hidden">
          
          {/* LEFT CONTACTS LIST */}
          <div className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
            {/* Search */}
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 mb-3">Chats & Inquiries</h2>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {(filteredContacts || []).map((c) => {
                const isSelected = activeContactId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveContactId(c.id);
                      if (setActiveConversationId) setActiveConversationId(c.id);
                    }}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img src={c.participantAvatar} alt={c.participantName} className="w-10 h-10 rounded-full object-cover" />
                      {c.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.participantName}</p>
                        <span className="text-[10px] text-slate-400">{c.lastMessageTime}</span>
                      </div>
                      <p className="text-[11px] text-blue-600 font-semibold">{c.participantRole}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT CHAT AREA matching Screen 15 */}
          <div className="flex-1 flex flex-col bg-white">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={activeContact.participantAvatar} alt={activeContact.participantName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeContact.participantName}</h3>
                  <p className="text-[11px] text-emerald-600 font-medium">
                    ● {activeContact.isOnline ? 'Online' : 'Offline'} • {activeContact.participantRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Initiating video call with ${activeContact.participantName}`, 'info')}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast('Voice call connecting...', 'info')}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
              <div className="text-center">
                <span className="text-[10px] bg-slate-200/60 text-slate-500 font-semibold px-2.5 py-1 rounded-full">
                  Today, 10:00 AM
                </span>
              </div>

              {(activeMessages || []).map((msg) => {
                const isMe = msg.isMine ?? msg.isMe ?? false;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img src={activeContact.participantAvatar} alt="Sender" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    )}

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box matching Screen 15 */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex items-center gap-2 bg-white">
              <button
                type="button"
                onClick={() => showToast('Attachment options: Code snippet, PDF, GitHub commit link', 'info')}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message or share a link..."
                className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-600"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </main>
    </div>
  );
};
