import {create} from 'zustand';

interface GraphData {
  nodes: Array<{
    id: string;
    type: string; // "File", "Class", "Function"
    name: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: string; // "contains"
  }>;
}

interface GraphState {
  graphData: GraphData | null;
  setGraphData: (data: GraphData) => void;
  clearGraphData: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  graphData: null,
  setGraphData: (data) => set({ graphData: data }),
  clearGraphData: () => set({ graphData: null }),
}));
