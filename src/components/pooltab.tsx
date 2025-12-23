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
}

export default function TippingTab({ user }: { user: any }) {
  const { address, isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [friends, setFriends] = useState<FarcasterUser[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 🎅 YOUR WALLET ADDRESS (The Santa Treasury)
  const TREASURY_ADDRESS = "0x6DBB76BC3BB345b567B369563EF1DC1Cd04d5569";

  // 1. Fetch Mutuals from your API
  const fetchRealEngagers = async () => {
    if (!user?.fid) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch(`/api/farcaster/wrapped?fid=${user.fid}`);
      if (!response.ok) throw new Error("Failed to fetch mutuals");
      const data = await response.json();
      setFriends(data);
      
      // Success haptic feedback
      sdk.actions.ready();
    } catch (e) {
      console.error("Neynar Fetch Error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Handle the Tip/Donation
  const handleTip = (recipientFid?: number) => {
    if (!isConnected) {
      alert("Please open this in Warpcast to use your wallet.");
      return;
    }

    try {
      sendTransaction({
        to: getAddress(TREASURY_ADDRESS), // Using treasury for donations
        value: parseEther("0.001"), // Fixed tip amount
        chainId: base.id,
      }, {
        onSuccess: (hash) => {
          console.log("Transaction Hash:", hash);
        },
        onError: (err) => {
          console.error("Transaction failed:", err.message);
        }
      });
    } catch (err) {
      console.error("Viem validation error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Donation Card */}
      <div className="bg-[#E6DCB1] p-6 rounded-[2.5rem] text-[#034F1B] border-b-8 border-[#CEAC5C] text-center shadow-xl">
        <h2 className="text-xl font-black italic uppercase text-[#7E121D]">Santa Protocol</h2>
        <p className="text-[10px] font-bold opacity-70 mb-4 uppercase tracking-widest">Support the Gifting Layer</p>
        
        <button 
          onClick={() => handleTip()}
          disabled={isPending}
          className="w-full bg-[#7E121D] text-white py-4 rounded-2xl font-black uppercase text-sm shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? "Confirming..." : "🎁 Donate 0.001 ETH"}
        </button>
      </div>

      {/* Nice List Section */}
      <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
        <button 
          onClick={fetchRealEngagers}
          disabled={isGenerating}
          className="w-full bg-[#034F1B] text-[#E6DCB1] py-3 rounded-xl font-bold text-xs uppercase mb-4"
        >
          {isGenerating ? "Loading Nice List..." : "📜 Load My Nice List"}
        </button>

        <div className="flex flex-col gap-3">
          {friends.map((friend) => (
            <div key={friend.fid} className="flex items-center justify-between bg-black/20 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <img src={friend.pfp_url} className="w-10 h-10 rounded-full border border-[#CEAC5C]" alt={friend.username} />
                <div>
                  <p className="text-[11px] font-bold text-white">{friend.display_name}</p>
                  <p className="text-[9px] text-[#CEAC5C]">@{friend.username}</p>
                </div>
              </div>
              <button 
                onClick={() => handleTip(friend.fid)} 
                className="bg-[#CEAC5C] text-[#034F1B] px-4 py-2 rounded-lg text-[10px] font-black uppercase"
              >
                Tip
              </button>
            </div>
          ))}
          {friends.length === 0 && !isGenerating && (
            <p className="text-center text-[10px] text-white/40 italic">No mutuals found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}