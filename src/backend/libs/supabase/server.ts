import { createClient } from '@supabase/supabase-js';

// A szerver oldalon használt Supabase kliens inicializálása kulccsal.
export const supabase = createClient(
  // A Supabase projekt publikus URL-je.
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // A service role kulcs, amely teljes hozzáférést biztosít az adatbázishoz.
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
