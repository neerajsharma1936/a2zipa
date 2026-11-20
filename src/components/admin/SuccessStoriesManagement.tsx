import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SuccessStoryItem, StoryTheme } from '../../types';
import { getStoryThemeConfig, initialSuccessStories } from '../../data/mockData';
import {
  Quote,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  RotateCcw,
  Sparkles,
  User,
  Briefcase,
  Image,
  Award,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';

const AVATAR_PRESETS = [
  { label: 'Ananya (Woman 1)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  { label: 'Rahul (Man 1)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80' },
  { label: 'Karan (Man 2)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { label: 'Pooja (Woman 2)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
  { label: 'Rohan (Man 3)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
  { label: 'Sneha (Woman 3)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80' },
  { label: 'Tech Professional 1', url: 'https://images.unsplash.com/photo-1534751516642-a171fed2e127?w=120&auto=format&fit=crop&q=80' },
  { label: 'Tech Professional 2', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
];

const THEME_OPTIONS: { id: StoryTheme; label: string; colorClass: string; borderClass: string }[] = [
  { id: 'blue', label: 'Sky Blue (e.g. Microsoft)', colorClass: 'bg-blue-500', borderClass: 'border-blue-300' },
  { id: 'purple', label: 'Violet Purple (e.g. TechCorp)', colorClass: 'bg-purple-500', borderClass: 'border-purple-300' },
  { id: 'emerald', label: 'Mint Emerald (e.g. DataMinds)', colorClass: 'bg-emerald-500', borderClass: 'border-emerald-300' },
  { id: 'amber', label: 'Golden Amber (e.g. Amazon)', colorClass: 'bg-amber-500', borderClass: 'border-amber-300' },
  { id: 'indigo', label: 'Deep Indigo (e.g. Google)', colorClass: 'bg-indigo-500', borderClass: 'border-indigo-300' },
  { id: 'cyan', label: 'Ocean Cyan (e.g. Oracle)', colorClass: 'bg-cyan-500', borderClass: 'border-cyan-300' },
];

export const SuccessStoriesManagement: React.FC = () => {
  const {
    successStories,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    toggleSuccessStoryActive,
    resetSuccessStories,
    reorderSuccessStories,
    navigateTo,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('all');
  const [editingStory, setEditingStory] = useState<SuccessStoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<SuccessStoryItem | null>(null);

  // Form state for creating or editing
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    avatar: string;
    quote: string;
    theme: StoryTheme;
    companyTag: string;
    rating: number;
    active: boolean;
  }>({
    name: '',
    role: '',
    avatar: AVATAR_PRESETS[0].url,
    quote: '',
    theme: 'blue',
    companyTag: 'Verified Placement',
    rating: 5,
    active: true,
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      role: '',
      avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)].url,
      quote: '',
      theme: 'blue',
      companyTag: 'Verified Placement',
      rating: 5,
      active: true,
    });
    setEditingStory(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (story: SuccessStoryItem) => {
    setFormData({
      name: story.name,
      role: story.role,
      avatar: story.avatar,
      quote: story.quote,
      theme: story.theme,
      companyTag: story.companyTag || 'Verified Placement',
      rating: story.rating || 5,
      active: story.active !== false,
    });
    setEditingStory(story);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter student name', 'error');
      return;
    }
    if (!formData.role.trim()) {
      showToast('Please enter role and company', 'error');
      return;
    }
    if (!formData.quote.trim()) {
      showToast('Please enter testimonial quote', 'error');
      return;
    }

    if (editingStory) {
      updateSuccessStory(editingStory.id, {
        name: formData.name.trim(),
        role: formData.role.trim(),
        avatar: formData.avatar.trim(),
        quote: formData.quote.trim(),
        theme: formData.theme,
        companyTag: formData.companyTag.trim() || 'Verified Placement',
        rating: formData.rating,
        active: formData.active,
      });
      showToast(`Updated success card for "${formData.name}"`, 'success');
    } else {
      addSuccessStory({
        name: formData.name.trim(),
        role: formData.role.trim(),
        avatar: formData.avatar.trim(),
        quote: formData.quote.trim(),
        theme: formData.theme,
        companyTag: formData.companyTag.trim() || 'Verified Placement',
        rating: formData.rating,
        active: formData.active,
        order: successStories.length + 1,
      });
      showToast(`Added new success card for "${formData.name}"`, 'success');
    }
    setIsAddModalOpen(false);
    setEditingStory(null);
  };

  const handleDeleteConfirm = () => {
    if (storyToDelete) {
      deleteSuccessStory(storyToDelete.id);
      showToast(`Removed success story card for "${storyToDelete.name}"`, 'info');
      setStoryToDelete(null);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all success story cards to the default 6 placement stories?')) {
      resetSuccessStories();
      showToast('Reset success story cards to default state', 'success');
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= successStories.length) return;

    const updated = [...successStories];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    // Update order values
    const reordered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    reorderSuccessStories(reordered);
    showToast('Updated card display order', 'success');
  };

  // Filtered stories
  const filteredStories = successStories
    .filter((story) => {
      const matchesSearch =
        story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.quote.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTheme = selectedThemeFilter === 'all' || story.theme === selectedThemeFilter;
      return matchesSearch && matchesTheme;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeCount = successStories.filter((s) => s.active !== false).length;

  // Active theme config for form live preview
  const previewThemeConfig = getStoryThemeConfig(formData.theme);

  return (
    <div className="space-y-6">
      {/* Top Banner & Statistics */}
      <div className="bg-gradient-to-r from-blue-900 via-[#004B87] to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Homepage Carousel Components</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Success Stories & Testimonial Cards
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openAddModal}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Card</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset to 6 default success stories"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="View on Homepage"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-xs text-blue-200 block font-medium">Total Story Cards</span>
            <span className="text-2xl font-black text-white">{successStories.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-xs text-blue-200 block font-medium">Live on Homepage</span>
            <span className="text-2xl font-black text-emerald-300">{activeCount} Active</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-xs text-blue-200 block font-medium">Card Themes</span>
            <span className="text-2xl font-black text-amber-300">6 Pastel Accents</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-xs text-blue-200 block font-medium">Scroll Speed</span>
            <span className="text-2xl font-black text-cyan-200">Continuous Conveyor</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, company, or quote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500">Theme:</span>
          <button
            type="button"
            onClick={() => setSelectedThemeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedThemeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Themes
          </button>
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedThemeFilter(theme.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedThemeFilter === theme.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${theme.colorClass}`} />
              <span className="capitalize">{theme.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStories.map((story, index) => {
          const theme = getStoryThemeConfig(story.theme);
          const isLive = story.active !== false;

          return (
            <div
              key={story.id}
              className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                isLive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/80'
              }`}
            >
              {/* Card Top Action Toolbar */}
              <div className="p-4 pb-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSuccessStoryActive(story.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                      isLive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {isLive ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                    <span>{isLive ? 'Live' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move earlier in conveyor belt"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === successStories.length - 1}
                    className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Move later in conveyor belt"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(story)}
                    className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                    title="Edit card components"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoryToDelete(story)}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Exact Card Preview */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className={`group relative flex flex-col justify-between bg-gradient-to-b ${theme.bg} p-6 rounded-[22px] border ${theme.border} shadow-xs relative overflow-hidden select-none`}>
                  <div className={`absolute top-4 right-4 ${theme.quoteColor} transition-colors pointer-events-none`}>
                    <Quote className="w-8 h-8 stroke-[1.5]" />
                  </div>

                  <div>
                    {/* Stars and Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-500 shadow-xs">
                        {[...Array(story.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold ${theme.tagColor} border px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                        {story.companyTag || 'Verified Placement'}
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-xs text-slate-700 leading-relaxed font-normal relative z-10 mb-4 line-clamp-4">
                      {story.quote}
                    </p>
                  </div>

                  {/* Student Avatar + Name + Role */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className={`w-10 h-10 rounded-full object-cover ring-2 ${theme.ringColor} shadow-xs`}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#0F172A] tracking-tight truncate">{story.name}</h4>
                      <p className={`text-[10px] font-semibold ${theme.roleColor} leading-tight truncate`}>{story.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Edit Trigger */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Theme: <strong className="capitalize text-slate-700">{story.theme}</strong></span>
                <button
                  type="button"
                  onClick={() => openEditModal(story)}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Edit Card Components →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStories.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Quote className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">No Story Cards Found</h3>
            <p className="text-xs text-slate-500">
              No cards matched your search or theme filters. Click "Add New Card" to create one.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            Create New Card
          </button>
        </div>
      )}

      {/* =====================================================================
          ADD / EDIT STORY CARD MODAL
          ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingStory ? 'Edit Story Card Components' : 'Add New Story Card'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the student credentials, quote copy, avatar photo, theme accent, and placement badge.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Top Row: Name and Role/Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation & Company *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Software Engineer Intern @ Microsoft"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Selector + Custom URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Avatar Photo URL *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.avatar}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/40 shadow-xs shrink-0"
                    />
                    <input
                      type="text"
                      required
                      placeholder="https://..."
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>

                  {/* Preset Avatar Quick Picks */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">Presets:</span>
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: preset.url })}
                        className={`px-2 py-1 text-[11px] rounded-lg border transition-all cursor-pointer shrink-0 ${
                          formData.avatar === preset.url
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Testimonial Quote / Review *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.quote.length} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder='e.g. "A2Z completely transformed my campus placement preparation. The capstone project gave me concrete architecture to discuss during my Microsoft interview!"'
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800 leading-relaxed"
                />
              </div>

              {/* Theme Selector & Placement Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Theme Pastel Accent
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEME_OPTIONS.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: theme.id })}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                          formData.theme === theme.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${theme.colorClass}`} />
                        <span className="capitalize truncate">{theme.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Placement Badge Tag
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Verified Placement"
                      value={formData.companyTag}
                      onChange={(e) => setFormData({ ...formData, companyTag: e.target.value })}
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Rating Stars
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= formData.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pl-4 border-l border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Card Visibility
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        />
                        <span>Active on Homepage</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time Live Preview inside Modal */}
              <div className="pt-2">
                <span className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Live Card Component Preview:
                </span>
                <div className={`group relative flex flex-col justify-between bg-gradient-to-b ${previewThemeConfig.bg} p-6 rounded-[22px] border ${previewThemeConfig.border} shadow-sm overflow-hidden select-none max-w-md mx-auto`}>
                  <div className={`absolute top-4 right-4 ${previewThemeConfig.quoteColor}`}>
                    <Quote className="w-8 h-8 stroke-[1.5]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-500 shadow-xs">
                        {[...Array(formData.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold ${previewThemeConfig.tagColor} border px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                        {formData.companyTag || 'Verified Placement'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal relative z-10 mb-4 line-clamp-3">
                      {formData.quote || '"Enter testimonial quote above to preview text..."'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={formData.avatar}
                        alt="Preview"
                        className={`w-10 h-10 rounded-full object-cover ring-2 ${previewThemeConfig.ringColor} shadow-xs`}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#0F172A] tracking-tight truncate">
                        {formData.name || 'Student Name'}
                      </h4>
                      <p className={`text-[10px] font-semibold ${previewThemeConfig.roleColor} leading-tight truncate`}>
                        {formData.role || 'Designation @ Company'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingStory ? 'Save Changes' : 'Create Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          DELETE CONFIRMATION MODAL
          ===================================================================== */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Success Story Card?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove the card for <strong className="text-slate-800">"{storyToDelete.name}"</strong> ({storyToDelete.role}) from the carousel?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStoryToDelete(null)}
                className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
