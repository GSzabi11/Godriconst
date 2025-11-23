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
  const adminHeader = req.headers.get('x-admin-auth');

  if (adminHeader !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';

  if (!contentType.startsWith('multipart/form-data')) {
    console.error('Invalid Content-Type for upload:', contentType);
    return NextResponse.json(
      { error: 'Invalid Content-Type, expected multipart/form-data' },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    console.error('Error parsing formData:', err);
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;

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
