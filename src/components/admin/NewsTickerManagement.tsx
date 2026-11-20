import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement, AnnouncementCategory, TickerSettings } from '../../types';
import {
  Radio,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Settings,
  Calendar,
  ExternalLink,
  Tag,
  Clock,
  Layers,
  Save,
  Bell,
  Sliders,
  ShieldCheck,
  Check,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';

export const NewsTickerManagement: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    reorderAnnouncements,
    tickerSettings,
    updateTickerSettings,
    showToast,
    navigateTo,
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Announcement | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    message: string;
    link: string;
    category: AnnouncementCategory;
    startDate: string;
    expiryDate: string;
    priority: number;
    isActive: boolean;
  }>({
    title: '',
    message: '',
    link: '',
    category: 'Admission',
    startDate: '',
    expiryDate: '',
    priority: announcements.length + 1,
    isActive: true,
  });

  // Local Settings form state
  const [settingsForm, setSettingsForm] = useState<TickerSettings>(tickerSettings);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);

  // Preset Color Palettes
  const labelColorPresets = [
    { name: 'Red Accent', value: '#DC2626' },
    { name: 'Orange Vivid', value: '#EA580C' },
    { name: 'Royal Blue', value: '#2563EB' },
    { name: 'Purple Power', value: '#7C3AED' },
    { name: 'Emerald Green', value: '#059669' },
  ];

  const bgColorPresets = [
    { name: 'Deep Azure Blue', value: '#004B87' },
    { name: 'Deep Royal Blue', value: '#0C2D6B' },
    { name: 'Navy Blue', value: '#0A2558' },
    { name: 'Midnight Slate', value: '#0F172A' },
    { name: 'Dark Indigo', value: '#1E1B4B' },
  ];

  // Open modal for new announcement
  const handleOpenAddModal = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      link: '',
      category: 'Admission',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      priority: announcements.length + 1,
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  // Open modal for editing announcement
  const handleOpenEditModal = (item: Announcement) => {
    setEditingAnnouncement(item);
    setFormData({
      title: item.title,
      message: item.message,
      link: item.link || '',
      category: item.category,
      startDate: item.startDate || '',
      expiryDate: item.expiryDate || '',
      priority: item.priority,
      isActive: item.isActive,
    });
    setIsAddModalOpen(true);
  };

  // Save announcement (Create or Update)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('Title and Message are required', 'error');
      return;
    }

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, {
        title: formData.title.trim(),
        message: formData.message.trim(),
        link: formData.link.trim() || undefined,
        category: formData.category,
        startDate: formData.startDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        priority: Number(formData.priority) || 1,
        isActive: formData.isActive,
      });
      showToast('Announcement updated successfully', 'success');
    } else {
      addAnnouncement({
        title: formData.title.trim(),
        message: formData.message.trim(),
        link: formData.link.trim() || undefined,
        category: formData.category,
        startDate: formData.startDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        priority: Number(formData.priority) || announcements.length + 1,
        isActive: formData.isActive,
      });
      showToast('New announcement created successfully', 'success');
    }

    setIsAddModalOpen(false);
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteAnnouncement(deletingId);
      setDeletingId(null);
      showToast('Announcement deleted', 'info');
    }
  };

  // Priority adjustment
  const handleMovePriority = (index: number, direction: 'up' | 'down') => {
    const newItems = [...announcements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap priority values
    const tempPriority = newItems[index].priority;
    newItems[index].priority = newItems[targetIndex].priority;
    newItems[targetIndex].priority = tempPriority;

    // Swap elements in array
    const tempItem = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = tempItem;

    reorderAnnouncements(newItems);
  };

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateTickerSettings(settingsForm);
    setIsSettingsSaved(true);
    showToast('Ticker Settings Saved Successfully', 'success');
    setTimeout(() => setIsSettingsSaved(false), 2500);
  };

  // Filtered announcements list
  const filteredAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements.filter((item) => {
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMsg = item.message.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchMsg && !matchCat) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && !item.isActive) return false;
      if (statusFilter === 'inactive' && item.isActive) return false;
      if (statusFilter === 'expired') {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        if (isNaN(expiry.getTime()) || expiry >= now) return false;
      }
      if (statusFilter === 'scheduled') {
        if (!item.startDate) return false;
        const start = new Date(item.startDate);
        if (isNaN(start.getTime()) || start <= now) return false;
      }

      return true;
    });
  }, [announcements, searchQuery, categoryFilter, statusFilter]);

  // Statistics
  const activeCount = announcements.filter((a) => a.isActive).length;
  const expiredCount = announcements.filter((a) => {
    if (!a.expiryDate) return false;
    const exp = new Date(a.expiryDate);
    return !isNaN(exp.getTime()) && exp < new Date();
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & METRICS CARDS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              News Ticker & Latest Updates
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Manage real-time horizontal scrolling news announcements, schedule admission alerts, placement notices, and customize ticker styles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Announcement</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base shrink-0">
            {announcements.length}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tickers</p>
            <p className="text-sm font-black text-slate-900">Announcements</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-base shrink-0">
            {activeCount}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live & Active</p>
            <p className="text-sm font-black text-slate-900">Currently Streaming</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-base shrink-0">
            {expiredCount}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expired / Past</p>
            <p className="text-sm font-black text-slate-900">Out of Date</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
            tickerSettings.isVisible ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
          }`}>
            {tickerSettings.isVisible ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ticker Visibility</p>
            <p className="text-sm font-black text-slate-900">
              {tickerSettings.isVisible ? 'Visible On Portal' : 'Hidden From Website'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. LIVE TICKER PREVIEW CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Live Website Ticker Preview
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
            Real-time Output
          </span>
        </div>

        <div className="p-4 bg-slate-900">
          <div
            className="w-full overflow-hidden rounded-xl border border-slate-800 shadow-md flex items-center relative select-none"
            style={{
              backgroundColor: settingsForm.bgColor || '#004B87',
              color: settingsForm.textColor || '#FFFFFF',
            }}
          >
            {/* Label Badge Preview */}
            <div
              className="shrink-0 z-20 flex items-center gap-2 px-4 py-2 font-extrabold text-xs tracking-wider uppercase text-white shadow-lg relative"
              style={{
                backgroundColor: settingsForm.labelBgColor || '#DC2626',
              }}
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>{settingsForm.labelText || 'LATEST UPDATES'}</span>
            </div>

            {/* Marquee Track Preview */}
            <div className="flex-1 overflow-hidden relative flex items-center py-2">
              <div className="flex items-center whitespace-nowrap space-x-6 animate-pulse px-4">
                {announcements.filter((a) => a.isActive).map((item) => (
                  <div key={item.id} className="inline-flex items-center gap-2 text-xs font-medium">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-amber-300">
                      [{item.category}]
                    </span>
                    <span className="font-bold">{item.title}:</span>
                    <span>{item.message}</span>
                    <span className="text-amber-400 font-bold ml-2">|</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TICKER STYLING & BEHAVIOR SETTINGS FORM */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Ticker Customization Settings
            </h3>
          </div>
          {isSettingsSaved && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Settings Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Ticker Visibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Website Visibility</label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSettingsForm({ ...settingsForm, isVisible: !settingsForm.isVisible })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  settingsForm.isVisible ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settingsForm.isVisible ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-slate-800">
                {settingsForm.isVisible ? 'Visible (Active)' : 'Hidden (Disabled)'}
              </span>
            </div>
          </div>

          {/* Label Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Label Text</label>
            <input
              type="text"
              value={settingsForm.labelText}
              onChange={(e) => setSettingsForm({ ...settingsForm, labelText: e.target.value })}
              placeholder="e.g. LATEST UPDATES"
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
            />
          </div>

          {/* Scroll Speed */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Scrolling Speed</label>
            <select
              value={settingsForm.scrollSpeed}
              onChange={(e) => setSettingsForm({ ...settingsForm, scrollSpeed: e.target.value as any })}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold cursor-pointer"
            >
              <option value="slow">Slow (Ultra Calm - 240s)</option>
              <option value="normal">Normal (Smooth & Legible - 170s)</option>
              <option value="fast">Fast (120s)</option>
            </select>
          </div>

          {/* Scroll Direction */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Scroll Direction</label>
            <select
              value={settingsForm.scrollDirection}
              onChange={(e) => setSettingsForm({ ...settingsForm, scrollDirection: e.target.value as any })}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold cursor-pointer"
            >
              <option value="left">Right to Left (Standard Marquee)</option>
              <option value="right">Left to Right (Reverse Marquee)</option>
            </select>
          </div>

          {/* Label Background Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Label Color Preset</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settingsForm.labelBgColor}
                onChange={(e) => setSettingsForm({ ...settingsForm, labelBgColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0 overflow-hidden shrink-0"
              />
              <div className="flex items-center gap-1 overflow-x-auto">
                {labelColorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, labelBgColor: preset.value })}
                    className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer shadow-xs"
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Ticker Background Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Ticker Background Preset</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settingsForm.bgColor}
                onChange={(e) => setSettingsForm({ ...settingsForm, bgColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0 overflow-hidden shrink-0"
              />
              <div className="flex items-center gap-1 overflow-x-auto">
                {bgColorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, bgColor: preset.value })}
                    className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer shadow-xs"
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pause on Hover */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 block">Pause Animation on Mouse Hover</label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSettingsForm({ ...settingsForm, pauseOnHover: !settingsForm.pauseOnHover })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  settingsForm.pauseOnHover ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settingsForm.pauseOnHover ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-slate-700">
                {settingsForm.pauseOnHover
                  ? 'Enabled (Hovering mouse pauses scrolling for easy reading)'
                  : 'Disabled (Scrolls continuously)'}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Ticker Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. ANNOUNCEMENTS LIST TABLE & CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5">
        
        {/* Table Header Controls: Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements by title or content..."
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 font-semibold cursor-pointer bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Admission">Admission</option>
              <option value="Placement">Placement</option>
              <option value="Training">Training</option>
              <option value="Internship">Internship</option>
              <option value="Important Notice">Important Notice</option>
              <option value="General">General</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 font-semibold cursor-pointer bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">S.No.</th>
                <th className="py-3 px-4">Announcement Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No announcements found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-500 text-center">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block text-sm">
                          {item.title}
                        </span>
                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        {item.link && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate">{item.link}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                      <div>
                        <span className="font-bold block text-slate-800">Start:</span>
                        <span>{item.startDate || 'Immediate'}</span>
                      </div>
                      <div className="mt-0.5">
                        <span className="font-bold block text-slate-800">Expiry:</span>
                        <span>{item.expiryDate || 'Never'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMovePriority(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer rounded"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-slate-800 px-1">{item.priority}</span>
                        <button
                          onClick={() => handleMovePriority(index, 'down')}
                          disabled={index === announcements.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer rounded"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleAnnouncementActive(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Preview Item"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD / EDIT ANNOUNCEMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Announcement Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admissions Open 2026-27"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Announcement Message / Text *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Admissions Open for B.Tech, M.Tech, Diploma & Vocational Courses! Apply today for early bird scholarships."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium cursor-pointer"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Placement">Placement</option>
                    <option value="Training">Training</option>
                    <option value="Internship">Internship</option>
                    <option value="Important Notice">Important Notice</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Display Priority Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Action Link / Target View */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Clickable Target Link (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. student-registration, all-programs, or https://..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setFormData({ ...formData, link: e.target.value });
                    }}
                    className="text-xs px-2 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer font-semibold"
                  >
                    <option value="">Quick Pick</option>
                    <option value="student-registration">Student Registration</option>
                    <option value="all-programs">All Programs</option>
                    <option value="student-certificates">Certificates</option>
                    <option value="application">Apply / Contact</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="form-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="form-is-active" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Activate announcement immediately on website
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PREVIEW ITEM MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Announcement Preview</h3>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                {previewItem.category}
              </span>
              <h4 className="font-bold text-sm">{previewItem.title}</h4>
              <p className="text-xs text-slate-200">{previewItem.message}</p>
              {previewItem.link && (
                <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 pt-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>Link Target: {previewItem.link}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setPreviewItem(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* 7. CONFIRM DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Announcement?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete this announcement ticker item?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
