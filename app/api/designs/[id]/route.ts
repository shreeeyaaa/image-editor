import { NextResponse } from "next/server";
import db from "@/lib/db";


export const GET = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  const design = await db.design.findUnique({
    where: { id },
    include: { layers: true },
  });

  if (!design) {
    return NextResponse.json({ error: "Design not found" }, { status: 404 });
  }

  return NextResponse.json(design);
};

export const PATCH = async (req: Request, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  const body = await req.json();

  const design = await db.design.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(design);
};
