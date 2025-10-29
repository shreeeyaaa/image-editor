



import { NextResponse } from "next/server";
import db from "@/lib/db";

export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  try {
    const body = await req.json();
    const { title, width, height, layers } = body;

    // updating the design metadata
    await db.design.update({
      where: { id },
      data: { title, width, height },
    });

    // deleting existing layers
    await db.layer.deleteMany({ where: { designId: id } });

    
    for (const layer of layers) {
      await db.layer.create({
        data: {
          id: layer.id, 
          designId: id,
          type: layer.type,
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
          rotation: layer.rotation || 0,
          flipX: layer.flipX || false,
          flipY: layer.flipY || false,
          zIndex: layer.zIndex || 0,
          assetId: layer.assetId || null,
          visible: layer.visible ?? true,
          cropX: layer.cropX ?? null,
          cropY: layer.cropY ?? null,
          cropW: layer.cropW ?? null,
          cropH: layer.cropH ?? null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save design error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
};
