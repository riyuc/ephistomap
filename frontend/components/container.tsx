'use client';

import { ReactNode } from 'react';
import Hero from './hero';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
      <div className={cn("relative h-screen", className)}>
        {/* Hero component for the 3D graph */}
        <Hero />
        {children}
      </div>
  );
};

export default Container;
