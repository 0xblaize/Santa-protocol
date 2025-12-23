import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid) return NextResponse.json({ error: "No FID provided" }, { status: 400 });
  if (!apiKey) {
    console.error("❌ NEYNAR_API_KEY is missing from environment variables");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    // 🎅 Fetching Reciprocal (Mutuals) and Followers
    const [mutualsResponse, followersResponse] = await Promise.all([
      fetch(`https://api.neynar.com/v2/farcaster/followers/reciprocal?fid=${fid}&limit=5`, 
        { headers: { 'api_key': apiKey } }),
      fetch(`https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=10`, 
        { headers: { 'api_key': apiKey } })
    ]);

    // Check if Neynar is rejecting the request
    if (mutualsResponse.status === 401 || followersResponse.status === 401) {
      console.error("❌ Neynar API Key is invalid");
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    const [mJSON, fJSON] = await Promise.all([
      mutualsResponse.json(),
      followersResponse.json()
    ]);

    const combined = [...(mJSON.users || []), ...(fJSON.users || [])];
    
    // De-duplicate by FID
    const uniqueList = Array.from(new Map(combined.map(u => [u.fid, u])).values());

    return NextResponse.json(uniqueList.slice(0, 10));
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch from Neynar" }, { status: 500 });
  }
}