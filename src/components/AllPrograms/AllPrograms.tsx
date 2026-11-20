import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faCompassDrafting,
  faScrewdriverWrench,
  faBookOpen,
  faGear,
  faCertificate,
  faHelmetSafety,
  faArrowRight,
  faMicrochip,
  faAward,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../context/AppContext';
import './AllPrograms.css';

interface ProgramCardItem {
  id: string;
  themeClass: string;
  title: string;
  subtitle?: string;
  description: string;
  mainIcon: typeof faGraduationCap;
  bottomIcon: typeof faGear;
  accentColor: string;
  gradient: string;
  badgeText: string;
  tagText: string;
  targetView: string;
  targetCategory?: string;
}

export const AllPrograms: React.FC = () => {
  const { navigateTo } = useApp();

  const programCards: ProgramCardItem[] = [
    {
      id: 'b-tech',
      themeClass: 'theme-btech',
      title: 'B TECH',
      description: 'Explore courses, projects and internship opportunities.',
      mainIcon: faGraduationCap,
      bottomIcon: faGear,
      accentColor: '#004B87',
      gradient: 'linear-gradient(135deg, #0077D4 0%, #004B87 100%)',
      badgeText: 'Engineering Core',
      tagText: 'ENGINEERING',
      targetView: 'all-programs',
      targetCategory: 'cs-it',
    },
    {
      id: 'm-tech',
      themeClass: 'theme-mtech',
      title: 'M TECH',
      subtitle: '(POST GRADUATION)',
      description: 'Explore courses, projects and internship opportunities.',
      mainIcon: faMicrochip,
      bottomIcon: faAward,
      accentColor: '#D97706',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
      badgeText: 'Advanced Masters',
      tagText: 'POST GRAD',
      targetView: 'all-programs',
      targetCategory: 'cs-it',
    },
    {
      id: 'diploma',
      themeClass: 'theme-diploma',
      title: 'DIPLOMA',
      description: 'Explore courses, projects and internship opportunities.',
      mainIcon: faCompassDrafting,
      bottomIcon: faCertificate,
      accentColor: '#059669',
      gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      badgeText: 'Certified Skills',
      tagText: 'POLYTECHNIC',
      targetView: 'all-programs',
      targetCategory: 'civil',
    },
    {
      id: 'non-tech',
      themeClass: 'theme-nontech',
      title: 'NON TECH',
      subtitle: '(GRADUATION)',
      description: 'Explore courses, projects and internship opportunities.',
      mainIcon: faBookOpen,
      bottomIcon: faBookOpen,
      accentColor: '#7C3AED',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
      badgeText: 'Degree Track',
      tagText: 'GRADUATION',
      targetView: 'all-programs',
      targetCategory: 'non-technical',
    },
  ];

  const handleCardClick = (card: ProgramCardItem) => {
    if (navigateTo) {
      navigateTo(card.targetView, { category: card.targetCategory });
    }
  };

  return (
    <section
      id="all-programs-section"
      className="our-programs-section"
      aria-label="Our All Programs"
    >
      <div className="our-programs-container">
        {/* 4 CARDS GRID: 2x2 on Mobile, 4 in one row on Desktop */}
        <div className="our-programs-grid" role="list">
          {programCards.map((card) => {
            return (
              <div
                key={card.id}
                role="listitem"
                tabIndex={0}
                onClick={() => handleCardClick(card)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(card);
                  }
                }}
                className={`our-program-card ${card.themeClass} group`}
                aria-label={`${card.title} ${card.subtitle || ''} - ${card.description}`}
              >
                {/* Top Glowing Color Accent Bar */}
                <div className="our-program-top-bar" />

                {/* Subtle Background Watermark Icon */}
                <div
                  className="our-program-watermark"
                  aria-hidden="true"
                >
                  <FontAwesomeIcon icon={card.bottomIcon} />
                </div>

                <div className="our-program-card-content">
                  {/* Top Bar: Vibrant Icon Box + Tag Badge */}
                  <div className="our-program-card-top">
                    <div className="our-program-icon-badge">
                      <FontAwesomeIcon icon={card.mainIcon} className="w-5 h-5 text-white" />
                    </div>
                    <span className="our-program-tag">
                      {card.tagText}
                    </span>
                  </div>

                  {/* Titles */}
                  <div className="our-program-title-wrap">
                    <h3 className="our-program-card-title">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <span className="our-program-card-subtitle">
                        {card.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="our-program-card-desc">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Bar: Decorative Badge + Action Arrow */}
                <div className="our-program-card-bottom">
                  <div
                    className="our-program-bottom-decorative"
                    title={card.badgeText}
                  >
                    <FontAwesomeIcon icon={card.bottomIcon} className="our-program-bottom-icon" />
                    <span className="our-program-badge-label">{card.badgeText}</span>
                  </div>

                  <div
                    className="our-program-arrow-btn"
                    aria-label={`View ${card.title}`}
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="our-program-arrow-icon" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
