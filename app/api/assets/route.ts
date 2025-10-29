import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import sharp from "sharp";


export const POST = async (req: Request) => {
  try {
    // get the file from the form
    const formData = await req.formData();
    const file = formData.get("file") as File;


    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

   
    // const uploadsDir = path.join(process.cwd(), "uploads");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // random file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    //  save the file
    // const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, buffer);

    // get the file size to save in the database
    const stat = fs.statSync(filePath);

    const asset = await db.asset.create({
      data: {
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: stat.size,
        url: `/uploads/${fileName}`,
        width,
        height, 
      },
    });

    return NextResponse.json(asset);
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    // getting all assets from the database and showing the newwest first 
    const assets = await db.asset.findMany({
      orderBy: { createdAt: "desc" }, 
    });

    return NextResponse.json(assets);
  } catch (err) {
    console.error("Failed to fetch assets:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
};