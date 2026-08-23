import React from 'react';
import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  wrapperClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  wrapperClassName = '',
}) => {


  return (
    <div className={cn(``, wrapperClassName)}>
      <a href="/" className={cn(`relative block w-56 h-16 lg:w-72 lg:h-20`, className)}>
        <img
          src="/layout/sdmlogo.webp"
          alt="Scott Dillingham Miniatures"
          width={288}
          height={80}
          className="object-contain size-full"
        />
    
     </a>
    </div>
  );
};

export default Logo;
