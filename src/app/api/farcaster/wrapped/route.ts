import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  // 1. Safety check for Key and FID
  if (!fid || !apiKey) return NextResponse.json([]);

  try {
    // 2. Use the standard followers endpoint (more reliable than reciprocal for testing)
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
    
    // 3. Return the users with a cache-buster header
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
