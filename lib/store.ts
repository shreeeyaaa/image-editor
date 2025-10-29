import { create } from 'zustand';
import { LayerType } from '@prisma/client';

export interface Layer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  zIndex: number;
  assetId?: string;
  url?: string;
  visible: boolean;
  
  //for static ones

  cropX?: number;
  cropY?: number;
  cropW?: number;
  cropH?: number;
  //adding for dynamic one
  cropRect?: { x: number; y: number; width: number; height: number };

}

interface EditorState {

  designId?: string; 


  layers: Layer[];
  selectedLayerId?: string;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, partial: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  selectLayer: (id?: string) => void;
  // adding crop mode 
  cropMode: boolean;
  setCropMode: (val: boolean) => void;
  cropRect: {                       
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  setCropRect: (rect: { x: number; y: number; width: number; height: number }) => void;
  setDesignId: (id: string) => void;
  setLayers: (layers: Layer[]) => void;
  

  
}

export const useEditorStore = create<EditorState>((set) => ({
  designId: undefined,

  layers: [],
  selectedLayerId: undefined,
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
  updateLayer: (id, partial) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    })),
  deleteLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
    })),
  selectLayer: (id) => set({ selectedLayerId: id }),

  //adding crop mode 
  cropMode: false,
  setCropMode: (val: boolean) => set({ cropMode: val}),

  //apply
//   cropMode: false,
cropRect: null,
// setCropMode: (val: boolean) => set({ cropMode: val }),
setCropRect: (rect: any) => set({ cropRect: rect }),
setDesignId: (id) => set({ designId: id }),
setLayers: (layers: Layer[]) => set({ layers }),
}));


