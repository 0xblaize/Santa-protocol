import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  // 1. Check if key is actually there
  if (!fid || !apiKey) {
    return NextResponse.json([]);
  }

  try {
    // 2. Use 'x-api-key' for Neynar V2
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=20`, 
      { 
        method: 'GET',
        headers: { 
          'accept': 'application/json',
          'x-api-key': apiKey 
        },
        cache: 'no-store' 
      }
    );

    const data = await response.json();
    
    // 3. Return users array. If empty, Neynar found no followers for this FID.
    return NextResponse.json(data.users || [], {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error("Santa API Error:", error);
    return NextResponse.json([]);
  }
}