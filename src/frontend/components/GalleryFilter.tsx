'use client'; 
import { motion } from 'framer-motion'; 
import { useState } from 'react';

// A galéria csoportok adatstruktúrájának definíciója
type GalleryGroup = {
  id: number;          // Egyedi azonosító
  title_en: string;    // Angol cím
  title_ro: string;    // Román cím
};

// A komponens által várt paraméterek (props) típusai
type Props = {
  groups: GalleryGroup[]; // A megjelenítendő csoportok listája
  locale: string;         // Az aktuális nyelv kódja ('ro', 'en', stb.)
  selectedGroupId: number | null; // A jelenleg kiválasztott csoport ID-ja
  setSelectedGroupId: (id: number | null) => void; // Függvény a kiválasztott csoport módosítására (visszaadja az ID-t a szülőnek)
};

// A GalleryFilter komponens definíciója
export default function GalleryFilter({
  groups,
  locale,
  selectedGroupId,
  setSelectedGroupId,
}: Props) {
  // Helyi állapot a szűrő menü nyitott/zárt állapotának tárolására
  // false = zárva (alapértelmezett), true = nyitva
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-10">
      {/* A fő gomb, ami megnyitja/bezárja a szűrő opciókat */}
      <button
        onClick={() => setIsOpen(prev => !prev)} // Kattintáskor megfordítja az állapotot
        className="px-5 py-2 rounded-full border bg-white text-black"
      >
        {/* A gomb szövege a nyelvtől függően 'Filtru' vagy 'Filter' */}
        {locale === 'ro' ? 'Filtru' : 'Filter'}
      </button>

      {/* Feltételes renderelés: Csak akkor jelenítjük meg a listát, ha az 'isOpen' igaz */}
      {isOpen && (
        <motion.div
          // Animáció kezdőállapota: láthatatlan és 0 magasság
          initial={{ opacity: 0, height: 0 }}
          // Animáció célállapota: teljesen látható és automatikus magasság (a tartalomhoz igazodik)
          animate={{ opacity: 1, height: 'auto' }}
          // Az animáció időtartama (0.3 másodperc)
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-3 mt-4" // Flexbox elrendezés a gomboknak
        >
          {/* Az "Összes" (All/Toate) gomb */}
          {/* Ez null-ra állítja a szűrőt, vagyis minden képet mutat */}
          <button
            onClick={() => setSelectedGroupId(null)}
            className={`px-4 py-2 rounded-full border ${
              // Feltételes stílusozás: Ha a kiválasztott ID null, akkor ez a gomb legyen fekete (aktív)
              selectedGroupId === null ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {locale === 'ro' ? 'Toate' : 'All'}
          </button>

          {/* Végigmegyünk a kapott csoportokon és mindegyikhez generálunk egy gombot */}
          {groups.map(group => (
            <button
              key={group.id} // Egyedi kulcs a React listakezeléséhez
              onClick={() => setSelectedGroupId(group.id)} // Kattintáskor beállítja ezt a csoportot aktívnak
              className={`px-4 py-2 rounded-full border ${
                // Feltételes stílusozás: Ha ez a csoport van kiválasztva, legyen fekete (aktív), különben fehér
                selectedGroupId === group.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100' // Inaktív gomboknál hover effekt
              }`}
            >
              {/* A csoport neve a választott nyelven */}
              {locale === 'ro' ? group.title_ro : group.title_en}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}