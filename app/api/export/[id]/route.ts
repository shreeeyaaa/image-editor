import { NextResponse } from "next/server";
import db from "@/lib/db";
import sharp from "sharp";
import fs from "fs";
import path from "path";


export const POST = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  // fetching the design with all its layers and assets of each layer
  const design = await db.design.findUnique({
    where: { id },
    include: {
      layers: {
        include: { asset: true }, 
      },
    },
  });

  if (!design) {
    return NextResponse.json(
      { error: "Design not found" },
      { status: 404 }
    );
  }

  const canvasWidth = design.width;
  const canvasHeight = design.height;

  // blank canvas with white background
  let image = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  // looping over each layer and adding it to canvas
  for (const layer of design.layers) {
    if (!layer.assetId || !layer.asset) continue; 

    const assetPath = path.join(process.cwd(), layer.asset.url);

   
    if (!fs.existsSync(assetPath)) continue;

    image = image.composite([
      {
        input: assetPath,
        top: Math.round(layer.y),
        left: Math.round(layer.x),
      },
    ]);
  }


  const buffer = await image.png().toBuffer();
  const uint8Buffer = new Uint8Array(buffer);

  return new Response(uint8Buffer, {
    status: 200,
    headers: { "Content-Type": "image/png" },
  });
};
