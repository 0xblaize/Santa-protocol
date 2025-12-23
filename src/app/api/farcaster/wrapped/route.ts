import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid || !apiKey) return NextResponse.json([]);

  try {
    // 🎅 Simplified: One single fast call to get followers
    // This removes the heavy loops that are causing the 30-second delay
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=20`, 
      { 
        headers: { 
          'accept': 'application/json',
          'x-api-key': apiKey 
        } 
      }
    );

    const data = await response.json();
    
    // Return the users array directly - this will be fast and reliable
    return NextResponse.json(data.users || []);
  } catch (error) {
    console.error("Santa API Error:", error);
    return NextResponse.json([]);
  }
}