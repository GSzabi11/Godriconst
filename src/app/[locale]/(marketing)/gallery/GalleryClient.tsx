'use client';

import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Lightbox from 'yet-another-react-lightbox';
import { createClient } from '@/utils/supabase/browser-client';
import 'yet-another-react-lightbox/styles.css';
import '@/styles/lightbox.css';

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
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [lightboxImages, setLightboxImages] = useState<
      { src: string; title?: string; description?: string }[]
  >([]);
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

    // Csak egy fájl engedélyezett
    if (e.target.files && e.target.files.length > 1) {
      toast.error('Egyszerre csak egy képet tölthetsz fel!');
      return;
    }

    // Max 5MB méretellenőrzés
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A fájl nem lehet nagyobb 5MB-nál!');
      return;
    }

    // Ellenőrzés: összes eddigi kép méret ne haladja meg a 24GB-ot
    const { data: allImages, error: fetchError } = await client
      .from('gallery_images')
      .select('size');

    if (fetchError) {
      toast.error('Nem sikerült ellenőrizni a tárhelyhasználatot.');
      return;
    }

    const totalUsedBytes = allImages?.reduce((acc, img) => acc + (img.size ?? 0), 0) ?? 0;
    const newTotal = totalUsedBytes + file.size;
    const maxAllowedBytes = 23 * 1024 * 1024 * 1024; // 24 GB

    if (newTotal > maxAllowedBytes) {
      toast.error('A feltöltéssel meghaladnád a 23GB-os limitet.');
      return;
    }

    // Alt szövegek bekérése
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
      const size = data.size ?? file.size;

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

        // ✅ Tárhelyhasználat mutatása
        const usedMB = (newTotal / (1024 * 1024)).toFixed(2);
        const maxMB = 23 * 1024;
        toast.info(`Használat: ${usedMB} MB / ${maxMB} MB`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Hiba történt a feltöltés során.');
    }
  };

  const moveImage = async (
    group: GalleryGroup,
    imageId: number,
    direction: 'up' | 'down',
  ) => {
    const groupIndex = galleryGroups.findIndex(g => g.id === group.id);
    const imgIndex = group.images.findIndex(i => i.id === imageId);
    const currentImage = group.images[imgIndex];

    if (!currentImage) {
      return;
    }

    const isFirst = imgIndex === 0;
    const isLast = imgIndex === group.images.length - 1;

    // ➤ Mozgatás előző csoportba
    if (direction === 'up' && isFirst && groupIndex > 0) {
      const prevGroup = galleryGroups[groupIndex - 1];
      if (!prevGroup) {
        return;
      }

      const newOrder = (prevGroup.images.at(-1)?.sort_order ?? 0) + 1;

      const { error } = await client
        .from('gallery_images')
        .update({
          group_id: prevGroup.id,
          sort_order: newOrder,
        })
        .eq('id', currentImage.id);

      if (error) {
        toast.error('Nem sikerült áthelyezni a képet az előző csoportba');
      } else {
        await loadGroups();
      }
      return;
    }

    // ➤ Mozgatás következő csoportba
    if (direction === 'down' && isLast && groupIndex < galleryGroups.length - 1) {
      const nextGroup = galleryGroups[groupIndex + 1];
      if (!nextGroup) {
        return;
      }

      const newOrder = (nextGroup.images[0]?.sort_order ?? 0) - 1;

      const { error } = await client
        .from('gallery_images')
        .update({
          group_id: nextGroup.id,
          sort_order: newOrder,
        })
        .eq('id', currentImage.id);

      if (error) {
        toast.error('Nem sikerült áthelyezni a képet a következő csoportba');
      } else {
        await loadGroups();
      }
      return;
    }

    // ➤ Mozgatás ugyanabban a csoportban
    const targetIndex = direction === 'up' ? imgIndex - 1 : imgIndex + 1;
    const targetImage = group.images[targetIndex];
    if (!targetImage) {
      return;
    }

    const { error: err1 } = await client
      .from('gallery_images')
      .update({ sort_order: targetImage.sort_order })
      .eq('id', currentImage.id);

    const { error: err2 } = await client
      .from('gallery_images')
      .update({ sort_order: currentImage.sort_order })
      .eq('id', targetImage.id);

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
              GB / 23 GB
              <div className="w-full bg-gray-300 h-2 rounded mt-1">
                <div
                  className="bg-green-600 h-full"
                  style={{ width: `${(usedBytes / (23 * 1024 * 1024 * 1024)) * 100}%` }}
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
                    {}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setLightboxImages(
                          group.images.map(i => ({
                            src: i.image_url,
                            title: locale === 'ro' ? group.title_ro : group.title_en,
                            description: locale === 'ro' ? i.alt_ro : i.alt_en,
                          })),
                        );
                        setLightboxIndex(group.images.findIndex(i => i.id === img.id));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setLightboxImages(
                            group.images.map(i => ({
                              src: i.image_url,
                              title: locale === 'ro' ? group.title_ro : group.title_en,
                              description: locale === 'ro' ? i.alt_ro : i.alt_en,
                            })),
                          );
                          setLightboxIndex(group.images.findIndex(i => i.id === img.id));
                        }
                      }}
                      className="w-full rounded shadow cursor-pointer transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <img
                        src={img.image_url}
                        alt={locale === 'ro' ? img.alt_ro : img.alt_en}
                        className="w-full rounded pointer-events-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>

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
      {lightboxIndex >= 0 && (
        <Lightbox
          open
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={lightboxImages}
          render={{
            slide: ({ slide }) => {
              const s = slide as {
                src: string;
                title?: string;
                description?: string;
              };

              return (
                <div className="flex flex-col items-center justify-center h-full text-white px-4">
                  {/* Csoport címe */}
                  {s.title && (
                    <div
                      className="rounded-md px-6 py-3 mb-4 shadow-lg backdrop-blur text-center w-full max-w-4xl"
                    >
                      <h2 className="text-2xl md:text-3xl font-semibold">{s.title}</h2>
                    </div>
                  )}

                  {/* Kép (nagyobb max-méretek!) */}
                  <img
                    src={s.src}
                    alt={s.description}
                    className="rounded-lg shadow-2xl max-h-[80vh] max-w-[95vw] object-contain transition-transform duration-300 hover:scale-105"
                  />

                  {/* Alt szöveg */}
                  {s.description && (
                    <div className="rounded-md px-5 py-2 mt-4 max-w-[95vw] shadow backdrop-blur text-sm md:text-base text-center">
                      {s.description}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      )}

    </div>
  );
}
