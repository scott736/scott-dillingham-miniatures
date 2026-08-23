import React from 'react';

import CategoryBadge from './category-badge';

import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  category: string;
  title: string;
  description: string;
  className?: string;
  icon: React.ReactNode;
  isCenter?: boolean;
}

export default function SectionHeader({
  title,
  icon,
  category,
  description,
  className = '',
  isCenter = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 md:flex-row md:items-end',
        isCenter &&
          'flex-col items-start justify-center md:flex-col md:items-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col gap-6 md:gap-8',
          isCenter && '!gap-3 md:items-center',
        )}
      >
        <CategoryBadge label={category} icon={icon} />
        <h2 className="text-2xl md:text-4xl md:text-balance lg:text-5xl lg:leading-14">
          {title}
        </h2>
      </div>
      <p
        className={cn(
          'flex-1 text-xl text-pretty md:text-end',
          isCenter && 'text-start md:text-center',
        )}
      >
        {description}
      </p>
    </div>
  );
}
