'use client';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [satelliteLog, setSatelliteLog] = useState<string[]>([]);
  const [globalStream, setGlobalStream] = useState<string[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState({ lat: '00.0000', long: '00.0000' });

  const satCatalog = ["STARLINK-512", "ISS (ZARYA)", "COSMOS 2551", "GPS III-SV05", "NOAA-19", "TIANGONG", "ENVISAT", "IRIDIUM 142", "HUBBLE", "ONEWEB-0421", "GOES-16", "METEOSAT-11"];

  useEffect(() => {
    setMounted(true);
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await res.json();
        setTelemetry({ lat: parseFloat(data.latitude).toFixed(4), long: parseFloat(data.longitude).toFixed(4) });
      } catch (e) { /* Link silent */ }
    };

    const streamInterval = setInterval(() => {
      const randomID = `SAT-${Math.floor(10000 + Math.random() * 90000)}-${Math.random() > 0.5 ? 'LEO' : 'GEO'}`;
      setGlobalStream(prev => [randomID, ...prev].slice(0, 50));
    }, 120);

    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
      fetchISS();
    }, 5000);

    return () => { clearInterval(timer); clearInterval(streamInterval); };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processCommand(input);
      setInput('');
    }
  };

  const processCommand = (cmd: string) => {
    const query = cmd.toLowerCase();
    let reply = "UNRECOGNIZED_QUERY // DATA_NOT_FOUND";
    
    // Simple logic based on your Digitakt Manual interest or general space
    if (query.includes('digitakt') || query.includes('lfo')) {
      reply = "DIGITAKT_II_OS_1.15: LFO MODULATION ASSIGNABLE VIA PAGE 2. SELECT WAVEFORM: TRI/SQU/RND.";
    } else if (query.includes('status')) {
      reply = "ALL SYSTEMS NOMINAL. LINK MARGIN: +14.2dB. ENCRYPTION: ACTIVE.";
    } else if (query.includes('who')) {
      reply = "OPERATOR_01 // ORBITAL_NODE_PRIMARY.";
    }

    setResponse(null); // Reset
    setTimeout(() => setResponse(reply), 200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setIsTyping(true);
    if (val.length > input.length) {
      const randomSat = satCatalog[Math.floor(Math.random() * satCatalog.length)];
      setSatelliteLog(prev => [`[${randomSat}] CAPTURED`, ...prev].slice(0, 10));
    }
    setTimeout(() => setIsTyping(false), 300);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-[#050505] text-[#888] font-mono flex flex-col overflow-hidden font-light">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 grayscale contrast-150">
        <iframe 
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* HEADER */}
      <div className="p-4 flex justify-between text-[8px] tracking-[0.6em] border-b border-white/5 bg-black/80 backdrop-blur-sm z-30 uppercase">
        <div className="flex items-center gap-4">
          <div className={`w-1 h-1 rounded-full ${isTyping ? 'bg-white' : 'bg-white/10'}`} />
          <span>ORBITAL_UPLINK_STATION // NODE_ALPHA</span>
        </div>
        <div>{time} UTC</div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_300px] z-20 overflow-hidden">
        
        {/* CENTERED INPUT */}
        <div className="flex flex-col items-center justify-center p-4">
          <textarea
            autoFocus
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none w-full max-w-xl h-48 text-base md:text-lg resize-none uppercase caret-white text-center tracking-[0.2em] text-white/60 font-light"
            placeholder="[ AWAIT_COMMAND ]"
            value={input}
            onChange={handleChange}
          />
          <div className="text-[7px] mt-4 opacity-20 tracking-widest uppercase">Press_Enter_to_Transmit</div>
        </div>

        {/* DATA SIDEBAR */}
        <div className="bg-black/95 border-l border-white/5 flex flex-col overflow-hidden text-[9px] tracking-widest">
          
          <div className="p-5 border-b border-white/5">
            <p className="mb-3 text-white/20 uppercase">Orbital_Position</p>
            <div className="space-y-1">
              <div className="flex justify-between"><span>LAT:</span> <span className="text-white/80">{telemetry.lat}</span></div>
              <div className="flex justify-between"><span>LNG:</span> <span className="text-white/80">{telemetry.long}</span></div>
            </div>
          </div>

          {/* RESPONSE BOX (New feature) */}
          <div className="p-5 border-b border-white/5 bg-white/[0.02] min-h-[100px]">
            <p className="mb-3 text-white/20 uppercase">Response_Stream</p>
            <div className="text-white leading-relaxed">
              {response ? `> ${response}` : '---'}
            </div>
          </div>

          <div className="p-5 border-b border-white/5 h-[150px] overflow-hidden">
            <p className="mb-3 text-white/20 uppercase">Satellite_Capture</p>
            <div className="space-y-1 text-white/40">
              {satelliteLog.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-white/70' : ''}>{log}</div>
              ))}
            </div>
          </div>

          <div className="p-5 flex-1 overflow-hidden opacity-20">
            <p className="mb-3 text-white/10 uppercase">Global_Catalog_Relay</p>
            <div className="space-y-0.5">
              {globalStream.map((id, i) => (
                <div key={i}>{id}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 text-[8px] text-gray-800 flex justify-between border-t border-white/5 bg-black z-30 uppercase tracking-[0.5em]">
        <span>LINK_STABILITY: 98.4%</span>
        <span>CORE_REDACTED_ENGINE_v24.0</span>
      </div>
    </main>
  );
}