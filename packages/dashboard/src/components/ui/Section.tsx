import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-20", className)}>
      <div className={cn("max-w-[1200px] mx-auto px-6", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
