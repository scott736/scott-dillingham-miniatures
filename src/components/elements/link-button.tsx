import { ChevronRight } from 'lucide-react';

import AnimatedBorderButton from '@/components/elements/animated-border-button';

interface LinkButtonProps {
  href: string;
  label: string;
  wrapperClassName?: string;
  className?: string;
  iconStyle?: 'default' | 'circle';
}

export default function LinkButton({
  href,
  label,
  wrapperClassName,
  className = '[&_svg]:transition-transform hover:[&_svg]:translate-x-0.5',
  iconStyle = 'default',
}: LinkButtonProps) {
  return (
    <AnimatedBorderButton
      asChild
      wrapperClassName={wrapperClassName}
      className={className}
    >
      <a href={href}>
        {label}
        {iconStyle === 'circle' ? (
          <span className="bg-background text-foreground rounded-full p-2">
            <ChevronRight />
          </span>
        ) : (
          <ChevronRight />
        )}
      </a>
    </AnimatedBorderButton>
  );
}
