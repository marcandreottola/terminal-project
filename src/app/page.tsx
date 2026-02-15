'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* FULLSCREEN VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <iframe 
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-50 grayscale contrast-125"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* CRT SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]" />

      {/* HEADER */}
      <div className="p-6 md:p-10 flex justify-between text-[11px] tracking-[0.5em] border-b border-white/10 bg-black/60 backdrop-blur-md z-30 uppercase">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_12px_red]' : 'bg-green-500'}`} />
          <span>Sen_Orbital_Uplink // Live_4K</span>
        </div>
        <div className="font-bold">{time} UTC</div>
      </div>

      {/* CENTERED MAIN INTERFACE */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-20">
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full h-64 text-2xl md:text-5xl resize-none uppercase caret-white text-center tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            placeholder="[ AWAITING_INPUT ]"
            value={input}
            onChange={handleChange}
          />
          
          {/* STATS BAR UNDER INPUT */}
          <div className="flex gap-12 text-[10px] tracking-[0.3em] text-white/30 uppercase border-t border-white/10 pt-6 w-full justify-center">
            <div className="flex gap-2"><span>Words:</span> <span className="text-white">{input.trim() ? input.trim().split(/\s+/).length : 0}</span></div>
            <div className="flex gap-2"><span>Chars:</span> <span className="text-white">{input.length}</span></div>
            <div className="flex gap-2"><span>Signal:</span> <span className="text-green-500">Nominal</span></div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[9px] text-gray-600 flex justify-between border-t border-white/10 bg-black/90 z-30 uppercase tracking-[0.3em]">
        <span>Encrypted_Uplink_Active</span>
        <span>XAI_CORE_v20.0</span>
      </div>
    </main>
  );
}