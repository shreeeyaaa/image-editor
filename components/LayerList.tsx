// import React from "react";
// import { useEditorStore } from "@/lib/store";

// const LayerList = () => {
//   const layers = useEditorStore((state) => state.layers);
//   const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
//   const selectLayer = useEditorStore((state) => state.selectLayer);

//   return (
//     <div className="bg-gray-100 p-2 rounded space-y-1 max-h-64 overflow-y-auto">
//       {layers.map((layer) => (
//         <div
//           key={layer.id}
//           onClick={() => selectLayer(layer.id)}
//           className={`p-2 rounded cursor-pointer ${
//             selectedLayerId === layer.id ? "bg-blue-300" : "bg-white"
//           }`}
//         >
//           {layer.assetId ? `Layer: ${layer.assetId}` : "Untitled Layer"}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LayerList;
