import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string
}

const Container: React.FC<ContainerProps> = ({ 
    children,
    className 
}) => {
  return (
    <div className={cn("flex flex-col space-y-16 min-w-screen min-h-screen mx-auto sm:px-6 lg:px-8 bg-gradient-to-bl from-sky-200 via-violet-300 to-red-50", className)}>
      {children}
    </div>
  );
};

export default Container;