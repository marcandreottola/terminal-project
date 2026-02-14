'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [tileValues, setTileValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const lastChar = val.slice(-1).toUpperCase();
    setInput(val);
    setIsTyping(true);

    if (/^[A-Z0-9]$/.test(lastChar)) {
      setTileValues(prev => ({
        ...prev,
        [lastChar]: Math.min((prev[lastChar] || 0) + 1, 60)
      }));
    }
    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-30 border-b border-white/5 bg-black z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isTyping ? 'bg-red-600 shadow-[0_0_8px_red]' : 'bg-gray-600'}`} />
          <span>DAT_STRM // {isTyping ? 'BUSY' : 'READY'}</span>
        </div>
        <div className="hidden sm:block opacity-50">{time}</div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 grid grid-cols-[1fr_80px] md:grid-cols-[1fr_140px] overflow-hidden">
        
        {/* LEFT: INPUT AREA */}
        <div className="flex flex-col items-center justify-center p-4 border-r border-white/5">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white"
            placeholder="SYSTEM_IDLE..."
            value={input}
            onChange={handleInputChange}
          />
          
          <div className="flex flex-wrap justify-center gap-1 w-full max-w-lg mt-10">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((char) => (
              <div key={char} className="flex flex-col items-center">
                <div 
                  className="w-3 h-3 md:w-4 md:h-4 border border-white/10"
                  style={{ backgroundColor: `rgba(255, 255, 255, ${(tileValues[char] || 0) / 60})` }}
                />
                <span className="text-[5px] text-gray-800 mt-0.5">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DIMMED SIX-COLUMN WALL */}
        <div className="flex p-2 gap-1.5 md:gap-2 overflow-hidden select-none bg-black/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col text-[8px] md:text-[9px] leading-tight flex-1">
              {Array.from({ length: 120 }).map((_, j) => (
                <span 
                  key={j} 
                  className={`transition-colors duration-700 ${isTyping ? 'text-white opacity-40' : 'text-gray-900 opacity-20'}`}
                >
                  {Math.random().toString(16).slice(2, 4).toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-700 flex justify-between border-t border-white/5 bg-black">
        <span>MEM_ALLOC: 1024MB</span>
        <span>XAI_DIM_CORE_v1.0</span>
      </div>
    </main>
  );
}