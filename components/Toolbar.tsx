

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useEditorStore } from "@/lib/store";
import { Layer } from "@/lib/store";
import { 
  ImagePlus, 
  Upload, 
  FlipHorizontal2, 
  FlipVertical2, 
  Crop, 
  Scissors,
  Trash2
} from 'lucide-react';

interface Asset {
  id: string;
  url: string;
  originalName: string;
  width?: number;
  height?: number;
}

const Toolbar: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  const layers = useEditorStore((s) => s.layers);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const addLayer = useEditorStore((s) => s.addLayer);
  const updateLayer = useEditorStore((s) => s.updateLayer);
const deleteLayer = useEditorStore((s) => s.deleteLayer);
 const selectLayer = useEditorStore((s) => s.selectLayer);

  // adding crop mode may be delete later
  const cropMode = useEditorStore((s) => s.cropMode);
  const setCropMode = useEditorStore((s) => s.setCropMode);

  // fetcing assets on mount 
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get("/api/assets");
        setAssets(res.data);
      } catch (err) {
        console.error("Failed to fetch assets:", err);
      }
    };
    fetchAssets();
  }, []);

  // file upload portion
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/assets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newAsset: Asset = res.data;
      setAssets((prev) => [newAsset, ...prev]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // bse image portion
  const handleAddBaseImage = async () => {


    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("/api/assets", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newAsset: Asset = res.data;
        setAssets((prev) => [newAsset, ...prev]);

        // base covering the whole canvas
        addLayer({
          id: crypto.randomUUID(),
          type: "IMAGE",
          x: 800 / 2,
          y: 600 / 2,
          width: 800,
          height: 600,
          rotation: 0,
          flipX: false,
          flipY: false,
          zIndex: -1, 
          assetId: newAsset.id,
          url: newAsset.url,
          visible: true,
        });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    };
    input.click();
  };

  const handleAddLayer = (asset: Asset) => {
    const newLayer: Layer = {
      id: crypto.randomUUID(),
      type: "IMAGE",
      x: 400, 
      y: 300,
      width: asset.width || 200,
      height: asset.height || 200,
      rotation: 0,
      flipX: false,
      flipY: false,
      zIndex: layers.length, 
      assetId: asset.id,
      url: asset.url,
      visible: true,
    };
    addLayer(newLayer); 
  };

  // flipping horizontally
  const flipHorizontal = () => {
    if (!selectedLayerId) return;
    const layer = useEditorStore.getState().layers.find(l => l.id === selectedLayerId);
    if (!layer) return;
    updateLayer(selectedLayerId, { flipX: !layer.flipX });
  };

  // flipping vertically
  const flipVertical = () => {
    if (!selectedLayerId) return;
    const layer = useEditorStore.getState().layers.find(l => l.id === selectedLayerId);
    if (!layer) return;
    updateLayer(selectedLayerId, { flipY: !layer.flipY });
  };

  // crop just static
  const cropLayer = () => {
    if (!selectedLayerId) return;
    updateLayer(selectedLayerId, {
      cropX: 50,
      cropY: 50,
      cropW: 500,
      cropH: 500,
    });
  };

  // selected layer delete
  const deleteSelectedLayer = () => {
    if (!selectedLayerId) return;
    deleteLayer(selectedLayerId);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200">
      {/* toolbase section */}
      <div className="p-4 space-y-1.5">
        {/* baseimg */}
        <button 
          className="w-full hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 text-sm"
          onClick={handleAddBaseImage}
        >
          <ImagePlus className="w-4 h-4" />
          Add Base Image
        </button>

        {/* upload button */}
        <label className="w-full hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 cursor-pointer text-sm">
          <Upload className="w-4 h-4" />
          Upload Image
          <input 
            type="file" 
            accept="image/*" 
            className="hidden"
            onChange={handleUpload}
          />
        </label>

        <div className="h-px bg-slate-200 my-3"></div>

        {/* tool section */}
        <button 
          className="w-full hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 text-sm"
          onClick={flipHorizontal}
        >
          <FlipHorizontal2 className="w-4 h-4" />
          Flip Horizontally
        </button>

        <button 
          className="w-full hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 text-sm"
          onClick={flipVertical}
        >
          <FlipVertical2 className="w-4 h-4" />
          Flip Vertically
        </button>

        <button 
          className="w-full hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 text-sm"
          onClick={cropLayer}
        >
          <Crop className="w-4 h-4" />
          Crop Layer
        </button>

        <button 
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 text-sm ${
            cropMode 
              ? "bg-slate-900 text-white" 
              : "hover:bg-slate-100 text-slate-700"
          }`}
          onClick={() => setCropMode(!cropMode)}
        >
          <Scissors className="w-4 h-4" />
          {cropMode ? "Exit Crop Mode" : "Crop Mode"}
        </button>

        <div className="h-px bg-slate-200 my-3"></div>

        {/* delete btn */}
        <button 
          className="w-full hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 text-sm"
          onClick={deleteSelectedLayer}
        >
          <Trash2 className="w-4 h-4" />
          Delete Layer
        </button>
      </div>

      {/* assets */}
      <div className="border-t border-slate-200 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Assets</h3>
        {/* <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto"> */}
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer border border-slate-200 hover:border-slate-900 transition-colors"
              onClick={() => handleAddLayer(asset)}
            >
              <img
                src={asset.url}
                alt={asset.originalName}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;