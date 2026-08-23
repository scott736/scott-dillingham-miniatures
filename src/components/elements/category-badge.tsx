import React from 'react';

import { Calendar } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  label: string;
  icon?: React.ReactNode;
}

export default function CategoryBadge({
  label,
  icon = <Calendar />,
}: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="[&>svg]:text-muted-foreground flex items-center gap-3 rounded-full py-2 ps-2.5 pe-4 text-xl font-normal [&>svg]:size-5"
    >
      {icon}
      {label}
    </Badge>
  );
}
