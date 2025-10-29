
import { Stage, Layer as KonvaLayer } from "react-konva";
import { useEditorStore } from "@/lib/store";
import CanvasImage from "./CanvasImage";
import { CropOverlay } from "./CropOverlay";
import { useState } from "react";
import { Check } from "lucide-react";

interface EditorCanvasProps {
  stageRef: React.RefObject<any>;
}

const EditorCanvas = ({ stageRef }: EditorCanvasProps) => {
  const layers = useEditorStore((state) => state.layers);
  const { cropMode, selectedLayerId } = useEditorStore();
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  // for removing that bounding box while exporting
  const [exporting, setExporting] = useState(false);

  const applyCrop = () => {
    const { layers, updateLayer, setCropMode } = useEditorStore.getState();
    const layer = layers.find((l) => l.id === selectedLayer?.id);
    if (!layer || !layer.cropRect) return;

    const rect = layer.cropRect;
    updateLayer(layer.id, {
      cropX: rect.x - layer.x + layer.width / 2,
      cropY: rect.y - layer.y + layer.height / 2,
      cropW: rect.width,
      cropH: rect.height,
    });

    setCropMode(false);
  };

  return (
    <div className="relative">
      <Stage 
        width={800} 
        height={600} 
        className="bg-white border border-slate-200 rounded-lg shadow-sm" 
        ref={stageRef}
      >
        <KonvaLayer>
          {layers
            .slice()
            .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
            .filter(layer => layer.visible)
            .map((layer) => (
              <CanvasImage key={layer.id} layer={layer} />
            ))}
          {cropMode && selectedLayer && selectedLayer.type === "IMAGE" && (
            <CropOverlay imageLayer={selectedLayer} />
          )}
        </KonvaLayer>
      </Stage>

      {cropMode && selectedLayer && selectedLayer.type === "IMAGE" && (
        <button
          className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-lg"
          onClick={applyCrop}
        >
          <Check className="w-4 h-4" />
          Apply Crop
        </button>
      )}
    </div>
  );
};

export default EditorCanvas;