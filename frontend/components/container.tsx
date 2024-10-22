'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from './ui/aurora-background';
import Hero from './hero';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <AuroraBackground>
      <div className="relative w-full h-screen">
        {/* Hero component for the 3D graph */}
        <Hero>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-4 w-full items-center"
          >
            {children} {/* Render children (Navbar, GitHubRepoForm) */}
          </motion.div>
        </Hero>
      </div>
    </AuroraBackground>
  );
};

export default Container;
