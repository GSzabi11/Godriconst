import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Emlékezetes "adatbázis" memóriában
let galleryData = [
  {
    title: 'Interior Renovation',
    images: [
      '/assets/images/bar.jpg',
      '/assets/images/table.jpg',
      '/assets/images/gerenda.jpg',
    ],
  },
  {
    title: 'Bathroom Renovation',
    images: [
      '/assets/images/bathroom.jpg',
      '/assets/images/before_csur.jpg',
      '/assets/images/after_csur.jpg',
    ],
  },
  {
    title: 'Garden Renovation',
    images: [
      '/assets/images/garden.jpg',
      '/assets/images/first_landing.jpg',
    ],
  },
];

// GET – Galéria lekérése
export async function GET() {
  return NextResponse.json({ gallery: galleryData });
}

// PUT – Galéria mentése (pl. új csoport, törlés, sorrend változás)
export async function PUT(req: NextRequest) {
  try {
    const { gallery } = await req.json();
    if (!Array.isArray(gallery)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
    galleryData = gallery;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json({ error: 'Failed to save gallery' }, { status: 500 });
  }
}

// DELETE – Cloudinary kép törlése
export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: 'Missing publicId' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ result });
  } catch (err) {
    console.error('Delete failed:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// POST – Kép feltöltés
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'gallery_uploads' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
