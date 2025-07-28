import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server-client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Nincs fájl csatolva.' }, { status: 400 });
  }

  // 1️⃣ Típus ellenőrzés
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Csak kép típusú fájl tölthető fel.' }, { status: 400 });
  }

  // 2️⃣ Méret limit (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'A fájl mérete nem lehet nagyobb 5MB-nál.' }, { status: 400 });
  }

  // 3️⃣ Összes kép méretének lekérdezése Supabase-ből
  const { data: images, error: fetchError } = await supabase
    .from('gallery_images')
    .select('size');

  if (fetchError) {
    console.error('Méretlekérési hiba:', fetchError.message);
    return NextResponse.json({ error: 'Nem sikerült ellenőrizni a tárhelyhasználatot.' }, { status: 500 });
  }

  type ImageRow = { size: number | null };
  const totalUsedBytes = (images ?? []).reduce(
    (acc: number, img: ImageRow) => acc + (img.size ?? 0),
    0,
  );

  const maxStorageBytes = 24 * 1024 * 1024 * 1024;
  if (totalUsedBytes + file.size > maxStorageBytes) {
    return NextResponse.json({ error: 'A feltöltés meghaladná a 24GB-os limitet.' }, { status: 400 });
  }

  // 4️⃣ Cloudinary feltöltés
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
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

    // 5️⃣ Csak Cloudinary adatok mentése (size is!)
    await supabase.from('gallery_images').insert({
      image_url: result.secure_url,
      cloudinary_id: result.public_id,
      size: file.size,
    });

    return NextResponse.json({
      result,
      size: file.size,
    });
  } catch (err) {
    console.error('Feltöltési hiba:', err);
    return NextResponse.json({ error: 'Hiba a feltöltés során.' }, { status: 500 });
  }
}
