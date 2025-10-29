import { Rect, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import { useEditorStore } from "@/lib/store";

export const CropOverlay = ({ imageLayer }: { imageLayer: any }) => {
  const rectRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const { updateLayer, setCropMode } = useEditorStore();

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, []);

  const applyCrop = () => {
    const rect = rectRef.current;
    updateLayer(imageLayer.id, {
      cropX: rect.x() - imageLayer.x + imageLayer.width / 2,
      cropY: rect.y() - imageLayer.y + imageLayer.height / 2,
      cropW: rect.width(),
      cropH: rect.height(),
    });
    setCropMode(false);
  };

  return (
    <>
      
      <Rect
    ref={rectRef}
    x={imageLayer.x - imageLayer.width / 4}
    y={imageLayer.y - imageLayer.height / 4}
    width={imageLayer.width / 2}
    height={imageLayer.height / 2}
    stroke="lime"
    dash={[6, 4]}
    draggable
    onDragMove={(e) => {
        const rect = e.target;
        useEditorStore.getState().setCropRect({
        x: rect.x(),
        y: rect.y(),
        width: rect.width(),
        height: rect.height(),
        });
    }}
  onTransformEnd={(e) => {
    const rect = e.target;
    useEditorStore.getState().setCropRect({
      x: rect.x(),
      y: rect.y(),
      width: rect.width() * rect.scaleX(),
      height: rect.height() * rect.scaleY(),
    });
  }}
/>

      <Transformer ref={trRef} />
    </>
  );
};
