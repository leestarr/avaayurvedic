import React from 'react';
import { Leaf } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="text-emerald-700">
          <Leaf size={28} className="transform rotate-45" />
        </div>
        <div className="absolute inset-0 -ml-2 -mt-1 text-amber-500">
          <Leaf size={24} className="transform -rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default Logo;