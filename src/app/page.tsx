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
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleKeyDown = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 100);
  };

  if (!mounted) return <div className="bg-black h-screen" />;

  return (
    <main className={`bg-black h-screen text-white font-mono p-10 overflow-hidden flex relative transition-transform duration-75 ${isTyping ? 'translate-x-[1px] translate-y-[-1px] scale-[1.002]' : 'translate-x-0'}`}>
      
      {/* CRT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* HEADER */}
      <div className="absolute top-10 left-10 right-10 flex justify-between text-[10px] tracking-[0.5em] opacity-60 z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-white'}`} />
          <span>DAT_STRM // {isTyping ? 'PROCESSING' : 'IDLE'}</span>
        </div>
        <div>{time} // UTC</div>
      </div>

      {/* CENTERED INPUT AREA */}
      <div className="flex-1 flex items-center justify-center z-20">
        <div className="max-w-2xl w-full">
          <label className="block text-[10px] mb-4 text-gray-500 tracking-[0.4em]">INPUT_VECTOR_:</label>
          <textarea
            autoFocus
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none w-full h-64 text-2xl resize-none uppercase caret-white mix-blend-difference"
            placeholder="START_TYPING..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* RIGHT SIDE: DENSE DATA STREAM (REACTIVE) */}
      <div className={`w-40 border-l border-white/5 flex gap-1 px-2 overflow-hidden pointer-events-none transition-opacity duration-300 ${isTyping ? 'opacity-100' : 'opacity-20'}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex flex-col text-[8px] leading-none transition-colors duration-75 ${isTyping ? 'text-white' : 'text-gray-600'}`}>
            {Array.from({ length: 120 }).map((_, j) => (
              <span key={j} className="mb-0.5">
                {Math.random() > 0.95 && input.length > 0 
                  ? input.slice(-1) 
                  : Math.random().toString(16).slice(2, 4).toUpperCase()}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-10 left-10 text-[9px] text-gray-600 space-x-8">
        <span>[MEM_POOL: 1024MB]</span>
        <span>[BUFFER: {input.length.toString().padStart(4, '0')}]</span>
        <span className={isTyping ? 'text-white' : ''}>[BITRATE: {isTyping ? '99.2kbps' : '0.0kbps'}]</span>
      </div>

      {/* BACKGROUND GHOST TEXT (PULSING) */}
      <div className={`absolute bottom-0 left-10 text-[22vw] font-black italic uppercase tracking-tighter leading-none pointer-events-none transition-all duration-75 ${isTyping ? 'opacity-10 scale-110' : 'opacity-[0.03] scale-100'}`}>
        {input.slice(-4) || "----"}
      </div>
    </main>
  );
}