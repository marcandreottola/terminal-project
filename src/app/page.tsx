'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hexLog, setHexLog] = useState<string[]>([]);
  
  // Satellite Telemetry State
  const [telemetry, setTelemetry] = useState({
    lat: '51.5074° N',
    long: '0.1278° W',
    alt: '408.2 km',
    vel: '27,580 km/h'
  });

  const textToMidiHex = (char: string) => {
    const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
    return `90 ${code} 7F`;
  };

  useEffect(() => {
    setMounted(true);
    
    // Update Clock
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 8));
      
      // Randomize Lat/Long slightly to simulate orbital movement
      setTelemetry({
        lat: `${(Math.random() * 180 - 90).toFixed(4)}° ${Math.random() > 0.5 ? 'N' : 'S'}`,
        long: `${(Math.random() * 360 - 180).toFixed(4)}° ${Math.random() > 0.5 ? 'E' : 'W'}`,
        alt: `${(408 + Math.random()).toFixed(1)} km`,
        vel: `${(27580 + Math.random() * 10).toFixed(0)} km/h`
      });
    }, 2000);

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
      
      {/* FULLSCREEN SEN.COM VIDEO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <iframe 
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-40 grayscale contrast-125"
          src="https://www.youtube.com/embed/live_stream?channel=UCkvW_7kp9LJrztmgA4q4bJQ&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* HEADER */}
      <div className="p-4 md:p-6 flex justify-between text-[10px] tracking-[0.4em] border-b border-white/10 bg-black/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500'}`} />
          <span>SEN_ORBITAL_LINK // ISS_TELEMETRY_ACTIVE</span>
        </div>
        <div>{time} UTC</div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_260px] z-20 overflow-hidden">
        
        {/* CENTERED INPUT AREA */}
        <div className="flex flex-col items-center justify-center p-4">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-2xl h-64 text-2xl md:text-4xl resize-none uppercase caret-white text-center drop-shadow-2xl"
            placeholder="[ AWAITING_TRANSMISSION ]"
            value={input}
            onChange={handleChange}
          />
        </div>

        {/* INTERACTIVE SIDEBAR */}
        <div className="bg-black/95 border-l border-white/10 flex flex-col overflow-hidden shadow-2xl">
          
          {/* TOP SECTION: SATELLITE METRICS */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02]">
            <p className="text-[9px] mb-4 text-gray-500 tracking-[0.2em] uppercase">Satellite_Metrics</p>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between"><span>LATITUDE:</span> <span className="text-green-500">{telemetry.lat}</span></div>
              <div className="flex justify-between"><span>LONGITUDE:</span> <span className="text-green-500">{telemetry.long}</span></div>
              <div className="flex justify-between"><span>ALTITUDE:</span> <span>{telemetry.alt}</span></div>
              <div className="flex justify-between"><span>VELOCITY:</span> <span>{telemetry.vel}</span></div>
            </div>
          </div>

          {/* BOTTOM SECTION: HEX STREAM */}
          <div className="p-6 flex-1 flex flex-col overflow-hidden">
            <p className="text-[9px] mb-4 text-gray-500 tracking-[0.2em] uppercase">Hex_Data_Stream</p>
            <div className="flex flex-col gap-1 font-mono">
              {hexLog.map((hex, i) => (
                <div key={i} className={`text-[12px] ${i === 0 ? 'text-white' : 'text-gray-800'}`}>
                  {hex}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={`n-${i}`} className="text-[11px] text-gray-900 opacity-20">00 00 00</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[9px] text-gray-600 flex justify-between border-t border-white/10 bg-black z-30 uppercase tracking-[0.3em]">
        <div className="flex gap-6">
          <span>Words: {input.trim() ? input.trim().split(/\s+/).length : 0}</span>
          <span>Chars: {input.length}</span>
        </div>
        <span>XAI_MISSION_CONTROL_v21.0</span>
      </div>
    </main>
  );
}