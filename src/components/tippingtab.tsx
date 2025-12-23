"use client";
import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { parseEther, getAddress } from "viem";
import { useAccount, useSendTransaction } from 'wagmi';
import { base } from "wagmi/chains";

interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  active_status: 'active' | 'inactive';
  verified_addresses?: {
    eth_addresses?: string[];
  };
  custody_address?: string;
}

export default function TippingTab({ user }: { user: any }) {
  const { address, isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [friends, setFriends] = useState<FarcasterUser[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 🎅 YOUR RECIPIENT ADDRESS (The Santa Treasury)
  const TREASURY_ADDRESS = "0x6DBB76BC3BB345b567B369563EF1DC1Cd04d5569";

  // 1. Fetch "Active" Mutuals from your API
  const fetchRealEngagers = async () => {
    if (!user?.fid) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch(`/api/farcaster/wrapped?fid=${user.fid}`);
      if (!response.ok) throw new Error("Neynar Fetch Failed");
      const data = await response.json();
      
      // The API now returns a list of active users
      setFriends(data);
    } catch (e) {
      console.error("Neynar API Error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Handle Gifting (Tipping)
  const handleTip = (friend?: FarcasterUser) => {
    if (!isConnected) {
      alert("Please connect your wallet in Warpcast.");
      return;
    }

    // Determine target: Use friend's verified address if it exists, otherwise use Treasury
    let target = TREASURY_ADDRESS;
    if (friend) {
      target = friend.verified_addresses?.eth_addresses?.[0] || friend.custody_address || TREASURY_ADDRESS;
    }

    try {
      sendTransaction({
        to: getAddress(target),
        value: parseEther("0.001"), // Amount to gift
        chainId: base.id,
      });
    } catch (err) {
      console.error("Transaction Prep Error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* 🎁 Main Donation Card */}
      <div className="bg-[#E6DCB1] p-6 rounded-[2.5rem] text-[#034F1B] border-b-8 border-[#CEAC5C] text-center shadow-xl">
        <h2 className="text-xl font-black italic uppercase text-[#7E121D]">Santa Protocol</h2>
        <p className="text-[10px] font-bold opacity-70 mb-4 uppercase">Support the 2025 Nice List</p>
        
        <button 
          onClick={() => handleTip()}
          disabled={isPending}
          className="w-full bg-[#7E121D] text-white py-4 rounded-2xl font-black uppercase text-sm shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? "Confirming..." : "🎁 Donate to Santa Pool"}
        </button>
      </div>

      {/* 📜 The Nice List (Engagement Based) */}
      <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
        <button 
          onClick={fetchRealEngagers}
          disabled={isGenerating}
          className="w-full bg-[#034F1B] text-[#E6DCB1] py-3 rounded-xl font-bold text-xs uppercase mb-4 flex items-center justify-center gap-2"
        >
          {isGenerating ? "🔍 ANALYZING ENGAGEMENT..." : "📜 Load My Nice List"}
        </button>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
          {friends.map((friend) => (
            <div key={friend.fid} className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5 hover:border-[#CEAC5C]/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={friend.pfp_url} className="w-10 h-10 rounded-full border border-[#CEAC5C]" alt={friend.username} />
                  {friend.active_status === 'active' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-black"></span>
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white truncate w-24">{friend.display_name}</p>
                  <p className="text-[9px] text-[#CEAC5C]">@{friend.username}</p>
                </div>
              </div>
              <button 
                onClick={() => handleTip(friend)} 
                className="bg-[#CEAC5C] text-[#034F1B] px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white transition-colors"
              >
                Gift
              </button>
            </div>
          ))}
          
          {friends.length === 0 && !isGenerating && (
            <div className="py-8 text-center">
              <p className="text-[10px] text-white/30 italic uppercase">Your list is empty. Click load!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}