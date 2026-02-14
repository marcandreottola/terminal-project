'use client';
import { useEffect, useState, useMemo } from 'react';

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

  // Generate stable random chars so they don't flicker too wildly
  const staticChars = useMemo(() => 
    Array.from({ length: 600 }).map(() => Math.random().toString(36).slice(2, 3).toUpperCase()), 
  []);

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
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-40 border-b border-white/5 bg-black z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-white'}`} />
          <span>DAT_STRM // {isTyping ? 'BUSY' : 'READY'}</span>
        </div>
        <div className="hidden sm:block">{time}</div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 grid grid-cols-[1fr_100px] md:grid-cols-[1fr_220px] overflow-hidden">
        
        {/* LEFT: INPUT & TILES */}
        <div className="flex flex-col items-center justify-center p-4 border-r border-white/5">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-lg md:text-xl resize-none uppercase caret-white"
            placeholder="ENTER_DATA..."
            value={input}
            onChange={handleInputChange}
          />
          
          {/* TILE BAR */}
          <div className="flex flex-wrap justify-center gap-1 w-full max-w-lg mt-10">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((char) => (
              <div key={char} className="flex flex-col items-center">
                <div 
                  className="w-3 h-3 md:w-4 md:h-4 border border-white/10"
                  style={{ backgroundColor: `rgba(255, 255, 255, ${(tileValues[char] || 0) / 60})` }}
                />
                <span className="text-[5px] text-gray-700 mt-0.5">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: THE SEAMLESS WALL */}
        {/* We use a grid with 0 gap to ensure characters touch perfectly */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-0 bg-black overflow-hidden select-none border-l border-white/5">
          {staticChars.map((char, i) => (
            <div 
              key={i} 
              className={`
                flex items-center justify-center
                text-[10px] md:text-[14px] 
                h-[15px] md:h-[20px] 
                border-[0.5px] border-white/5
                transition-colors duration-200
                ${isTyping ? 'text-white bg-white/5' : 'text-gray-900 bg-transparent'}
              `}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-600 flex justify-between border-t border-white/5 bg-black">
        <span>MEM_ALLOC: 1024MB</span>
        <span>XAI_SYSTEM_v4.0</span>
      </div>
    </main>
  );
}