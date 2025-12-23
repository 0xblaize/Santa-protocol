import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid) return NextResponse.json([]);

  try {
    // 🎅 RUN BOTH REQUESTS AT ONCE
    const [mutualsResponse, followersResponse] = await Promise.all([
      fetch(`https://api.neynar.com/v2/farcaster/followers/reciprocal?fid=${fid}&limit=5`, 
        { headers: { 'api_key': apiKey || '' } }),
      fetch(`https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=10`, 
        { headers: { 'api_key': apiKey || '' } })
    ]);

    const [mJSON, fJSON] = await Promise.all([
      mutualsResponse.json(),
      followersResponse.json()
    ]);

    // Combine them into one list
    const combined = [...(mJSON.users || []), ...(fJSON.users || [])];
    
    // Remove any duplicates (in case a mutual is also a follower)
    const uniqueList = Array.from(new Map(combined.map(u => [u.fid, u])).values());

    return NextResponse.json(uniqueList.slice(0, 10));
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json([]);
  }
}