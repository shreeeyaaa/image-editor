
"use client";

import React from "react";
import { useEditorStore } from "@/lib/store";
import { ChevronUp, ChevronDown, Eye, EyeOff, Layers } from "lucide-react";

const LayerPanel = () => {
  const layers = useEditorStore((s) => s.layers);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const selectLayer = useEditorStore((s) => s.selectLayer);
  const updateLayer = useEditorStore((s) => s.updateLayer);

  const toggleVisibility = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    updateLayer(id, { visible: !layer.visible });
  };

  const moveLayerUp = (id: string) => {
    const idx = layers.findIndex(l => l.id === id);
    if (idx === -1 || idx === 0) return; 
    const newLayers = [...layers];
    [newLayers[idx].zIndex, newLayers[idx - 1].zIndex] = [newLayers[idx - 1].zIndex, newLayers[idx].zIndex];
    useEditorStore.getState().setLayers(newLayers);
  };

  const moveLayerDown = (id: string) => {
    const idx = layers.findIndex(l => l.id === id);
    if (idx === -1 || idx === layers.length - 1) return; 
    const newLayers = [...layers];
    [newLayers[idx].zIndex, newLayers[idx + 1].zIndex] = [newLayers[idx + 1].zIndex, newLayers[idx].zIndex];
    useEditorStore.getState().setLayers(newLayers);
  };

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="w-64 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Layers
        </h2>
      </div>

      {/* layer list */}
      <div className="p-2 space-y-1">
        {sortedLayers.map((layer) => (
          <div
            key={layer.id}
            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              selectedLayerId === layer.id 
                ? "bg-slate-900 text-white" 
                : "hover:bg-slate-100 text-slate-700"
            }`}
            onClick={() => selectLayer(layer.id)}
          >
            {/* left side layer info */}
            <div className="flex-1 truncate min-w-0">
              <div className="text-sm font-medium truncate">
                {layer.assetId ? `Asset: ${layer.assetId.slice(0, 8)}...` : layer.type}
              </div>
              {!layer.visible && (
                <div className={`text-xs ${selectedLayerId === layer.id ? 'text-red-300' : 'text-red-500'}`}>
                  Hidden
                </div>
              )}
            </div>

            {/* action buttons to the right */}
            <div className="flex items-center gap-1 ml-2">
              <button
                className={`p-1 rounded transition-colors ${
                  selectedLayerId === layer.id
                    ? 'hover:bg-slate-700'
                    : 'hover:bg-slate-200'
                }`}
                title="Move up"
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayerUp(layer.id);
                }}
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                className={`p-1 rounded transition-colors ${
                  selectedLayerId === layer.id
                    ? 'hover:bg-slate-700'
                    : 'hover:bg-slate-200'
                }`}
                title="Move down"
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayerDown(layer.id);
                }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                className={`p-1 rounded transition-colors ${
                  selectedLayerId === layer.id
                    ? 'hover:bg-slate-700'
                    : 'hover:bg-slate-200'
                }`}
                title={layer.visible ? "Hide" : "Show"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(layer.id);
                }}
              >
                {layer.visible ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;