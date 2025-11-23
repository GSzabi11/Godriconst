import { supabase } from '@backend/libs/supabase/server';

// A Supabase adatbázisból lekérdezzük a galéria csoportokat és a hozzájuk tartozó képeket.
// A függvény a kért locale alapján választja ki a megfelelő nyelvű címeket és feliratokat.
export async function fetchGallery(locale: string) {
  // A galéria csoportok és kapcsolt képek lekérdezése, rendezett sorrendben.
  const { data: groups } = await supabase
    .from('gallery_groups')
    .select('id, title_en, title_ro, sort_order, gallery_images(id, image_url, alt_en, alt_ro)')
    .order('sort_order', { ascending: true });

  // A kapott csoportok leképezése a frontend által elvárt formátumra.
  return groups?.map(group => ({
    // A csoport azonosítója változtatás nélkül kerül átadásra.
    id: group.id,
    // A cím kiválasztása a kért nyelv szerint.
    title: locale === 'ro' ? group.title_ro : group.title_en,
    // A képek listájának leképezése a megfelelő alt szöveggel.
    images: group.gallery_images.map(image => ({
      // A kép URL-je a Supabase tárolóból.
      url: image.image_url,
      // Nyelvfüggő alternatív szöveg hozzárendelése.
      alt: locale === 'ro' ? image.alt_ro : image.alt_en,
    })),
  })) ?? [];
}