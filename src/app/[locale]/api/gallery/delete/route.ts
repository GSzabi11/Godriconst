import type { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/backend/utils/supabase/server-client'; // helyes export


// Cloudinary konfiguráció környezeti változókból
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// POST endpoint a galéria elemek törléséhez
export async function POST(req: NextRequest) {
  // A kérés törzsének beolvasása
  const body = await req.json();
  // Azonosítók kinyerése a törléshez
  const { imageId, cloudinaryId } = body;
  // Admin ellenőrzéshez használt fejléc
  const adminHeader = req.headers.get('x-admin-auth');

  // Jogosultság hiányában 401-es válasz
  if (adminHeader !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Kötelező mezők meglétének ellenőrzése
  if (!imageId || !cloudinaryId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Supabase kliens létrehozása a további műveletekhez
  const supabase = await createServerClient();

  // Törlés Cloudinary-ból a public_id alapján
  try {
    await cloudinary.uploader.destroy(cloudinaryId);
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete from Cloudinary' }, { status: 500 });
  }

  //Törlés Supabase-ből az adatbázis sor eltávolításával
  const { error } = await supabase.from('gallery_images').delete().eq('id', imageId);

  // Adatbázis hiba esetén 500-as válasz
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sikeres törlés esetén siker válasz
  return NextResponse.json({ success: true });
}