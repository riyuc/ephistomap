"use client";

import CytoscapeComponent from "react-cytoscapejs";
import { useGraphStore } from "@/store/graphStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";

cytoscape.use(cola);

export default function GraphVisualization() {
  const graphData = useGraphStore((state) => state.graphData);
  const router = useRouter();

  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    if (!graphData) {
      router.push("/");
      return;
    }

    const cyElements = [
      ...graphData.nodes.map((node) => ({
        data: { id: node.id, label: node.name, type: node.type },
      })),
      ...graphData.edges.map((edge) => ({
        data: { source: edge.source, target: edge.target, label: edge.type },
      })),
    ];

    setElements(cyElements);
  }, [graphData, router]);

  if (!graphData) {
    return null; 
  }

  const stylesheet: Array<cytoscape.Stylesheet> = [
    {
      selector: 'node[type = "File"]',
      style: {
        "background-color": "#B0C4DE",
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
        "color": "#000",
      },
    },
    {
      selector: 'node[type = "Class"]',
      style: {
        "background-color": "#87CEFA",
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
        "color": "#000",
      },
    },
    {
      selector: 'node[type = "Function"]',
      style: {
        "background-color": "#ADD8E6",
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": "12px",
        "color": "#000",
      },
    },
    {
      selector: "edge",
      style: {
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "label": "data(label)",
        "font-size": "10px",
        "color": "#555",
      },
    },
  ];

  const colaLayout = {
    name: "cola",
    maxSimulationTime: 1500, 
    nodeSpacing: function (node: any) {
      return 50;
    },
    edgeLength: 150,
    infinite: false,
  };

  return (
    <div className="flex justify-center mt-8">
      <CytoscapeComponent
        elements={elements}
        style={{ width: "90vw", height: "80vh" }}
        layout={colaLayout}
        stylesheet={stylesheet}
        zoomingEnabled={true}
        userZoomingEnabled={true}
        panningEnabled={true}
        userPanningEnabled={true}
      />
    </div>
  );
}
