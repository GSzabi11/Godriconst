// pl. libs/gallery/fetchGallery.ts
import { supabase } from '@/libs/supabase/server';

export async function fetchGallery(locale: string) {
  const { data: groups } = await supabase
    .from('gallery_groups')
    .select('id, title_en, title_ro, sort_order, gallery_images(id, image_url, alt_en, alt_ro)')
    .order('sort_order', { ascending: true });

  return groups?.map(group => ({
    id: group.id,
    title: locale === 'ro' ? group.title_ro : group.title_en,
    images: group.gallery_images.map(image => ({
      url: image.image_url,
      alt: locale === 'ro' ? image.alt_ro : image.alt_en,
    })),
  })) ?? [];
}
