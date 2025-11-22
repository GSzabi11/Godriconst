import type { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/backend/utils/supabase/server-client'; // helyes export

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { imageId, cloudinaryId } = body;

  if (!imageId || !cloudinaryId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const supabase = await createServerClient(); // 🔧 nincs paraméter

  // 1. Törlés Cloudinary-ból
  try {
    await cloudinary.uploader.destroy(cloudinaryId);
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete from Cloudinary' }, { status: 500 });
  }

  // 2. Törlés Supabase-ből
  const { error } = await supabase.from('gallery_images').delete().eq('id', imageId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
