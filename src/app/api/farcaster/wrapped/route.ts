import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid || !apiKey) return NextResponse.json([]);

  try {
    // 🎅 One single, direct call. No loops, no timeouts.
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=10`, 
      { 
        headers: { 
          'accept': 'application/json',
          'x-api-key': apiKey 
        },
        cache: 'no-store' // This stops the "304" and "empty" caching issues
      }
    );

    const data = await response.json();
    
    // Return the list instantly
    return NextResponse.json(data.users || [], {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    console.error("Santa API Error:", error);
    return NextResponse.json([]);
  }
}