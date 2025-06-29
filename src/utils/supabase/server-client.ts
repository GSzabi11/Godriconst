import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // szinkron!

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesList) => {
          cookiesList.forEach(({ name, value, options }) => {
            // ❗ Törlés logika: ha érték üres és maxAge -1, akkor törlés
            if (value === '' && options?.maxAge === -1) {
              cookieStore.set(name, '', {
                path: '/',
                expires: new Date(0), // böngésző törlés
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
