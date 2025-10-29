import { NextResponse } from "next/server";
import db from "@/lib/db";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = await req.json();

  const layer = await db.layer.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(layer);
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  await db.layer.delete({ where: { id } });
  return new Response(null, { status: 204 });
};
