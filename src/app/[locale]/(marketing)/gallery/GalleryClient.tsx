'use client';

import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/browser-client';

type GalleryImage = {
  id: number;
  image_url: string;
  alt_en: string;
  alt_ro: string;
  group_id: number;
  cloudinary_id: string;
  sort_order?: number;
  size?: number;
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
  const [usedBytes, setUsedBytes] = useState<number>(0);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editedTitleEn, setEditedTitleEn] = useState('');
  const [editedTitleRo, setEditedTitleRo] = useState('');
  const [newGroupTitleEn, setNewGroupTitleEn] = useState('');
  const [newGroupTitleRo, setNewGroupTitleRo] = useState('');
  const isAdmin = typeof window !== 'undefined' && window.location.href.includes('admin=2000527@Insignia.Mokka');

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
          cloudinary_id,
          sort_order,
          size
        )
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Hiba a gallery_groups betoltese soran:', error.message);
      return;
    }

    const mapped: GalleryGroup[] = data.map(group => ({
      id: group.id,
      title_en: group.title_en,
      title_ro: group.title_ro,
      sort_order: group.sort_order,
      images: (group.gallery_images || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    }));

    setGalleryGroups(mapped);

    // Tárhelyhasználat frissítése
    const { data: allImages, error: usageError } = await client
      .from('gallery_images')
      .select('size');

    if (!usageError && allImages) {
      const totalUsed = allImages.reduce((acc, img) => acc + (img.size ?? 0), 0);
      setUsedBytes(totalUsed);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, group: GalleryGroup) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!e.target.files || e.target.files.length > 1) {
      toast.error('Egyszerre csak egy képet tölthetsz fel!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A fájl nem lehet nagyobb 5MB-nál!');
      return;
    }

    const { data: allImages, error: fetchError } = await client
      .from('gallery_images')
      .select('size');

    if (fetchError) {
      toast.error('Nem sikerült ellenőrizni a tárhelyhasználatot.');
      return;
    }

    const totalUsedBytes = allImages?.reduce((acc, img) => acc + (img.size ?? 0), 0) ?? 0;
    const newTotal = totalUsedBytes + file.size;
    const maxAllowedBytes = 24 * 1024 * 1024 * 1024;

    if (newTotal > maxAllowedBytes) {
      toast.error('A feltöltéssel meghaladnád a 24GB-os limitet.');
      return;
    }

    // eslint-disable-next-line no-alert
    const alt_en = prompt('Enter image alt text in English:')?.trim();
    // eslint-disable-next-line no-alert
    const alt_ro = prompt('Enter image alt text in Romanian:')?.trim();
    if (!alt_en || !alt_ro) {
      toast.error('Mindkét alt mező kötelező!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      const url = data.result?.secure_url;
      const cloudinary_id = data.result?.public_id;
      const size = data.size;

      if (!url || !cloudinary_id) {
        toast.error('Hiba: Nem kaptunk érvényes választ a feltöltés után.');
        return;
      }

      const sort_order = group.images.length + 1;

      const { error } = await client.from('gallery_images').insert({
        image_url: url,
        alt_en,
        alt_ro,
        group_id: group.id,
        cloudinary_id,
        sort_order,
        size,
      });

      if (error) {
        toast.error(`Hiba: ${error.message}`);
      } else {
        await loadGroups();
        toast.success('Kép sikeresen feltöltve.');

        const { data: refreshedImages, error: fetchError2 } = await client
          .from('gallery_images')
          .select('size');

        if (!fetchError2 && refreshedImages) {
          const totalBytes = refreshedImages.reduce((acc, img) => acc + (img.size ?? 0), 0);
          const usedMB = (totalBytes / (1024 * 1024)).toFixed(2);
          const totalMB = 24 * 1024;

          // eslint-disable-next-line no-alert
          alert(`A tárhelyből jelenleg ${usedMB} MB van használva a ${totalMB} MB-ból.`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Hiba történt a feltöltés során.');
    }
  };

  const moveImage = async (group: GalleryGroup, imageId: number, direction: 'up' | 'down') => {
    const index = group.images.findIndex(i => i.id === imageId);
    if (
      index < 0
      || (direction === 'up' && index === 0)
      || (direction === 'down' && index === group.images.length - 1)
    ) {
      return;
    }

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const current = group.images[index];
    const other = group.images[otherIndex];

    // Ellenőrzés undefined ellen
    if (!current || !other) {
      toast.error('Nem sikerült a kép sorrendjét módosítani (hiányzó elem)');
      return;
    }

    const { error: err1 } = await client
      .from('gallery_images')
      .update({ sort_order: other.sort_order })
      .eq('id', current.id);

    const { error: err2 } = await client
      .from('gallery_images')
      .update({ sort_order: current.sort_order })
      .eq('id', other.id);

    if (err1 || err2) {
      toast.error('Nem sikerült a kép sorrendjét módosítani');
    } else {
      await loadGroups();
    }
  };

  const handleRenameGroup = async (groupId: number) => {
    const { error } = await client.from('gallery_groups').update({
      title_en: editedTitleEn,
      title_ro: editedTitleRo,
    }).eq('id', groupId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Csoport frissítve');
      setEditingGroupId(null);
      await loadGroups();
    }
  };

  const moveGroup = async (groupId: number, direction: 'up' | 'down') => {
    const index = galleryGroups.findIndex(g => g.id === groupId);
    if (
      index < 0
      || (direction === 'up' && index === 0)
      || (direction === 'down' && index === galleryGroups.length - 1)
    ) {
      return;
    }

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const current = galleryGroups[index];
    const other = galleryGroups[otherIndex];

    // Ellenőrzés undefined ellen
    if (!current || !other) {
      toast.error('Nem sikerült a csoport sorrendet módosítani (hiányzó elem)');
      return;
    }

    const { error: err1 } = await client
      .from('gallery_groups')
      .update({ sort_order: other.sort_order })
      .eq('id', current.id);

    const { error: err2 } = await client
      .from('gallery_groups')
      .update({ sort_order: current.sort_order })
      .eq('id', other.id);

    if (err1 || err2) {
      toast.error('Nem sikerült a csoport sorrendet módosítani');
    } else {
      await loadGroups();
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
        throw new Error(result.error);
      }
      await loadGroups();
      toast.success('Kép törölve');
    } catch (err) {
      console.error(err);
      toast.error('Nem sikerült a kép törlése');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    const group = galleryGroups.find(g => g.id === groupId);
    if (!group) {
      return;
    }

    try {
      await Promise.all(group.images.map(async (img) => {
        const res = await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId: img.id, cloudinaryId: img.cloudinary_id }),
        });
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.error);
        }
      }));

      const { error } = await client.from('gallery_groups').delete().eq('id', groupId);
      if (error) {
        throw new Error(error.message);
      }

      toast.success('Csoport és képek törölve');
      await loadGroups();
    } catch (err) {
      console.error(err);
      toast.error('Nem sikerült a csoport törlése');
    }
  };
  const bytesToGigabytes = (bytes: number) => {
    return Math.ceil((bytes / (1024 * 1024 * 1024)) * 100) / 100; // két tizedes, felfelé kerekítve
  };
  return (
    <div className="bg-gray-200 font-sans text-[#1c1c1c]">
      <section className="relative flex h-64 items-center bg-[url('/assets/images/first_landing.jpg')] bg-cover bg-center pl-[5%]">
        <div className="max-w-xl bg-black bg-opacity-60 p-10">
          <h1 className="text-4xl text-white md:text-5xl">{t('heading')}</h1>
        </div>
      </section>

      <section className="bg-[#d8cdcd] px-[10%] py-16">
        <p className="mb-8 text-lg">{t('paragraph')}</p>

        {isAdmin && (
          <div className="mb-8 space-y-2">
            <div className="mb-6 rounded bg-yellow-100 border border-yellow-300 p-4 text-yellow-800 shadow text-sm">
              💾
              {' '}
              <strong>Tárhelyhasználat:</strong>
              {' '}
              {bytesToGigabytes(usedBytes)}
              {' '}
              GB / 24 GB
              <div className="w-full bg-gray-300 h-2 rounded mt-1">
                <div
                  className="bg-green-600 h-full"
                  style={{ width: `${(usedBytes / (24 * 1024 * 1024 * 1024)) * 100}%` }}
                />
              </div>
            </div>
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
                onClick={async () => {
                  const titleEn = newGroupTitleEn.trim();
                  const titleRo = newGroupTitleRo.trim();
                  if (!titleEn || !titleRo) {
                    toast.error('Mindkét nyelven meg kell adni a nevet');
                    return;
                  }

                  const maxSort = galleryGroups.reduce((acc, g) => Math.max(acc, g.sort_order), 0);
                  const { error } = await client.from('gallery_groups').insert({
                    title_en: titleEn,
                    title_ro: titleRo,
                    sort_order: maxSort + 1,
                  });

                  if (error) {
                    toast.error(error.message);
                  } else {
                    setNewGroupTitleEn('');
                    setNewGroupTitleRo('');
                    await loadGroups();
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('create_group') || 'Create Group'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {galleryGroups.map(group => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-4">
                {isAdmin && editingGroupId === group.id
                  ? (
                      <>
                        <input
                          className="border px-2 py-1"
                          value={editedTitleEn}
                          onChange={e => setEditedTitleEn(e.target.value)}
                        />
                        <input className="border px-2 py-1" value={editedTitleRo} onChange={e => setEditedTitleRo(e.target.value)} />
                        <button onClick={() => handleRenameGroup(group.id)} className="bg-blue-500 text-white px-2 rounded">💾</button>
                      </>
                    )
                  : (
                      <>
                        <h2 className="text-2xl md:text-3xl">{locale === 'ro' ? group.title_ro : group.title_en}</h2>
                        {isAdmin && (
                          <button onClick={() => {
                            setEditingGroupId(group.id);
                            setEditedTitleEn(group.title_en);
                            setEditedTitleRo(group.title_ro);
                          }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                {isAdmin && (
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => moveGroup(group.id, 'up')}><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveGroup(group.id, 'down')}><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteGroup(group.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="mb-4">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
                    +
                    {' '}
                    {t('add_image')}
                    <input type="file" accept="image/*" onChange={e => handleUpload(e, group)} className="hidden" multiple={false} />
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
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        <button
                          onClick={() => handleDelete(img.id, img.cloudinary_id)}
                          className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                        >
                          ✕
                        </button>
                        <div className="flex gap-1">
                          <button onClick={() => moveImage(group, img.id, 'up')}>
                            <ArrowUp className="w-4 h-4 text-white bg-black rounded" />
                          </button>
                          <button onClick={() => moveImage(group, img.id, 'down')}>
                            <ArrowDown className="w-4 h-4 text-white bg-black rounded" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
