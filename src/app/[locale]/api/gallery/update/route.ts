import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/backend/utils/supabase/server-client';

export async function POST(req: NextRequest) {

  const adminHeader = req.headers.get('x-admin-auth');
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  if (!adminSecret || adminHeader !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action, table, data, id } = body;
  
  const supabase = await createServerClient();
  let error;

  try {
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

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Database operation failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}