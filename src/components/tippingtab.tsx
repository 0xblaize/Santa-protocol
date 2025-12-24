"use client";
import React, { useState } from 'react';
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
  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [friends, setFriends] = useState<FarcasterUser[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Fetch Followers from your simplified API
  const fetchRealEngagers = async () => {
    if (!user?.fid) return;
    setIsGenerating(true);
    
    try {
      // Adding a timestamp prevents the '304 Not Modified' browser cache issue
      const response = await fetch(`/api/farcaster/wrapped?fid=${user.fid}&t=${Date.now()}`);
      if (!response.ok) throw new Error("Neynar Fetch Failed");
      const data = await response.json();
      
      setFriends(data);
    } catch (e) {
      console.error("Neynar API Error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Handle Tipping (Native v2 SDK Flow)
  const handleTip = (friend: FarcasterUser) => {
    if (!isConnected) {
      sdk.actions.addFrame(); // Prompt to add frame/connect if not connected
      return;
    }

    // Priority: Verified ETH Address > Custody Address
    const target = friend.verified_addresses?.eth_addresses?.[0] || friend.custody_address;

    if (!target) {
      alert("No wallet found for this user.");
      return;
    }

    try {
      sendTransaction({
        to: getAddress(target),
        value: parseEther("0.001"), 
        chainId: base.id,
      });
    } catch (err) {
      console.error("Transaction Prep Error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* 📜 The Nice List (Tipping Only) */}
      <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
        <button 
          onClick={fetchRealEngagers}
          disabled={isGenerating}
          className="w-full bg-[#034F1B] text-[#E6DCB1] py-3 rounded-xl font-bold text-xs uppercase mb-4 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          {isGenerating ? "🔍 LOADING..." : "📜 Load My Tipping List"}
        </button>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
          {friends.map((friend) => (
            <div key={friend.fid} className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5 hover:border-[#CEAC5C]/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={friend.pfp_url || 'https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=144/https%3A%2F%2Fi.imgur.com%2F8QK97vD.png'} 
                    className="w-10 h-10 rounded-full border border-[#CEAC5C]" 
                    alt={friend.username} 
                  />
                  {friend.active_status === 'active' && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-black"></span>
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white truncate w-24">{friend.display_name}</p>
                  <p className="text-[9px] text-[#CEAC5C] truncate">@{friend.username}</p>
                </div>
              </div>
              <button 
                onClick={() => handleTip(friend)} 
                disabled={isPending}
                className="bg-[#CEAC5C] text-[#034F1B] px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white active:scale-90 transition-all disabled:opacity-50"
              >
                {isPending ? "..." : "Tip"}
              </button>
            </div>
          ))}
          
          {friends.length === 0 && !isGenerating && (
            <div className="py-8 text-center">
              <p className="text-[10px] text-white/40 italic uppercase">Your list is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}