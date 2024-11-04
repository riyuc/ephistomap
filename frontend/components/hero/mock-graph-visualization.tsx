'use client';

import React from 'react';

const MockGraphVisualization: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Replace this with your actual graph visualization */}
      <svg width="200" height="200">
        <circle cx="100" cy="100" r="80" stroke="blue" strokeWidth="4" fill="lightblue" />
        <text x="100" y="105" textAnchor="middle" fill="blue" fontSize="20px" fontFamily="Arial" dy=".3em">
          Graph
        </text>
      </svg>
    </div>
  );
};

export default MockGraphVisualization;