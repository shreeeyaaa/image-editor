import { NextResponse } from "next/server";
import db from "@/lib/db";
import { designSchema } from "@/lib/validators";

export const GET = async () => {
  // just  get all designs with their layers
  const designs = await db.design.findMany({ include: { layers: true } });

  // return as JSON
  return NextResponse.json(designs);
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // validate with Zod
    const parsed = designSchema.parse(body);

    // creating new design
    const design = await db.design.create({
      data: {
        title: parsed.title,
        width: parsed.width,
        height: parsed.height,
      },
      include: { layers: true }, // include layers even if empty
    });

    return NextResponse.json(design);

  } catch (err) {
    // incase of errorss
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 } 
    );
  }
};
