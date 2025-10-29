
"use client";

import { useEditorStore } from "@/lib/store";
import { Save } from "lucide-react";

function SaveButton({ designId }: { designId: string }) {
  const { layers } = useEditorStore();

  const saveDesign = async () => {
    const designData = {
      title: "My New Design",
      width: 800,
      height: 600,
      layers,
    };

    const res = await fetch(`/api/designs/${designId}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(designData),
    });

    if (res.ok) {
      alert("Design saved successfully");
    } else {
      alert("Failed to save design");
    }
  };

  return (
    <button
      onClick={saveDesign}
      className="hover:bg-slate-100 bg-blue-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm border border-slate-200"
    >
      <Save className="w-4 h-4" />
      Save Design
    </button>
  );
}

export default SaveButton;