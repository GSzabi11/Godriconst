import { NextResponse } from 'next/server';

// POST metódus az admin jogosultság ellenőrzésére
export async function POST(request: Request) {
  try {
    // A kérés JSON beolvasása
    const body = await request.json();
    // A jelszó mező kinyerése a törzsből
    const { password } = body;

    // Ellenőrzés: Ha a szerver változója undefined, akkor a .env fájl nem töltődött be
    if (!process.env.ADMIN_PAGE_PASSWORD) {
      console.error("HIBA: Az ADMIN_PAGE_PASSWORD nincs beállítva a szerveren!");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Ha a kapott jelszó egyezik a szerveren tárolttal, admin jogosultságot adunk
    if (password === process.env.ADMIN_PAGE_PASSWORD) {
      return NextResponse.json({ isAdmin: true });
    }

    // Hibás jelszó esetén visszautasítjuk a kérést
    return NextResponse.json({ isAdmin: false }, { status: 401 });

  } catch (error) {
    // Hibakezelés
    console.error("Hiba a kérés feldolgozása közben:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}