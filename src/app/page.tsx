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

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const numbers = "0123456789".split("");

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden selection:bg-white selection:text-black">
      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-50 border-b border-white/5 bg-black z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 animate-pulse' : 'bg-white'}`} />
          <span>DAT_STRM // {isTyping ? 'BUSY' : 'READY'}</span>
        </div>
        <div className="hidden sm:block">{time}</div>
      </div>

      {/* SECURE GRID SYSTEM */}
      <div className="flex-1 grid grid-cols-[1fr_80px] md:grid-cols-[1fr_220px] overflow-hidden">
        
        {/* CENTER: TILES & INPUT */}
        <div className="relative flex flex-col items-center justify-center p-4 overflow-y-auto border-r border-white/5">
          <div className="w-full max-w-lg mb-8">
            <label className="block text-[8px] text-gray-600 mb-2 tracking-widest uppercase">User_Uplink_Primary</label>
            <textarea
              autoFocus
              className="bg-transparent border-none outline-none w-full h-32 md:h-40 text-lg md:text-xl resize-none uppercase caret-white"
              placeholder="ENTER_DATA..."
              value={input}
              onChange={handleInputChange}
            />
          </div>

          {/* TILE REGISTER */}
          <div className="flex flex-wrap justify-center gap-0.5 md:gap-1 w-full max-w-lg pb-10">
            {[...alphabet, ...numbers].map((char) => (
              <div key={char} className="flex flex-col items-center">
                <div 
                  className="w-2.5 h-2.5 md:w-4 md:h-4 border border-white/10 transition-colors"
                  style={{ backgroundColor: `rgba(255, 255, 255, ${(tileValues[char] || 0) / 60})` }}
                />
                <span className="text-[4px] md:text-[5px] text-gray-700 mt-0.5">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: UNIFORM WALL OF CODE */}
        {/* We use 'justify-end' to keep them locked to the right edge */}
        <div className="flex justify-end p-1 md:p-2 gap-1 md:gap-2 overflow-hidden select-none bg-black/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="flex flex-col text-[7px] md:text-[9px] leading-tight break-all opacity-40 w-[10px] md:w-[28px] shrink-0"
            >
              {Array.from({ length: 150 }).map((_, j) => (
                <span key={j} className={`transition-colors duration-300 ${isTyping ? 'text-white' : 'text-gray-800'}`}>
                  {Math.random().toString(36).slice(2, 4).toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-600 flex justify-between border-t border-white/5 bg-black z-30">
        <span>MEM_ALLOC: 1024MB</span>
        <span>XAI_SYSTEM_v2.1</span>
      </div>
    </main>
  );
}