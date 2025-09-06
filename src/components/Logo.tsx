import React from 'react';
import logoImage from '../images/SYNERGY-removebg-preview.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Image */}
      <img 
        src={logoImage} 
        alt="Synergy Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />

      {/* Text */}
      {showText && (
        <span className={`font-bold text-black ${textSizeClasses[size]}`}>
          Synergy Sphere
        </span>
      )}
    </div>
  );
};

export default Logo;
