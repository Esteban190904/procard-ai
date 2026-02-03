// src/app/api/remove-bg/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { image } = await req.json(); 
  
  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_API_KEY ||"", 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_file_b64: image.split(",")[1], 
      size: "auto",
    }),
  });

  if (response.ok) {
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
    return NextResponse.json({ result: base64Image });
  } else {
    return NextResponse.json({ error: "Error procesando IA" }, { status: 500 });
  }
}
