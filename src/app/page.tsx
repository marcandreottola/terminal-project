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
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-40 border-b border-white/5 bg-black z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500' : 'bg-white'}`} />
          <span>DAT_STRM // {isTyping ? 'BUSY' : 'READY'}</span>
        </div>
        <div>{time}</div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_100px] md:grid-cols-[1fr_220px] overflow-hidden">
        
        {/* LEFT: INPUT AREA */}
        <div className="flex flex-col items-center justify-center p-4 border-r border-white/5">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white"
            placeholder="TYPE_SYSTEM_INPUT..."
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
                <span className="text-[5px] text-gray-700 mt-0.5">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: THE SEAMLESS WALL (No Columns, just one text block) */}
        <div className="bg-black overflow-hidden select-none border-l border-white/5 p-0">
          <p className={`
            break-all 
            text-[11px] md:text-[15px] 
            leading-[0.85] 
            tracking-normal 
            text-left 
            w-full 
            h-full
            transition-colors 
            duration-150
            ${isTyping ? 'text-white' : 'text-gray-900'}
          `}>
            {Array.from({ length: 2000 }).map(() => 
              Math.random().toString(36).slice(2, 3).toUpperCase()
            ).join('')}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-600 flex justify-between border-t border-white/5 bg-black">
        <span>MEM_ALLOC: 1024MB</span>
        <span>XAI_SYSTEM_v6.0</span>
      </div>
    </main>
  );
}