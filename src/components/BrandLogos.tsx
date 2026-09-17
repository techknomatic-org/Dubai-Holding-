import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'white' | 'color' | 'bw-dark' | 'bw-light' | string;
}

export const DubaiHoldingLogo: React.FC<LogoProps> = ({ className = 'h-8', theme = 'white' }) => {
  const isDark = theme === 'color' || theme === 'bw-dark';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subTextColor = isDark ? '#94A3B8' : '#5C656E';
  const checkColor = '#E31B23';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 118 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Red Checkmark Accent on the letter A in DUBAI */}
        <path
          d="M93 17 L100 25 L116 5 L108 5 L98 20 L94 15 Z"
          fill={checkColor}
        />

        {/* D */}
        <text
          x="2"
          y="26"
          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="24"
          letterSpacing="1.5"
          fill={textColor}
        >
          D
        </text>

        {/* U */}
        <text
          x="23"
          y="26"
          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="24"
          letterSpacing="1.5"
          fill={textColor}
        >
          U
        </text>

        {/* B */}
        <text
          x="45"
          y="26"
          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="24"
          letterSpacing="1.5"
          fill={textColor}
        >
          B
        </text>

        {/* A (with checkmark apex) */}
        <path
          d="M66 26 L72 10 L76 10 L82 26 L77 26 L75 20 L70 20 L68.5 26 Z M71.5 16 L73.5 16 L72.5 13 Z"
          fill={textColor}
        />

        {/* I */}
        <text
          x="86"
          y="26"
          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="24"
          letterSpacing="1.5"
          fill={textColor}
        >
          I
        </text>

        {/* HOLDING */}
        <text
          x="2"
          y="42"
          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
          fontWeight="700"
          fontSize="13.5"
          letterSpacing="3.5"
          fill={subTextColor}
        >
          HOLDING
        </text>
      </svg>
    </div>
  );
};

export const TechMahindraLogo: React.FC<LogoProps> = ({ className = 'h-6', theme = 'white' }) => {
  const isDark = theme === 'color' || theme === 'bw-dark';
  const techColor = isDark ? '#A1A1AA' : '#5D5D5D';
  const mahindraColor = '#E31837';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 102 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Tech */}
        <text
          x="1"
          y="18"
          fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="0.5"
          fill={techColor}
        >
          Tech
        </text>

        {/* Mahindra */}
        <text
          x="1"
          y="38"
          fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="0.5"
          fill={mahindraColor}
        >
          Mahindra
        </text>
      </svg>
    </div>
  );
};

export const DualBrandHeaderLogo: React.FC<LogoProps> = ({ className = 'h-8', theme = 'white' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <DubaiHoldingLogo className="h-8" theme={theme} />
      <div className="h-5 w-[1px] bg-slate-300 dark:bg-white/20 opacity-60" />
      <TechMahindraLogo className="h-6" theme={theme} />
    </div>
  );
};
