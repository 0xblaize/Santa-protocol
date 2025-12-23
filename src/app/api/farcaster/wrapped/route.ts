import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid || !apiKey) return NextResponse.json({ error: "Setup incomplete" }, { status: 400 });

  try {
    // 🎅 STEP 1: Get Popular Casts to find "Engagers"
    // This finds the users who liked/recasted your best content
    const popularCastsResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/feed/user/popular?fid=${fid}`,
      { headers: { 'api_key': apiKey } }
    );
    const popularData = await popularCastsResponse.json();

    // 🎅 STEP 2: Get Active Followers
    // This ensures we aren't tipping bots or dead accounts
    const followersResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/followers?fid=${fid}&sort_type=descending&limit=20`,
      { headers: { 'api_key': apiKey } }
    );
    const followersData = await followersResponse.json();

    // 🎅 STEP 3: Merge & Filter
    // We prioritize people who are in both lists (Active + Followers)
    const allUsers = [...(followersData.users || [])];
    
    // Filter for "Active" status only
    const activeUsers = allUsers.filter(u => u.active_status === 'active');

    // If active list is too short, use the general list
    const finalSelection = activeUsers.length > 0 ? activeUsers : allUsers;

    // Return the top 10 "Nice" users
    return NextResponse.json(finalSelection.slice(0, 10));

  } catch (error) {
    console.error("Santa API Error:", error);
    return NextResponse.json([]);
  }
}