'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tileValues, setTileValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center (from -1 to 1)
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    const lastChar = e.target.value.slice(-1).toUpperCase();
    if (/^[A-Z0-9]$/.test(lastChar)) {
      setTileValues(prev => ({ ...prev, [lastChar]: Math.min((prev[lastChar] || 0) + 1, 60) }));
    }
    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* BACKGROUND DEPTH GRID */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-transform duration-75 ease-out"
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) scale(1.1)`
        }}
      />

      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-30 border-b border-white/5 bg-black z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-gray-600'}`} />
          <span>SYS_UPLINK // {isTyping ? 'DATA_TRANSFER' : 'READY'}</span>
        </div>
        <div>{time}</div>
      </div>

      {/* SPATIAL CONTENT GRID */}
      <div className="flex-1 grid grid-cols-[1fr_80px] md:grid-cols-[1fr_140px] overflow-hidden relative">
        
        {/* CENTER: INPUT AREA */}
        <div 
          className="flex flex-col items-center justify-center p-4 transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
        >
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white text-center"
            placeholder="TYPE_MESSAGE..."
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

        {/* RIGHT: PARALLAX DATA WALL */}
        <div 
          className="flex p-2 gap-1.5 md:gap-2 overflow-hidden select-none bg-black/40 border-l border-white/5 transition-transform duration-150 ease-out"
          style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col text-[8px] md:text-[9px] leading-tight flex-1">
              {Array.from({ length: 120 }).map((_, j) => (
                <span 
                  key={j} 
                  className={`transition-colors duration-500 ${isTyping ? 'text-white opacity-40' : 'text-gray-900 opacity-20'}`}
                >
                  {Math.random().toString(16).slice(2, 4).toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-700 flex justify-between border-t border-white/5 bg-black z-30">
        <span>COORDINATES: {mousePos.x.toFixed(2)} / {mousePos.y.toFixed(2)}</span>
        <span>XAI_SPATIAL_v9.0</span>
      </div>
    </main>
  );
}