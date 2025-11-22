import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Ellenőrzés: Ha a szerver változója undefined, akkor a .env fájl nem töltődött be
    if (!process.env.ADMIN_PAGE_PASSWORD) {
      console.error("HIBA: Az ADMIN_PAGE_PASSWORD nincs beállítva a szerveren!");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (password === process.env.ADMIN_PAGE_PASSWORD) {
      return NextResponse.json({ isAdmin: true });
    }
    
    return NextResponse.json({ isAdmin: false }, { status: 401 });

  } catch (error) {
    console.error("Hiba a kérés feldolgozása közben:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}