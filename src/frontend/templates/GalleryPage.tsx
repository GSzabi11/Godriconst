'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Lightbox from 'yet-another-react-lightbox';
import { createClient } from '@/backend/utils/supabase/browser-client';
import 'yet-another-react-lightbox/styles.css';
import '@frontend/styles/lightbox.css';

// Egy kép adatait leíró típus a galériában.
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

// Egy galéria csoportot leíró típus, amely képeket tartalmaz.
type GalleryGroup = {
  id: number;
  title_en: string;
  title_ro: string;
  sort_order: number;
  images: GalleryImage[];
};

// A Galéria oldal fő komponense.

export default function GalleryPage() {
  const t = useTranslations('Gallery');
  const locale = useLocale();
  const client = createClient();

  // Állapotváltozók (State)
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
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Betöltéskor ellenőrizzük, hogy admin felhasználó nyitotta-e az oldalt a query param alapján.
  useEffect(() => {
    const checkAdmin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const passwordToCheck = urlParams.get('admin');

      if (passwordToCheck) {
        const res = await fetch('/api/check-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: passwordToCheck }),
        });

        if (res.ok) {
          setIsAdmin(true);
        }
      }
    };

    checkAdmin();
  }, []);

  // Biztonságos API hívást megvalósító segédfüggvény.
  const secureApiCall = async (
    action: 'update' | 'insert' | 'delete',
    table: string,
    data?: any,
    id?: number,
  ) => {
    const res = await fetch('/api/gallery/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-auth': isAdmin ? (process.env.NEXT_PUBLIC_ADMIN_SECRET || '') : '',
      },
      body: JSON.stringify({ action, table, data, id }),
    });

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || 'Ismeretlen hiba történt az API hívás során');
    }
    return result;
  };

  // Galéria csoportok és képek betöltése, valamint a tárhely kihasználtság kiszámítása.
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

    const { data: allImages, error: usageError } = await client
      .from('gallery_images')
      .select('size');

    if (!usageError && allImages) {
      const totalUsed = allImages.reduce((acc, img) => acc + (img.size ?? 0), 0);
      setUsedBytes(totalUsed);
    }
  };

  // Az első render után betölti a galéria adatokat.
  useEffect(() => {
    loadGroups();
  }, []);

  // Kép feltöltése méretellenőrzés, alt szövegek bekérése, majd API hívás és állapot frissítés.
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, group: GalleryGroup) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (e.target.files && e.target.files.length > 1) {
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
    const maxAllowedBytes = 23 * 1024 * 1024 * 1024;

    if (newTotal > maxAllowedBytes) {
      toast.error('A feltöltéssel meghaladnád a 23GB-os limitet.');
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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'x-admin-auth': isAdmin ? (process.env.NEXT_PUBLIC_ADMIN_SECRET || '') : '',
        },
      });
      const data = await res.json();

      const url = data.result?.secure_url;
      const cloudinary_id = data.result?.public_id;
      const size = data.size ?? file.size;

      if (!url || !cloudinary_id) {
        toast.error('Hiba: Nem kaptunk érvényes választ a feltöltés után.');
        return;
      }

      const sort_order = group.images.length + 1;

      await secureApiCall('insert', 'gallery_images', {
        image_url: url,
        alt_en,
        alt_ro,
        group_id: group.id,
        cloudinary_id,
        sort_order,
        size,
      });

      await loadGroups();
      toast.success('Kép sikeresen feltöltve.');

      const usedMB = (newTotal / (1024 * 1024)).toFixed(2);
      const maxMB = 23 * 1024;
      toast.info(`Használat: ${usedMB} MB / ${maxMB} MB`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Hiba történt a feltöltés során: ${err.message}`);
    }
  };

  // Képek átrendezése csoporton belül és között a sorrend mezők módosításával.
  const moveImage = async (
    group: GalleryGroup,
    imageId: number,
    direction: 'up' | 'down',
  ) => {
    const groupIndex = galleryGroups.findIndex(g => g.id === group.id);
    const imgIndex = group.images.findIndex(i => i.id === imageId);
    const currentImage = group.images[imgIndex];

    if (!currentImage) return;

    const isFirst = imgIndex === 0;
    const isLast = imgIndex === group.images.length - 1;

    try {
      if (direction === 'up' && isFirst && groupIndex > 0) {
        const prevGroup = galleryGroups[groupIndex - 1];
        if (!prevGroup) return;

        const newOrder = (prevGroup.images.at(-1)?.sort_order ?? 0) + 1;

        await secureApiCall('update', 'gallery_images', {
          group_id: prevGroup.id,
          sort_order: newOrder,
        }, currentImage.id);

        await loadGroups();
        return;
      }

      if (direction === 'down' && isLast && groupIndex < galleryGroups.length - 1) {
        const nextGroup = galleryGroups[groupIndex + 1];
        if (!nextGroup) return;

        const newOrder = (nextGroup.images[0]?.sort_order ?? 0) - 1;

        await secureApiCall('update', 'gallery_images', {
          group_id: nextGroup.id,
          sort_order: newOrder,
        }, currentImage.id);

        await loadGroups();
        return;
      }

      const targetIndex = direction === 'up' ? imgIndex - 1 : imgIndex + 1;
      const targetImage = group.images[targetIndex];
      if (!targetImage) return;

      await Promise.all([
        secureApiCall('update', 'gallery_images', { sort_order: targetImage.sort_order }, currentImage.id),
        secureApiCall('update', 'gallery_images', { sort_order: currentImage.sort_order }, targetImage.id),
      ]);

      await loadGroups();
    } catch (err: any) {
      toast.error(`Hiba a mozgatásnál: ${err.message}`);
    }
  };

  // Csoport átnevezése a szerkesztett mezők alapján, majd lista frissítése.
  const handleRenameGroup = async (groupId: number) => {
    try {
      await secureApiCall('update', 'gallery_groups', {
        title_en: editedTitleEn,
        title_ro: editedTitleRo,
      }, groupId);

      toast.success('Csoport frissítve');
      setEditingGroupId(null);
      await loadGroups();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Galéria csoportok sorrendjének módosítása fel/le mozgatással.
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

    if (!current || !other) {
      toast.error('Hiba: Hiányzó csoport elem');
      return;
    }

    try {
      await Promise.all([
        secureApiCall('update', 'gallery_groups', { sort_order: other.sort_order }, current.id),
        secureApiCall('update', 'gallery_groups', { sort_order: current.sort_order }, other.id),
      ]);

      await loadGroups();
    } catch (err: any) {
      toast.error(`Hiba a csoport mozgatásnál: ${err.message}`);
    }
  };

  // Egyetlen kép törlése a Supabase-ből és a tárolóból, majd lista frissítése.
  const handleDelete = async (imageId: number, cloudinaryId: string) => {
    try {
      const res = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': isAdmin ? (process.env.NEXT_PUBLIC_ADMIN_SECRET || '') : '',
        },
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

  // Teljes csoport törlése minden képével együtt, megerősítéssel és hibakezeléssel.
  const handleDeleteGroup = async (groupId: number) => {
    const group = galleryGroups.find(g => g.id === groupId);
    if (!group) return;

    // eslint-disable-next-line no-alert
    if (!confirm('Biztosan törölni akarod ezt a csoportot és az összes benne lévő képet?')) {
      return;
    }

    try {
      await Promise.all(group.images.map(async (img) => {
        const res = await fetch('/api/delete-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-auth': isAdmin ? (process.env.NEXT_PUBLIC_ADMIN_SECRET || '') : '',
          },
          body: JSON.stringify({ imageId: img.id, cloudinaryId: img.cloudinary_id }),
        });
        const result = await res.json();
        if (!result.success) {
          throw new Error(`Kép törlése sikertelen: ${result.error}`);
        }
      }));

      await secureApiCall('delete', 'gallery_groups', undefined, groupId);

      toast.success('Csoport és képek törölve');
      await loadGroups();
    } catch (err: any) {
      console.error(err);
      toast.error(`Nem sikerült a csoport törlése: ${err.message}`);
    }
  };

  // Új csoport létrehozása a megadott román és angol címekkel, sorban a lista végére illesztve.
  const handleCreateGroup = async () => {
    const titleEn = newGroupTitleEn.trim();
    const titleRo = newGroupTitleRo.trim();
    if (!titleEn || !titleRo) {
      toast.error('Mindkét nyelven meg kell adni a nevet');
      return;
    }

    try {
      const maxSort = galleryGroups.reduce((acc, g) => Math.max(acc, g.sort_order), 0);

      await secureApiCall('insert', 'gallery_groups', {
        title_en: titleEn,
        title_ro: titleRo,
        sort_order: maxSort + 1,
      });

      setNewGroupTitleEn('');
      setNewGroupTitleRo('');
      await loadGroups();
      toast.success('Csoport létrehozva');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Segédfüggvény: bájt értéket két tizedesre kerekített gigabájtra konvertál.
  const bytesToGigabytes = (bytes: number) => {
    return Math.ceil((bytes / (1024 * 1024 * 1024)) * 100) / 100;
  };

  const visibleGroups = [...galleryGroups]
    .sort((a, b) => {
      if (selectedGroupId === null) {
        return a.sort_order - b.sort_order;
      }
      if (a.id === selectedGroupId) return -1;
      if (b.id === selectedGroupId) return 1;
      return a.sort_order - b.sort_order;
    });

  const sortedFilterOptions = [{ id: null, title_en: 'All', title_ro: 'Toate', sort_order: -1 }, ...galleryGroups]
    .sort((a, b) => {
      if (selectedGroupId === null) return a.sort_order - b.sort_order;
      if (a.id === selectedGroupId) return -1;
      if (b.id === selectedGroupId) return 1;
      return a.sort_order - b.sort_order;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1220] via-[#111827] to-[#0c0c0c] text-white">
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/images/first_landing.jpg"
            alt="Gallery Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl text-center text-white bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow mb-4">
              {t('heading')}
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto">
              {t('paragraph')}
            </p>
            <div className="mt-6 h-1 w-16 mx-auto bg-white rounded-full opacity-80" />
          </motion.div>
        </div>
      </section>

      <section className="relative bg-[#f6f0ec] text-[#1c1c1c] px-[6%] py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40 pointer-events-none" />
        <div className="relative mx-auto w-full max-w-7xl 2xl:max-w-[1600px] space-y-10">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#6b5b53]">{t('heading')}</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1c1c1c]">{t('paragraph')}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-[#1c1c1c]/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[#1c1c1c] shadow-sm hover:-translate-y-[1px] hover:shadow-md transition"
              >
                {t('filter')}
              </button>
              {isAdmin && (
                <div className="rounded-full bg-[#1c1c1c] px-4 py-2 text-white text-sm font-medium shadow-lg shadow-[#1c1c1c]/20">
                  admin
                </div>
              )}
            </div>
          </div>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 rounded-2xl bg-white/90 p-4 shadow-lg shadow-[#1c1c1c]/10 border border-white">
                {sortedFilterOptions.map(group => (
                  <button
                    key={group.id ?? 'all'}
                    onClick={() => setSelectedGroupId(group.id ?? null)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${selectedGroupId === group.id
                      ? 'bg-[#1c1c1c] text-white shadow-[#1c1c1c]/20'
                      : 'bg-white text-[#1c1c1c] border border-[#1c1c1c]/10 hover:bg-[#f3ece8]'
                      }`}
                  >
                    {group.id === null ? (locale === 'ro' ? 'Toate' : 'All') : locale === 'ro' ? group.title_ro : group.title_en}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {isAdmin && (
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-[#1c1c1c]/10 border border-white space-y-4">
              {/*admin panel kódja*/}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#6b5b53]">Tárhelyhasználat</p>
                  <p className="text-lg font-semibold text-[#1c1c1c]">
                    {bytesToGigabytes(usedBytes)} GB / 23 GB
                  </p>
                </div>
                <div className="w-full sm:w-72 h-2 rounded-full bg-[#f1e7e2] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                    style={{ width: `${(usedBytes / (23 * 1024 * 1024 * 1024)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={newGroupTitleEn}
                  onChange={e => setNewGroupTitleEn(e.target.value)}
                  placeholder="New group name (EN)"
                  className="w-full rounded-xl border border-[#d8cdcd] bg-white px-4 py-3 text-sm shadow-sm focus:border-[#1c1c1c] focus:outline-none"
                />
                <input
                  type="text"
                  value={newGroupTitleRo}
                  onChange={e => setNewGroupTitleRo(e.target.value)}
                  placeholder="New group name (RO)"
                  className="w-full rounded-xl border border-[#d8cdcd] bg-white px-4 py-3 text-sm shadow-sm focus:border-[#1c1c1c] focus:outline-none"
                />
              </div>
              <button
                onClick={handleCreateGroup}
                className="inline-flex items-center justify-center rounded-full bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1c1c1c]/20 hover:bg-black transition"
              >
                {t('create_group') || 'Create Group'}
              </button>
            </div>
          )}

          <div className="space-y-12">
            {visibleGroups.map(group => (
              <div key={group.id} className="rounded-3xl bg-white/90 p-6 shadow-xl shadow-[#1c1c1c]/10 border border-white">
                <div className="flex items-center gap-3 mb-6">
                  {isAdmin && editingGroupId === group.id ? (
                    <>
                      <input
                        className="rounded-lg border border-[#d8cdcd] px-3 py-2 text-sm shadow-sm"
                        value={editedTitleEn}
                        onChange={e => setEditedTitleEn(e.target.value)}
                      />
                      <input
                        className="rounded-lg border border-[#d8cdcd] px-3 py-2 text-sm shadow-sm"
                        value={editedTitleRo}
                        onChange={e => setEditedTitleRo(e.target.value)}
                      />
                      <button
                        onClick={() => handleRenameGroup(group.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-white text-sm shadow hover:bg-emerald-700"
                      >
                        💾
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-semibold text-[#1c1c1c]">
                        {locale === 'ro' ? group.title_ro : group.title_en}
                      </h2>
                      <span className="rounded-full bg-[#f1e7e2] px-3 py-1 text-xs font-semibold text-[#6b5b53]">
                        {group.images.length}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setEditingGroupId(group.id);
                            setEditedTitleEn(group.title_en);
                            setEditedTitleRo(group.title_ro);
                          }}
                          className="ml-2 rounded-full bg-white p-2 shadow border border-[#d8cdcd] hover:-translate-y-[1px] transition"
                        >
                          <Pencil className="w-4 h-4 text-[#1c1c1c]" />
                        </button>
                      )}
                    </>
                  )}
                  {isAdmin && (
                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => moveGroup(group.id, 'up')} className="rounded-full bg-[#f1e7e2] p-2 text-[#1c1c1c] shadow"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveGroup(group.id, 'down')} className="rounded-full bg-[#f1e7e2] p-2 text-[#1c1c1c] shadow"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteGroup(group.id)} className="rounded-full bg-red-100 p-2 text-red-700 shadow hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="mb-5">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1c1c1c] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-black">
                      + {t('add_image')}
                      <input type="file" accept="image/*" onChange={e => handleUpload(e, group)} className="hidden" multiple={false} />
                    </label>
                  </div>
                )}

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {group.images.map(img => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden bg-[#f6f0ec] border border-white shadow-lg shadow-[#1c1c1c]/10 aspect-[4/3]">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setLightboxImages(group.images.map(i => ({ src: i.image_url, title: locale === 'ro' ? group.title_ro : group.title_en, description: locale === 'ro' ? i.alt_ro : i.alt_en })));
                          setLightboxIndex(group.images.findIndex(i => i.id === img.id));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setLightboxImages(group.images.map(i => ({ src: i.image_url, title: locale === 'ro' ? group.title_ro : group.title_en, description: locale === 'ro' ? i.alt_ro : i.alt_en })));
                            setLightboxIndex(group.images.findIndex(i => i.id === img.id));
                          }
                        }}
                        className="w-full h-full cursor-pointer"
                      >
                        <img
                          src={img.image_url}
                          alt={locale === 'ro' ? img.alt_ro : img.alt_en}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                        <span className="truncate pr-2">{locale === 'ro' ? img.alt_ro : img.alt_en}</span>
                      </div>

                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                          <button onClick={() => handleDelete(img.id, img.cloudinary_id)} className="rounded-full bg-red-600/90 px-2 py-1 text-xs font-semibold text-white shadow">✕</button>
                          <div className="flex gap-1">
                            <button onClick={() => moveImage(group, img.id, 'up')} className="rounded-full bg-black/70 p-1 text-white shadow"><ArrowUp className="w-4 h-4" /></button>
                            <button onClick={() => moveImage(group, img.id, 'down')} className="rounded-full bg-black/70 p-1 text-white shadow"><ArrowDown className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
                  {s.title && (
                    <div className="rounded-2xl px-6 py-4 mb-4 shadow-lg backdrop-blur bg-white/10 border border-white/10 text-center w-full max-w-4xl">
                      <h2 className="text-2xl md:text-3xl font-semibold">{s.title}</h2>
                    </div>
                  )}

                  <img
                    src={s.src}
                    alt={s.description}
                    className="rounded-2xl shadow-2xl max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-300 hover:scale-105"
                  />

                  {s.description && (
                    <div className="rounded-xl px-5 py-3 mt-4 max-w-[95vw] shadow backdrop-blur bg-white/10 border border-white/10 text-sm md:text-base text-center">
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