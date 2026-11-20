import React from 'react';

interface TopBannerBackgroundProps {
  className?: string;
  heightClass?: string;
}

export const TopBannerBackground: React.FC<TopBannerBackgroundProps> = ({
  className = '',
  heightClass = 'h-[320px] sm:h-[400px] lg:h-[460px]',
}) => {
  return (
    <div
      className={`absolute top-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-0 ${heightClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover object-top"
        viewBox="0 0 1600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Main Background Linear Gradient */}
          <linearGradient id="skyBaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9E4FD" />
            <stop offset="35%" stopColor="#E3F1FD" />
            <stop offset="50%" stopColor="#F4F9FF" />
            <stop offset="70%" stopColor="#E0F0FE" />
            <stop offset="100%" stopColor="#C1E1FD" />
          </linearGradient>

          {/* Central Bright Ambient Light */}
          <radialGradient id="centerGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#EFF7FF" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#D9ECFE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C2E2FD" stopOpacity="0" />
          </radialGradient>

          {/* Left Top Ring Gradients */}
          <linearGradient id="leftRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7EBDF8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#A8D5FC" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="leftRingGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6AAEF7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#BFE0FE" stopOpacity="0.15" />
          </linearGradient>

          {/* Right Top Arch Gradients */}
          <linearGradient id="rightArchGrad1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#76BAF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#BFE0FE" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="rightArchGrad2" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.15" />
          </linearGradient>

          {/* Wave Gradients */}
          <linearGradient id="backWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9BCDFB" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#BCE0FD" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#89C4FA" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="midWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBE4FD" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#EAF4FE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C4E1FD" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="frontWhiteWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#F0F7FE" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>

          {/* Subtle Drop Shadow for Wave Depth */}
          <filter id="waveShadow" x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Base Sky Background */}
        <rect width="1600" height="480" fill="url(#skyBaseGradient)" />

        {/* 2. Central Glow Light Bloom */}
        <rect width="1600" height="480" fill="url(#centerGlow)" />

        {/* 3. Top Left Circular Ring & Arcs */}
        <g id="topLeftCircles">
          {/* Outermost large soft arc */}
          <circle cx="80" cy="10" r="320" fill="url(#leftRingGrad1)" />
          {/* Inner ring layer */}
          <circle cx="10" cy="-20" r="220" fill="url(#leftRingGrad2)" />
          <path
            d="M -50,60 C 20,120 140,160 210,220 C 240,250 250,300 210,340 C 170,380 90,380 10,360 L -50,360 Z"
            fill="#90C8FA"
            fillOpacity="0.22"
          />
        </g>

        {/* 4. Left Dot Grid Matrix (4 rows x 6 cols) */}
        <g id="leftDotGrid" fill="#5B9EF5" fillOpacity="0.55">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <circle
                key={`left-dot-${row}-${col}`}
                cx={20 + col * 18}
                cy={225 + row * 16}
                r="1.75"
              />
            ))
          )}
        </g>

        {/* 5. Top Right Circular Arcs & Layers */}
        <g id="topRightCircles">
          {/* Large top-right circle */}
          <circle cx="1520" cy="-30" r="340" fill="url(#rightArchGrad1)" />
          {/* Overlapping mid circle */}
          <circle cx="1460" cy="240" r="240" fill="url(#rightArchGrad2)" />
          {/* Outer sweeping arch */}
          <circle cx="1580" cy="180" r="300" stroke="#7CBDF8" strokeWidth="2" strokeOpacity="0.3" fill="none" />
        </g>

        {/* 6. Right Dot Grid Matrix (4 rows x 6 cols) */}
        <g id="rightDotGrid" fill="#5B9EF5" fillOpacity="0.55">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <circle
                key={`right-dot-${row}-${col}`}
                cx={1475 + col * 18}
                cy={255 + row * 16}
                r="1.75"
              />
            ))
          )}
        </g>

        {/* 7. Layered Flowing Waves */}
        {/* Deep blue background wave layer */}
        <path
          d="M -20 340 Q 260 270 540 330 T 1120 320 Q 1380 280 1620 340 L 1620 480 L -20 480 Z"
          fill="url(#backWaveGrad)"
        />

        {/* Mid blue wave layer with soft curve */}
        <path
          d="M -20 370 Q 320 280 680 340 T 1320 320 Q 1480 340 1620 370 L 1620 480 L -20 480 Z"
          fill="url(#midWaveGrad)"
          filter="url(#waveShadow)"
        />

        {/* Distinct sweeping translucent wave ribbon across bottom */}
        <path
          d="M -20 310 C 220 300 360 410 680 430 C 1040 450 1280 340 1620 390 L 1620 480 L -20 480 Z"
          fill="#86BFF7"
          fillOpacity="0.25"
        />

        {/* Front Crisp White Flowing Wave Ribbon */}
        <path
          d="M -20 385 C 240 315 480 435 840 430 C 1180 425 1400 345 1620 365 L 1620 480 L -20 480 Z"
          fill="url(#frontWhiteWave)"
        />

        {/* Bottom smooth fade to content background */}
        <rect y="440" width="1600" height="40" fill="url(#frontWhiteWave)" fillOpacity="0.75" />
      </svg>
    </div>
  );
};
