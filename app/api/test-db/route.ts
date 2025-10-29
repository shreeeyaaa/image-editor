// just for testing connection to the database
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const result = await db.$queryRaw`SELECT 1+4 AS result`;
    return NextResponse.json({ status: "connected successfully", result });
  } catch (err) {
    return NextResponse.json({ status: "failed", error: err });
  }
}
