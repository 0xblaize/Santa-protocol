"use client";

import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Navbar() {
  const [userData, setUserData] = useState<{ username?: string; pfpUrl?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Safe way to get context without triggering crash errors
        const context = await sdk.context;
        if (context?.user) {
          setUserData(context.user);
        }
      } catch (e) {
        console.warn("Context not available yet");
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#034F1B] border-b-2 border-[#CEAC5C] px-6 py-4 flex justify-between items-center shadow-2xl">
      {/* FAR LEFT: Project Name */}
      <div className="flex flex-col">
        <h1 className="text-[#E6DCB1] font-black text-lg italic uppercase tracking-tighter leading-none">
          Santa Protocol
        </h1>
        <span className="text-[7px] text-[#CEAC5C] font-bold tracking-[0.2em] uppercase mt-1">
          Base Mainnet Hub
        </span>
      </div>

      {/* FAR RIGHT: User Info */}
      <div className="flex items-center gap-3">
        <div className="hidden xs:flex flex-col items-end leading-none">
          <span className="text-[10px] font-black text-[#CEAC5C] lowercase">
            @{userData?.username || 'farcaster'}
          </span>
        </div>
        
        {/* Profile Circle */}
        <div className="w-10 h-10 rounded-full border-2 border-[#CEAC5C] overflow-hidden bg-[#E6DCB1]/10 flex items-center justify-center shadow-inner">
          {userData?.pfpUrl ? (
            <img 
              src={userData.pfpUrl} 
              alt="pfp" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-[#CEAC5C]/20 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}