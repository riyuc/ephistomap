// components/container/Container.tsx
'use client';

import React, { ReactNode } from 'react';
import Hero from '@/components/hero/hero';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("relative h-screen overflow-hidden", className)}>
      {/* Hero component for the 3D graph */}
      <Hero />
      {/* Main Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default Container;
