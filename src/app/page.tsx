"use client";
import React, { useState, useEffect } from 'react';
import { Activity, MapPin, Navigation, Globe, Shield } from 'lucide-react';

export default function MissionControl() {
  const [data, setData] = useState({
    latitude: 0, longitude: 0, altitude: 0, velocity: 0, locationName: "SYNCING..."
  });

  const updateTelemetry = async () => {
    try {
      const issRes = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const iss = await issRes.json();
      const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${iss.latitude}&longitude=${iss.longitude}&localityLanguage=en`);
      const geo = await geoRes.json();
      setData({
        latitude: iss.latitude, longitude: iss.longitude, altitude: iss.altitude,
        velocity: iss.velocity, locationName: geo.countryName || geo.locality || "INTERNATIONAL WATERS"
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    updateTelemetry();
    const interval = setInterval(updateTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 font-mono p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center border-b border-cyan-900 pb-2">
          <h1 className="text-xl font-black tracking-widest flex items-center gap-2">
            <Activity className="animate-pulse" size={20} /> LIVE_FEED_01
          </h1>
          <div className="text-[10px] text-cyan-800 tracking-[0.3em]">SECURE_UPLINK_ESTABLISHED</div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          
          {/* THE VIDEO FEED (LEFT SIDE) */}
          <div className="col-span-12 lg:col-span-8 aspect-video bg-black border border-cyan-900 relative">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/jPTD2gnZFUw?autoplay=1&mute=1&controls=0&showinfo=0" 
              title="ISS Live Feed"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            {/* Overlay UI to make it look like a HUD */}
            <div className="absolute top-4 left-4 pointer-events-none border-l-2 border-t-2 border-cyan-500 w-20 h-20 opacity-40" />
            <div className="absolute bottom-4 right-4 pointer-events-none border-r-2 border-b-2 border-cyan-500 w-20 h-20 opacity-40" />
          </div>

          {/* THE DATA PANEL (RIGHT SIDE) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="bg-cyan-950/20 border border-cyan-900 p-6">
              <label className="text-[10px] text-cyan-700 uppercase block mb-1">Current Sector</label>
              <div className="text-3xl font-black text-white truncate">{data.locationName}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-950/10 border border-cyan-900 p-4">
                <label className="text-[10px] text-cyan-700 block mb-1 uppercase">Lat</label>
                <div className="text-xl font-bold">{data.latitude.toFixed(4)}</div>
              </div>
              <div className="bg-cyan-950/10 border border-cyan-900 p-4">
                <label className="text-[10px] text-cyan-700 block mb-1 uppercase">Lng</label>
                <div className="text-xl font-bold">{data.longitude.toFixed(4)}</div>
              </div>
            </div>

            <div className="bg-cyan-950/10 border border-cyan-900 p-6 flex-grow flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-2 right-2 opacity-10"><Globe size={80}/></div>
               <label className="text-[10px] text-cyan-700 uppercase block mb-1 tracking-widest font-bold">Orbital Stats</label>
               <div className="text-lg font-bold">ALT: {data.altitude.toFixed(0)} KM</div>
               <div className="text-lg font-bold text-orange-500">VEL: {Math.round(data.velocity)} KM/H</div>
            </div>

            <div className="border border-green-900/50 bg-green-950/10 p-4 flex items-center justify-between">
              <div className="text-[10px] text-green-700 font-bold uppercase tracking-widest">System_Integrity</div>
              <Shield className="text-green-500" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}