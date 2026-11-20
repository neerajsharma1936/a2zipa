import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { Radio, Sparkles, ExternalLink, ChevronRight, Bell } from 'lucide-react';

interface NewsTickerProps {
  className?: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ className = '' }) => {
  const { announcements, tickerSettings, navigateTo } = useApp();

  // Filter active and scheduled announcements
  const activeAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements
      .filter((item) => {
        if (!item.isActive) return false;
        if (item.startDate) {
          const start = new Date(item.startDate);
          if (!isNaN(start.getTime()) && start > now) return false;
        }
        if (item.expiryDate) {
          const expiry = new Date(item.expiryDate);
          if (!isNaN(expiry.getTime()) && expiry < now) return false;
        }
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }, [announcements]);

  // Hide ticker if globally disabled or if there are no active announcements
  if (!tickerSettings.isVisible || activeAnnouncements.length === 0) {
    return null;
  }

  // Calculate speed duration in seconds - calibrated for ultra-smooth, slow, comfortable news crawl
  const getSpeedDuration = () => {
    switch (tickerSettings.scrollSpeed) {
      case 'slow':
        return '220s';
      case 'fast':
        return '90s';
      case 'normal':
      default:
        return '150s';
    }
  };

  // Ensure enough items to span wide screens seamlessly with two identical halves
  const baseItems = useMemo(() => {
    if (activeAnnouncements.length === 0) return [];
    if (activeAnnouncements.length === 1) {
      return [...activeAnnouncements, ...activeAnnouncements, ...activeAnnouncements, ...activeAnnouncements];
    }
    if (activeAnnouncements.length === 2) {
      return [...activeAnnouncements, ...activeAnnouncements];
    }
    return activeAnnouncements;
  }, [activeAnnouncements]);

  const handleItemClick = (item: Announcement) => {
    if (!item.link) return;
    if (item.link.startsWith('http://') || item.link.startsWith('https://')) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo(item.link);
    }
  };

  const isLeftToRight = tickerSettings.scrollDirection === 'right';

  // Deep Azure Blue background (#004B87) and pure white text defaults
  const effectiveBgColor =
    !tickerSettings.bgColor ||
    tickerSettings.bgColor === '#0B1528' ||
    tickerSettings.bgColor === '#0C2D6B'
      ? '#004B87'
      : tickerSettings.bgColor;
  const effectiveTextColor =
    !tickerSettings.textColor || tickerSettings.textColor === '#F8FAFC'
      ? '#FFFFFF'
      : tickerSettings.textColor;

  return (
    <div
      id="news-ticker-container"
      className={`no-print relative w-full overflow-hidden z-30 select-none border-b border-sky-900/60 shadow-md flex items-stretch ${className}`}
      style={{
        backgroundColor: effectiveBgColor,
        color: effectiveTextColor,
      }}
    >
      {/* 1. FIXED LEFT BADGE LABEL (Covers complete height of parent div) */}
      <div
        className="shrink-0 z-20 self-stretch flex items-center gap-1 sm:gap-2 px-2 sm:px-6 font-black text-[10px] sm:text-sm tracking-wider uppercase text-white shadow-xl relative"
        style={{
          backgroundColor: tickerSettings.labelBgColor || '#DC2626',
        }}
      >
        <span className="relative flex h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
        </span>
        <span className="truncate">
          {(() => {
            const label = tickerSettings.labelText || 'LATEST UPDATES';
            const parts = label.split(/\s+/);
            if (parts.length > 1 && parts[0].toUpperCase() === 'LATEST') {
              return (
                <>
                  <span className="hidden sm:inline">{parts[0]} </span>
                  <span>{parts.slice(1).join(' ')}</span>
                </>
              );
            }
            return label;
          })()}
        </span>

        {/* Diagonal cut edge / separator notch */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2.5 sm:w-3 translate-x-full pointer-events-none block h-full z-20"
          style={{
            borderLeft: `10px solid ${tickerSettings.labelBgColor || '#DC2626'}`,
            borderTop: '20px solid transparent',
            borderBottom: '20px solid transparent',
          }}
        />
      </div>

      {/* 2. SCROLLING TICKER TRACK (CONTINUOUS CONVEYOR BELT) */}
      <div
        className={`flex-1 overflow-hidden relative self-stretch flex items-center py-2.5 sm:py-3 ${
          tickerSettings.pauseOnHover ? 'group' : ''
        }`}
        style={{
          backgroundColor: effectiveBgColor,
        }}
      >
        {/* Gradient edge masks matching deep royal blue */}
        <div
          className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${effectiveBgColor}, transparent)`,
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${effectiveBgColor}, transparent)`,
          }}
        />

        {/* Seamless Dual-Track Conveyor Container */}
        <div
          className={`flex items-center whitespace-nowrap will-change-transform subpixel-antialiased ${
            tickerSettings.pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
          }`}
          style={{
            animationName: isLeftToRight ? 'marquee-right' : 'marquee-left',
            animationDuration: getSpeedDuration(),
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {/* Primary Conveyor Set */}
          <div className="flex items-center whitespace-nowrap shrink-0">
            {baseItems.map((item, index) => (
              <div
                key={`primary-${item.id}-${index}`}
                onClick={() => handleItemClick(item)}
                className={`inline-flex items-center gap-2.5 sm:gap-3.5 px-6 text-sm sm:text-[15px] font-medium transition-colors ${
                  item.link ? 'cursor-pointer hover:text-amber-200 hover:underline' : ''
                }`}
              >
                {/* Category Tag */}
                {item.category && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-white/15 text-amber-300 border border-white/20 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{item.category}</span>
                  </span>
                )}

                {/* Title & Message in pure white */}
                <span className="font-extrabold text-white tracking-wide shrink-0">
                  {item.title}:
                </span>
                <span className="text-white font-medium opacity-100">
                  {item.message}
                </span>

                {/* Clickable link icon */}
                {item.link && (
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300 opacity-90 shrink-0 inline-block ml-1" />
                )}

                {/* Dot bullet separator */}
                <span className="mx-5 text-amber-400/80 font-black text-sm select-none">
                  •
                </span>
              </div>
            ))}
          </div>

          {/* Duplicate Conveyor Set (100% Identical for zero-jump continuous loop) */}
          <div className="flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
            {baseItems.map((item, index) => (
              <div
                key={`dup-${item.id}-${index}`}
                onClick={() => handleItemClick(item)}
                className={`inline-flex items-center gap-2.5 sm:gap-3.5 px-6 text-sm sm:text-[15px] font-medium transition-colors ${
                  item.link ? 'cursor-pointer hover:text-amber-200 hover:underline' : ''
                }`}
              >
                {/* Category Tag */}
                {item.category && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-white/15 text-amber-300 border border-white/20 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{item.category}</span>
                  </span>
                )}

                {/* Title & Message in pure white */}
                <span className="font-extrabold text-white tracking-wide shrink-0">
                  {item.title}:
                </span>
                <span className="text-white font-medium opacity-100">
                  {item.message}
                </span>

                {item.link && (
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300 opacity-90 shrink-0 inline-block ml-1" />
                )}

                {/* Dot bullet separator */}
                <span className="mx-5 text-amber-400/80 font-black text-sm select-none">
                  •
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline keyframe definitions for smooth infinite scrolling with translate3d for GPU sharpness */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          #news-ticker-container div {
            animation-duration: 300s !important;
          }
        }
      `}</style>
    </div>
  );
};
