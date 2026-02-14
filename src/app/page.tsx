'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Track which video "angle" we are on for each of the 3 feeds
  const [angles, setAngles] = useState([0, 1, 2]);

  // A list of sample surveillance-style plant videos 
  // (In production, replace these with your own Pexels/hosted links)
  const plantFeeds = [
    "https://assets.mixkit.co/videos/preview/mixkit-green-leaves-of-a-plant-1043-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-green-leaves-34505-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-swaying-green-leaves-in-the-forest-34504-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-leaves-of-a-plant-in-the-wind-1044-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-sunlight-on-plant-leaves-1045-large.mp4"
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setIsTyping(true);

    // Shift angles every time a letter is struck
    setAngles(prev => prev.map(() => Math.floor(Math.random() * plantFeeds.length)));

    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <div className="p-4 flex justify-between text-[10px] tracking-[0.4em] opacity-40 border-b border-white/5 bg-black z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500' : 'bg-white'}`} />
          <span>BOTANICAL_SURVEILLANCE // FEED_ACTIVE</span>
        </div>
        <div>{time}</div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_80px] md:grid-cols-[1fr_140px] overflow-hidden">
        
        {/* CENTER COLUMN: VIDEOS + INPUT */}
        <div className="flex flex-col border-r border-white/5 bg-[#050505]">
          
          {/* TRIPLE FEED SECTION */}
          <div className="grid grid-cols-3 h-48 md:h-64 border-b border-white/10 overflow-hidden bg-black">
            {angles.map((angleIndex, i) => (
              <div key={i} className="relative border-r border-white/5 last:border-r-0 group">
                <div className="absolute top-2 left-2 text-[8px] z-10 bg-black/50 px-1 font-bold text-red-500">
                  CAM_0{i + 1} // {isTyping ? 'SWITCHING' : 'LIVE'}
                </div>
                <video 
                  key={plantFeeds[angleIndex]} // Key forces re-render/jump on change
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover grayscale opacity-40 contrast-125 brightness-75"
                >
                  <source src={plantFeeds[angleIndex]} type="video/mp4" />
                </video>
                {/* Surveillance Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[0.5px] border-white/5" />
              </div>
            ))}
          </div>

          {/* INPUT AREA */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            <textarea
              autoFocus
              className="bg-transparent border-none outline-none w-full max-w-lg h-32 text-xl md:text-2xl resize-none uppercase caret-white text-center z-10"
              placeholder="ENTER_OBSERVATION..."
              value={input}
              onChange={handleInputChange}
            />
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] text-[15vw] font-bold select-none">
              XAI_PLANT
            </div>
          </div>
        </div>

        {/* RIGHT: DATA WALL */}
        <div className="flex p-2 gap-2 overflow-hidden select-none opacity-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col text-[8px] md:text-[9px] leading-tight flex-1">
              {Array.from({ length: 120 }).map((_, j) => (
                <span key={j} className="text-gray-600">
                  {Math.random().toString(16).slice(2, 4).toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-700 flex justify-between border-t border-white/5 bg-black">
        <span>BIO_METRIC: STABLE</span>
        <span>XAI_PLANT_MONITOR_v10.0</span>
      </div>
    </main>
  );
}