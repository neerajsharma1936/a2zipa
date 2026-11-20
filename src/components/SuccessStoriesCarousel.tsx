import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SuccessStoryItem } from '../types';
import { getStoryThemeConfig, initialSuccessStories } from '../data/mockData';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export const SuccessStoriesCarousel: React.FC = () => {
  const { successStories } = useApp();

  // Active items from admin or fallback to defaults
  const activeStories = useMemo(() => {
    const list = (successStories || []).filter((s) => s.active !== false);
    if (list.length === 0) return initialSuccessStories;
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [successStories]);

  // Ensure enough items so track width is comfortably wide on any screen
  const displayStories = useMemo(() => {
    let items = [...activeStories];
    while (items.length < 6) {
      items = [...items, ...activeStories];
    }
    return items;
  }, [activeStories]);

  const trackRef = useRef<HTMLDivElement>(null);
  const primaryTrackRef = useRef<HTMLDivElement>(null);

  // Position & physics state
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragLastXRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Main 60/120fps Animation Loop
  useEffect(() => {
    let lastTime = performance.now();
    const autoSpeed = 0.65; // ~40px per second, pleasant and easily readable

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      const track = trackRef.current;
      const primary = primaryTrackRef.current;

      if (track && primary) {
        const halfWidth = primary.offsetWidth;

        // Auto drift when not hovering or dragging
        if (!isHoveredRef.current && !isDraggingRef.current) {
          targetOffsetRef.current -= autoSpeed * dt;
        }

        // Smooth spring interpolation towards target
        const diff = targetOffsetRef.current - offsetRef.current;
        offsetRef.current += diff * Math.min(0.12 * dt, 1);

        // Infinite Wrap-around math (Works in both directions!)
        if (halfWidth > 0) {
          while (offsetRef.current <= -halfWidth) {
            offsetRef.current += halfWidth;
            targetOffsetRef.current += halfWidth;
          }
          while (offsetRef.current > 0) {
            offsetRef.current -= halfWidth;
            targetOffsetRef.current -= halfWidth;
          }
        }

        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Manual button scroll (shifts by 1 card + gap = 380px)
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    const shift = 380;
    if (direction === 'left') {
      targetOffsetRef.current += shift;
    } else {
      targetOffsetRef.current -= shift;
    }
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragLastXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - dragLastXRef.current;
    dragLastXRef.current = currentX;
    offsetRef.current += delta;
    targetOffsetRef.current += delta;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragLastXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - dragLastXRef.current;
    dragLastXRef.current = e.clientX;
    offsetRef.current += delta;
    targetOffsetRef.current += delta;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="pt-3 sm:pt-4 pb-8 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-[#F5F3FF] border-t border-blue-100/80 overflow-hidden relative group/stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto my-0 py-0 mb-3 sm:mb-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#0F172A] leading-tight my-0 py-0">
            Student <span className="bg-gradient-to-r from-[#004B87] via-[#0077D4] to-indigo-600 bg-clip-text text-transparent">Success Stories</span>
          </h2>
        </div>
      </div>

      {/* Carousel Container with Left & Right Navigation Buttons on Sides */}
      <div className="relative w-full max-w-[1440px] mx-auto px-2 sm:px-4">
        {/* Left Navigation Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-slate-800 border border-slate-200/90 shadow-lg hover:bg-white hover:text-blue-600 hover:border-blue-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          title="Previous Story"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Navigation Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-slate-800 border border-slate-200/90 shadow-lg hover:bg-white hover:text-blue-600 hover:border-blue-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
          title="Next Story"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Truly Infinite Conveyor Belt Track Container */}
        <div
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            isDraggingRef.current = false;
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative w-full overflow-hidden py-2 select-none cursor-grab active:cursor-grabbing"
        >
          {/* Subtle Left & Right Gradient Edge Masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#F0F7FF] via-[#F0F7FF]/80 to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#F5F3FF] via-[#F5F3FF]/80 to-transparent z-20" />

          {/* Continuous Moving Track with Hardware Acceleration */}
          <div
            ref={trackRef}
            className="flex items-stretch py-2 will-change-transform subpixel-antialiased"
            style={{ width: 'max-content' }}
          >
            {/* Primary Track */}
            <div ref={primaryTrackRef} className="flex items-stretch gap-6 pr-6 shrink-0">
              {displayStories.map((story, idx) => (
                <StoryCard key={`primary-${story.id}-${idx}`} story={story} />
              ))}
            </div>

            {/* Duplicate Track (100% Identical clone for mathematical wrap-around) */}
            <div className="flex items-stretch gap-6 pr-6 shrink-0" aria-hidden="true">
              {displayStories.map((story, idx) => (
                <StoryCard key={`dup-${story.id}-${idx}`} story={story} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable Presentation Card for each Testimonial
const StoryCard: React.FC<{ story: SuccessStoryItem }> = ({ story }) => {
  const theme = getStoryThemeConfig(story.theme);

  return (
    <div
      className={`w-[320px] sm:w-[370px] lg:w-[400px] shrink-0 group relative flex flex-col justify-between bg-gradient-to-b ${theme.bg} p-6 sm:p-7 rounded-[24px] border ${theme.border} shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)] transition-all duration-300 hover:-translate-y-1 overflow-hidden select-none`}
    >
      <div className={`absolute top-4 right-5 ${theme.quoteColor} transition-colors pointer-events-none`}>
        <Quote className="w-9 h-9 sm:w-10 sm:h-10 stroke-[1.5]" />
      </div>

      <div>
        {/* Star Ratings & Tag */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-500 shadow-xs">
            {[...Array(story.rating || 5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className={`text-[10px] font-bold ${theme.tagColor} border px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
            {story.companyTag || 'Verified Placement'}
          </span>
        </div>

        {/* Testimonial Quote */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal relative z-10 mb-4">
          {story.quote}
        </p>
      </div>

      {/* Student Details */}
      <div className="pt-3.5 border-t border-slate-200/60 flex items-center gap-3.5">
        <div className="relative shrink-0">
          <img
            src={story.avatar}
            alt={story.name}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ${theme.ringColor} shadow-xs`}
            loading="lazy"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Verified Graduate" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-extrabold text-[#0F172A] tracking-tight truncate">{story.name}</h4>
          <p className={`text-[11px] font-semibold ${theme.roleColor} leading-tight mt-0.5 truncate`}>{story.role}</p>
        </div>
      </div>
    </div>
  );
};
