import { useTheme } from '../contexts/ThemeContext';

interface CheckItLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function CheckItLogo({ size = 'md', showText = true, className = '' }: CheckItLogoProps) {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background rounded square */}
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="20"
            fill={isDark ? "#10B981" : "#059669"}
            className="transition-colors duration-300"
          />
          
          {/* Inner dark area */}
          <rect
            x="20"
            y="25"
            width="60"
            height="60"
            rx="15"
            fill={isDark ? "#1F2937" : "#111827"}
            className="transition-colors duration-300"
          />
          
          {/* Large checkmark */}
          <path
            d="M30 50 L42 62 L70 34"
            stroke={isDark ? "#34D399" : "#10B981"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="transition-colors duration-300"
          />
          
          {/* Small checkmark */}
          <path
            d="M30 65 L35 70 L45 60"
            stroke={isDark ? "#34D399" : "#10B981"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="transition-colors duration-300"
          />
          
          {/* Lines representing text */}
          <rect
            x="50"
            y="48"
            width="25"
            height="3"
            rx="1.5"
            fill={isDark ? "#10B981" : "#059669"}
            className="transition-colors duration-300"
          />
          <rect
            x="50"
            y="55"
            width="20"
            height="3"
            rx="1.5"
            fill={isDark ? "#10B981" : "#059669"}
            className="transition-colors duration-300"
          />
          <rect
            x="48"
            y="68"
            width="15"
            height="2"
            rx="1"
            fill={isDark ? "#10B981" : "#059669"}
            className="transition-colors duration-300"
          />
          <rect
            x="48"
            y="73"
            width="20"
            height="2"
            rx="1"
            fill={isDark ? "#10B981" : "#059669"}
            className="transition-colors duration-300"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <h1 
          className={`
            font-bold tracking-tight transition-colors duration-300
            ${textSizeClasses[size]}
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}
        >
          CheckIt
        </h1>
      )}
    </div>
  );
}