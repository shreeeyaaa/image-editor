
"use client";

import React, { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/Toolbar";
import EditorCanvas from "@/components/EditorCanvas";
import LayerPanel from "@/components/LayerPanel";
import SaveButton from "@/components/SaveButton";
import axios from "axios";
import { useEditorStore } from "@/lib/store";
import { Download } from "lucide-react";

const EditorPage = () => {
  const setDesignId = useEditorStore((s) => s.setDesignId);
  const setLayers = useEditorStore((s) => s.setLayers);
  const designId = useEditorStore((s) => s.designId);
  const stageRef = useRef<any>(null);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const createDesign = async () => {
      try {
        const res = await axios.post("/api/designs", {
          title: "Untitled Design",
          width: 800,
          height: 600,
        });
        setDesignId(res.data.id);
        setLayers([]);
      } catch (err) {
        console.error("Failed to create design:", err);
      }
    };
    createDesign();
  }, [setDesignId, setLayers]);

  // Export function
  const exportImage = (format: "png" | "jpeg") => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ 
      pixelRatio: 2, 
      mimeType: `image/${format}` 
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `design.${format}`;
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <h1 className="text-lg font-semibold text-slate-800">Image Editor</h1>
        
        <div className="flex items-center gap-2">
          {designId && <SaveButton designId={designId} />}
          
          <div className="h-6 w-px bg-slate-200"></div>
          
          <button
            onClick={() => exportImage("png")}
            className="hover:bg-slate-100 bg-blue-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-slate-200"
          >
            <Download className="w-4 h-4" />
            Export PNG
          </button>
          
          <button
            onClick={() => exportImage("jpeg")}
            className="hover:bg-slate-100 bg-blue-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-slate-200"
          >
            <Download className="w-4 h-4" />
            Export JPEG
          </button>
        </div>
      </div>

      {/* Main content like toolbar,canvas and layers */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-100">
          <EditorCanvas stageRef={stageRef} />
        </div>
        
        <LayerPanel />
      </div>
    </div>
  );
};

export default EditorPage;