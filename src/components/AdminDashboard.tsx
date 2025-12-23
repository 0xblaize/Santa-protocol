"use client";
import React, { useState, useEffect } from 'react';

// We pass "setActiveTab" as a prop so the button can change the view
export default function AdminDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ title: '', url: '', points: '' });
  const [poolBalance, setPoolBalance] = useState("0.0000");

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, []);

  const fetchStats = async () => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setPoolBalance(data.treasuryTotal || "0.0000");
  };

  const fetchTasks = async () => {
    const res = await fetch('/api/admin/tasks');
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  const handleAddTask = async () => {
    if (!newTask.title) return;
    await fetch('/api/admin/tasks', {
      method: 'POST',
      body: JSON.stringify(newTask),
    });
    setNewTask({ title: '', url: '', points: '' });
    fetchTasks(); // Refresh list
  };

  // FIXED DELETE LOGIC
  const handleRemoveTask = async (index: number) => {
    await fetch(`/api/admin/tasks?id=${index}`, { 
      method: 'DELETE' 
    });
    fetchTasks(); // Refresh list after deletion
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4">
      
      {/* 🔄 SWITCH TO USER MODE BUTTON */}
      <button 
        onClick={() => setActiveTab('tipping')}
        className="w-full bg-white/10 text-[#E6DCB1] py-3 rounded-2xl border border-white/20 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all"
      >
        🔄 Switch to User View
      </button>

      {/* 🟢 COMMAND CENTER HEADER */}
      <div className="bg-[#BD3634] p-6 rounded-[2rem] shadow-xl border-b-4 border-black/20">
        <h2 className="text-xl font-black italic uppercase text-[#E6DCB1]">Admin Panel</h2>
        <div className="mt-4 bg-black/20 p-4 rounded-2xl">
          <p className="text-[8px] font-black uppercase opacity-60 text-[#E6DCB1]">Live Pool Balance</p>
          <p className="text-2xl font-black text-[#E6DCB1]">{poolBalance} ETH</p>
        </div>
      </div>

      {/* 🟡 TASK MANAGEMENT */}
      <div className="bg-white/10 p-5 rounded-[2rem] border border-white/20">
        <h3 className="text-[10px] font-black uppercase mb-4 text-[#CEAC5C]">Add Task</h3>
        <input 
          className="w-full bg-black/30 p-3 rounded-xl mb-2 text-sm text-white outline-none" 
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        />
        <input 
          className="w-full bg-black/30 p-3 rounded-xl mb-4 text-sm text-white outline-none" 
          placeholder="URL"
          value={newTask.url}
          onChange={(e) => setNewTask({...newTask, url: e.target.value})}
        />
        <button onClick={handleAddTask} className="w-full bg-[#CEAC5C] text-[#034F1B] py-3 rounded-xl font-black uppercase text-[10px]">
          Add to Santa List
        </button>
      </div>

      {/* 🔴 LIVE TASKS (WITH REMOVE BUTTON) */}
      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold">{task.title}</span>
            <button 
              onClick={() => handleRemoveTask(i)}
              className="bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}