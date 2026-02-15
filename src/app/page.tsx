'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hexLog, setHexLog] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const textToMidiHex = (char: string) => {
    const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    return `90 ${code} 7F`;
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);

    // STARFIELD BACKUP ENGINE
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.2,
      speed: Math.random() * 0.4 + 0.1
    }));

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += isTyping ? star.speed * 4 : star.speed;
        if (star.y > canvas.height) star.y = 0;
      });
      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      clearInterval(timer);
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const lastChar = val.slice(-1);
    setInput(val);
    setIsTyping(true);
    if (lastChar) {
      setHexLog(prev => [textToMidiHex(lastChar), ...prev].slice(0, 40));
    }
    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* SEN LIVE 4K FEED LAYER */}
      <div className="absolute inset-0 z-0 opacity-30 grayscale contrast-125">
        <iframe 
          className="w-full h-full scale-[1.2]"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* STARFIELD LAYER (BACKUP/OVERLAY) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-screen" />

      {/* HUD SCANLINES */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-60 border-b border-white/10 bg-black/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-gray-600'}`} />
          <span>SEN_SPACE_RELAY // ISS_4K_ACTIVE</span>
        </div>
        <div>{time} UTC</div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 grid grid-cols-[1fr_100px] md:grid-cols-[1fr_240px] overflow-hidden z-20">
        <div className="flex flex-col items-center justify-center p-4">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            placeholder="[SYSTEM_READY]"
            value={input}
            onChange={handleInputChange}
          />
        </div>

        {/* RIGHT: MIDI/HEX LOG */}
        <div className="bg-black/95 border-l border-white/10 p-4 flex flex-col gap-1 overflow-hidden">
          <div className="text-[9px] mb-4 text-gray-500 border-b border-white/10 pb-2 tracking-widest">UPLINK_HEX</div>
          {hexLog.map((hex, i) => (
            <div key={i} className={`text-[10px] md:text-[13px] ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{hex}</div>
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`n-${i}`} className="text-[10px] text-gray-900 opacity-20 font-mono">00 00 00</div>
          ))}
        </div>
      </div>

      <div className="p-4 text-[8px] text-gray-600 flex justify-between border-t border-white/10 bg-black/95 z-30">
        <span>RELAY: SEN_ORBITAL</span>
        <span>XAI_UPLINK_v16.0</span>
      </div>
    </main>
  );
}