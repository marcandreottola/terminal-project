'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hexLog, setHexLog] = useState<string[]>([]);

  // Converts text to MIDI-style Hex: Status (90) + Note (Hex) + Velocity (7F)
  const textToMidiHex = (char: string) => {
    const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    return `90 ${code} 7F`;
  };

  useEffect(() => {
    setMounted(true);
    
    // Track mouse for spatial parallax
    const handleMouseMove = (e: MouseEvent) => {
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
    const val = e.target.value;
    const lastChar = val.slice(-1);
    setInput(val);
    setIsTyping(true);

    if (lastChar) {
      const newHex = textToMidiHex(lastChar);
      setHexLog(prev => [newHex, ...prev].slice(0, 50)); // Keep last 50 entries
    }

    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* BACKGROUND: NASA LIVE FEED */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 grayscale contrast-150">
        <iframe 
          className="w-full h-full scale-[1.5]"
          src="https://www.youtube.com/embed/live_stream?channel=UCLA_DiR1FfKNvjuUpBHmylQ&autoplay=1&mute=1&controls=0&modestbranding=1"
          allow="autoplay"
        />
      </div>

      {/* CRT SCANLINE & GRID OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-10 transition-transform duration-75 ease-out"
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '80px 80px',
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.1)`
        }}
      />

      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-60 border-b border-white/10 bg-black/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-gray-600'}`} />
          <span>DEEP_SPACE_UPLINK // ISS_MONITOR_ACTIVE</span>
        </div>
        <div className="hidden sm:block font-bold">{time} UTC</div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-[1fr_100px] md:grid-cols-[1fr_220px] overflow-hidden z-20">
        
        {/* CENTER: INPUT AREA */}
        <div 
          className="flex flex-col items-center justify-center p-4 transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        >
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            placeholder="[WAITING_FOR_DATA_INPUT]"
            value={input}
            onChange={handleInputChange}
          />
          <div className="mt-8 text-[7px] tracking-[0.5em] opacity-20 border px-2 py-1 border-white/20">
            ENCRYPTION: AES-256_ACTIVE
          </div>
        </div>

        {/* RIGHT: MIDI/HEX TELEMETRY */}
        <div 
          className="bg-black/90 border-l border-white/10 p-4 flex flex-col gap-1 overflow-hidden transition-transform duration-150 ease-out"
          style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
        >
          <div className="text-[9px] mb-4 text-gray-500 border-b border-white/10 pb-2 tracking-widest">TRANSMISSION_HEX</div>
          
          <div className="flex flex-col gap-1">
            {hexLog.map((hex, i) => (
              <div 
                key={i} 
                className={`text-[10px] md:text-[13px] font-mono transition-all duration-200 ${i === 0 ? 'text-white' : 'text-gray-800'}`}
              >
                {hex}
              </div>
            ))}
            {/* Background noise to fill space */}
            {Array.from({ length: Math.max(0, 30 - hexLog.length) }).map((_, i) => (
              <div key={`noise-${i}`} className="text-[10px] text-gray-900 opacity-20">
                00 00 00
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-600 flex justify-between border-t border-white/10 bg-black/95 z-30">
        <div className="flex gap-4">
          <span>SIGNAL: STRONG</span>
          <span>LATENCY: 42ms</span>
        </div>
        <span>XAI_UPLINK_CORE_v11.5</span>
      </div>
    </main>
  );
}