import { NextResponse } from "next/server";
import { getXmasGiftingList } from "../../../lib/neynar";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    // Call the logic we wrote in your neynar.ts
    const list = await getXmasGiftingList(Number(fid));
    
    return NextResponse.json(list);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch Top engager List" }, { status: 500 });
  }
}