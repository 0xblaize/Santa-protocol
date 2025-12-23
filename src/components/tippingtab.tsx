"use client";
import React, { useState } from 'react';
import sdk from '@farcaster/frame-sdk'; // 👈 NEW SDK
import { parseEther, getAddress } from "viem";
import { useAccount, useSendTransaction } from 'wagmi'; // 👈 Use Wagmi for cleaner tips
import { base } from "wagmi/chains";

export default function TippingTab({ user }: { user: any }) {
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const [friends, setFriends] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 🎅 Change this to your Treasury Address or the Friend's address
  const TREASURY_ADDRESS = "0x6DBB76BC3BB345b567B369563EF1DC1Cd04d5569";

  const fetchRealEngagers = async () => {
    if (!user?.fid) return;
    setIsGenerating(true);
    
    try {
      // 🎅 This MUST match your file path in src/app/api/farcaster/wrapped/route.ts
      const response = await fetch(`/api/farcaster/wrapped?fid=${user.fid}`);
      if (!response.ok) throw new Error("API Failed");
      
      const data = await response.json();
      
      setFriends(data.map((u: any) => ({
        fid: u.fid,
        username: u.username,
        display_name: u.display_name,
        pfp: u.pfp_url,
        reason: "Top Engager"
      })));

    } catch (e) {
      console.error("Failed to fetch real mutuals", e);
      // Fallback for testing if API fails
      alert("Make sure NEYNAR_API_KEY is in Vercel!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTip = (friend: any) => {
    if (!address) {
       alert("Please connect your wallet first");
       return;
    }

    // 🎅 Using Wagmi is much safer than the raw provider
    sendTransaction({
      to: getAddress(TREASURY_ADDRESS), // Using your treasury for now
      value: parseEther("0.001"),
      chainId: base.id,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#E6DCB1] p-8 rounded-[2.5rem] text-[#034F1B] border-b-8 border-[#CEAC5C] text-center shadow-2xl">
        <h2 className="text-xl font-black italic uppercase text-[#7E121D]">2025 Nice List</h2>
        <p className="text-[9px] font-bold opacity-60 mb-6">REAL-TIME ENGAGEMENT WRAPPED</p>
        
        <button 
          onClick={fetchRealEngagers}
          disabled={isGenerating}
          className="w-full bg-[#034F1B] text-[#E6DCB1] py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all"
        >
          {isGenerating ? "FETCHING FROM CHAIN..." : "🎁 Check Wrapped Mutuals"}
        </button>
      </div>

      <div className="flex flex-col gap-3 pb-20">
        {friends.map((friend) => (
          <div key={friend.fid} className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={friend.pfp} className="w-10 h-10 rounded-full border border-white/20" alt={friend.username} />
              <div>
                <p className="text-xs font-black text-[#E6DCB1]">{friend.display_name}</p>
                <p className="text-[8px] text-[#CEAC5C] font-bold italic">@{friend.username}</p>
              </div>
            </div>
            <button onClick={() => handleTip(friend)} className="bg-[#CEAC5C] text-[#034F1B] px-4 py-2 rounded-xl text-[10px] font-black uppercase">
              Tip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}