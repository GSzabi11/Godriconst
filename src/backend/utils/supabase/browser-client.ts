import { createBrowserClient } from '@supabase/ssr';

// Böngésző oldali Supabase kliens inicializálása, amely anonim kulccsal kommunikál a backenddel.
// Ez a kliens a felhasználói interakciókhoz használható, például adatlekérésekhez a publikus API-n keresztül.
// Függvény, amely létrehozza a kliens példányt a publikus URL-lel és az anon kulccsal.
export function createClient() {
  // A kliens példány létrehozása a környezeti változókból kiolvasott URL és anon kulcs alapján.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
