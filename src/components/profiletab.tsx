"use client";

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function ProfileTab({ user }: { user: any }) {
  const [stats, setStats] = useState({ totalGifts: 0, points: 0, rank: "Gift Giver" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Guard: If user or fid is missing, don't run the fetch
      if (!user?.fid) return;

      try {
        const res = await sdk.quickAuth.fetch(`/api/user/stats?fid=${user.fid}`);
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.warn("Could not load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.fid]); // 2. Optional chaining prevents the TypeError

  // 3. Loading UI: Prevents the app from crashing while waiting for data
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#034F1B]">
        <div className="text-[#E6DCB1] animate-pulse font-black italic">LOADING PROFILE...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in bg-[#034F1B] min-h-screen p-4 pt-10 pb-24">
      {/* Badge Header Section */}
      <div className="bg-[#E6DCB1] p-8 rounded-[2.5rem] text-[#034F1B] border-b-8 border-[#CEAC5C] shadow-2xl flex flex-col items-center">
        <div className="relative">
          {/* 4. Use Optional Chaining for image and username too */}
          <img 
            src={user?.pfpUrl || user?.pfp_url} 
            className="w-24 h-24 rounded-full border-4 border-[#034F1B] bg-white/10" 
            alt="Profile" 
          />
          {stats.totalGifts >= 5 && (
            <div className="absolute -bottom-2 -right-2 bg-[#BD3634] p-2 rounded-full border-2 border-[#E6DCB1] text-xs shadow-lg">
              🎅
            </div>
          )}
        </div>
        <h2 className="mt-4 text-xl font-black italic uppercase tracking-tighter">
          @{user?.username || 'farcaster'}
        </h2>
        <span className="text-[10px] font-bold text-[#CEAC5C] uppercase tracking-widest mt-1">
          {loading ? "Calculating Rank..." : `Rank: ${stats.rank}`}
        </span>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center backdrop-blur-sm">
          <span className="text-[9px] font-black text-[#CEAC5C] uppercase opacity-60 tracking-widest">Gifts Sent</span>
          <div className="text-2xl font-black text-[#E6DCB1]">{stats.totalGifts}</div>
        </div>
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center backdrop-blur-sm">
          <span className="text-[9px] font-black text-[#CEAC5C] uppercase opacity-60 tracking-widest">Santa Points</span>
          <div className="text-2xl font-black text-[#E6DCB1]">{stats.points}</div>
        </div>
      </div>

      {/* Badge List */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[#CEAC5C] text-[10px] font-black uppercase tracking-[0.2em] px-2">Your Badges</h3>
        <BadgeRow label="First Gift" earned={stats.totalGifts > 0} icon="🎁" />
        <BadgeRow label="Pool Contributor" earned={stats.points > 100} icon="🏦" />
        <BadgeRow label="Mega Santa" earned={stats.totalGifts >= 10} icon="🌟" />
      </div>
    </div>
  );
}

function BadgeRow({ label, earned, icon }: { label: string; earned: boolean; icon: string }) {
  return (
    <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-500 ${earned ? 'bg-[#E6DCB1]/10 border-[#CEAC5C]' : 'bg-white/5 border-white/5 opacity-20'}`}>
      <span className="text-[#E6DCB1] text-xs font-bold">{label}</span>
      <span className="text-lg">{earned ? icon : "🔒"}</span>
    </div>
  );
}