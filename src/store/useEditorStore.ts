import { create } from 'zustand';

export type ModuleType = 'cabinet' | 'drawer' | 'shelf' | 'wall' | 'door' | 'window' | 'pillar' | 'viga' | 'niche' | 'panel';

export interface Module {
  id: string;
  type: ModuleType;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    thickness: number;
  };
  material: string;
  config?: {
    drawers?: number;
    shelves?: number;
    partitions?: number;
    doors?: number;
    doorType?: 'sliding' | 'hinged';
    hasHardware?: boolean;
    hardwareType?: string;
    handleType?: string;
    hingeType?: string;
    slideType?: string;
  };
  parentId?: string; // For nesting or snapping to walls
  metadata?: any;
}

export interface Room {
  id: string;
  name: string;
  type: 'kitchen' | 'bedroom' | 'closet' | 'bathroom' | 'living' | 'office';
  dimensions: { width: number; depth: number; height: number };
}

interface EditorState {
  room: Room | null;
  modules: Module[];
  selectedModuleId: string | null;
  viewMode: '3d' | '2d';
  renderMode: 'standard' | 'realistic';
  showCuttingPlan: boolean;
  showDrillingPlan: boolean;
  showTechnicalDrawing: boolean;
  activeTool: 'select' | 'move' | 'rotate' | 'scale' | 'wall' | 'push-pull';
  
  setRoom: (room: Room) => void;
  addModule: (module: Module) => void;
  removeModule: (id: string) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  selectModule: (id: string | null) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  setRenderMode: (mode: 'standard' | 'realistic') => void;
  setShowCuttingPlan: (show: boolean) => void;
  setShowDrillingPlan: (show: boolean) => void;
  setShowTechnicalDrawing: (show: boolean) => void;
  setActiveTool: (tool: EditorState['activeTool']) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  room: { id: 'default', name: 'Nova Cozinha', type: 'kitchen', dimensions: { width: 5000, depth: 4000, height: 2600 } },
  modules: [],
  selectedModuleId: null,
  viewMode: '3d',
  renderMode: 'standard',
  showCuttingPlan: false,
  showDrillingPlan: false,
  showTechnicalDrawing: false,
  activeTool: 'select',

  setRoom: (room) => set({ room }),
  addModule: (module) => set((state) => ({ modules: [...state.modules, module] })),
  removeModule: (id) => set((state) => ({ modules: state.modules.filter((m) => m.id !== id) })),
  updateModule: (id, updates) =>
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  selectModule: (id) => set({ selectedModuleId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setRenderMode: (mode) => set({ renderMode: mode }),
  setShowCuttingPlan: (show) => set({ showCuttingPlan: show }),
  setShowDrillingPlan: (show) => set({ showDrillingPlan: show }),
  setShowTechnicalDrawing: (show) => set({ showTechnicalDrawing: show }),
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
