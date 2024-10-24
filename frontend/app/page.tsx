// pages/index.tsx or pages/Home.tsx
'use client';

import React from 'react';
import Container from '@/components/container/container';
import Navbar from '@/components/navbar/navbar';
import ProductDemo from '@/components/product-demo';

const Home: React.FC = () => {
  return (
    <Container>
      <Navbar />
      <ProductDemo />
    </Container>
  );
};

export default Home;
