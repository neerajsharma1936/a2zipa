import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Layers,
  Calendar,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sliders,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  BookOpen,
  School,
  Clock,
} from 'lucide-react';

export const FormDropdownsManagement: React.FC = () => {
  const {
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
    branches,
    addBranch,
    removeBranch,
    navigateTo,
    showToast,
  } = useApp();

  // Active section inside the Dropdown Manager
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'qualifications' | 'branches' | 'years' | 'colleges' | 'durations' | 'course-streams'>('all');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state for Qualification
  const [newQualInput, setNewQualInput] = useState('');
  const [editingQual, setEditingQual] = useState<{ original: string; current: string } | null>(null);

  // Editing state for Branch / Stream
  const [newBranchInput, setNewBranchInput] = useState('');
  const [editingBranch, setEditingBranch] = useState<{ original: string; current: string } | null>(null);

  // Editing state for Passing / Graduation Year
  const [newYearInput, setNewYearInput] = useState('');

  // Editing state for Colleges / Institutes
  const [newCollegeInput, setNewCollegeInput] = useState('');
  const [editingCollege, setEditingCollege] = useState<{ original: string; current: string } | null>(null);

  // Editing state for Duration
  const [newDurationInput, setNewDurationInput] = useState('');
  const [editingDuration, setEditingDuration] = useState<{ original: string; current: string } | null>(null);

  // Editing state for Course Streams (Branches)
  const [newStreamInput, setNewStreamInput] = useState('');
  const [editingStream, setEditingStream] = useState<{ original: string; current: string } | null>(null);

  // Handlers for Qualification
  const handleAddQualification = () => {
    const trimmed = newQualInput.trim();
    if (!trimmed) {
      showToast('Please enter a qualification title', 'error');
      return;
    }
    if (qualifications.some((q) => q.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" already exists in qualifications list`, 'warning');
      return;
    }
    addQualification(trimmed);
    setNewQualInput('');
    showToast(`Added "${trimmed}" to Qualification dropdown options!`, 'success');
  };

  const handleUpdateQualification = (original: string, updated: string) => {
    const trimmed = updated.trim();
    if (!trimmed) {
      showToast('Qualification title cannot be empty', 'error');
      return;
    }
    updateQualification(original, trimmed);
    setEditingQual(null);
    showToast(`Updated qualification to "${trimmed}"`, 'success');
  };

  const handleDeleteQualification = (item: string) => {
    removeQualification(item);
    showToast(`Removed "${item}" from qualifications`, 'info');
  };

  // Handlers for Branch / Stream
  const handleAddBranch = () => {
    const trimmed = newBranchInput.trim();
    if (!trimmed) {
      showToast('Please enter a branch or stream name', 'error');
      return;
    }
    if (branchesList.some((b) => b.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" already exists in branches list`, 'warning');
      return;
    }
    addBranchOption(trimmed);
    setNewBranchInput('');
    showToast(`Added "${trimmed}" to Branch / Stream dropdown options!`, 'success');
  };

  const handleUpdateBranch = (original: string, updated: string) => {
    const trimmed = updated.trim();
    if (!trimmed) {
      showToast('Branch name cannot be empty', 'error');
      return;
    }
    updateBranchOption(original, trimmed);
    setEditingBranch(null);
    showToast(`Updated branch to "${trimmed}"`, 'success');
  };

  const handleDeleteBranch = (item: string) => {
    removeBranchOption(item);
    showToast(`Removed "${item}" from branches`, 'info');
  };

  // Handlers for Graduation Years
  const handleAddYear = () => {
    const trimmed = newYearInput.trim();
    if (!trimmed) {
      showToast('Please enter a graduation year', 'error');
      return;
    }
    if (passingYears.includes(trimmed)) {
      showToast(`Year "${trimmed}" is already in the list`, 'warning');
      return;
    }
    addPassingYear(trimmed);
    setNewYearInput('');
    showToast(`Added "${trimmed}" to Graduation Year dropdown!`, 'success');
  };

  const handleDeleteYear = (year: string) => {
    removePassingYear(year);
    showToast(`Removed year "${year}"`, 'info');
  };

  // Handlers for Colleges / Institutes
  const handleAddCollege = () => {
    const trimmed = newCollegeInput.trim();
    if (!trimmed) {
      showToast('Please enter a college / institute name', 'error');
      return;
    }
    if (colleges.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" already exists in colleges list`, 'warning');
      return;
    }
    addCollege(trimmed);
    setNewCollegeInput('');
    showToast(`Added "${trimmed}" to College / Institute options!`, 'success');
  };

  const handleUpdateCollege = (original: string, updated: string) => {
    const trimmed = updated.trim();
    if (!trimmed) {
      showToast('College name cannot be empty', 'error');
      return;
    }
    updateCollege(original, trimmed);
    setEditingCollege(null);
    showToast(`Updated college to "${trimmed}"`, 'success');
  };

  const handleDeleteCollege = (item: string) => {
    removeCollege(item);
    showToast(`Removed "${item}" from colleges`, 'info');
  };

  // Handlers for Duration
  const handleAddDuration = () => {
    const trimmed = newDurationInput.trim();
    if (!trimmed) {
      showToast('Please enter a duration option', 'error');
      return;
    }
    if (durations.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`"${trimmed}" already exists in durations list`, 'warning');
      return;
    }
    addDuration(trimmed);
    setNewDurationInput('');
    showToast(`Added "${trimmed}" to Duration dropdown options!`, 'success');
  };

  const handleUpdateDuration = (original: string, updated: string) => {
    const trimmed = updated.trim();
    if (!trimmed) {
      showToast('Duration option cannot be empty', 'error');
      return;
    }
    updateDuration(original, trimmed);
    setEditingDuration(null);
    showToast(`Updated duration to "${trimmed}"`, 'success');
  };

  const handleDeleteDuration = (item: string) => {
    removeDuration(item);
    showToast(`Removed "${item}" from durations`, 'info');
  };

  // Filtered lists based on search
  const filteredQualifications = qualifications.filter((q) =>
    q.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBranches = branchesList.filter((b) =>
    b.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredYears = passingYears.filter((y) =>
    y.includes(searchTerm)
  );
  const filteredColleges = colleges.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDurations = durations.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-[#071B49] via-[#0D2869] to-[#146EF5] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 border border-white/15">
            <Sliders className="w-3.5 h-3.5 text-blue-300" />
            <span>Registration & Form Field Customizer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Manage Form Input Fields & Dropdown Lists
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('student-registration')}
            className="px-4 py-2.5 bg-white text-[#071B49] hover:bg-blue-50 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#146EF5]" />
            <span>Preview Registration Page</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        {/* Quick Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across all dropdowns (qualifications, branches, years, colleges, durations)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146EF5]/20 focus:border-[#146EF5] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Dropdown Managers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* =====================================================================
            CARD 1: QUALIFICATIONS DROPDOWN MANAGER
            ===================================================================== */}
        {(activeSubTab === 'all' || activeSubTab === 'qualifications') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#146EF5] flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      1. Qualifications Dropdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Options available in student registration modal and course filters
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-[#146EF5] font-black text-xs rounded-full border border-blue-100">
                  {qualifications.length} items
                </span>
              </div>

              {/* Add Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQualInput}
                  onChange={(e) => setNewQualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddQualification();
                  }}
                  placeholder="Add new qualification (e.g. BCA, MCA, B.Sc, B.Voc)..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146EF5]/20 focus:border-[#146EF5]"
                />
                <button
                  type="button"
                  onClick={handleAddQualification}
                  className="px-4 py-2.5 bg-[#146EF5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredQualifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {searchTerm ? 'No matching qualifications found.' : 'No qualifications added yet.'}
                  </p>
                ) : (
                  filteredQualifications.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 rounded-xl transition-all text-xs sm:text-sm"
                    >
                      {editingQual?.original === item ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingQual.current}
                            onChange={(e) => setEditingQual({ ...editingQual, current: e.target.value })}
                            className="flex-1 px-3 py-1.5 bg-white border border-[#146EF5] rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none ring-2 ring-[#146EF5]/20"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateQualification(editingQual.original, editingQual.current);
                              if (e.key === 'Escape') setEditingQual(null);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateQualification(editingQual.original, editingQual.current)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingQual(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="w-2 h-2 rounded-full bg-[#146EF5]" />
                            <span className="font-bold text-slate-800 truncate">{item}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingQual({ original: item, current: item })}
                              className="p-1.5 text-slate-400 hover:text-[#146EF5] hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Edit qualification name"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQualification(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Delete from list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Quick Helper / Live Preview Note */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live on Student Placement Registration Sheet
              </span>
            </div>
          </div>
        )}

        {/* =====================================================================
            CARD 2: BRANCH / STREAM DROPDOWN MANAGER
            ===================================================================== */}
        {(activeSubTab === 'all' || activeSubTab === 'branches') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      2. Branch / Stream Dropdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Engineering, IT & academic specializations in the registration dropdown
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded-full border border-emerald-100">
                  {branchesList.length} items
                </span>
              </div>

              {/* Add Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBranchInput}
                  onChange={(e) => setNewBranchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddBranch();
                  }}
                  placeholder="Add new branch (e.g. AI & ML, Mechatronics, Cyber)..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Branch</span>
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredBranches.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {searchTerm ? 'No matching branches found.' : 'No branches added yet.'}
                  </p>
                ) : (
                  filteredBranches.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 rounded-xl transition-all text-xs sm:text-sm"
                    >
                      {editingBranch?.original === item ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingBranch.current}
                            onChange={(e) => setEditingBranch({ ...editingBranch, current: e.target.value })}
                            className="flex-1 px-3 py-1.5 bg-white border border-emerald-500 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none ring-2 ring-emerald-500/20"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateBranch(editingBranch.original, editingBranch.current);
                              if (e.key === 'Escape') setEditingBranch(null);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateBranch(editingBranch.original, editingBranch.current)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingBranch(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span className="font-bold text-slate-800 truncate">{item}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingBranch({ original: item, current: item })}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Edit branch name"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBranch(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Delete from list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Populates Branch/Stream Dropdown
              </span>
            </div>
          </div>
        )}

        {/* =====================================================================
            CARD 3: GRADUATION / PASSING YEAR DROPDOWN MANAGER
            ===================================================================== */}
        {(activeSubTab === 'all' || activeSubTab === 'years') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      3. Graduation Year Dropdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Graduation years available for student placement registration
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-black text-xs rounded-full border border-purple-100">
                  {passingYears.length} years
                </span>
              </div>

              {/* Add Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddYear();
                  }}
                  placeholder="Add year (e.g. 2029, 2030)..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddYear}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Year</span>
                </button>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {filteredYears.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6 col-span-3">
                    {searchTerm ? 'No matching years found.' : 'No years configured.'}
                  </p>
                ) : (
                  filteredYears.map((year) => (
                    <div
                      key={year}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-purple-50/40 border border-slate-200/80 rounded-xl transition-all text-xs sm:text-sm group"
                    >
                      <span className="font-extrabold text-slate-900">{year}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteYear(year)}
                        className="text-slate-400 hover:text-rose-600 p-1 hover:bg-white rounded-md transition-colors cursor-pointer"
                        title={`Delete ${year}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active in Student Graduation Year Dropdown
              </span>
            </div>
          </div>
        )}

        {/* =====================================================================
            CARD 4: COLLEGE / INSTITUTE DROPDOWN MANAGER
            ===================================================================== */}
        {(activeSubTab === 'all' || activeSubTab === 'colleges') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      4. College / Institute Dropdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Colleges and universities available in student registration modal and filters
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-black text-xs rounded-full border border-indigo-100">
                  {colleges.length} colleges
                </span>
              </div>

              {/* Add Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCollegeInput}
                  onChange={(e) => setNewCollegeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCollege();
                  }}
                  placeholder="Add new college (e.g. IIT, NIT, Government Polytechnic)..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleAddCollege}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add College</span>
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredColleges.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {searchTerm ? 'No matching colleges found.' : 'No colleges added yet.'}
                  </p>
                ) : (
                  filteredColleges.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 rounded-xl transition-all text-xs sm:text-sm"
                    >
                      {editingCollege?.original === item ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingCollege.current}
                            onChange={(e) => setEditingCollege({ ...editingCollege, current: e.target.value })}
                            className="flex-1 px-3 py-1.5 bg-white border border-indigo-500 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none ring-2 ring-indigo-500/20"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateCollege(editingCollege.original, editingCollege.current);
                              if (e.key === 'Escape') setEditingCollege(null);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateCollege(editingCollege.original, editingCollege.current)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCollege(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{item}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingCollege({ original: item, current: item })}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Edit college name"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCollege(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Delete from list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Populates College / Institute on Student Registration
              </span>
            </div>
          </div>
        )}

        {/* =====================================================================
            CARD 5: DURATION DROPDOWN MANAGER
            ===================================================================== */}
        {(activeSubTab === 'all' || activeSubTab === 'durations') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      5. Duration Dropdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Duration options available in student registration form
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-black text-xs rounded-full border border-amber-100">
                  {durations.length} durations
                </span>
              </div>

              {/* Add Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDurationInput}
                  onChange={(e) => setNewDurationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddDuration();
                  }}
                  placeholder="Add new duration (e.g. 45 Days, 6 Months, 1 Year)..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
                <button
                  type="button"
                  onClick={handleAddDuration}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Duration</span>
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredDurations.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {searchTerm ? 'No matching durations found.' : 'No durations added yet.'}
                  </p>
                ) : (
                  filteredDurations.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50/40 border border-slate-200/80 rounded-xl transition-all text-xs sm:text-sm"
                    >
                      {editingDuration?.original === item ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={editingDuration.current}
                            onChange={(e) => setEditingDuration({ ...editingDuration, current: e.target.value })}
                            className="flex-1 px-3 py-1.5 bg-white border border-amber-500 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none ring-2 ring-amber-500/20"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateDuration(editingDuration.original, editingDuration.current);
                              if (e.key === 'Escape') setEditingDuration(null);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateDuration(editingDuration.original, editingDuration.current)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDuration(null)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{item}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingDuration({ original: item, current: item })}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Edit duration option"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDuration(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Delete from list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Populates Duration on Student Registration
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
