'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type GalleryGroup = {
  id: number;
  title_en: string;
  title_ro: string;
};

type Props = {
  groups: GalleryGroup[];
  locale: string;
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;
};

export default function GalleryFilter({
  groups,
  locale,
  selectedGroupId,
  setSelectedGroupId,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-10">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="px-5 py-2 rounded-full border bg-white text-black"
      >
        {locale === 'ro' ? 'Filtru' : 'Filter'}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-3 mt-4"
        >
          <button
            onClick={() => setSelectedGroupId(null)}
            className={`px-4 py-2 rounded-full border ${
              selectedGroupId === null ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {locale === 'ro' ? 'Toate' : 'All'}
          </button>

          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`px-4 py-2 rounded-full border ${
                selectedGroupId === group.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {locale === 'ro' ? group.title_ro : group.title_en}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
