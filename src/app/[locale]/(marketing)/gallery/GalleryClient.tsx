'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/browser-client';

type GalleryImage = {
  id: number;
  image_url: string;
  alt_en: string;
  alt_ro: string;
  group_id: number;
  cloudinary_id: string;
};

type GalleryGroup = {
  id: number;
  title_en: string;
  title_ro: string;
  sort_order: number;
  images: GalleryImage[];
};

export default function GalleryClient() {
  const t = useTranslations('Gallery');
  const locale = useLocale();
  const client = createClient();

  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newGroupTitleEn, setNewGroupTitleEn] = useState('');
  const [newGroupTitleRo, setNewGroupTitleRo] = useState('');
  const isAdmin = typeof window !== 'undefined' && window.location.href.includes('admin=1');

  const loadGroups = async () => {
    const { data, error } = await client
      .from('gallery_groups')
      .select(`
        id,
        title_en,
        title_ro,
        sort_order,
        gallery_images (
          id,
          image_url,
          alt_en,
          alt_ro,
          group_id,
          cloudinary_id
        )
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Hiba a gallery_groups betöltésénél:', error.message);
      return;
    }

    const mapped: GalleryGroup[] = data.map(group => ({
      id: group.id,
      title_en: group.title_en,
      title_ro: group.title_ro,
      sort_order: group.sort_order,
      images: group.gallery_images || [],
    }));

    setGalleryGroups(mapped);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, groupId: number) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // eslint-disable-next-line no-alert
    const alt_en = prompt('Enter image alt text in English (required):')?.trim();
    // eslint-disable-next-line no-alert
    const alt_ro = prompt('Enter image alt text in Romanian (required):')?.trim();

    if (!alt_en || !alt_ro) {
      // eslint-disable-next-line no-alert
      alert('Both English and Romanian alt text are required.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const url = data.result?.secure_url;
      const cloudinary_id = data.result?.public_id;

      if (url && cloudinary_id) {
        const { error } = await client.from('gallery_images').insert({
          image_url: url,
          alt_en,
          alt_ro,
          group_id: groupId,
          cloudinary_id,
        });

        if (error) {
          console.error('Insert image error:', error.message);
          alert(`Hiba a kép mentéskor: ${error.message}`);
        } else {
          await loadGroups();
        }
      } else {
        // eslint-disable-next-line no-alert
        alert('Hiba: nincs URL válaszban.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      // eslint-disable-next-line no-alert
      alert('Kép feltöltési hiba.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: number, cloudinaryId: string) => {
    try {
      const res = await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, cloudinaryId }),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || 'Hiba a törlés során');
      }

      await loadGroups();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Nem sikerült törölni a képet.');
    }
  };

  const handleAddGroup = async () => {
    const titleEn = newGroupTitleEn.trim();
    const titleRo = newGroupTitleRo.trim();

    if (!titleEn || !titleRo) {
      alert('Mindkét nyelven meg kell adni a csoport nevét!');
      return;
    }

    const maxSort = galleryGroups.reduce((acc, g) => Math.max(acc, g.sort_order ?? 0), 0);

    const { error } = await client.from('gallery_groups').insert({
      title_en: titleEn,
      title_ro: titleRo,
      sort_order: maxSort + 1,
    });

    if (error) {
      console.error('Insert error:', error.message);
      // eslint-disable-next-line no-alert
      alert(`Hiba történt a csoport mentésekor: ${error.message}`);
      return;
    }

    setNewGroupTitleEn('');
    setNewGroupTitleRo('');
    await loadGroups();
  };

  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section className="relative flex h-64 items-center bg-[url('/assets/images/first_landing.jpg')] bg-cover bg-center pl-[5%]">
        <div className="max-w-xl bg-black bg-opacity-60 p-10">
          <h1 className="text-4xl leading-tight text-white md:text-5xl">{t('heading')}</h1>
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <p className="mb-8 text-lg">{t('paragraph')}</p>

        {isAdmin && (
          <div className="mb-8 space-y-2">
            <input
              type="text"
              value={newGroupTitleEn}
              onChange={e => setNewGroupTitleEn(e.target.value)}
              placeholder="New group name (EN)"
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              value={newGroupTitleRo}
              onChange={e => setNewGroupTitleRo(e.target.value)}
              placeholder="New group name (RO)"
              className="border px-3 py-2 rounded w-full"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddGroup}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('create_group') || 'Create Group'}
              </button>
              <button
                onClick={loadGroups}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {t('refresh') || 'Refresh'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {galleryGroups.map(group => (
            <div key={group.id}>
              <h2 className="mb-4 text-2xl md:text-3xl">
                {locale === 'ro' ? group.title_ro : group.title_en}
              </h2>

              {isAdmin && (
                <div className="mb-4">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
                    +
                    {' '}
                    {t('add_image')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleUpload(e, group.id)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {group.images.map(img => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.image_url}
                      alt={locale === 'ro' ? img.alt_ro : img.alt_en}
                      className="w-full rounded shadow"
                      loading="lazy"
                      draggable={false}
                    />
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(img.id, img.cloudinary_id)}
                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {uploading && (
                <p className="text-sm mt-2 text-gray-600">
                  {t('uploading')}
                  ...
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
