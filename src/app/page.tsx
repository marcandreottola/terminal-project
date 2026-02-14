'use client';
import { useEffect, useState, useMemo } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Fix hydration and start clock
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Handle typing state for smooth transitions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 800); // Slower fade out
    return () => clearTimeout(timeout);
  };

  // Generate a static "Lunar Map" grid (square tiles)
  const lunarTiles = useMemo(() => {
    return Array.from({ length: 48 }).map(() => Math.random());
  }, []);

  if (!mounted) return <div className="bg-black h-screen" />;

  return (
    <main className="bg-black h-screen text-white font-mono p-10 overflow-hidden flex relative selection:bg-white selection:text-black">
      {/* CRT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* HEADER */}
      <div className="absolute top-10 left-10 right-10 flex justify-between text-[10px] tracking-[0.5em] opacity-40 z-30">
        <div>ORBITAL_PHASE // {input.length > 0 ? 'ACTIVE_TRANS' : 'STABLE'}</div>
        <div>{time} // UTC</div>
      </div>

      {/* CENTERED INPUT AREA */}
      <div className="flex-1 flex flex-col items-center justify-center z-20">
        <div className="max-w-2xl w-full">
          <label className="block text-[10px] mb-4 text-gray-500 tracking-[0.4em] opacity-50">SURFACE_COMM_LINK:</label>
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full h-32 text-2xl resize-none uppercase caret-white transition-opacity duration-1000"
            placeholder="TYPE_TO_SCAN..."
            value={input}
            onChange={handleInputChange}
          />
        </div>

        {/* LUNAR SURFACE TILES (Initiated by typing) */}
        <div className={`grid grid-cols-12 gap-1 mt-12 transition-all duration-1000 ease-in-out ${input.length > 0 ? 'opacity-40 scale-100' : 'opacity-0 scale-95'}`}>
          {lunarTiles.map((val, i) => (
            <div 
              key={i} 
              className="w-8 h-8 border border-white/10 transition-colors duration-700"
              style={{ 
                backgroundColor: `rgba(255, 255, 255, ${val * (isTyping ? 0.3 : 0.1)})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: GLOWING DATA STREAM */}
      <div className="w-40 border-l border-white/10 flex gap-2 px-4 overflow-hidden pointer-events-none font-mono">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col text-[8px] leading-none">
            {Array.from({ length: 120 }).map((_, j) => {
              const char = Math.random().toString(16).slice(2, 3).toUpperCase();
              return (
                <span 
                  key={j} 
                  className={`mb-1 transition-all duration-700 ${isTyping ? 'text-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-500 shadow-[0_0_3px_rgba(255,255,255,0.2)]'}`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-10 left-10 text-[9px] text-gray-600 flex gap-8">
        <span className="animate-pulse">● SIGNAL_STABLE</span>
        <span>LAT: 0.6740 | LONG: 23.4720</span>
      </div>
    </main>
  );
}