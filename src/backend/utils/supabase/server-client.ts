import { createServerClient as createBaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Szerver oldali Supabase kliens létrehozása, amely a Next.js cookie API-t használja a session kezeléshez.
// A cookie műveletek biztosítják, hogy a Supabase által kezelt autentikáció megfelelően működjön SSR környezetben is.
// Függvény, amely előkészíti a cookie kezelő réteget, majd átadja a Supabase SSR kliensnek.
export async function createServerClient() {
  // A Next.js cookie store lehívása a válaszhoz kapcsolódó sütik kezeléséhez.
  const cookieStore = await cookies(); // Ez szinkron, nem kell "await"

  // A Supabase kliens összeállítása a szolgáltatás kulccsal és a cookie API implementációval.
  return createBaseClient(
    // A projekt publikus Supabase URL-je a környezeti változókból.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // A szerverre szánt szolgáltatáskulcs, amely magasabb jogosultságot biztosít.
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      // A Supabase által elvárt cookie API implementáció.
      cookies: {
        // Az összes süti lekérése a beépített store-ból.
        getAll: () => cookieStore.getAll(),
        // Cookie frissítés: a Supabase által kért változtatások végrehajtása
        setAll: (cookiesList) => {
          // Minden módosítás végigiterálása és alkalmazása.
          cookiesList.forEach(({ name, value, options }) => {
            // Törlés logika: üres érték és maxAge === -1 esetén törlés
            if (value === '' && options?.maxAge === -1) {
              // A süti azonnali lejáratra állítása, ezzel törölve azt.
              cookieStore.set(name, '', {
                path: '/',
                expires: new Date(0),
              });
            } else {
              // Általános eset: érték beállítása a megadott opciókkal.
              cookieStore.set(name, value, options);
            }
          });
        },
      },
    },
  );
}
