'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tileValues, setTileValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setMounted(true);
    
    // Start Webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Camera access denied", err));
    }

    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    return () => clearInterval(timer);
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
      
      {/* WEBCAM LAYER - Spatial HUD Effect */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale sepia brightness-50 pointer-events-none scale-x-[-1]"
      />

      {/* CRT SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-40 border-b border-white/5 bg-black/60 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-white'}`} />
          <span>HUD_UPLINK // {isTyping ? 'SENSORS_ACTIVE' : 'STANDBY'}</span>
        </div>
        <div>{time} // UTC</div>
      </div>

      {/* MAIN HUD CONTENT */}
      <div className="flex-1 grid grid-cols-[1fr_80px] md:grid-cols-[1fr_140px] overflow-hidden z-20">
        
        {/* CENTER: USER INPUT AREA */}
        <div className="flex flex-col items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white text-center shadow-inner"
            placeholder="[SYSTEM_AWAITING_INPUT]"
            value={input}
            onChange={handleInputChange}
          />
          
          {/* TILE REGISTER */}
          <div className="flex flex-wrap justify-center gap-1 w-full max-w-lg mt-10">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((char) => (
              <div key={char} className="flex flex-col items-center">
                <div 
                  className="w-3 h-3 md:w-4 md:h-4 border border-white/20"
                  style={{ backgroundColor: `rgba(255, 255, 255, ${(tileValues[char] || 0) / 60})` }}
                />
                <span className="text-[5px] text-gray-500 mt-0.5">{char}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DIMMED SIX-COLUMN WALL */}
        <div className="flex p-2 gap-2 overflow-hidden select-none bg-black/60 border-l border-white/10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col text-[8px] md:text-[9px] leading-tight flex-1">
              {Array.from({ length: 120 }).map((_, j) => (
                <span key={j} className={`transition-colors duration-500 ${isTyping ? 'text-white opacity-40' : 'text-gray-900 opacity-20'}`}>
                  {Math.random().toString(16).slice(2, 4).toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-600 flex justify-between border-t border-white/5 bg-black/80 z-30">
        <span>SENSORS: CAMERA_01_ACTIVE</span>
        <span>XAI_HUD_v8.0</span>
      </div>
    </main>
  );
}