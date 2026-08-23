'use client';

import type React from 'react';
import { useRef, useState, useEffect } from 'react';

import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedBorderButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  borderColor?: string;
  borderWidth?: number;
  animationDuration?: number;
  gap?: number;
  rounded?: 'md' | 'full';
  asChild?: boolean;
  wrapperClassName?: string;
  disabled?: boolean;
}

export default function AnimatedBorderButton({
  children,
  className,
  onClick,
  borderColor = 'var(--primary)',
  borderWidth = 2,
  animationDuration = 0.25,
  rounded = 'full',
  asChild = false,
  wrapperClassName,
  disabled,
}: AnimatedBorderButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathRef = useRef<SVGRectElement>(null);
  const [, setPathLength] = useState(0);

  const borderRadius = rounded === 'full' ? '32' : '6';

  // Calculate the path length once the component mounts
  useEffect(() => {
    if (pathRef.current) {
      // const length = pathRef.current.getTotalLength();
      const length =
        pathRef.current.getBBox().width * 2 +
        pathRef.current.getBBox().height * 2;
      setPathLength(length);
    }
  }, []);

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-transform',
        wrapperClassName,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer SVG Border */}
      <div className="pointer-events-none absolute -inset-1">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <motion.rect
            ref={pathRef}
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={`calc(100% - ${borderWidth}px)`}
            height={`calc(100% - ${borderWidth}px)`}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke={borderColor}
            strokeWidth={borderWidth}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1 : 0 }}
            transition={{ duration: animationDuration, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <Button
        size="lg"
        className={cn(
          'w-full',
          rounded === 'full' ? 'rounded-full' : 'rounded-md',
          className,
        )}
        asChild={asChild}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </div>
  );
}
