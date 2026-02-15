'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stats
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('uplink_draft');
    if (saved) setInput(saved);

    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    localStorage.setItem('uplink_draft', val);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-[#eee] font-mono flex flex-col overflow-hidden">
      
      {/* THE SEN.COM LIVE FEED - Stable YouTube Embed */}
      <div className="absolute inset-0 z-0 opacity-40 grayscale contrast-125 pointer-events-none">
        <iframe 
          className="w-full h-full scale-[1.3]"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* INTERFACE OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-black/20" />

      {/* HEADER */}
      <div className="p-6 flex justify-between text-[10px] tracking-[0.3em] border-b border-white/10 bg-black/60 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-white/20'}`} />
          <span>SEN_RELAY // ISS_LIVE_4K</span>
        </div>
        <div className="hidden sm:block font-bold">{time} UTC</div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_220px] z-20">
        {/* WRITING AREA */}
        <div className="relative flex flex-col p-8 md:p-16">
          <textarea
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-xl md:text-2xl resize-none caret-white leading-relaxed uppercase drop-shadow-lg"
            placeholder="[AWAITING_DATA_INPUT...]"
            value={input}
            onChange={handleChange}
          />
        </div>

        {/* SIDEBAR METRICS */}
        <div className="bg-black/90 border-l border-white/10 p-8 flex flex-col gap-10 text-[10px] tracking-[0.2em] text-gray-500 shadow-2xl">
          <section>
            <p className="mb-4 text-white/30 border-b border-white/10 pb-2 font-bold uppercase">Telemetry</p>
            <div className="flex justify-between py-2 border-b border-white/5"><span>WORDS</span> <span className="text-white">{wordCount}</span></div>
            <div className="flex justify-between py-2 border-b border-white/5"><span>CHARS</span> <span className="text-white">{charCount}</span></div>
          </section>

          <section className="flex flex-col gap-3">
            <p className="mb-2 text-white/30 border-b border-white/10 pb-2 font-bold uppercase">Controls</p>
            <button 
              onClick={() => { if(confirm('CLEAR ALL DATA?')) { setInput(''); localStorage.removeItem('uplink_draft'); }}}
              className="text-left py-2 hover:text-red-500 transition-colors border border-white/5 px-3 hover:bg-white/5"
            >
              [ WIPE_BUFFER ]
            </button>
            <button 
              onClick={() => { navigator.clipboard.writeText(input); alert('DATA_COPIED'); }}
              className="text-left py-2 hover:text-green-500 transition-colors border border-white/5 px-3 hover:bg-white/5"
            >
              [ COPY_UPLINK ]
            </button>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[9px] text-gray-700 flex justify-between border-t border-white/10 bg-black z-30 uppercase tracking-widest">
        <span>Signal: Stable</span>
        <span>XAI_ORBITAL_NOTEPAD_v17.0</span>
      </div>
    </main>
  );
}