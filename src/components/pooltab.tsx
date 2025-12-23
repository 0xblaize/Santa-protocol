"use client";

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { parseEther } from "viem";
import { useAccount } from 'wagmi';

export default function PoolTab() {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<any[]>([]);
  const [donateAmount, setDonateAmount] = useState("0.005");
  const [poolTotal, setPoolTotal] = useState(0);
  const [isDonating, setIsDonating] = useState(false);
  const GOAL = 100; // 10 ETH Goal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      const stats = await statsRes.json();
      setPoolTotal(parseFloat(stats.treasuryTotal) || 0);

      const tasksRes = await fetch('/api/admin/tasks');
      const taskData = await tasksRes.json();
      setTasks(Array.isArray(taskData) ? taskData : []);
    } catch (e) { console.error(e); }
  };

  const handleDonate = async () => {
    if (!address) return;
    setIsDonating(true);
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      await provider?.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address as `0x${string}`,
          to: "0x6DBB76BC3BB345b567B369563EF1DC1Cd04d5569" as `0x${string}`,
          value: parseEther(donateAmount).toString() as `0x${string}`,
          chainId: "0x2105", 
        }]
      });
      sdk.haptics.notificationOccurred('success');
      fetchData();
    } catch (err) { console.error(err); }
    finally { setIsDonating(false); }
  };

  const progressPercent = Math.min((poolTotal / GOAL) * 100, 100);

  return (
    <div className="flex flex-col gap-6">
      {/* COMMUNITY GOAL CARD */}
      <div className="bg-[#E6DCB1] p-6 rounded-[2.5rem] text-[#034F1B] border-b-8 border-[#CEAC5C] shadow-2xl">
        <div className="flex justify-between items-end mb-2 px-1">
          <h2 className="text-xl font-black italic uppercase text-[#7E121D]">Goal Progress</h2>
          <span className="text-xs font-black">{poolTotal.toFixed(3)} / {GOAL} ETH</span>
        </div>
        
        <div className="w-full h-5 bg-black/10 rounded-full p-1 border border-[#034F1B]/20">
          <div className="h-full bg-[#034F1B] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* CUSTOM DONATION INPUT */}
        <div className="mt-6 p-4 bg-white/30 rounded-2xl border border-[#CEAC5C]/30">
          <label className="text-[10px] font-black uppercase opacity-60 block mb-1">Your Gift (ETH)</label>
          <input 
            type="number" 
            step="0.001" 
            value={donateAmount} 
            onChange={(e) => setDonateAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-black outline-none text-[#034F1B]"
          />
        </div>

        <button onClick={handleDonate} disabled={isDonating} className="w-full mt-4 bg-[#034F1B] text-[#E6DCB1] py-4 rounded-2xl font-black uppercase text-xs">
          {isDonating ? "GIFTING..." : "DONATE TO POOL"}
        </button>
      </div>

      {/* TASKS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[#CEAC5C] text-[10px] font-black uppercase tracking-widest px-2">Santa Tasks</h3>
        {tasks.length > 0 ? (
          tasks.map((task, i) => (
            <button key={i} onClick={() => sdk.actions.openUrl(task.url)} className="w-full flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/10">
              <span className="text-[#E6DCB1] text-xs font-black">{task.title}</span>
              <span className="text-[#CEAC5C] text-[9px] font-black">+{task.points} PTS</span>
            </button>
          ))
        ) : (
          <div className="w-full p-10 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center opacity-30">
            <span className="text-3xl mb-2">⏳</span>
            <span className="text-[#E6DCB1] text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  );
}