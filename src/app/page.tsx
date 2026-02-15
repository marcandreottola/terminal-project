'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [satelliteLog, setSatelliteLog] = useState<string[]>([]);
  const [globalStream, setGlobalStream] = useState<string[]>([]);
  
  const [telemetry, setTelemetry] = useState({ lat: '00.0000', long: '00.0000' });

  // Satellite Catalog for the "Trigger"
  const satCatalog = ["STARLINK-512", "ISS (ZARYA)", "COSMOS 2551", "GPS III-SV05", "NOAA-19", "TIANGONG", "ENVISAT", "IRIDIUM 142", "HUBBLE", "ONEWEB-0421", "GOES-16", "METEOSAT-11"];

  useEffect(() => {
    setMounted(true);
    
    // 1. Fetch Real ISS Position (Secure Relay)
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await res.json();
        setTelemetry({
          lat: parseFloat(data.latitude).toFixed(4),
          long: parseFloat(data.longitude).toFixed(4)
        });
      } catch (e) { /* Fallback to zero */ }
    };

    // 2. Constant Global Stream (The "Thousands of Satellites" feel)
    const streamInterval = setInterval(() => {
      const randomID = `SAT-${Math.floor(10000 + Math.random() * 90000)}-${Math.random() > 0.5 ? 'LEO' : 'GEO'}`;
      setGlobalStream(prev => [randomID, ...prev].slice(0, 50));
    }, 150);

    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
      fetchISS();
    }, 3000);

    return () => { clearInterval(timer); clearInterval(streamInterval); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setIsTyping(true);
    
    // Trigger: Pick a satellite code whenever a letter is typed
    if (val.length > input.length) {
      const randomSat = satCatalog[Math.floor(Math.random() * satCatalog.length)];
      setSatelliteLog(prev => [`[${randomSat}] CAPTURED`, ...prev].slice(0, 15));
    }
    
    setTimeout(() => setIsTyping(false), 300);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-[#050505] text-[#a0a0a0] font-mono flex flex-col overflow-hidden font-light">
      
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 grayscale contrast-150">
        <iframe 
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* HEADER */}
      <div className="p-4 flex justify-between text-[9px] tracking-[0.5em] border-b border-white/5 bg-black/80 backdrop-blur-sm z-30 uppercase">
        <div className="flex items-center gap-4">
          <div className={`w-1 h-1 rounded-full ${isTyping ? 'bg-white' : 'bg-white/10'}`} />
          <span>XAI_SATELLITE_UPLINK // DATA_STREAMS</span>
        </div>
        <div>{time} UTC</div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_280px] z-20 overflow-hidden">
        
        {/* CENTERED INPUT AREA (Refined Typography) */}
        <div className="flex flex-col items-center justify-center p-4">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-xl h-48 text-lg md:text-xl resize-none uppercase caret-white text-center tracking-widest text-white/70 font-light"
            placeholder="[ AWAIT_INPUT ]"
            value={input}
            onChange={handleChange}
          />
        </div>

        {/* DATA SIDEBAR */}
        <div className="bg-black/90 border-l border-white/5 flex flex-col overflow-hidden text-[9px] tracking-widest">
          
          {/* BOX 1: REAL ISS POSITION */}
          <div className="p-5 border-b border-white/5 bg-white/[0.01]">
            <p className="mb-3 text-white/30 uppercase">Current_Position</p>
            <div className="space-y-1">
              <div className="flex justify-between"><span>LAT:</span> <span>{telemetry.lat}</span></div>
              <div className="flex justify-between"><span>LNG:</span> <span>{telemetry.long}</span></div>
            </div>
          </div>

          {/* BOX 2: CAPTURED SATELLITES (Triggered by Typing) */}
          <div className="p-5 border-b border-white/5 h-[200px] overflow-hidden">
            <p className="mb-3 text-white/30 uppercase">Uplink_Capture</p>
            <div className="space-y-1 text-white/80">
              {satelliteLog.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-white' : 'opacity-40'}>{log}</div>
              ))}
            </div>
          </div>

          {/* BOX 3: GLOBAL DATA STREAM (Continuous) */}
          <div className="p-5 flex-1 overflow-hidden opacity-30">
            <p className="mb-3 text-white/10 uppercase">Global_Catalog_Stream</p>
            <div className="space-y-0.5 font-thin">
              {globalStream.map((id, i) => (
                <div key={i}>{id}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-3 text-[8px] text-gray-700 flex justify-between border-t border-white/5 bg-black z-30 uppercase tracking-[0.4em]">
        <div className="flex gap-10">
          <span>DATA_RATE: 48.2 KB/S</span>
          <span>BUFFER: OPTIMAL</span>
        </div>
        <span>XAI_IKEDA_ENGINE_v23.0</span>
      </div>
    </main>
  );
}