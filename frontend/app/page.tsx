'use client';

import React from 'react';
import Navbar from '@/components/navbar/navbar';
import ProductDemo from '@/components/product-demo';
import { AuroraBackground } from '@/components/ui/aurora-background';
import Hero from '@/components/hero/hero';

export default function Home() {
  return (
    <AuroraBackground>
        <Navbar />
        <Hero />
        {/* <ProductDemo /> */}
    </AuroraBackground>
  );
};

