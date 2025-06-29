'use client';

import { ArrowDown, ArrowUp, Pencil } from 'lucide-react';
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
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editedTitleEn, setEditedTitleEn] = useState('');
  const [editedTitleRo, setEditedTitleRo] = useState('');
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
      console.error('Hiba a gallery_groups betoltésénél:', error.message);
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

  const handleRenameGroup = async (groupId: number) => {
    const { error } = await client.from('gallery_groups').update({
      title_en: editedTitleEn,
      title_ro: editedTitleRo,
    }).eq('id', groupId);

    if (error) {
      toast.error(`Nem sikerült frissíteni: ${error.message}`);
    } else {
      toast.success('Csoport sikeresen frissítve');
      setEditingGroupId(null);
      await loadGroups();
    }
  };

  const moveGroup = async (groupId: number, direction: 'up' | 'down') => {
    const index = galleryGroups.findIndex(g => g.id === groupId);
    if (index < 0 || (direction === 'up' && index === 0) || (direction === 'down' && index === galleryGroups.length - 1)) {
      return;
    }

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const current = galleryGroups[index]!;
    const other = galleryGroups[otherIndex]!;

    const { error: err1 } = await client.from('gallery_groups').update({ sort_order: other.sort_order }).eq('id', current.id);
    const { error: err2 } = await client.from('gallery_groups').update({ sort_order: current.sort_order }).eq('id', other.id);

    if (err1 || err2) {
      toast.error('Nem sikerült a sorrend módosítása');
    } else {
      await loadGroups();
    }
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
                onClick={async () => {
                  const titleEn = newGroupTitleEn.trim();
                  const titleRo = newGroupTitleRo.trim();

                  if (!titleEn || !titleRo) {
                    toast.error('Mindkét nyelven meg kell adni a csoport nevét!');
                    return;
                  }

                  const maxSort = galleryGroups.reduce((acc, g) => Math.max(acc, g.sort_order ?? 0), 0);
                  const { error } = await client.from('gallery_groups').insert({
                    title_en: titleEn,
                    title_ro: titleRo,
                    sort_order: maxSort + 1,
                  });

                  if (error) {
                    toast.error(`Hiba történt a csoport mentésekor: ${error.message}`);
                  } else {
                    setNewGroupTitleEn('');
                    setNewGroupTitleRo('');
                    await loadGroups();
                    toast.success('Csoport sikeresen hozzáadva');
                  }
                }}
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
              <div className="flex items-center gap-2 mb-4">
                {editingGroupId === group.id
                  ? (
                      <>
                        <input
                          className="border px-2 py-1"
                          value={editedTitleEn}
                          onChange={e => setEditedTitleEn(e.target.value)}
                        />
                        <input
                          className="border px-2 py-1"
                          value={editedTitleRo}
                          onChange={e => setEditedTitleRo(e.target.value)}
                        />
                        <button
                          onClick={() => handleRenameGroup(group.id)}
                          className="bg-blue-500 text-white px-2 rounded"
                        >
                          💾
                        </button>
                      </>
                    )
                  : (
                      <>
                        <h2 className="text-2xl md:text-3xl">
                          {locale === 'ro' ? group.title_ro : group.title_en}
                        </h2>
                        <button onClick={() => {
                          setEditingGroupId(group.id);
                          setEditedTitleEn(group.title_en);
                          setEditedTitleRo(group.title_ro);
                        }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </>
                    )}
                <div className="ml-auto flex gap-1">
                  <button onClick={() => moveGroup(group.id, 'up')}><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveGroup(group.id, 'down')}><ArrowDown className="w-4 h-4" /></button>
                </div>
              </div>

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
