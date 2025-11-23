import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/backend/utils/supabase/server-client';

// Cloudinary hitelesítési adatok konfigurálása környezeti változókból
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// POST endpoint új galériaelem létrehozásához
export async function POST(req: NextRequest) {
  // Supabase szerver kliens inicializálása az adatbázis műveletekhez
  const supabase = await createServerClient();

  // A form adatainak beolvasása a kérésből
  const formData = await req.formData();
  // A feltöltött fájl kinyerése a form adatokból
  const file = formData.get('file') as File;

  // Ha nincs csatolt fájl, 400-as hibával térünk vissza
  if (!file) {
    return NextResponse.json({ error: 'Nincs fájl csatolva.' }, { status: 400 });
  }

  //Típus ellenőrzés: csak képfájlok engedélyezettek
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Csak kép típusú fájl tölthető fel.' }, { status: 400 });
  }

  //Méret limit (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'A fájl mérete nem lehet nagyobb 5MB-nál.' }, { status: 400 });
  }

  // Összes kép méretének lekérdezése Supabase-ből
  const { data: images, error: fetchError } = await supabase
    .from('gallery_images')
    .select('size');

  //Adatlekérési hiba esetén logolunk és 500-as hibával válaszolunk
  if (fetchError) {
    console.error('Méretlekérési hiba:', fetchError.message);
    return NextResponse.json({ error: 'Nem sikerült ellenőrizni a tárhelyhasználatot.' }, { status: 500 });
  }

  // A korábban tárolt képek méretének összesítése
  type ImageRow = { size: number | null };
  const totalUsedBytes = (images ?? []).reduce(
    (acc: number, img: ImageRow) => acc + (img.size ?? 0),
    0,
  );

  // Maximális tárhely limite 24GB-ra állítva
  const maxStorageBytes = 24 * 1024 * 1024 * 1024;
  // Ha a feltöltés meghaladná a limitet, hibát adunk vissza
  if (totalUsedBytes + file.size > maxStorageBytes) {
    return NextResponse.json({ error: 'A feltöltés meghaladná a 24GB-os limitet.' }, { status: 400 });
  }

  //Cloudinary feltöltés előkészítése bufferből
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Fájl feltöltése Cloudinary-ba stream segítségével
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'gallery_uploads' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
        .end(buffer);
    });

    // Cloudinary metaadatok mentése Supabase-be (mérettel együtt)
    await supabase.from('gallery_images').insert({
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
      size: file.size,
    });

    // Sikeres válasz visszaadása a feltöltés eredményével
    return NextResponse.json({
      result,
      size: file.size,
    });
  } catch (err) {
    // Feltöltési hiba
    console.error('Feltöltési hiba:', err);
    return NextResponse.json({ error: 'Hiba a feltöltés során.' }, { status: 500 });
  }
}