"use client";

import GraphVisualization from "@/components/graph-visualization";

export default function GraphPage() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-4">Repository Knowledge Graph</h1>
      <GraphVisualization />
    </div>
  );
}
