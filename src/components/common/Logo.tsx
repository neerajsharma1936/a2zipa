import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  // Determine pixel size based on preset or custom number
  const getPixelSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm': return 36;
      case 'md': return 48;
      case 'lg': return 64;
      case 'xl': return 120;
      default: return 48;
    }
  };

  const px = getPixelSize();

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none shrink-0 ${className}`}
    >
      <defs>
        {/* Core Blue Metallic Gradient */}
        <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077D4" />
          <stop offset="50%" stopColor="#005A9C" />
          <stop offset="100%" stopColor="#002D54" />
        </linearGradient>

        {/* Premium Gold/Bronze Metallic Gradient */}
        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="35%" stopColor="#E5B52F" />
          <stop offset="70%" stopColor="#C99418" />
          <stop offset="100%" stopColor="#966D0E" />
        </linearGradient>

        {/* Soft Drop Shadows for Depth */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#001F3B" floodOpacity="0.25" />
        </filter>
        <filter id="goldShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="4" stdDeviation="3" floodColor="#423005" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. TOP SYMBOL: GRADUATION CAP & HANDSHAKE ENCLOSED IN ARCH */}
      <g filter="url(#logoShadow)">
        {/* Arch / Circular Frame enclosing the top */}
        <path
          d="M 120 220 A 150 150 0 0 1 380 220"
          stroke="url(#logoBlueGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 380 220 A 150 150 0 0 1 425 280"
          stroke="url(#logoGoldGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Handshake enclosing Circle */}
        <circle cx="250" cy="110" r="36" fill="white" stroke="url(#logoGoldGrad)" strokeWidth="6" />
        
        {/* Handshake Icon */}
        <path
          d="M 232 114 C 235 110, 240 106, 246 109 L 254 115 C 258 118, 264 112, 268 116"
          stroke="url(#logoGoldGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 268 112 C 265 116, 260 120, 254 117 L 246 111 C 242 108, 236 114, 232 110"
          stroke="url(#logoGoldGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Graduation Academic Cap on top of handshake circle */}
        <path
          d="M 215 62 L 250 48 L 285 62 L 250 76 Z"
          fill="url(#logoBlueGrad)"
          stroke="white"
          strokeWidth="2.5"
        />
        <path
          d="M 230 70 L 230 84 C 230 90, 270 90, 270 84 L 270 70"
          fill="url(#logoBlueGrad)"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Cap Tassel */}
        <path
          d="M 285 62 L 294 72 L 294 82"
          stroke="url(#logoGoldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* 2. BACKGROUND: STYLIZED PROFESSIONAL SILHOUETTES (3 FIGURES) */}
      <g filter="url(#logoShadow)" opacity="0.95">
        {/* Left Professional */}
        <circle cx="175" cy="210" r="28" fill="#94A3B8" />
        <path d="M 135 242 C 135 242, 142 290, 145 320 L 205 320 C 208 290, 215 242, 215 242 Z" fill="#64748B" />
        {/* Left tie & collar */}
        <path d="M 170 242 L 180 242 L 175 258 Z" fill="url(#logoBlueGrad)" />

        {/* Right Professional */}
        <circle cx="325" cy="210" r="28" fill="#94A3B8" />
        <path d="M 285 242 C 285 242, 292 290, 295 320 L 355 320 C 358 290, 365 242, 365 242 Z" fill="#64748B" />
        {/* Right tie & collar */}
        <path d="M 320 242 L 330 242 L 325 258 Z" fill="url(#logoBlueGrad)" />

        {/* Center Leader Professional (larger & primary blue suit) */}
        <circle cx="250" cy="190" r="34" fill="#CBD5E1" stroke="white" strokeWidth="2" />
        <path
          d="M 195 228 C 195 228, 204 290, 208 340 L 292 340 C 296 290, 305 228, 305 228 Z"
          fill="url(#logoBlueGrad)"
          stroke="white"
          strokeWidth="2.5"
        />
        {/* Center white shirt collar */}
        <path d="M 235 228 L 265 228 L 250 250 Z" fill="white" />
        {/* Center blue tie */}
        <path d="M 246 235 L 254 235 L 252 285 L 248 285 Z" fill="#1D4ED8" />
      </g>

      {/* 3. FOREGROUND: BRAND NAME "A2Z" WITH GOLD ACCENT */}
      {/* Letter 'A' */}
      <path
        d="M 50 440 L 115 300 L 165 300 L 230 440 L 175 440 L 160 405 L 120 405 L 105 440 Z M 128 385 L 152 385 L 140 330 Z"
        fill="url(#logoBlueGrad)"
        filter="url(#logoShadow)"
      />

      {/* Golden Letter '2' (Sleek metallic bevel style) */}
      <path
        d="M 196 332 C 196 308, 232 295, 255 295 C 285 295, 308 312, 308 338 C 308 368, 268 395, 235 415 L 310 415 L 310 445 L 190 445 L 190 425 C 215 402, 274 358, 274 338 C 274 326, 265 318, 252 318 C 235 318, 226 328, 224 338 Z"
        fill="url(#logoGoldGrad)"
        filter="url(#goldShadow)"
      />

      {/* Letter 'Z' */}
      <path
        d="M 300 300 L 415 300 L 415 335 L 340 410 L 420 410 L 420 445 L 295 445 L 295 410 L 372 335 L 300 335 Z"
        fill="url(#logoBlueGrad)"
        filter="url(#logoShadow)"
      />

      {/* 4. DYNAMIC SWOOSHING GOLDEN ARROW (UPWARD MOMENTUM) */}
      <g filter="url(#goldShadow)">
        {/* Curved swoosh wrapping around the bottom and right */}
        <path
          d="M 30 380 C 100 450, 240 460, 310 435 C 380 410, 440 340, 470 270"
          stroke="url(#logoGoldGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrow Head pointing up-right */}
        <path
          d="M 445 282 L 485 252 L 480 304 Z"
          fill="url(#logoGoldGrad)"
        />
      </g>
    </svg>
  );
};
