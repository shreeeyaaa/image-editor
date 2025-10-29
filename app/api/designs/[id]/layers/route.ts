import { NextResponse } from "next/server";
import db from "@/lib/db";

export const POST = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const params = await context.params;
    const designId = params.id;

    if (!designId) {
      return NextResponse.json(
        { error: "Design ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.width || !body.height) {
      return NextResponse.json(
        { error: "Width and height are required" },
        { status: 400 }
      );
    }

    const layer = await db.layer.create({
      data: {
        designId,
        type: body.type || "IMAGE",
        assetId: body.assetId,
        x: body.x ?? 0,
        y: body.y ?? 0,
        width: body.width,
        height: body.height,
        rotation: body.rotation ?? 0,
        flipX: body.flipX ?? false,
        flipY: body.flipY ?? false,
        opacity: body.opacity ?? 1,
        zIndex: body.zIndex ?? 0,
        cropX: body.cropX,
        cropY: body.cropY,
        cropW: body.cropW,
        cropH: body.cropH,
        visible: body.visible ?? true,
      },
      include: {
        asset: true,
        design: true,
      },
    });

    return NextResponse.json(layer, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create layer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create layer" },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const params = await context.params;
    const designId = params.id;

    const layers = await db.layer.findMany({
      where: { designId },
      include: { asset: true },
      orderBy: { zIndex: 'asc' },
    });

    return NextResponse.json(layers);
  } catch (error: any) {
    console.error("Failed to fetch layers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch layers" },
      { status: 500 }
    );
  }
};