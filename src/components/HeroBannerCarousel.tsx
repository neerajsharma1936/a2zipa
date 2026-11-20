import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerCarouselProps {
  className?: string;
}

export const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({ className = '' }) => {
  const { heroBanners, navigateTo } = useApp();

  // Filter active banners and check scheduling dates if present
  const now = new Date();
  const activeBanners = heroBanners
    .filter((banner) => {
      if (!banner.active) return false;
      if (banner.startDate && new Date(banner.startDate) > now) return false;
      if (banner.endDate && new Date(banner.endDate) < now) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const bannerCount = activeBanners.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Touch swipe support for mobile devices
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep currentIndex in bounds if banners change
  useEffect(() => {
    if (currentIndex >= bannerCount) {
      setCurrentIndex(0);
    }
  }, [bannerCount, currentIndex]);

  const goToNext = useCallback(() => {
    if (bannerCount <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % bannerCount);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [bannerCount, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (bannerCount <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + bannerCount) % bannerCount);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [bannerCount, isTransitioning]);

  const goToIndex = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Automatic sliding every 5 seconds (5000ms), paused on hover
  useEffect(() => {
    if (bannerCount <= 1 || isHovered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [bannerCount, isHovered, goToNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null) {
      if (touchDeltaXRef.current < -45) {
        goToNext();
      } else if (touchDeltaXRef.current > 45) {
        goToPrev();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  // Banner CTA / Click navigation
  const handleBannerClick = (banner: HeroBanner, e?: React.MouseEvent) => {
    const destination = banner.ctaLink?.trim();
    if (!destination) return;

    if (destination.startsWith('http://') || destination.startsWith('https://')) {
      window.open(destination, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo(destination);
    }
  };

  if (bannerCount === 0) {
    return null;
  }

  return (
    <section
      id="hero-banner-section"
      aria-label="Promotional Hero Banner Carousel"
      className={`relative w-full overflow-hidden bg-slate-950 select-none group ${className}`}
      style={{ margin: 0, padding: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        Expanded banner height for higher visual impact across screens:
        - Mobile: 220px to 260px
        - Tablet/Medium: 320px to 380px
        - Desktop/Large: 420px to 460px
      */}
      <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[460px] overflow-hidden">
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          const hasTextContent = Boolean(
            banner.heading?.trim() ||
            banner.subtitle?.trim() ||
            banner.offerBadge?.trim() ||
            banner.ctaText?.trim()
          );

          return (
            <div
              key={banner.id}
              id={`hero-slide-${banner.id}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-600 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Responsive Picture: Uses mobile image on screens <= 640px if available */}
              <picture className="w-full h-full block">
                {banner.mobileImage && (
                  <source media="(max-width: 640px)" srcSet={banner.mobileImage} />
                )}
                <img
                  src={banner.desktopImage}
                  alt={banner.title || 'Promotional Hero Banner'}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </picture>

              {/* Optional Overlays based on configuration */}
              {hasTextContent && banner.overlayMode !== 'none' && (
                <div
                  className={`absolute inset-0 transition-opacity ${
                    banner.overlayMode === 'dark'
                      ? 'bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent'
                      : banner.overlayMode === 'clean'
                      ? 'bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent'
                      : 'bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-transparent'
                  }`}
                />
              )}

              {/* Clickable Area and Safe Area Content */}
              <div
                onClick={(e) => {
                  // If clicking the slide area without specific button target, navigate to link
                  if (banner.ctaLink) {
                    handleBannerClick(banner, e);
                  }
                }}
                className={`absolute inset-0 w-full h-full ${
                  banner.ctaLink ? 'cursor-pointer' : ''
                }`}
              >
                {hasTextContent ? (
                  <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-left relative z-20 overflow-hidden">
                    <div className="max-w-xl lg:max-w-2xl max-h-full overflow-hidden space-y-1.5 sm:space-y-2.5 py-2">
                      {/* Offer / Category Badge */}
                      {banner.offerBadge && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#004B87]/90 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-sm ring-1 ring-white/20 truncate max-w-full">
                          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300 animate-pulse shrink-0" />
                          <span className="truncate">{banner.offerBadge}</span>
                        </div>
                      )}

                      {/* Heading */}
                      {banner.heading && (
                        <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug line-clamp-2 break-words drop-shadow-md">
                          {banner.heading}
                        </h2>
                      )}

                      {/* Subtitle */}
                      {banner.subtitle && (
                        <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 break-words font-normal leading-relaxed drop-shadow">
                          {banner.subtitle}
                        </p>
                      )}

                      {/* CTA Button */}
                      {banner.ctaText && (
                        <div className="pt-1 sm:pt-2">
                          <button
                            id={`hero-cta-btn-${banner.id}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBannerClick(banner, e);
                            }}
                            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#004B87] hover:bg-[#003B6D] active:bg-[#002D54] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-950/40 transition-all transform hover:-translate-y-0.5 cursor-pointer truncate max-w-full"
                          >
                            <span className="truncate">{banner.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // For purely graphical banners (text already baked into image), provide a full-bleed clickable hot-zone
                  <div className="w-full h-full" title={banner.title} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls: Only render if more than 1 banner exists */}
      {bannerCount > 1 && (
        <>
          {/* Previous Arrow Button */}
          <button
            id="hero-carousel-prev-btn"
            type="button"
            aria-label="Previous Banner Slide"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all opacity-70 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer focus:opacity-100 focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Next Arrow Button */}
          <button
            id="hero-carousel-next-btn"
            type="button"
            aria-label="Next Banner Slide"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all opacity-70 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer focus:opacity-100 focus:outline-none"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Carousel Indicator Dots */}
          <div
            id="hero-carousel-dots"
            className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10"
          >
            {activeBanners.map((banner, dotIndex) => {
              const isDotActive = dotIndex === currentIndex;
              return (
                <button
                  key={banner.id}
                  id={`hero-dot-${dotIndex}`}
                  type="button"
                  aria-label={`Go to slide ${dotIndex + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(dotIndex);
                  }}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    isDotActive
                      ? 'w-6 sm:w-7 h-1.5 sm:h-2 bg-blue-500 shadow-sm shadow-blue-500/50'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
