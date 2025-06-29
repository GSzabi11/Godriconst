import { createServerClient as createBaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies(); // Ez szinkron, nem kell "await"

  return createBaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesList) => {
          cookiesList.forEach(({ name, value, options }) => {
            // Törlés logika: üres érték és maxAge === -1 esetén törlés
            if (value === '' && options?.maxAge === -1) {
              cookieStore.set(name, '', {
                path: '/',
                expires: new Date(0),
              });
            } else {
              cookieStore.set(name, value, options);
            }
          });
        },
      },
    },
  );
}
