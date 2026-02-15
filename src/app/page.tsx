'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hexLog, setHexLog] = useState<string[]>([]);
  
  // Real-time ISS Telemetry
  const [telemetry, setTelemetry] = useState({
    lat: 'FETCHING...',
    long: 'FETCHING...',
    alt: '408.2 KM',
    vel: '27,580 KM/H'
  });

  const textToMidiHex = (char: string) => {
    const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    return `90 ${code} 7F`;
  };

  useEffect(() => {
    setMounted(true);
    
    // Live Clock & ISS Data Fetching
    const fetchISS = async () => {
      try {
        const res = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await res.json();
        setTelemetry(prev => ({
          ...prev,
          lat: `${parseFloat(data.iss_position.latitude).toFixed(4)}°`,
          long: `${parseFloat(data.iss_position.longitude).toFixed(4)}°`
        }));
      } catch (e) {
        console.error("Link Failure");
      }
    };

    fetchISS();
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
      fetchISS(); // Update position every 5 seconds
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const lastChar = val.slice(-1);
    setInput(val);
    setIsTyping(true);
    if (lastChar) {
      setHexLog(prev => [textToMidiHex(lastChar), ...prev].slice(0, 25));
    }
    setTimeout(() => setIsTyping(false), 300);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* BACKGROUND VIDEO - SCALE FIXED */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <iframe 
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-30 grayscale contrast-125"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* INTERFACE OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_3px]" />

      {/* HEADER */}
      <div className="p-4 md:p-6 flex justify-between text-[10px] tracking-[0.4em] border-b border-white/10 bg-black/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500'}`} />
          <span>SEN_ORBITAL_LINK // ISS_POSITION_REALTIME</span>
        </div>
        <div>{time} UTC</div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_260px] z-20 overflow-hidden">
        
        {/* CENTERED UPLINK AREA */}
        <div className="flex flex-col items-center justify-center p-4">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-2xl h-64 text-2xl md:text-5xl resize-none uppercase caret-white text-center drop-shadow-2xl font-bold tracking-tighter"
            placeholder="[ ENTER_UPLINK ]"
            value={input}
            onChange={handleChange}
          />
        </div>

        {/* SIDEBAR TELEMETRY */}
        <div className="bg-black/95 border-l border-white/10 flex flex-col overflow-hidden shadow-2xl">
          
          {/* SATELLITE POSITION DATA */}
          <div className="p-6 border-b border-white/10 bg-white/[0.03]">
            <p className="text-[9px] mb-4 text-gray-500 tracking-[0.2em] uppercase">Orbit_Telemetry</p>
            <div className="space-y-3 text-[11px] font-bold">
              <div className="flex justify-between"><span>LAT:</span> <span className="text-green-500">{telemetry.lat}</span></div>
              <div className="flex justify-between"><span>LONG:</span> <span className="text-green-500">{telemetry.long}</span></div>
              <div className="flex justify-between"><span>ALT:</span> <span>{telemetry.alt}</span></div>
              <div className="flex justify-between text-gray-500"><span>VEL:</span> <span>{telemetry.vel}</span></div>
            </div>
          </div>

          {/* INTERACTIVE HEX LOG */}
          <div className="p-6 flex-1 flex flex-col overflow-hidden">
            <p className="text-[9px] mb-4 text-gray-500 tracking-[0.2em] uppercase">Hex_Out_Stream</p>
            <div className="flex flex-col gap-1">
              {hexLog.map((hex, i) => (
                <div key={i} className={`text-[13px] ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{hex}</div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={`n-${i}`} className="text-[11px] text-gray-950 font-mono">00 00 00</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[9px] text-gray-600 flex justify-between border-t border-white/10 bg-black z-30 uppercase tracking-[0.3em]">
        <div className="flex gap-8">
          <span>Words: {input.trim() ? input.trim().split(/\s+/).length : 0}</span>
          <span>Chars: {input.length}</span>
        </div>
        <span>XAI_MISSION_CONTROL_v22.0</span>
      </div>
    </main>
  );
}