"use client";
import React, { useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { parseEther } from "viem";
import { useAccount } from 'wagmi';

export default function TippingTab({ user }: { user: any }) {
  const { address } = useAccount();
  const [friends, setFriends] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchRealEngagers = async () => {
    if (!user?.fid) return;
    setIsGenerating(true);
    
    try {
      // 🎅 Calling our new API route
      const response = await fetch(`/api/farcaster/wrapped?fid=${user.fid}`);
      const data = await response.json();
      
      // We map the real Neynar data to our list
      setFriends(data.map((u: any) => ({
        fid: u.fid,
        username: u.username,
        display_name: u.display_name,
        pfp: u.pfp_url,
        reason: "Top Engager"
      })));

      sdk.haptics.notificationOccurred('success');
    } catch (e) {
      console.error("Failed to fetch real mutuals", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTip = async (friend: any) => {
    if (!address) return;
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      await provider?.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address as `0x${string}`,
          to: "0xYOUR_TREASURY_WALLET" as `0x${string}`, 
          value: parseEther("0.001").toString() as `0x${string}`,
          chainId: "0x2105", 
        }]
      });
      sdk.haptics.notificationOccurred('success');
    } catch (err) { console.error(err); }
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
          <div key={friend.fid} className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
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