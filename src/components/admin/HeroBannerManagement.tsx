import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Upload,
  Calendar,
  Layers,
  Smartphone,
  Monitor,
  ExternalLink,
  Info,
  Check,
  X,
  Clock
} from 'lucide-react';

export const HeroBannerManagement: React.FC = () => {
  const {
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    toggleHeroBannerStatus,
    reorderHeroBanners,
    navigateTo,
    showToast,
  } = useApp();

  // Modals & form state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<HeroBanner | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Image dimension check state
  const [desktopDimWarning, setDesktopDimWarning] = useState<string | null>(null);
  const [mobileDimWarning, setMobileDimWarning] = useState<string | null>(null);
  const [detectedDesktopDims, setDetectedDesktopDims] = useState<string | null>(null);
  const [detectedMobileDims, setDetectedMobileDims] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    title: string;
    desktopImage: string;
    mobileImage: string;
    heading: string;
    subtitle: string;
    offerBadge: string;
    ctaText: string;
    ctaLink: string;
    active: boolean;
    order: number;
    startDate: string;
    endDate: string;
    overlayMode: 'clean' | 'gradient' | 'dark' | 'none';
    textColor: 'light' | 'dark';
  }>({
    title: '',
    desktopImage: '',
    mobileImage: '',
    heading: '',
    subtitle: '',
    offerBadge: '',
    ctaText: 'Explore Now',
    ctaLink: 'all-programs',
    active: true,
    order: heroBanners.length + 1,
    startDate: '',
    endDate: '',
    overlayMode: 'gradient',
    textColor: 'light',
  });

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample banners for instant setup
  const presetSamples = [
    {
      label: 'Summer Tech Placement Drive',
      desktop: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=250&auto=format&fit=crop&q=85',
      mobile: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&h=450&auto=format&fit=crop&q=85',
      heading: 'Summer 2025 Placement & Internship Drive',
      subtitle: 'Over 500+ verified partner companies offering high stipends',
      badge: 'Batch 2025 Open',
      cta: 'Explore Openings',
      link: 'all-programs',
    },
    {
      label: 'AICTE Verified Certification',
      desktop: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=250&auto=format&fit=crop&q=85',
      mobile: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1080&h=450&auto=format&fit=crop&q=85',
      heading: 'ISO 9001:2015 Recognized Certifications',
      subtitle: 'Earn cryptographically verifiable credentials with QR validation',
      badge: 'Govt. Approved',
      cta: 'Verify Certificate',
      link: 'student-certificates',
    },
    {
      label: 'Generative AI & Cloud Masterclass',
      desktop: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=250&auto=format&fit=crop&q=85',
      mobile: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1080&h=450&auto=format&fit=crop&q=85',
      heading: 'Generative AI & Full-Stack Cloud Masterclass',
      subtitle: 'Weekend live interactive cohorts with senior architects',
      badge: 'Limited Seats • 40% Off',
      cta: 'View Syllabus',
      link: 'all-programs',
    },
    {
      label: '50% Early Bird Scholarship',
      desktop: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=250&auto=format&fit=crop&q=85',
      mobile: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1080&h=450&auto=format&fit=crop&q=85',
      heading: 'Flat 50% Undergrad Career Scholarship',
      subtitle: 'Merit-based financial aid for high-potential engineering students',
      badge: 'Code: LAUNCH50',
      cta: 'Claim Aid',
      link: 'all-programs',
    },
  ];

  // Helper to validate and read uploaded image files with dimension checking
  const handleImageFileUpload = (
    file: File,
    type: 'desktop' | 'mobile'
  ) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const dimensionStr = `${width} × ${height} px`;

        if (type === 'desktop') {
          setDetectedDesktopDims(dimensionStr);
          // Recommended: 1920x250 (aspect ratio ~7.68)
          const targetRatio = 1920 / 250;
          const currentRatio = width / height;
          if (width < 1200 || Math.abs(currentRatio - targetRatio) > 2.5) {
            setDesktopDimWarning(
              `Uploaded: ${dimensionStr}. Recommended desktop ratio is 1920 × 250 px (wide & short banner). Image will scale with object-fit: cover.`
            );
          } else {
            setDesktopDimWarning(null);
          }
          setFormData((prev) => ({ ...prev, desktopImage: dataUrl }));
        } else {
          setDetectedMobileDims(dimensionStr);
          // Recommended: 1080x450 (aspect ratio ~2.4)
          const targetRatio = 1080 / 450;
          const currentRatio = width / height;
          if (width < 600 || Math.abs(currentRatio - targetRatio) > 1.5) {
            setMobileDimWarning(
              `Uploaded: ${dimensionStr}. Recommended mobile ratio is 1080 × 450 px. Image will scale with object-fit: cover.`
            );
          } else {
            setMobileDimWarning(null);
          }
          setFormData((prev) => ({ ...prev, mobileImage: dataUrl }));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingBannerId(null);
    setDesktopDimWarning(null);
    setMobileDimWarning(null);
    setDetectedDesktopDims(null);
    setDetectedMobileDims(null);
    setFormData({
      title: '',
      desktopImage: presetSamples[0].desktop,
      mobileImage: presetSamples[0].mobile,
      heading: '',
      subtitle: '',
      offerBadge: '',
      ctaText: 'Explore Internships',
      ctaLink: 'all-programs',
      active: true,
      order: heroBanners.length + 1,
      startDate: '',
      endDate: '',
      overlayMode: 'gradient',
      textColor: 'light',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBannerId(banner.id);
    setDesktopDimWarning(null);
    setMobileDimWarning(null);
    setDetectedDesktopDims(null);
    setDetectedMobileDims(null);
    setFormData({
      title: banner.title,
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage || '',
      heading: banner.heading || '',
      subtitle: banner.subtitle || '',
      offerBadge: banner.offerBadge || '',
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || 'all-programs',
      active: banner.active,
      order: banner.order,
      startDate: banner.startDate ? banner.startDate.substring(0, 16) : '',
      endDate: banner.endDate ? banner.endDate.substring(0, 16) : '',
      overlayMode: banner.overlayMode || 'gradient',
      textColor: banner.textColor || 'light',
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a banner title/name', 'error');
      return;
    }
    if (!formData.desktopImage.trim()) {
      showToast('Please provide a desktop banner image', 'error');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      desktopImage: formData.desktopImage.trim(),
      mobileImage: formData.mobileImage.trim() || undefined,
      heading: formData.heading.trim() || undefined,
      subtitle: formData.subtitle.trim() || undefined,
      offerBadge: formData.offerBadge.trim() || undefined,
      ctaText: formData.ctaText.trim() || undefined,
      ctaLink: formData.ctaLink.trim() || undefined,
      active: formData.active,
      order: Number(formData.order) || heroBanners.length + 1,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      overlayMode: formData.overlayMode,
      textColor: formData.textColor,
    };

    if (editingBannerId) {
      updateHeroBanner(editingBannerId, payload);
    } else {
      addHeroBanner(payload);
    }
    setIsFormModalOpen(false);
  };

  // Reorder handlers
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...heroBanners].sort((a, b) => a.order - b.order);
    const itemA = sorted[index];
    const itemB = sorted[index - 1];
    sorted[index] = itemB;
    sorted[index - 1] = itemA;
    reorderHeroBanners(sorted.map((b) => b.id));
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...heroBanners].sort((a, b) => a.order - b.order);
    if (index >= sorted.length - 1) return;
    const itemA = sorted[index];
    const itemB = sorted[index + 1];
    sorted[index] = itemB;
    sorted[index + 1] = itemA;
    reorderHeroBanners(sorted.map((b) => b.id));
  };

  const sortedBanners = [...heroBanners].sort((a, b) => a.order - b.order);
  const activeCount = heroBanners.filter((b) => b.active).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Control Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              Public Website Hero
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {activeCount} of {heroBanners.length} Active in Carousel
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Hero Banner Management
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="admin-toggle-preview-btn"
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              showLivePreview
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>{showLivePreview ? 'Hide Live Preview' : 'Interactive Preview'}</span>
          </button>

          <button
            id="admin-add-banner-btn"
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hero Banner</span>
          </button>
        </div>
      </div>

      {/* Interactive In-Dashboard Live Preview */}
      {showLivePreview && (
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-100">Live Public Carousel Simulation</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Test responsive behavior, auto-sliding (5s), pause on hover, navigation dots and mobile ratios.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewViewport === 'desktop'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (1920×250)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewViewport === 'mobile'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (1080×450)</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center p-2 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden">
            <div
              className={`transition-all duration-300 overflow-hidden rounded-xl border border-slate-700 shadow-2xl ${
                previewViewport === 'desktop'
                  ? 'w-full max-w-5xl'
                  : 'w-full max-w-sm'
              }`}
            >
              {/* Simulated browser header */}
              <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <span className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[10px] text-slate-300">
                    a2z.org / {previewViewport === 'desktop' ? 'Desktop Viewport' : 'Mobile Viewport'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Auto-Slide 5s</span>
              </div>

              {/* Render Carousel inside simulated container */}
              <div
                className={`relative w-full overflow-hidden ${
                  previewViewport === 'desktop'
                    ? 'h-[160px] sm:h-[190px] md:h-[220px]'
                    : 'h-[150px]'
                }`}
              >
                {sortedBanners.filter((b) => b.active).length > 0 ? (
                  <img
                    src={
                      previewViewport === 'mobile' && sortedBanners.filter((b) => b.active)[0]?.mobileImage
                        ? sortedBanners.filter((b) => b.active)[0].mobileImage
                        : sortedBanners.filter((b) => b.active)[0]?.desktopImage
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs">
                    No active banners to preview. Toggle at least one banner active.
                  </div>
                )}
                {sortedBanners.filter((b) => b.active)[0]?.heading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent flex items-center p-4 sm:p-6">
                    <div className="space-y-1">
                      {sortedBanners.filter((b) => b.active)[0]?.offerBadge && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                          {sortedBanners.filter((b) => b.active)[0].offerBadge}
                        </span>
                      )}
                      <h4 className="text-xs sm:text-base font-bold text-white line-clamp-1">
                        {sortedBanners.filter((b) => b.active)[0].heading}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-1">
                        {sortedBanners.filter((b) => b.active)[0].subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              All Promotional Hero Banners ({sortedBanners.length})
            </h3>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active ({activeCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Inactive ({sortedBanners.length - activeCount})
            </span>
          </div>
        </div>

        {sortedBanners.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No hero banners created yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first desktop promotional banner (1920 × 250 px) to display directly below the navbar on the homepage.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Hero Banner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Order</th>
                  <th className="py-3.5 px-4 w-44">Banner Thumbnail</th>
                  <th className="py-3.5 px-4">Title & Overlay Content</th>
                  <th className="py-3.5 px-4">CTA & Target</th>
                  <th className="py-3.5 px-4">Mobile Image</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedBanners.map((banner, index) => {
                  const isFirst = index === 0;
                  const isLast = index === sortedBanners.length - 1;

                  return (
                    <tr
                      key={banner.id}
                      id={`admin-banner-row-${banner.id}`}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Order Controls */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="font-bold text-slate-800 text-xs px-2 py-0.5 rounded bg-slate-100">
                            #{banner.order}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              title="Move Slide Up"
                              disabled={isFirst}
                              onClick={() => handleMoveUp(index)}
                              className={`p-1 rounded transition-colors ${
                                isFirst
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-200 cursor-pointer'
                              }`}
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              title="Move Slide Down"
                              disabled={isLast}
                              onClick={() => handleMoveDown(index)}
                              className={`p-1 rounded transition-colors ${
                                isLast
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-200 cursor-pointer'
                              }`}
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Thumbnail Preview */}
                      <td className="py-3.5 px-4">
                        <div className="w-36 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-xs relative bg-slate-900 group-hover:shadow transition-shadow">
                          <img
                            src={banner.desktopImage}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/70 backdrop-blur-xs text-[9px] text-white rounded font-mono">
                            1920×250
                          </span>
                        </div>
                      </td>

                      {/* Title & Overlay Content */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{banner.title}</span>
                            {banner.offerBadge && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                                {banner.offerBadge}
                              </span>
                            )}
                          </div>
                          {banner.heading ? (
                            <p className="text-slate-600 text-[11px] line-clamp-1 font-medium">
                              "{banner.heading}"
                            </p>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              Image-only banner (No text overlay)
                            </span>
                          )}
                          {banner.subtitle && (
                            <p className="text-slate-400 text-[10px] line-clamp-1">
                              {banner.subtitle}
                            </p>
                          )}
                          {(banner.startDate || banner.endDate) && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium pt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Schedule: {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'Now'} →{' '}
                                {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Ongoing'}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* CTA Info */}
                      <td className="py-3.5 px-4">
                        {banner.ctaText ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {banner.ctaText}
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                            </span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              Link: {banner.ctaLink || 'all-programs'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>

                      {/* Mobile Image */}
                      <td className="py-3.5 px-4">
                        {banner.mobileImage ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-900">
                              <img
                                src={banner.mobileImage}
                                alt="Mobile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Separate (1080×450)
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Fallback to desktop image
                          </span>
                        )}
                      </td>

                      {/* Active Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          id={`toggle-banner-status-${banner.id}`}
                          onClick={() => toggleHeroBannerStatus(banner.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            banner.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              banner.active ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{banner.active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            id={`edit-banner-btn-${banner.id}`}
                            onClick={() => handleOpenEdit(banner)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Banner"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            id={`delete-banner-btn-${banner.id}`}
                            onClick={() => setBannerToDelete(banner)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT BANNER MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {editingBannerId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingBannerId ? 'Edit Hero Promotional Banner' : 'Add New Hero Promotional Banner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Desktop 1920 × 250 px recommended • Automatic 5s Carousel Transition
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Quick Preset Samples */}
              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Quick Fill from Template Presets:
                  </span>
                  <span className="text-[10px] text-blue-600">Click any preset to auto-fill</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presetSamples.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          title: preset.label,
                          desktopImage: preset.desktop,
                          mobileImage: preset.mobile,
                          heading: preset.heading,
                          subtitle: preset.subtitle,
                          offerBadge: preset.badge,
                          ctaText: preset.cta,
                          ctaLink: preset.link,
                        }));
                        setDesktopDimWarning(null);
                        setMobileDimWarning(null);
                        showToast(`Applied preset: ${preset.label}`, 'info');
                      }}
                      className="p-2 rounded-lg bg-white border border-blue-200/80 hover:border-blue-500 hover:shadow-xs text-left transition-all cursor-pointer group"
                    >
                      <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1 block">
                        {preset.label}
                      </span>
                      <span className="text-[9px] text-slate-500 line-clamp-1 block mt-0.5">
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  1. Banner Identification & Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Banner Name / Internal Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="banner-title-input"
                      type="text"
                      required
                      placeholder="e.g. Summer 2025 Placement Drive"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Display Order (Position)
                    </label>
                    <input
                      id="banner-order-input"
                      type="number"
                      min={1}
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="banner-active-checkbox"
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Active (Show in Public Hero Carousel)
                    </span>
                  </label>
                </div>
              </div>

              {/* 2. Desktop & Mobile Image Uploads */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. Responsive Banner Images
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Desktop: 1920 × 250 px • Mobile: 1080 × 450 px
                  </span>
                </div>

                {/* Desktop Image Section */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-blue-600" />
                      <span>Desktop Banner Image (1920 × 250 px)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={desktopFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file, 'desktop');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => desktopFileInputRef.current?.click()}
                      className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3 h-3 text-blue-600" />
                      <span>Upload File</span>
                    </button>
                  </div>

                  <input
                    id="banner-desktop-image-input"
                    type="url"
                    required
                    placeholder="https://... or upload image"
                    value={formData.desktopImage}
                    onChange={(e) => {
                      setFormData({ ...formData, desktopImage: e.target.value });
                      setDesktopDimWarning(null);
                    }}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />

                  {/* Desktop Image Preview & Warnings */}
                  {formData.desktopImage && (
                    <div className="mt-2 space-y-1.5">
                      <div className="h-16 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
                        <img
                          src={formData.desktopImage}
                          alt="Desktop Banner Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-[9px] text-white rounded font-mono">
                          Desktop Preview (1920×250 Ratio)
                        </span>
                      </div>
                      {detectedDesktopDims && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          Image Resolution: {detectedDesktopDims}
                        </p>
                      )}
                      {desktopDimWarning && (
                        <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{desktopDimWarning}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Image Section */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mobile Banner Image (1080 × 450 px)</span>
                      </label>
                      <span className="text-[10px] text-slate-400 block">
                        Optional: If omitted, the desktop image will be automatically used on mobile.
                      </span>
                    </div>
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file, 'mobile');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => mobileFileInputRef.current?.click()}
                      className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3 h-3 text-emerald-600" />
                      <span>Upload Mobile File</span>
                    </button>
                  </div>

                  <input
                    id="banner-mobile-image-input"
                    type="url"
                    placeholder="https://... (Optional mobile companion image)"
                    value={formData.mobileImage}
                    onChange={(e) => {
                      setFormData({ ...formData, mobileImage: e.target.value });
                      setMobileDimWarning(null);
                    }}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />

                  {formData.mobileImage && (
                    <div className="mt-2 space-y-1.5">
                      <div className="h-16 w-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
                        <img
                          src={formData.mobileImage}
                          alt="Mobile Banner Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 right-1 px-1 py-0.5 bg-black/70 backdrop-blur-xs text-[8px] text-white rounded font-mono">
                          Mobile (1080×450)
                        </span>
                      </div>
                      {detectedMobileDims && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          Image Resolution: {detectedMobileDims}
                        </p>
                      )}
                      {mobileDimWarning && (
                        <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{mobileDimWarning}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Optional Overlay Text & CTA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3. Optional Overlay Text & Action Link
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Leave blank if text is already inside your image graphic
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Overlay Heading (Optional)
                    </label>
                    <input
                      id="banner-heading-input"
                      type="text"
                      placeholder="e.g. Summer 2025 Internship Drive"
                      value={formData.heading}
                      onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Offer / Category Badge (Optional)
                    </label>
                    <input
                      id="banner-badge-input"
                      type="text"
                      placeholder="e.g. Flat 50% Off • Batch 2025"
                      value={formData.offerBadge}
                      onChange={(e) => setFormData({ ...formData, offerBadge: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Subtitle / Description (Optional)
                  </label>
                  <input
                    id="banner-subtitle-input"
                    type="text"
                    placeholder="e.g. Guaranteed stipends and live capstone projects with top tech partners"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      CTA Button Text (Optional)
                    </label>
                    <input
                      id="banner-cta-text-input"
                      type="text"
                      placeholder="e.g. Explore Internships"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      CTA Destination / View Target
                    </label>
                    <select
                      id="banner-cta-link-select"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                      <option value="all-programs">All Programs / Internships / Courses</option>
                      <option value="student-certificates">Certificates Verification</option>
                      <option value="programs">Programs View</option>
                      <option value="courses">Courses View</option>
                      <option value="messages">Messages</option>
                      <option value="notifications">Notifications</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Overlay Style
                    </label>
                    <select
                      id="banner-overlay-mode-select"
                      value={formData.overlayMode}
                      onChange={(e) => setFormData({ ...formData, overlayMode: e.target.value as any })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                      <option value="gradient">Gradient Overlay (Dark left to transparent right - Best for text legibility)</option>
                      <option value="dark">Dark Shading</option>
                      <option value="clean">Light Soft Shade</option>
                      <option value="none">No Overlay (Pure raw image)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Schedule Start Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="banner-save-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBannerId ? 'Save Banner Changes' : 'Create Hero Banner'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION SAFETY MODAL */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Permanently Delete Hero Banner?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong className="text-slate-800">"{bannerToDelete.title}"</strong>? This will remove it from the public hero carousel immediately.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center gap-3 text-left">
              <div className="w-16 h-8 rounded bg-slate-900 overflow-hidden shrink-0">
                <img
                  src={bannerToDelete.desktopImage}
                  alt={bannerToDelete.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{bannerToDelete.title}</p>
                <p className="text-[10px] text-slate-400">Order #{bannerToDelete.order}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer w-full"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-banner-btn"
                type="button"
                onClick={() => {
                  deleteHeroBanner(bannerToDelete.id);
                  setBannerToDelete(null);
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer w-full"
              >
                Yes, Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
