'use client';

import CounterOnVisible from './CounterOnVisible';

// A komponens által várt paraméterek (props) típusainak definiálása
type Props = {
  icon: string;  // Az ikon képfájl elérési útvonala
  end: number;   // A számérték, ameddig a számlálónak el kell számolnia
  label: string; // A statisztika megnevezése 
};

// A StatItem komponens definíciója, amely egyetlen statisztikai kártyát jelenít meg
export const StatItem = ({ icon, end, label }: Props) => {
  return (
    // A kártya külső konténere Tailwind osztályokkal formázva:
    <div className="stat rounded-3xl bg-white p-5 shadow-lg shadow-[#1c1c1c]/10 border border-white/60 flex items-center gap-4">
      
      {/* Az ikon kép megjelenítése */}
      <img 
        src={icon} 
        alt={label} 
        className="h-12 w-12" // Fix magasság és szélesség
        loading="lazy"        // Lusta betöltés (csak akkor töltődik be, ha közel van a nézethez)
        draggable={false}     // Megakadályozza a kép "húzását" (drag-and-drop)
      />
      
      {/* Szöveges tartalom konténere (szám és felirat) */}
      <div>
        {/* A számláló komponens beillesztése, átadva neki a végső értéket */}
        <CounterOnVisible end={end} />
        
        {/* A statisztika címkéje sötétbarna színnel */}
        <p className="text-[#3a2f2a]">{label}</p>
      </div>
    </div>
  );
};