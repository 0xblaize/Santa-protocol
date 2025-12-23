import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid || !apiKey) return NextResponse.json([]);

  try {
    // 🎅 Simplified to a single fast fetch to avoid timeouts and 202 status
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=10`, 
      { 
        headers: { 'x-api-key': apiKey },
        cache: 'no-store' // 🎅 Forces the server to get fresh data
      }
    );

    const data = await response.json();
    
    // 🎅 Forces the browser to ignore the '304' cache
    return new NextResponse(JSON.stringify(data.users || []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json([]);
  }
}