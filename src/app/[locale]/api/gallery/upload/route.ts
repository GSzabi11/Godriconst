import type { UploadApiResponse } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';


// Cloudinary konfiguráció a környezeti változókból
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// POST endpoint a tényleges fájl feltöltéséhez
export async function POST(req: NextRequest) {
  // Form adatok beolvasása
  const formData = await req.formData();
  // A beküldött fájl kinyerése
  const file = formData.get('file') as File;
  // Admin autentikációs header
  const adminHeader = req.headers.get('x-admin-auth');

  // Jogosultság ellenőrzése
  if (adminHeader !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fájl meglétének ellenőrzése
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // A fájl bájtjainak kinyerése bufferként
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Cloudinary upload stream létrehozása ígéretbe csomagolva
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'gallery_uploads' }, (error, result) => {
          if (error || !result) {
            return reject(error || new Error('No result from Cloudinary'));
          }
          resolve(result);
        })
        .end(buffer);
    });

    // Sikeres feltöltésnél visszaadjuk a biztonságos URL-t és az azonosítót
    return NextResponse.json({
      result: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (err) {
    // Hibakezelés: logolunk, majd 500-as hibával válaszolunk
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}