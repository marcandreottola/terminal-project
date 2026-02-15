'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hexLog, setHexLog] = useState<string[]>([]);

  const textToMidiHex = (char: string) => {
    const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    return `90 ${code} 7F`;
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const lastChar = val.slice(-1);
    setInput(val);
    setIsTyping(true);
    if (lastChar) {
      setHexLog(prev => [textToMidiHex(lastChar), ...prev].slice(0, 30));
    }
    setTimeout(() => setIsTyping(false), 300);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* THE SEN.COM FEED - Using the direct 4K YouTube Live URL */}
      <div className="absolute inset-0 z-0 opacity-40 grayscale contrast-125 pointer-events-none">
        <iframe 
          className="w-full h-full scale-[1.5]"
          src="https://www.youtube.com/embed/fO9e9jnhYK8?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* OVERLAYS FOR THE HMI LOOK */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-black/20" />

      {/* HEADER */}
      <div className="p-6 flex justify-between text-[10px] tracking-[0.4em] border-b border-white/10 bg-black/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-white/20'}`} />
          <span>SEN_ORBITAL_UPLINK // LIVE_FEED</span>
        </div>
        <div>{time} UTC</div>
      </div>

      {/* CENTERED CONTENT */}
      <div className="flex-1 grid grid-cols-[1fr_240px] z-20 overflow-hidden">
        
        <div className="flex flex-col items-center justify-center p-4">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-2xl h-64 text-2xl md:text-4xl resize-none uppercase caret-white text-center drop-shadow-2xl leading-tight"
            placeholder="TYPE_MESSAGE..."
            value={input}
            onChange={handleChange}
          />
        </div>

        {/* SIDEBAR TELEMETRY */}
        <div className="bg-black/95 border-l border-white/10 p-6 flex flex-col gap-1 overflow-hidden">
          <p className="text-[9px] mb-4 text-gray-500 border-b border-white/10 pb-2 tracking-widest">HEX_STREAM</p>
          {hexLog.map((hex, i) => (
            <div key={i} className={`text-[12px] ${i === 0 ? 'text-white font-bold' : 'text-gray-800'}`}>{hex}</div>
          ))}
        </div>
      </div>

      <div className="p-4 text-[9px] text-gray-600 flex justify-between border-t border-white/10 bg-black z-30 uppercase tracking-[0.2em]">
        <span>Status: Online</span>
        <span>Build: v19.0_STABLE</span>
      </div>
    </main>
  );
}