import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  const apiKey = process.env.NEYNAR_API_KEY;

  if (!fid || !apiKey) return NextResponse.json({ error: "Setup incomplete" }, { status: 400 });

  try {
    const headers = { 
      'accept': 'application/json',
      'x-api-key': apiKey 
    };

    const [popularCastsRes, followersRes] = await Promise.all([
      fetch(`https://api.neynar.com/v2/farcaster/feed/user/popular?fid=${fid}`, { headers }),
      fetch(`https://api.neynar.com/v2/farcaster/followers?fid=${fid}&limit=50`, { headers })
    ]);

    const popularData = await popularCastsRes.json();
    const followersData = await followersRes.json();

    const engagerFids = new Map();
    const topCasts = (popularData.casts || []).slice(0, 3);

    // 🎅 Fix for Error 1: Added ': any' to cast
    const reactionRequests = topCasts.map((cast: any) =>
      fetch(`https://api.neynar.com/v2/farcaster/reactions/cast?hash=${cast.hash}&types=likes,recasts&limit=20`, { headers })
        .then(res => res.json())
    );

    const allReactions = await Promise.all(reactionRequests);

    allReactions.forEach(data => {
      (data.reactions || []).forEach((reaction: any) => {
        const uFid = reaction.user?.fid;
        if (uFid) {
          engagerFids.set(uFid, (engagerFids.get(uFid) || 0) + 1);
        }
      });
    });

    const followers = followersData.users || [];
    const scoredUsers = followers
      .filter((u: any) => u.active_status === 'active')
      .map((user: any) => ({
        ...user,
        engagementScore: engagerFids.get(user.fid) || 0
      }))
      // 🎅 Fix for Error 2 & 3: Added ': any' to a and b
      .sort((a: any, b: any) => b.engagementScore - a.engagementScore);

    return NextResponse.json(scoredUsers.slice(0, 10));

  } catch (error) {
    console.error("Santa API Error:", error);
    return NextResponse.json([]);
  }
}