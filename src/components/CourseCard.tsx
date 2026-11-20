import React from 'react';
import { useApp } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPhone } from '@fortawesome/free-solid-svg-icons';
import {
  Trash2,
  Camera,
  Globe,
  EyeOff,
  Sparkles,
  ImagePlus,
  Clock,
  GraduationCap,
  Tag,
  Edit2,
  Copy,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const PLACEHOLDER_COURSE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23F1F5F9"/><circle cx="370" cy="200" r="24" fill="%23CBD5E1"/><path d="M260 340 L360 250 L440 310 L500 260 L580 340 Z" fill="%23CBD5E1"/><text x="400" y="380" font-family="sans-serif" font-size="20" font-weight="bold" fill="%2364748B" text-anchor="middle">No Image Attached</text><text x="400" y="408" font-family="sans-serif" font-size="14" fill="%2394A3B8" text-anchor="middle">Click Image button to add or upload</text></svg>';

export interface CourseCardProps {
  id?: string;
  image?: string;
  title: string;
  category?: string;
  categoryLabel?: string;
  branch?: string;
  degreeType?: string;
  shortDescription?: string;
  description?: string;
  duration?: string;
  eligibility?: string;
  qualification?: string;
  fee?: string;
  status?: 'published' | 'draft';
  badgeBg?: string;
  badgeBorder?: string;
  badgeText?: string;
  showAdminControls?: boolean;
  onViewDetails?: () => void;
  onExploreCourse?: () => void;
  onApplyNow?: () => void;
  onTogglePublish?: () => void;
  onDelete?: () => void;
  onDeleteImage?: () => void;
  onChangeImage?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
  className?: string;
  imageAlt?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  image,
  title,
  category,
  categoryLabel,
  branch,
  degreeType,
  shortDescription,
  description,
  duration,
  eligibility,
  qualification,
  fee,
  status = 'published',
  badgeBg = 'bg-blue-50',
  badgeBorder = 'border-blue-200',
  badgeText = 'text-blue-700',
  showAdminControls = false,
  onViewDetails,
  onExploreCourse,
  onApplyNow,
  onTogglePublish,
  onDelete,
  onDeleteImage,
  onChangeImage,
  onDuplicate,
  onEdit,
  className = '',
  imageAlt,
}) => {
  const cardId = id || `course-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const isPublished = status === 'published';
  const hasImage = Boolean(image && image.trim() && image !== PLACEHOLDER_COURSE_IMAGE);
  const displayImage = hasImage ? (image as string) : PLACEHOLDER_COURSE_IMAGE;

  const displayCategory = categoryLabel || category || 'Program';
  const displayBranch = branch || degreeType || 'Core';
  const displayDuration = duration || '4 Years';
  const displayEligibility = eligibility || qualification || '10+2 with Science';
  const displayFee = fee || 'Scholarship Available';
  const displayDesc =
    shortDescription ||
    (description && description.length > 110 ? `${description.slice(0, 105)}...` : description) ||
    'Comprehensive professional curriculum with practical laboratories & job placement assistance.';

  const { navigateTo } = useApp();

  const handleDetailsClick = () => {
    if (onExploreCourse) {
      onExploreCourse();
    } else if (onViewDetails) {
      onViewDetails();
    }
  };

  const handleApplyClick = () => {
    if (onApplyNow) {
      onApplyNow();
    } else {
      navigateTo('application', { selectedCourse: title });
    }
  };

  return (
    <div
      id={cardId}
      className={`bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.16)] transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col h-full overflow-hidden group relative ${
        !isPublished ? 'ring-2 ring-amber-300/60 bg-amber-50/10' : ''
      } ${className}`}
    >
      {/* Course Image at TOP with fixed aspect ratio */}
      <div className="w-full aspect-[16/10] overflow-hidden rounded-t-2xl relative bg-slate-100 shrink-0">
        <img
          src={displayImage}
          alt={imageAlt || title}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            hasImage ? 'group-hover:scale-105' : 'opacity-85'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges & Overlays */}
        <div className="absolute inset-x-0 top-0 p-2.5 sm:p-3 flex items-center justify-between gap-2 z-10 bg-gradient-to-b from-black/55 via-black/20 to-transparent">
          {/* Category / Degree Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md border ${
              badgeBg && badgeBorder && badgeText
                ? `${badgeBg}/90 ${badgeBorder} ${badgeText}`
                : 'bg-white/90 text-slate-800 border-white/60'
            }`}
          >
            {displayCategory}
          </span>

          {/* Admin Controls Overlay if enabled */}
          {showAdminControls ? (
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-lg">
              {/* Status Toggle */}
              <button
                id={`${cardId}-status-btn`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePublish?.();
                }}
                title={isPublished ? 'Click to Unpublish (Move to Draft)' : 'Click to Publish Program'}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide flex items-center gap-1 transition-all cursor-pointer ${
                  isPublished
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-white animate-pulse' : 'bg-white/80'}`} />
                <span>{isPublished ? 'Published' : 'Draft'}</span>
              </button>

              {/* Change Image */}
              <button
                id={`${cardId}-change-img-btn`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeImage?.();
                }}
                title={hasImage ? 'Change Image' : 'Upload Image'}
                className="p-1 text-slate-200 hover:text-white hover:bg-white/20 rounded-lg transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Delete Image */}
              {hasImage && onDeleteImage && (
                <button
                  id={`${cardId}-delete-img-btn`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage();
                  }}
                  title="Remove Image"
                  className="p-1 text-rose-300 hover:text-white hover:bg-rose-600/90 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/70 text-white backdrop-blur-sm">
              {displayBranch}
            </span>
          )}
        </div>

        {/* Empty image prompt in admin mode */}
        {!hasImage && showAdminControls && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[1px] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-[11px] font-bold text-slate-700 pointer-events-auto">
              <ImagePlus className="w-3.5 h-3.5 text-blue-600" />
              <span>No image attached</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Body with Clean Structured Spacing */}
      <div className="p-3 sm:p-3.5 md:p-3.5 lg:p-4 bg-white flex flex-col justify-between flex-1 gap-2.5 sm:gap-3 min-w-0 overflow-hidden">
        
        {/* Top Info: Title + Short Description */}
        <div className="space-y-1.5 min-w-0">
          {/* Branch Pill + Degree */}
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100 shrink-0">
              {displayBranch}
            </span>
            {degreeType && degreeType !== displayBranch && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                • {degreeType}
              </span>
            )}
          </div>

          {/* Course Title - Fixed min-height for uniform 4-column alignment */}
          <div className="min-h-[2.5rem] sm:min-h-[2.75rem] flex items-center">
            <h3
              onClick={handleDetailsClick}
              className="text-xs sm:text-sm md:text-sm lg:text-base font-bold text-slate-900 line-clamp-2 leading-snug tracking-tight hover:text-[#2563EB] transition-colors cursor-pointer"
              title={title}
            >
              {title}
            </h3>
          </div>

          {/* Short Description - Exactly 2 lines max with clean truncation */}
          <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2rem] sm:min-h-[2.25rem]">
            {displayDesc}
          </p>
        </div>

        {/* Course Metadata (Duration, Eligibility, Fee) */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[11px] font-medium">Duration:</span>
            </span>
            <span className="font-semibold text-slate-800 text-[11px] truncate text-right">
              {displayDuration}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[11px] font-medium">Eligibility:</span>
            </span>
            <span className="font-semibold text-slate-800 text-[11px] truncate text-right" title={displayEligibility}>
              {displayEligibility}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5 min-w-0">
            <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
              <Tag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[11px] font-medium">Fee:</span>
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] truncate text-right">
              {displayFee}
            </span>
          </div>
        </div>

        {/* Admin Management Toolbar (If in Admin Mode) */}
        {showAdminControls && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  title="Edit Course Details"
                  className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}

              {onDuplicate && (
                <button
                  type="button"
                  onClick={onDuplicate}
                  title="Duplicate Course"
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              {onTogglePublish && (
                <button
                  type="button"
                  onClick={onTogglePublish}
                  title={isPublished ? 'Unpublish course' : 'Publish course'}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    isPublished
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                  }`}
                >
                  {isPublished ? <EyeOff className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                  <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  title="Delete Course"
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Public / Standard Action Buttons on the SAME ROW (Desktop & Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-1.5 w-full min-w-0">
          {/* BUTTON 1: Blue filled, White eye icon, "View Details" */}
          <button
            id={`${cardId}-view-btn`}
            type="button"
            onClick={handleDetailsClick}
            className="flex-1 min-w-0 h-8.5 sm:h-9 px-1.5 sm:px-2.5 bg-[#004B87] hover:bg-[#003B6D] active:bg-[#002D54] text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs hover:shadow-md hover:shadow-blue-950/20 transition-all duration-200 cursor-pointer whitespace-nowrap overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#004B87]/50"
          >
            <FontAwesomeIcon icon={faEye} className="text-white text-[10px] sm:text-xs shrink-0" />
            <span className="truncate">View Details</span>
          </button>

          {/* BUTTON 2: White bg, Blue border, Blue phone icon, "Apply Now" */}
          <button
            id={`${cardId}-apply-btn`}
            type="button"
            onClick={handleApplyClick}
            className="flex-1 min-w-0 h-8.5 sm:h-9 px-1.5 sm:px-2.5 bg-white hover:bg-[#004B87] active:bg-[#002D54] text-[#004B87] hover:text-white border border-[#004B87] sm:border-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs hover:shadow-md hover:shadow-blue-950/20 transition-all duration-200 cursor-pointer whitespace-nowrap overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#004B87]/50 group/apply"
          >
            <FontAwesomeIcon icon={faPhone} className="text-[#004B87] group-hover/apply:text-white transition-colors text-[10px] sm:text-xs shrink-0" />
            <span className="truncate">Apply Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};

