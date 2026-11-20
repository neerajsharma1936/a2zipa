import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseCard, PLACEHOLDER_COURSE_IMAGE } from '../CourseCard';
import {
  ProgramItem,
  ProgramCategory,
  ProgramCategoryItem,
  DEFAULT_PROGRAM_CATEGORIES,
  PRESET_PROGRAM_IMAGES,
  getStoredPrograms,
  saveStoredPrograms,
  resetStoredPrograms,
  PROGRAMS_UPDATED_EVENT,
  getStoredCategories,
  saveStoredCategories,
  resetStoredCategories,
  CATEGORIES_UPDATED_EVENT,
} from '../../data/programsData';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Camera,
  ImagePlus,
  Upload,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Copy,
  Clock,
  GraduationCap,
  Briefcase,
  LayoutGrid,
  List,
  X,
  Check,
  Tag,
  Tags,
  Phone,
  Mail,
  UserCheck,
  Award,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const BADGE_COLOR_PALETTES: Record<
  string,
  { label: string; bg: string; border: string; text: string; dot: string }
> = {
  blue: { label: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  emerald: { label: 'Emerald Green', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  indigo: { label: 'Indigo / Violet', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  amber: { label: 'Amber / Orange', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  rose: { label: 'Rose Red', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
  purple: { label: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
  cyan: { label: 'Cyan / Teal', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  slate: { label: 'Slate Gray', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700', dot: 'bg-slate-500' },
};

export interface AllProgramsManagementProps {
  hideBanner?: boolean;
}

export const AllProgramsManagement: React.FC<AllProgramsManagementProps> = ({ hideBanner = false }) => {
  const { navigateTo, showToast } = useApp();

  const [programs, setPrograms] = useState<ProgramItem[]>(() => getStoredPrograms());
  const [categories, setCategories] = useState<ProgramCategoryItem[]>(() => getStoredCategories());
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [programToDelete, setProgramToDelete] = useState<ProgramItem | null>(null);
  const [imageModalProgram, setImageModalProgram] = useState<ProgramItem | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedProgramForDetails, setSelectedProgramForDetails] = useState<ProgramItem | null>(null);

  // Category Management Modal State
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('blue');
  const [editingCategory, setEditingCategory] = useState<ProgramCategoryItem | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatColor, setEditCatColor] = useState('blue');
  const [categoryToDelete, setCategoryToDelete] = useState<ProgramCategoryItem | null>(null);

  // Form state for Add/Edit Program
  const [formState, setFormState] = useState<{
    id?: string;
    title: string;
    category: string;
    categoryLabel: string;
    degreeType: 'B.Tech' | 'Diploma' | 'ITI / Certificate' | 'Undergraduate (Non-Tech)';
    branch: string;
    shortDescription: string;
    description: string;
    duration: string;
    eligibility: string;
    qualification: string;
    passingYear: string;
    fee: string;
    certificateInfo: string;
    contactPhone: string;
    contactEmail: string;
    counselorName: string;
    specializations: string;
    careerOpportunities: string;
    image: string;
    status: 'published' | 'draft';
  }>({
    title: '',
    category: 'cs-it',
    categoryLabel: 'CS-IT',
    degreeType: 'B.Tech',
    branch: 'Computer Science & Engineering',
    shortDescription: 'Cutting-edge curriculum covering core algorithms, cloud architecture, and modern full-stack development.',
    description: 'Comprehensive 4-year engineering program delivering hands-on industry training, project-based laboratory experience, and direct campus placement assistance.',
    duration: '4 Years (8 Semesters)',
    eligibility: '10+2 with Physics & Mathematics (Min 60%)',
    qualification: '10+2 (PCM)',
    passingYear: '2023 - 2026',
    fee: '₹75,000 / Year',
    certificateInfo: 'Govt. Recognized & ISO 9001:2015 QR-Verified Industry Certificate',
    contactPhone: '+91 98765 43210',
    contactEmail: 'admissions@a2z.edu.in',
    counselorName: 'Senior Academic Counselor',
    specializations: 'Full Stack Development, Cloud Architecture, AI & ML Basics',
    careerOpportunities: 'Software Engineer, Full Stack Developer, Systems Architect',
    image: PRESET_PROGRAM_IMAGES[1].url,
    status: 'published',
  });

  // Keep state synced with localStorage and other components
  useEffect(() => {
    const handleSync = () => {
      setPrograms(getStoredPrograms());
      setCategories(getStoredCategories());
    };
    window.addEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
    window.addEventListener(CATEGORIES_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(PROGRAMS_UPDATED_EVENT, handleSync);
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const updateProgramsList = (updated: ProgramItem[]) => {
    setPrograms(updated);
    saveStoredPrograms(updated);
  };

  const updateCategoriesList = (updated: ProgramCategoryItem[]) => {
    setCategories(updated);
    saveStoredCategories(updated);
  };

  // Stats calculation
  const publishedCount = useMemo(
    () => programs.filter((p) => (p.status || 'published') === 'published').length,
    [programs]
  );
  const draftCount = useMemo(
    () => programs.filter((p) => p.status === 'draft').length,
    [programs]
  );

  const categoriesCount = useMemo(() => {
    const set = new Set(programs.map((p) => p.category));
    return set.size;
  }, [programs]);

  // Filtering
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      const progStatus = prog.status || 'published';
      if (statusFilter !== 'all' && progStatus !== statusFilter) return false;
      if (selectedCategory !== 'all' && prog.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prog.title.toLowerCase().includes(q);
        const matchCat = (prog.categoryLabel || '').toLowerCase().includes(q);
        const matchBranch = (prog.branch || '').toLowerCase().includes(q);
        const matchDegree = (prog.degreeType || '').toLowerCase().includes(q);
        const matchDesc = (prog.description || '').toLowerCase().includes(q);
        const matchShortDesc = (prog.shortDescription || '').toLowerCase().includes(q);
        const matchSpec = (prog.specializations || []).some((s) => s.toLowerCase().includes(q));
        const matchCareer = (prog.careerOpportunities || []).some((c) => c.toLowerCase().includes(q));
        return (
          matchTitle ||
          matchCat ||
          matchBranch ||
          matchDegree ||
          matchDesc ||
          matchShortDesc ||
          matchSpec ||
          matchCareer
        );
      }
      return true;
    });
  }, [programs, statusFilter, selectedCategory, searchQuery]);

  // Publish / Unpublish handler
  const handleTogglePublish = (id: string) => {
    const updated = programs.map((p) => {
      if (p.id === id) {
        const nextStatus = (p.status || 'published') === 'published' ? 'draft' : 'published';
        showToast(
          nextStatus === 'published'
            ? `Course "${p.title}" is now PUBLISHED and live on All Programs page.`
            : `Course "${p.title}" moved to DRAFTS (hidden from public All Programs page).`,
          'success'
        );
        return { ...p, status: nextStatus as 'published' | 'draft' };
      }
      return p;
    });
    updateProgramsList(updated);
  };

  // Delete program
  const confirmDeleteProgram = () => {
    if (!programToDelete) return;
    const updated = programs.filter((p) => p.id !== programToDelete.id);
    updateProgramsList(updated);
    showToast(`Course "${programToDelete.title}" permanently deleted from catalog.`, 'success');
    if (selectedProgramForDetails?.id === programToDelete.id) {
      setSelectedProgramForDetails(null);
    }
    setProgramToDelete(null);
  };

  // Duplicate program
  const handleDuplicateProgram = (prog: ProgramItem) => {
    const duplicated: ProgramItem = {
      ...prog,
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${prog.title} (Copy)`,
      status: 'draft',
    };
    const updated = [duplicated, ...programs];
    updateProgramsList(updated);
    showToast(`Duplicated "${prog.title}" as draft.`, 'success');
  };

  // Delete image
  const handleDeleteImage = (prog: ProgramItem) => {
    const updated = programs.map((p) => (p.id === prog.id ? { ...p, image: '' } : p));
    updateProgramsList(updated);
    showToast(`Image deleted for "${prog.title}". A placeholder is now displayed.`, 'success');
    if (selectedProgramForDetails?.id === prog.id) {
      setSelectedProgramForDetails((prev) => (prev ? { ...prev, image: '' } : null));
    }
    if (imageModalProgram?.id === prog.id) {
      setImageModalProgram((prev) => (prev ? { ...prev, image: '' } : null));
      setCustomImageUrl('');
    }
  };

  // Open Image Modal
  const handleOpenImageModal = (prog: ProgramItem) => {
    setImageModalProgram(prog);
    setCustomImageUrl(prog.image || '');
  };

  // Save updated image
  const handleSaveImage = () => {
    if (!imageModalProgram) return;
    const newUrl = customImageUrl.trim();
    const updated = programs.map((p) =>
      p.id === imageModalProgram.id ? { ...p, image: newUrl } : p
    );
    updateProgramsList(updated);
    showToast(
      newUrl
        ? `Image updated for "${imageModalProgram.title}".`
        : `Image removed for "${imageModalProgram.title}".`,
      'success'
    );
    if (selectedProgramForDetails?.id === imageModalProgram.id) {
      setSelectedProgramForDetails((prev) => (prev ? { ...prev, image: newUrl } : null));
    }
    setImageModalProgram(null);
  };

  // Handle image upload from computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Please upload an image smaller than 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImageUrl(reader.result);
        showToast('Image loaded! Click "Save Image" to apply.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    const defaults = resetStoredPrograms();
    setPrograms(defaults);
    showToast('Programs catalog restored to initial defaults.', 'success');
  };

  // Category CRUD Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) {
      showToast('Please enter a category name', 'error');
      return;
    }

    // Generate unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    if (!baseSlug) baseSlug = `cat-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (categories.some((c) => c.id === uniqueSlug)) {
      counter += 1;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    const palette = BADGE_COLOR_PALETTES[newCatColor] || BADGE_COLOR_PALETTES.blue;
    const newCategoryItem: ProgramCategoryItem = {
      id: uniqueSlug,
      label: name,
      description: newCatDesc.trim() || undefined,
      badgeBg: palette.bg,
      badgeBorder: palette.border,
      badgeText: palette.text,
      isDefault: false,
    };

    const updated = [...categories, newCategoryItem];
    updateCategoriesList(updated);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatColor('blue');
    showToast(`Category "${name}" created successfully!`, 'success');
  };

  const handleStartEditCategory = (cat: ProgramCategoryItem) => {
    setEditingCategory(cat);
    setEditCatName(cat.label);
    setEditCatDesc(cat.description || '');

    const foundKey =
      Object.keys(BADGE_COLOR_PALETTES).find(
        (k) => BADGE_COLOR_PALETTES[k].bg === cat.badgeBg
      ) || 'blue';
    setEditCatColor(foundKey);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const name = editCatName.trim();
    if (!name) {
      showToast('Please enter a category name', 'error');
      return;
    }

    const palette = BADGE_COLOR_PALETTES[editCatColor] || BADGE_COLOR_PALETTES.blue;
    const updatedCats = categories.map((c) => {
      if (c.id === editingCategory.id) {
        return {
          ...c,
          label: name,
          description: editCatDesc.trim() || undefined,
          badgeBg: palette.bg,
          badgeBorder: palette.border,
          badgeText: palette.text,
        };
      }
      return c;
    });

    updateCategoriesList(updatedCats);

    // Synchronize existing programs in this category with updated label and badge style
    const updatedPrograms = programs.map((p) => {
      if (p.category === editingCategory.id) {
        return {
          ...p,
          categoryLabel: name,
          badgeBg: palette.bg,
          badgeBorder: palette.border,
          badgeText: palette.text,
        };
      }
      return p;
    });
    updateProgramsList(updatedPrograms);

    setEditingCategory(null);
    showToast(`Category "${name}" updated successfully!`, 'success');
  };

  const handleDeleteCategory = (cat: ProgramCategoryItem) => {
    if (categories.length <= 1) {
      showToast('At least one category is required in the catalog.', 'error');
      return;
    }

    const remaining = categories.filter((c) => c.id !== cat.id);
    updateCategoriesList(remaining);

    // Re-assign programs under this category to the first remaining category
    const fallbackCategory = remaining[0];
    const updatedPrograms = programs.map((p) => {
      if (p.category === cat.id) {
        return {
          ...p,
          category: fallbackCategory.id,
          categoryLabel: fallbackCategory.label,
          badgeBg: fallbackCategory.badgeBg || 'bg-blue-50',
          badgeBorder: fallbackCategory.badgeBorder || 'border-blue-200',
          badgeText: fallbackCategory.badgeText || 'text-blue-700',
        };
      }
      return p;
    });
    updateProgramsList(updatedPrograms);

    if (selectedCategory === cat.id) {
      setSelectedCategory('all');
    }
    setCategoryToDelete(null);
    showToast(`Category "${cat.label}" deleted.`, 'success');
  };

  const handleResetCategoriesToDefaults = () => {
    const defaults = resetStoredCategories();
    setCategories(defaults);
    showToast('Categories restored to default system categories.', 'success');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProgram(null);
    const initialCat = categories[0]?.id || 'cs-it';
    const initialCatLabel = categories[0]?.label || 'CS-IT';
    setFormState({
      title: '',
      category: initialCat,
      categoryLabel: initialCatLabel,
      degreeType: 'B.Tech',
      branch: 'Computer Science & Engineering',
      shortDescription: 'Cutting-edge curriculum covering core algorithms, cloud architecture, and modern software development.',
      description: 'Comprehensive 4-year engineering program delivering hands-on industry training, project-based laboratory experience, and direct campus placement assistance.',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with Physics & Mathematics (Min 60%)',
      qualification: '10+2 (PCM)',
      passingYear: '2023 - 2026',
      fee: '₹75,000 / Year',
      certificateInfo: 'Govt. Recognized & ISO 9001:2015 QR-Verified Industry Certificate',
      contactPhone: '+91 98765 43210',
      contactEmail: 'admissions@a2z.edu.in',
      counselorName: 'Senior Academic Counselor',
      specializations: 'Data Structures, Web Development, Cloud Computing',
      careerOpportunities: 'Software Engineer, Systems Analyst, Tech Lead',
      image: PRESET_PROGRAM_IMAGES[1].url,
      status: 'published',
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setFormState({
      id: prog.id,
      title: prog.title,
      category: prog.category,
      categoryLabel: prog.categoryLabel || 'Technical Track',
      degreeType: prog.degreeType,
      branch: prog.branch || prog.categoryLabel || prog.degreeType,
      shortDescription: prog.shortDescription || prog.description || '',
      description: prog.description,
      duration: prog.duration,
      eligibility: prog.eligibility,
      qualification: prog.qualification || prog.eligibility,
      passingYear: prog.passingYear || '2023 - 2026',
      fee: prog.fee || '₹45,000 / Year',
      certificateInfo: prog.certificateInfo || 'Govt. Recognized & ISO 9001:2015 QR-Verified Industry Certificate',
      contactPhone: prog.contactInfo?.phone || '+91 98765 43210',
      contactEmail: prog.contactInfo?.email || 'admissions@a2z.edu.in',
      counselorName: prog.contactInfo?.counselor || 'Academic Admissions Cell',
      specializations: (prog.specializations || []).join(', '),
      careerOpportunities: (prog.careerOpportunities || []).join(', '),
      image: prog.image,
      status: prog.status || 'published',
    });
    setIsEditModalOpen(true);
  };

  // Save Add/Edit Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Please enter a valid course/program title', 'error');
      return;
    }

    const cat = formState.category;
    const matchedCategory = categories.find((c) => c.id === cat);
    const catLabel = matchedCategory?.label || formState.categoryLabel || formState.category;
    const catBg = matchedCategory?.badgeBg || 'bg-blue-50';
    const catBorder = matchedCategory?.badgeBorder || 'border-blue-200';
    const catText = matchedCategory?.badgeText || 'text-blue-700';

    const specsArray = formState.specializations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const careersArray = formState.careerOpportunities
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const fullDesc =
      formState.description.trim() ||
      'Comprehensive industry-aligned curriculum with practical lab training and career placement support.';
    const shortDesc =
      formState.shortDescription.trim() ||
      (fullDesc.length > 115 ? `${fullDesc.slice(0, 110)}...` : fullDesc);

    if (editingProgram) {
      // Update existing
      const updated = programs.map((p) => {
        if (p.id === editingProgram.id) {
          return {
            ...p,
            title: formState.title.trim(),
            category: cat,
            categoryLabel: catLabel,
            degreeType: formState.degreeType,
            branch: formState.branch.trim() || catLabel || formState.degreeType,
            shortDescription: shortDesc,
            description: fullDesc,
            duration: formState.duration.trim() || '4 Years',
            eligibility: formState.eligibility.trim() || '10+2 with PCM',
            qualification: formState.qualification.trim() || formState.eligibility.trim() || '10+2 with PCM',
            passingYear: formState.passingYear.trim() || '2023 - 2026',
            fee: formState.fee.trim() || '₹45,000 / Year',
            certificateInfo: formState.certificateInfo.trim() || 'Govt. Recognized & ISO 9001:2015 QR-Verified Certificate',
            contactInfo: {
              phone: formState.contactPhone.trim() || '+91 98765 43210',
              email: formState.contactEmail.trim() || 'admissions@a2z.edu.in',
              counselor: formState.counselorName.trim() || 'Academic Admissions Cell',
            },
            specializations: specsArray.length > 0 ? specsArray : p.specializations,
            careerOpportunities: careersArray.length > 0 ? careersArray : p.careerOpportunities,
            badgeBg: catBg,
            badgeBorder: catBorder,
            badgeText: catText,
            image: formState.image.trim(),
            status: formState.status,
          };
        }
        return p;
      });
      updateProgramsList(updated);
      showToast(`Course "${formState.title}" updated and synced with All Programs page!`, 'success');
    } else {
      // Add new
      const newProgram: ProgramItem = {
        id: `prog-${Date.now()}-${formState.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: formState.title.trim(),
        category: cat,
        categoryLabel: catLabel,
        degreeType: formState.degreeType,
        branch: formState.branch.trim() || catLabel || formState.degreeType,
        shortDescription: shortDesc,
        description: fullDesc,
        duration: formState.duration.trim() || '4 Years',
        eligibility: formState.eligibility.trim() || '10+2 with PCM',
        qualification: formState.qualification.trim() || formState.eligibility.trim() || '10+2 with PCM',
        passingYear: formState.passingYear.trim() || '2023 - 2026',
        fee: formState.fee.trim() || '₹45,000 / Year',
        certificateInfo: formState.certificateInfo.trim() || 'Govt. Recognized & ISO 9001:2015 QR-Verified Industry Certificate',
        contactInfo: {
          phone: formState.contactPhone.trim() || '+91 98765 43210',
          email: formState.contactEmail.trim() || 'admissions@a2z.edu.in',
          counselor: formState.counselorName.trim() || 'Academic Admissions Cell',
        },
        specializations:
          specsArray.length > 0
            ? specsArray
            : ['Core Technical Foundations', 'Practical Projects', 'Industry Workshop'],
        careerOpportunities:
          careersArray.length > 0 ? careersArray : ['Project Engineer', 'Technical Specialist'],
        badgeBg: catBg,
        badgeBorder: catBorder,
        badgeText: catText,
        image: formState.image.trim() || PRESET_PROGRAM_IMAGES[0].url,
        status: formState.status,
      };
      const updated = [newProgram, ...programs];
      updateProgramsList(updated);
      showToast(
        newProgram.status === 'published'
          ? `Course "${newProgram.title}" published immediately to public All Programs page!`
          : `Course "${newProgram.title}" saved to Drafts!`,
        'success'
      );
    }

    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Top Banner & Management Actions (hidden when hideBanner is true, e.g. on Dashboard) */}
      {!hideBanner && (
        <div className="bg-gradient-to-r from-[#071B49] via-[#0D2869] to-[#146EF5] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 border border-white/15">
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>Course Catalog & Curriculum Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Manage All Programs & Categories
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              Add or edit academic degree tracks, manage program categories, syllabus details, eligibility, fees, and published course status across the platform.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-manage-categories"
              onClick={() => setIsManageCategoriesModalOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm shadow-xs"
            >
              <Tags className="w-4 h-4 text-blue-200" />
              <span>Manage Categories ({categories.length})</span>
            </button>

            <button
              id="btn-add-new-program"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-white text-[#071B49] hover:bg-blue-50 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#146EF5]" />
              <span>Add New Program</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Toolbar: Category Tabs, Search, Status Filter & View Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#146EF5] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Programs ({programs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#146EF5] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Right side Controls: Search, Status, View Mode & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Action buttons if top banner is hidden */}
          {hideBanner && (
            <div className="flex items-center gap-2">
              <button
                id="btn-manage-categories"
                onClick={() => setIsManageCategoriesModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Manage Categories"
              >
                <Tags className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Categories ({categories.length})</span>
              </button>

              <button
                id="btn-add-new-program"
                onClick={handleOpenAddModal}
                className="px-3.5 py-1.5 bg-[#146EF5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Program</span>
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#146EF5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#146EF5] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#146EF5] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#146EF5] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PROGRAMS DISPLAY (EXACTLY 4 CARDS IN ONE ROW ON DESKTOP OR TABLE VIEW)
          ==================================================================== */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No courses match current filters</h3>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Course</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* ====================================================================
            GRID VIEW: EXACTLY 4 CARDS IN ONE ROW (md:grid-cols-4, lg:grid-cols-4)
            ==================================================================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {filteredPrograms.map((prog) => {
            return (
              <div key={prog.id} className="relative group/admincard h-full">
                <CourseCard
                  id={`admin-course-${prog.id}`}
                  image={prog.image}
                  title={prog.title}
                  category={prog.category}
                  categoryLabel={prog.categoryLabel}
                  branch={prog.branch || prog.categoryLabel}
                  degreeType={prog.degreeType}
                  shortDescription={prog.shortDescription || prog.description}
                  description={prog.description}
                  duration={prog.duration}
                  eligibility={prog.eligibility}
                  qualification={prog.qualification || prog.eligibility}
                  fee={prog.fee}
                  status={prog.status || 'published'}
                  badgeBg={prog.badgeBg}
                  badgeBorder={prog.badgeBorder}
                  badgeText={prog.badgeText}
                  showAdminControls={true}
                  onTogglePublish={() => handleTogglePublish(prog.id)}
                  onDelete={() => setProgramToDelete(prog)}
                  onDeleteImage={() => handleDeleteImage(prog)}
                  onChangeImage={() => handleOpenImageModal(prog)}
                  onEdit={() => handleOpenEditModal(prog)}
                  onDuplicate={() => handleDuplicateProgram(prog)}
                  onViewDetails={() => setSelectedProgramForDetails(prog)}
                  onExploreCourse={() => setSelectedProgramForDetails(prog)}
                  onApplyNow={() => {
                    navigateTo('application', { selectedCourse: prog.title });
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* ====================================================================
            TABLE VIEW FOR DENSE MANAGEMENT
            ==================================================================== */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Course & Image</th>
                  <th className="py-3.5 px-4">Category & Branch</th>
                  <th className="py-3.5 px-4">Duration & Eligibility</th>
                  <th className="py-3.5 px-4">Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map((prog) => {
                  const isPublished = (prog.status || 'published') === 'published';
                  return (
                    <tr key={prog.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prog.image || PLACEHOLDER_COURSE_IMAGE}
                            alt={prog.title}
                            className="w-12 h-9 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <p
                              onClick={() => setSelectedProgramForDetails(prog)}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                              title={prog.title}
                            >
                              {prog.title}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {prog.shortDescription || prog.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${prog.badgeBg} ${prog.badgeText} border ${prog.badgeBorder}`}>
                          {prog.categoryLabel}
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {prog.branch || prog.degreeType}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{prog.duration}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1" title={prog.eligibility}>
                          {prog.eligibility}
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-700">
                        {prog.fee || '₹45,000 / Year'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(prog.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProgramForDetails(prog)}
                            title="View Full Details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenImageModal(prog)}
                            title="Change Image"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(prog)}
                            title="Edit Course"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateProgram(prog)}
                            title="Duplicate Course"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProgramToDelete(prog)}
                            title="Delete Course"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          ADD / EDIT COURSE MODAL
          ==================================================================== */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingProgram ? 'Edit Course / Program' : 'Add New Course / Program'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingProgram
                      ? 'Changes will immediately update the catalog and public All Programs page.'
                      : 'Create a new course card with complete eligibility, fee, and syllabus details.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 sm:p-6 space-y-4">
              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course / Program Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. B.Tech in Artificial Intelligence & Data Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              {/* Category, Degree Type & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Track Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c.id === e.target.value);
                      setFormState({
                        ...formState,
                        category: e.target.value,
                        categoryLabel: selectedCat ? selectedCat.label : formState.categoryLabel,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Degree / Credential Type
                  </label>
                  <select
                    value={formState.degreeType}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        degreeType: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="Diploma">Diploma (Polytechnic)</option>
                    <option value="ITI / Certificate">ITI / Certificate</option>
                    <option value="Undergraduate (Non-Tech)">Undergraduate (Non-Tech)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch / Specialization Name
                  </label>
                  <input
                    type="text"
                    value={formState.branch}
                    onChange={(e) => setFormState({ ...formState, branch: e.target.value })}
                    placeholder="e.g. Computer Science & AI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Duration, Fee & Passing Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Duration
                  </label>
                  <input
                    type="text"
                    value={formState.duration}
                    onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                    placeholder="e.g. 4 Years (8 Semesters)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Fee / Tuition
                  </label>
                  <input
                    type="text"
                    value={formState.fee}
                    onChange={(e) => setFormState({ ...formState, fee: e.target.value })}
                    placeholder="e.g. ₹75,000 / Year or Free"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Passing Year (Applicable)
                  </label>
                  <input
                    type="text"
                    value={formState.passingYear}
                    onChange={(e) => setFormState({ ...formState, passingYear: e.target.value })}
                    placeholder="e.g. 2023 - 2026 or Any Year"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Eligibility & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Eligibility Criteria
                  </label>
                  <input
                    type="text"
                    value={formState.eligibility}
                    onChange={(e) => setFormState({ ...formState, eligibility: e.target.value })}
                    placeholder="e.g. 10+2 with Physics & Mathematics (Min 55%)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Required Qualification
                  </label>
                  <input
                    type="text"
                    value={formState.qualification}
                    onChange={(e) => setFormState({ ...formState, qualification: e.target.value })}
                    placeholder="e.g. 10+2 PCM / 10th Standard / Polytechnic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Certificate Information */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate Details & Accreditations
                </label>
                <input
                  type="text"
                  value={formState.certificateInfo}
                  onChange={(e) => setFormState({ ...formState, certificateInfo: e.target.value })}
                  placeholder="e.g. Govt. Recognized & ISO 9001:2015 QR-Verified Industry Certificate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              {/* Short Description (Card summary) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description <span className="text-slate-400 font-normal">(Card preview - max 2 lines)</span>
                </label>
                <input
                  type="text"
                  value={formState.shortDescription}
                  onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                  placeholder="Concise 1-2 sentence overview for the card display..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Description & Scope <span className="text-slate-400 font-normal">(Shown in Details Modal)</span>
                </label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Detailed breakdown of syllabus, laboratories, industry certifications, and career pathways..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              {/* Contact Information Row */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Course Admissions Contact Information:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Helpline Phone</label>
                    <input
                      type="text"
                      value={formState.contactPhone}
                      onChange={(e) => setFormState({ ...formState, contactPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Email Address</label>
                    <input
                      type="email"
                      value={formState.contactEmail}
                      onChange={(e) => setFormState({ ...formState, contactEmail: e.target.value })}
                      placeholder="admissions@a2z.edu.in"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Counselor Name</label>
                    <input
                      type="text"
                      value={formState.counselorName}
                      onChange={(e) => setFormState({ ...formState, counselorName: e.target.value })}
                      placeholder="Senior Admissions Officer"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Focus Areas & Career Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Focus Areas (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formState.specializations}
                    onChange={(e) => setFormState({ ...formState, specializations: e.target.value })}
                    placeholder="e.g. Cloud Arch, AI Models, Cyber Security"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Career Roles (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formState.careerOpportunities}
                    onChange={(e) => setFormState({ ...formState, careerOpportunities: e.target.value })}
                    placeholder="e.g. Full Stack Dev, Cloud Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Card Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-mono text-xs"
                  />
                  {formState.image && (
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, image: '' })}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Presets Picker */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Or select a curated preset image:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_PROGRAM_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormState({ ...formState, image: preset.url })}
                        className={`group relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          formState.image === preset.url
                            ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                            : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Toggle (Published vs Draft) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Publishing Status
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {formState.status === 'published'
                      ? 'Live: visible immediately on public All Programs page.'
                      : 'Draft: hidden from public All Programs page (Admin only).'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, status: 'published' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formState.status === 'published'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormState({ ...formState, status: 'draft' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formState.status === 'draft'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProgram ? 'Save Changes' : 'Create & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          CHANGE IMAGE MODAL
          ==================================================================== */}
      {imageModalProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setImageModalProgram(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Change Course Image</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{imageModalProgram.title}</p>
                </div>
              </div>
              <button
                onClick={() => setImageModalProgram(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Preview of Current / New Image */}
            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative mb-4">
              <img
                src={customImageUrl || PLACEHOLDER_COURSE_IMAGE}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!customImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs font-bold">
                  No image attached (Placeholder will display)
                </div>
              )}
            </div>

            {/* URL input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-mono"
                />
              </div>

              {/* Upload file */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Or Upload From Device
                </label>
                <label className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (JPG, PNG, WebP)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Presets */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  Preset Curated Images:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_PROGRAM_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomImageUrl(preset.url)}
                      className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        customImageUrl === preset.url
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {customImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setCustomImageUrl('')}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageModalProgram(null)}
                    className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveImage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Save Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DELETE CONFIRMATION MODAL
          ==================================================================== */}
      {programToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setProgramToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Course Permanently?</h3>
            <p className="text-xs text-slate-600 mt-1">
              Are you sure you want to delete <strong className="text-slate-900">"{programToDelete.title}"</strong>? It will immediately be removed from both the Admin Panel and the public All Programs page.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setProgramToDelete(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProgram}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          COURSE DETAILS MODAL (FULL PREVIEW)
          ==================================================================== */}
      {selectedProgramForDetails && (
        <div
          id="admin-program-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedProgramForDetails(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-100">
              <img
                src={selectedProgramForDetails.image || PLACEHOLDER_COURSE_IMAGE}
                alt={selectedProgramForDetails.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProgramForDetails(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${selectedProgramForDetails.badgeBg} ${selectedProgramForDetails.badgeBorder} ${selectedProgramForDetails.badgeText} border`}>
                  {selectedProgramForDetails.categoryLabel}
                </span>
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                  {selectedProgramForDetails.branch || selectedProgramForDetails.degreeType}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedProgramForDetails.title}
                </h3>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 ${
                    (selectedProgramForDetails.status || 'published') === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${(selectedProgramForDetails.status || 'published') === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span>{(selectedProgramForDetails.status || 'published') === 'published' ? 'Published' : 'Draft'}</span>
                </span>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                {selectedProgramForDetails.shortDescription && (
                  <p className="text-xs font-medium text-slate-500 italic">
                    "{selectedProgramForDetails.shortDescription}"
                  </p>
                )}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProgramForDetails.description}
                </p>
              </div>

              {/* Course Key Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-semibold text-slate-800">{selectedProgramForDetails.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Course Fee</span>
                  <span className="font-bold text-emerald-700">{selectedProgramForDetails.fee || '₹45,000 / Year'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligibility</span>
                  <span className="font-semibold text-slate-800">{selectedProgramForDetails.eligibility}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Passing Year</span>
                  <span className="font-semibold text-slate-800">{selectedProgramForDetails.passingYear || '2023 - 2026'}</span>
                </div>
              </div>

              {/* Certificate Information */}
              {selectedProgramForDetails.certificateInfo && (
                <div className="flex items-start gap-2.5 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Certification:</span>
                    <span>{selectedProgramForDetails.certificateInfo}</span>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {selectedProgramForDetails.contactInfo && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <span className="font-bold text-slate-800 block text-[11px]">Admissions & Counseling:</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{selectedProgramForDetails.contactInfo.phone || '+91 98765 43210'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedProgramForDetails.contactInfo.email || 'admissions@a2z.edu.in'}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Specializations & Careers */}
              {selectedProgramForDetails.specializations && selectedProgramForDetails.specializations.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Key Focus Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProgramForDetails.specializations.map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const prog = selectedProgramForDetails;
                    setSelectedProgramForDetails(null);
                    handleOpenEditModal(prog);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit in Admin</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const prog = selectedProgramForDetails;
                      setSelectedProgramForDetails(null);
                      navigateTo('student-registration', { selectedCourse: prog.title });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Register Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProgramForDetails(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MANAGE CATEGORIES MODAL (ADD, EDIT, DELETE CATEGORIES)
          ==================================================================== */}
      {isManageCategoriesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => {
            setIsManageCategoriesModalOpen(false);
            setEditingCategory(null);
            setCategoryToDelete(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Tags className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Manage Course Categories
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add new categories, edit names/colors, or remove categories. Changes sync across public and admin views.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsManageCategoriesModalOpen(false);
                  setEditingCategory(null);
                  setCategoryToDelete(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* 1. ADD / EDIT CATEGORY FORM */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  {editingCategory ? (
                    <>
                      <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Edit Category: {editingCategory.label}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Add New Category</span>
                    </>
                  )}
                </h4>

                {editingCategory ? (
                  <form onSubmit={handleSaveEditCategory} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category Name / Label <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        placeholder="e.g. Artificial Intelligence & Robotics"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={editCatDesc}
                        onChange={(e) => setEditCatDesc(e.target.value)}
                        placeholder="Short description of this discipline"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Badge Color Scheme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(BADGE_COLOR_PALETTES).map(([key, pal]) => (
                          <button
                            type="button"
                            key={key}
                            onClick={() => setEditCatColor(key)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              editCatColor === key
                                ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 font-bold'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${pal.dot}`} />
                            <span className="text-xs text-slate-700 line-clamp-1">{pal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Preview:</span>
                      {(() => {
                        const pal = BADGE_COLOR_PALETTES[editCatColor] || BADGE_COLOR_PALETTES.blue;
                        return (
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${pal.bg} ${pal.border} ${pal.text}`}
                          >
                            {editCatName || 'Category Label'}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddCategory} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category Name / Label <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Artificial Intelligence & Robotics, Pharmacy, Biotech..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        placeholder="e.g. Robotics, autonomous vehicles, automation, and intelligent machines."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Badge Color Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(BADGE_COLOR_PALETTES).map(([key, pal]) => (
                          <button
                            type="button"
                            key={key}
                            onClick={() => setNewCatColor(key)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              newCatColor === key
                                ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 font-bold'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${pal.dot}`} />
                            <span className="text-xs text-slate-700 line-clamp-1">{pal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Preview:</span>
                      {(() => {
                        const pal = BADGE_COLOR_PALETTES[newCatColor] || BADGE_COLOR_PALETTES.blue;
                        return (
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border ${pal.bg} ${pal.border} ${pal.text}`}
                          >
                            {newCatName || 'Category Preview'}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* 2. EXISTING CATEGORIES LIST */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Current Categories ({categories.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    {programs.length} total programs classified
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {categories.map((cat) => {
                    const count = programs.filter((p) => p.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border shrink-0 ${
                              cat.badgeBg || 'bg-blue-50'
                            } ${cat.badgeBorder || 'border-blue-200'} ${
                              cat.badgeText || 'text-blue-700'
                            }`}
                          >
                            {cat.label}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{cat.label}</span>
                              <span className="text-[11px] font-mono text-slate-400">({cat.id})</span>
                            </div>
                            {cat.description && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[11px] font-semibold">
                            {count} {count === 1 ? 'Program' : 'Programs'}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              title="Edit Category"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCategoryToDelete(cat)}
                              title="Delete Category"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. DELETE CATEGORY CONFIRMATION IN-MODAL */}
              {categoryToDelete && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Confirm Delete Category: &ldquo;{categoryToDelete.label}&rdquo;</span>
                  </div>
                  <p className="text-xs text-rose-700">
                    Any programs currently in this category will automatically be reassigned to the default available category.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(categoryToDelete)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Yes, Delete Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(null)}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetCategoriesToDefaults}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Restore default system categories"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default Categories</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsManageCategoriesModalOpen(false);
                    setEditingCategory(null);
                    setCategoryToDelete(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
