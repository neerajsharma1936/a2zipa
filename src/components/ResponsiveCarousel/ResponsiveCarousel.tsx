import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { CarouselSlide, carouselSlides as defaultSlides } from './carouselData';
import './ResponsiveCarousel.css';

export interface ResponsiveCarouselProps {
  slides?: CarouselSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
  className?: string;
  variant?: 'hero' | 'standalone';
  onSlideCtaClick?: (slide: CarouselSlide) => void;
}

export const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  slides = defaultSlides,
  autoplay = true,
  autoplayInterval = 5000,
  pauseOnHover = false,
  className = '',
  variant = 'standalone',
  onSlideCtaClick,
}) => {
  const originalCount = slides.length;

  // Build cloned array for smooth infinite looping: [Clone Last, ...Originals, Clone First]
  // Cloned indices:
  // 0: Clone of slides[originalCount - 1]
  // 1: slides[0]
  // ...
  // originalCount: slides[originalCount - 1]
  // originalCount + 1: Clone of slides[0]
  const extendedSlides: (CarouselSlide & { isClone?: boolean; cloneId?: string })[] = [
    { ...slides[originalCount - 1], isClone: true, cloneId: `clone-last-${slides[originalCount - 1].id}` },
    ...slides.map((s) => ({ ...s, isClone: false })),
    { ...slides[0], isClone: true, cloneId: `clone-first-${slides[0].id}` },
  ];

  // Track index: starts at 1 (representing the first original slide)
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Dragging state for mobile swipe and desktop mouse drag
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragCurrentX, setDragCurrentX] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive Gap and Slide ratio (Mobile: 78% center card width leaves ~10% visible on each side)
  const isMobile = containerWidth > 0 && containerWidth < 768;
  const slideRatio = variant === 'hero' ? 0.90 : (isMobile ? 0.78 : 0.80);
  const cardGap = isMobile ? 10 : 18;

  // Measure container width via ResizeObserver
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Compute active original index (0-based) for dots
  let activeDotIndex = 0;
  if (currentIndex <= 0) {
    activeDotIndex = originalCount - 1;
  } else if (currentIndex >= originalCount + 1) {
    activeDotIndex = 0;
  } else {
    activeDotIndex = currentIndex - 1;
  }

  // Navigation handlers
  const goToNext = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      if (prev >= extendedSlides.length - 1) {
        return 1;
      }
      return prev + 1;
    });
  }, [extendedSlides.length]);

  const goToPrev = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return originalCount;
      }
      return prev - 1;
    });
  }, [originalCount]);

  const goToSlide = (slideIndex: number) => {
    setIsAnimating(true);
    setCurrentIndex(slideIndex + 1);
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Autoplay management (every card slides automatic left after 5 seconds)
  const resetAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    const shouldPauseForHover = pauseOnHover && isHovered;
    if (isPlaying && !isDragging && !shouldPauseForHover) {
      autoplayTimerRef.current = setInterval(() => {
        goToNext();
      }, autoplayInterval);
    }
  }, [isPlaying, isHovered, isDragging, pauseOnHover, autoplayInterval, goToNext]);

  useEffect(() => {
    resetAutoplayTimer();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [resetAutoplayTimer, currentIndex]);

  // Handle transition end for seamless infinite loop reset
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Ensure we only respond to track's own transform transition
    if (e.target !== trackRef.current) return;
    if (!e.propertyName.includes('transform')) return;

    if (currentIndex >= extendedSlides.length - 1) {
      // Reached trailing clone -> silently jump to index 1 without animation
      setIsAnimating(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      // Reached leading clone -> silently jump to index originalCount without animation
      setIsAnimating(false);
      setCurrentIndex(originalCount);
    }
  };

  // Failsafe timer: guarantee clone boundary reset even if browser skips transitionend
  useEffect(() => {
    if (currentIndex >= extendedSlides.length - 1) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(1);
      }, 650);
      return () => clearTimeout(timer);
    } else if (currentIndex <= 0) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(originalCount);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, extendedSlides.length, originalCount]);

  // Touch and Mouse Drag handlers
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    isHorizontalSwipeRef.current = null;
    setIsDragging(true);
    setDragStartX(touch.clientX);
    setDragCurrentX(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartXRef.current);
    const diffY = Math.abs(touch.clientY - touchStartYRef.current);

    // Differentiate horizontal swipe from vertical scroll
    if (isHorizontalSwipeRef.current === null) {
      if (diffX > 6 || diffY > 6) {
        isHorizontalSwipeRef.current = diffX >= diffY;
      }
    }

    if (isHorizontalSwipeRef.current === true) {
      setDragCurrentX(touch.clientX);
    } else if (isHorizontalSwipeRef.current === false) {
      // User is intentionally scrolling vertically; release carousel drag
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipeRef.current === false) {
      isHorizontalSwipeRef.current = null;
      setIsDragging(false);
      return;
    }
    isHorizontalSwipeRef.current = null;
    handleDragEnd();
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragCurrentX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const diff = dragCurrentX - dragStartX;
    const threshold = Math.max(30, containerWidth * 0.1);

    if (diff < -threshold) {
      // Swiped Left -> Next Slide
      goToNext();
    } else if (diff > threshold) {
      // Swiped Right -> Prev Slide
      goToPrev();
    } else {
      // Small drag -> snap back
      setIsAnimating(true);
    }

    setIsDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  };

  // Calculate pixel translation
  // To center card `k`:
  // cardWidth = containerWidth * slideRatio
  // cardOffset = k * (cardWidth + cardGap)
  // translateX = (containerWidth - cardWidth) / 2 - cardOffset + dragDelta
  const cardWidth = containerWidth > 0 ? containerWidth * slideRatio : 800;
  const baseTranslate = containerWidth > 0
    ? (containerWidth - cardWidth) / 2 - currentIndex * (cardWidth + cardGap)
    : -currentIndex * 80;
  const dragDelta = isDragging ? dragCurrentX - dragStartX : 0;
  const currentTranslateX = baseTranslate + dragDelta;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlayPause();
    }
  };

  return (
    <section
      className={`ovo-carousel variant-${variant} ${className}`}
      aria-label="Promotional Highlights Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isDragging) handleDragEnd();
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Desktop Prev Button (Shown on hover) */}
      <button
        type="button"
        className="ovo-carousel-nav-btn prev"
        onClick={goToPrev}
        aria-label="Previous promotional slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Desktop Next Button (Shown on hover) */}
      <button
        type="button"
        className="ovo-carousel-nav-btn next"
        onClick={goToNext}
        aria-label="Next promotional slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Viewport */}
      <div
        ref={containerRef}
        className="ovo-carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
      >
        {/* Track: Animates as ONE contiguous DOM container (prevents ghosting) */}
        <ul
          ref={trackRef}
          className={`ovo-carousel-track ${isAnimating && !isDragging ? 'is-animating' : ''} ${
            isDragging ? 'is-dragging' : ''
          }`}
          style={{
            transform: `translate3d(${currentTranslateX}px, 0, 0)`,
            gap: `${cardGap}px`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, idx) => {
            const isMainCard = idx === currentIndex;
            const uniqueKey = slide.isClone ? `${slide.cloneId}-${idx}` : `slide-${slide.id}-${idx}`;

            return (
              <li
                key={uniqueKey}
                className={`ovo-carousel-slide ${isMainCard ? 'is-main-card' : ''}`}
                aria-hidden={!isMainCard}
                style={{
                  width: containerWidth > 0 ? `${cardWidth}px` : `${slideRatio * 100}%`,
                  flex: `0 0 ${containerWidth > 0 ? `${cardWidth}px` : `${slideRatio * 100}%`}`,
                }}
              >
                <div className="ovo-carousel-card">
                  {/* Background Image: Strictly straight, non-distorted */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{ objectPosition: slide.imagePosition || 'center center' }}
                    className="ovo-carousel-image"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      // Fallback to high-res CDN if local file is missing
                      if (slide.fallbackImage && e.currentTarget.src !== slide.fallbackImage) {
                        e.currentTarget.src = slide.fallbackImage;
                      }
                    }}
                  />

                  {/* Top subtle vignette */}
                  <div className="ovo-carousel-top-overlay" />

                  {/* Gradient Overlay for Pristine Contrast */}
                  <div className="ovo-carousel-overlay" />

                  {/* Card Content Overlay */}
                  <div className="ovo-carousel-content">
                    {slide.badge && (
                      <div className="ovo-carousel-badge">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{slide.badge}</span>
                      </div>
                    )}

                    <h3 className="ovo-carousel-title">{slide.title}</h3>

                    <p className="ovo-carousel-description">{slide.description}</p>

                    {slide.secondaryText && (
                      <p className="ovo-carousel-secondary-text">
                        <span>●</span>
                        <span>{slide.secondaryText}</span>
                      </p>
                    )}

                    <div>
                      <a
                        href={slide.buttonLink || '#'}
                        onClick={(e) => {
                          if (onSlideCtaClick) {
                            e.preventDefault();
                            onSlideCtaClick(slide);
                          }
                        }}
                        className="ovo-carousel-cta"
                      >
                        <span>{slide.buttonText || 'Learn more'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Pagination & Control Pill Container */}
      {/* Matches Reference: [ ●  ●  ━━━  ●  ⏸ ] */}
      <div className="ovo-carousel-controls-wrapper">
        <div className="ovo-carousel-controls-pill">
          {/* Pagination dots & active elongated bar */}
          <div className="ovo-carousel-dots" role="tablist" aria-label="Carousel pagination">
            {slides.map((slide, dotIdx) => {
              const isActive = activeDotIndex === dotIdx;
              return (
                <button
                  key={`dot-${slide.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${dotIdx + 1}: ${slide.title}`}
                  className={`ovo-carousel-dot ${isActive ? 'is-active' : ''}`}
                  onClick={() => goToSlide(dotIdx)}
                />
              );
            })}
          </div>

          {/* Pause / Play Button */}
          <button
            type="button"
            id="carousel-pause-play-btn"
            className="ovo-carousel-pause-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause automatic carousel rotation' : 'Resume automatic carousel rotation'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
