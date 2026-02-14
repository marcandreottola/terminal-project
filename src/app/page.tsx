'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Create an object to store the 'fill' value (0-60) for each key
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

    // Update the specific tile value for the key pressed
    if (/^[A-Z0-9]$/.test(lastChar)) {
      setTileValues(prev => ({
        ...prev,
        [lastChar]: Math.min((prev[lastChar] || 0) + 1, 60)
      }));
    }

    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return <div className="bg-black h-screen" />;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const numbers = "0123456789".split("");

  return (
    <main className="bg-black h-screen text-white font-mono p-10 overflow-hidden flex relative">
      {/* CRT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* HEADER */}
      <div className="absolute top-10 left-10 right-10 flex justify-between text-[10px] tracking-[0.5em] opacity-60 z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-white'}`} />
          <span>DAT_STRM // {isTyping ? 'PROCESSING' : 'IDLE'}</span>
        </div>
        <div>{time} // UTC</div>
      </div>

      {/* CENTERED INPUT AREA */}
      <div className="flex-1 flex flex-col items-center justify-center z-20">
        <div className="max-w-2xl w-full">
          <label className="block text-[10px] mb-4 text-gray-500 tracking-[0.4em]">INPUT_VECTOR_:</label>
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full h-48 text-2xl resize-none uppercase caret-white"
            placeholder="START_TYPING..."
            value={input}
            onChange={handleInputChange}
          />
        </div>

        {/* HORIZONTAL TILE BAR (A-Z, 0-9) */}
        <div className="flex flex-col items-center gap-2 mt-20">
          <div className="flex gap-1">
            {alphabet.map((char) => (
              <div key={char} className="flex flex-col items-center gap-1">
                <div 
                  className="w-4 h-4 border border-white/10 transition-colors duration-200"
                  style={{ 
                    backgroundColor: `rgba(255, 255, 255, ${(tileValues[char] || 0) / 60})`,
                    boxShadow: tileValues[char] > 0 ? `0 0 ${tileValues[char] / 4}px rgba(255,255,255,0.3)` : 'none'
                  }}
                />
                <span className="text-[6px] text-gray-600">{char}</span>
              </div>
            ))}
            <div className="w-[1px] h-6 bg-white/10 mx-2" /> {/* Divider */}
            {numbers.map((num) => (
              <div key={num} className="flex flex-col items-center gap-1">
                <div 
                  className="w-4 h-4 border border-white/10 transition-colors duration-200"
                  style={{ 
                    backgroundColor: `rgba(255, 255, 255, ${(tileValues[num] || 0) / 60})`,
                    boxShadow: tileValues[num] > 0 ? `0 0 ${tileValues[num] / 4}px rgba(255,255,255,0.3)` : 'none'
                  }}
                />
                <span className="text-[6px] text-gray-600">{num}</span>
              </div>
            ))}
          </div>
          <div className="text-[8px] text-gray-500 tracking-[0.2em] mt-2">KEYBOARD_REGISTER_LOAD</div>
        </div>
      </div>

      {/* RIGHT SIDE: EXPANDED DATA STREAM (Edge aligned) */}
      <div className="absolute top-0 bottom-0 right-2 w-64 border-l border-white/5 flex gap-1 px-2 py-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col text-[8px] leading-[1.2] opacity-40">
            {Array.from({ length: 150 }).map((_, j) => (
              <span key={j} className={`transition-colors duration-500 ${isTyping ? 'text-white' : 'text-gray-700'}`}>
                {Math.random().toString(16).slice(2, 4).toUpperCase()}
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
    </main>
  );
}