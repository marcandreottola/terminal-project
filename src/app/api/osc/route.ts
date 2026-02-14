import { NextResponse } from 'next/server';
const osc = require('node-osc');

// This creates the "Cannon" that fires data at TouchDesigner
const client = new osc.Client('127.0.0.1', 8080);

export async function POST(req: Request) {
  const { text } = await req.json();
  
  // This sends the text as an OSC message
  client.send('/type', text, () => {
    // Message sent
  });

  return NextResponse.json({ success: true });
}