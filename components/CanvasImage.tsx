

"use client";

import { Image as KonvaImage, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import useImage from "use-image";
import { useEditorStore } from "@/lib/store";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const CanvasImage = ({ layer }: { layer: any }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const selectLayer = useEditorStore((s) => s.selectLayer);
  const updateLayer = useEditorStore((s) => s.updateLayer);

  const [image] = useImage(layer.url || "");

 


  // Show transformer if selected
  useEffect(() => {
    if (layer.id === selectedLayerId && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedLayerId, layer.id]);

  if (!image) return null;

  // actual image dimensions
  const origWidth = image.width;
  const origHeight = image.height;

  // initial display size if layer doesn't have h/w 
  let displayWidth = layer.width;
  let displayHeight = layer.height;

  if (!displayWidth || !displayHeight) {
    // scaling for initial load
    const widthRatio = CANVAS_WIDTH / origWidth;
    const heightRatio = CANVAS_HEIGHT / origHeight;
    const scale = Math.min(widthRatio, heightRatio, 1) * 0.8; 
    displayWidth = origWidth * scale;
    displayHeight = origHeight * scale;
  }

  //cropping portion
  const cropX = layer.cropX ?? 0;
  const cropY = layer.cropY ?? 0;
  const cropWidth = layer.cropW ?? origWidth;
  const cropHeight = layer.cropH ?? origHeight;

  // aspect ratio
  const cropAspectRatio = cropWidth / cropHeight;

  const displayAspectRatio = displayWidth / displayHeight;
  let finalWidth = displayWidth;
  let finalHeight = displayHeight;

  if (cropAspectRatio !== displayAspectRatio) {
    if (cropAspectRatio > displayAspectRatio) {
      finalHeight = displayWidth / cropAspectRatio;
    } else {
      finalWidth = displayHeight * cropAspectRatio;
    }
  }

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        
        x={layer.x ?? CANVAS_WIDTH / 2}
        y={layer.y ?? CANVAS_HEIGHT / 2}
        
        width={finalWidth}
        height={finalHeight}
        
        offsetX={finalWidth / 2}
        offsetY={finalHeight / 2}
            rotation={layer.rotation ?? 0}
        scaleX={layer.flipX ? -1 : 1}
        scaleY={layer.flipY ? -1 : 1}
        
        crop={{
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight,
        }}
        
        draggable
        onClick={() => selectLayer(layer.id)}
        
        onDragEnd={(e) => {
          updateLayer(layer.id, { 
            x: e.target.x(), 
            y: e.target.y() 
          });
        }}
        
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          const newWidth = node.width() * scaleX;
          const newHeight = node.height() * scaleY;
          
          updateLayer(layer.id, {
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
            rotation: node.rotation(),
          });
          
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      
      {layer.id === selectedLayerId && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default CanvasImage;