import type { UploadApiResponse } from 'cloudinary';
import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
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

    return NextResponse.json({
      result: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
