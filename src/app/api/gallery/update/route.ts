import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/backend/utils/supabase/server-client';

// POST endpoint, amely általános CRUD műveleteket végez a galéria táblákon
export async function POST(req: NextRequest) {

  // Admin authentikációs header kiolvasása
  const adminHeader = req.headers.get('x-admin-auth');
  // A titkos kulcs, amellyel ellenőrizzük az admin jogosultságot
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  // Ha nincs jelszó vagy nem egyezik, 401-es hibát küldünk
  if (!adminSecret || adminHeader !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // A kérés JSON törzsének beolvasása
  const body = await req.json();
  // Az elvárt mezők kibontása a művelethez
  const { action, table, data, id } = body;

  // Supabase kliens példányosítása
  const supabase = await createServerClient();
  // Változó az esetleges hibák tárolásához
  let error;

  try {
    // A művelet típusa alapján indítjuk az adatbázis hívást
    switch (action) {
      case 'update':
        ({ error } = await supabase.from(table).update(data).eq('id', id));
        break;
      case 'insert':
        ({ error } = await supabase.from(table).insert(data));
        break;
      case 'delete':
        ({ error } = await supabase.from(table).delete().eq('id', id));
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Ha a Supabase visszaad hibát, azt kivételként kezeljük
    if (error) throw error;

    // Sikeres művelet esetén visszaadjuk a siker státuszt
    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Hibalog az adatbázis művelet meghiúsulása esetén
    console.error('Database operation failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}