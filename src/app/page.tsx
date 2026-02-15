'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hexLog, setHexLog] = useState<string[]>([]);

  // Function to convert text to a MIDI-style Hex string
  const textToMidiHex = (char: string) => {
    const code = char.charCodeAt(0).toString(16).toUpperCase();
    return `90 ${code} 7F`; // MIDI Note On + Velocity
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].slice(0, 11));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const lastChar = val.slice(-1);
    setInput(val);
    setIsTyping(true);

    if (lastChar) {
      const newHex = textToMidiHex(lastChar);
      setHexLog(prev => [newHex, ...prev].slice(0, 100));
    }

    const timeout = setTimeout(() => setIsTyping(false), 300);
    return () => clearTimeout(timeout);
  };

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 bg-black text-white font-mono flex flex-col overflow-hidden">
      
      {/* BACKGROUND: NASA ISS LIVE FEED */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 grayscale contrast-125">
        <iframe 
          className="w-full h-full scale-[1.5]"
          src="https://www.youtube.com/embed/jPTD2gnZFUw?autoplay=1&mute=1&controls=0&showinfo=0&autohide=1"
          allow="autoplay"
        />
      </div>

      {/* CRT SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* HEADER */}
      <div className="p-4 md:p-8 flex justify-between text-[10px] tracking-[0.4em] opacity-60 border-b border-white/10 bg-black/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-gray-600'}`} />
          <span>DEEP_SPACE_UPLINK // ISS_STREAM_LIVE</span>
        </div>
        <div>{time} UTC</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 grid grid-cols-[1fr_120px] md:grid-cols-[1fr_200px] overflow-hidden z-20">
        
        {/* CENTER: INPUT AREA */}
        <div className="flex flex-col items-center justify-center p-4 bg-black/10 backdrop-blur-[1px]">
          <textarea
            autoFocus
            className="bg-transparent border-none outline-none w-full max-w-lg h-40 text-xl md:text-2xl resize-none uppercase caret-white text-center drop-shadow-2xl"
            placeholder="COMM_LINK_READY..."
            value={input}
            onChange={handleInputChange}
          />
          <div className="mt-4 text-[8px] tracking-[0.2em] opacity-30">SECURE_CHANNEL_ENCRYPTED</div>
        </div>

        {/* RIGHT: LIVE MIDI/HEX CONVERSION LOG */}
        <div className="bg-black/80 border-l border-white/10 p-4 flex flex-col gap-1 overflow-hidden">
          <div className="text-[9px] mb-4 text-gray-500 border-b border-white/10 pb-2">MIDI_HEX_OUT</div>
          {hexLog.map((hex, i) => (
            <div 
              key={i} 
              className={`text-[10px] md:text-[12px] transition-all duration-300 ${i === 0 ? 'text-white' : 'text-gray-700'}`}
            >
              {hex}
            </div>
          ))}
          {/* Fills the rest with random data if log is short */}
          {hexLog.length < 30 && Array.from({ length: 30 - hexLog.length }).map((_, i) => (
            <div key={`blank-${i}`} className="text-[10px] text-gray-900 opacity-20">00 00 00</div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-[8px] text-gray-500 flex justify-between border-t border-white/10 bg-black/90 z-30">
        <span>FREQ: 2.44 GHz</span>
        <span>XAI_TRANSCEIVER_v11.0</span>
      </div>
    </main>
  );
}