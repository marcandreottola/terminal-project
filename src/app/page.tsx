"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Zap, Globe, Navigation, MapPin, Cpu } from 'lucide-react';

export default function MissionControl() {
  const [data, setData] = useState({ 
    latitude: 0, longitude: 0, altitude: 0, velocity: 0, locationName: "SYNCING..." 
  });
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  // 1. Telemetry Loop
  useEffect(() => {
    const update = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const iss = await res.json();
        const geo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${iss.latitude}&longitude=${iss.longitude}`).then(r => r.json());
        
        const newLoc = geo.countryName || "INTERNATIONAL WATERS";
        
        setData({ 
          latitude: iss.latitude, 
          longitude: iss.longitude, 
          altitude: iss.altitude,
          velocity: iss.velocity,
          locationName: newLoc
        });

        // Add a log entry if location changes
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] SECTOR_UPDATE: ${newLoc}`, ...prev].slice(0, 5));
      } catch (e) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] SIG_LOSS: RECONNECTING...`, ...prev]);
      }
    };
    
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-mono text-cyan-400">
      {/* 2. THE SEN 4K VIDEO ENGINE */}
      <div className="absolute inset-0 z-0">
        <iframe 
          className="w-full h-full scale-[1.3] pointer-events-none brightness-75 contrast-125"
          src="https://www.youtube.com/embed/sen?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3" 
          allow="autoplay; encrypted-media" 
          frameBorder="0"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
      </div>

      {/* 3. TOP NAV / SYSTEM LOGS */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-black/60 border border-cyan-900/50 p-4 backdrop-blur-xl">
            <Activity className="animate-pulse text-cyan-400" size={28} />
            <div>
              <h1 className="text-xl font-black tracking-widest italic leading-none">SpaceTV-1_NADIR</h1>
              <span className="text-[9px] text-cyan-800 uppercase tracking-[0.4em]">Uplink_Node: Bartolomeo_ISS</span>
            </div>
          </div>
          {/* Scrolling Mini-Log */}
          <div className="bg-black/40 backdrop-blur-sm border-l border-cyan-500/30 p-2 h-20 overflow-hidden w-64">
             {logs.map((log, i) => (
               <div key={i} className="text-[9px] text-cyan-600/80 mb-1 animate-in fade-in slide-in-from-left-2 truncate">
                 {log}
               </div>
             ))}
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-2">
           <div className="bg-green-500/10 border border-green-500/30 px-3 py-1 text-[10px] text-green-400 font-bold tracking-widest uppercase">
             Live_Telemetry_Stable
           </div>
           <div className="text-[9px] text-cyan-900">REF_ID: Z-ISS-25544</div>
        </div>
      </div>

      {/* 4. MAIN TELEMETRY HUD (Floating Right) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
        <HudBlock icon={<Globe size={16}/>} label="Ground Sector" value={data.locationName} highlight />
        <div className="grid grid-cols-2 gap-4">
          <HudBlock icon={<MapPin size={14}/>} label="LAT" value={data.latitude.toFixed(4)} />
          <HudBlock icon={<Navigation size={14}/>} label="LNG" value={data.longitude.toFixed(4)} />
        </div>
        <HudBlock icon={<Zap size={14}/>} label="Velocity (km/h)" value={Math.round(data.velocity).toLocaleString()} color="text-orange-500" />
        <HudBlock icon={<Cpu size={14}/>} label="Altitude (km)" value={data.altitude.toFixed(1)} />
      </div>

      {/* 5. SYSTEM STATUS FOOTER */}
      <div className="absolute bottom-10 left-10 flex gap-6 z-10 items-end">
        <div className="group bg-black/60 border border-cyan-900/50 p-4 backdrop-blur-md transition-all hover:border-cyan-400">
           <div className="text-[9px] text-cyan-800 uppercase mb-2 font-bold tracking-widest">Orbital_Shielding</div>
           <div className="flex gap-1">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-4 w-2 bg-green-500/40 border border-green-500/60" />)}
           </div>
        </div>
        <div className="text-[10px] text-cyan-900 uppercase tracking-widest">
           Grid_Sync: 0.042ms<br/>
           Buffer: Nominal
        </div>
      </div>
    </div>
  );
}

// Sub-component for HUD blocks to keep code clean but functional
function HudBlock({ icon, label, value, highlight = false, color = "text-cyan-200" }) {
  return (
    <div className={`bg-black/60 border border-cyan-900/50 p-5 backdrop-blur-xl min-w-[180px] ${highlight ? 'border