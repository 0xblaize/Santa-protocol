"use client";

import React, { useState } from 'react';
import TippingTab from './tippingtab';
import PoolTab from './pooltab';
import ProfileTab from './profiletab';
import AdminDashboard from './AdminDashboard';

const ADMIN_FID = 544065; // 🚨 Replace with your actual FID

export default function UserWorkshop({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('tipping');
  const isAdmin = user?.fid === ADMIN_FID;

  return (
    <div className="flex flex-col bg-[#034F1B] h-screen text-[#E6DCB1] overflow-hidden">
      
      {/* HEADER */}
      

      {/* MAIN CONTENT - scrollable */}
      <main className="flex-1 overflow-y-auto p-6 pb-32">
        {activeTab === 'tipping' && <TippingTab user={user} />}
        {activeTab === 'pool' && <PoolTab user={user} />}
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'admin' && isAdmin && <AdminDashboard setActiveTab={setActiveTab} />}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#023a14] border-t-2 border-[#CEAC5C]/30 flex justify-around items-center p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-[999] backdrop-blur-lg">
        
        <NavButton icon="💸" label="Tip" active={activeTab === 'tipping'} onClick={() => setActiveTab('tipping')} />
        <NavButton icon="🌊" label="Pool" active={activeTab === 'pool'} onClick={() => setActiveTab('pool')} />
        <NavButton icon="🎅" label="Stats" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />

        {/* ADMIN SWITCH: Only visible to you */}
        {isAdmin && (
          <>
            <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'admin' ? 'text-[#BD3634] scale-110' : 'opacity-40'}`}
            >
              <span className="text-xl">⚙️</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#BD3634]">Admin</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#CEAC5C] scale-110' : 'opacity-40'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}