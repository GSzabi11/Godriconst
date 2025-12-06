'use client';

import { motion } from 'framer-motion'; 
import { ReactNode } from 'react'; 

// A komponens által várt paraméterek (props) típusainak meghatározása
type Props = {
  icon: ReactNode; // Az ikon, ami lehet bármilyen React elem (pl. SVG vagy ikon komponens)
  title: string;   // A kártya címe (szöveg)
  desc: string;    // A kártya leírása (szöveg)
  delay?: number;  // Opcionális paraméter az animáció késleltetéséhez (alapértéke 0 lesz)
};

// Maga a ValueCard komponens függvénye
export const ValueCard = ({ icon, title, desc, delay = 0 }: Props) => {
  return (
    <motion.div
      // Kezdőállapot: teljesen átlátszó (opacity: 0) és 15 pixellel lejjebb van (y: 15)
      initial={{ opacity: 0, y: 15 }}
      
      // Amikor az elem a képernyőre (viewportba) kerül:
      // Teljesen látható lesz (opacity: 1) és a helyére úszik (y: 0)
      whileInView={{ opacity: 1, y: 0 }}
      
      // Beállítások a nézet figyeléséhez: az animáció csak egyszer fusson le
      viewport={{ once: true }}
      
      // Az átmenet beállításai: itt használjuk fel a kapott késleltetést (delay)
      transition={{ delay }}
      
      // Tailwind CSS osztályok a kinézethez:
      className="group rounded-3xl bg-[#f9f6f3] p-6 shadow-lg shadow-[#1c1c1c]/10 border border-white/70 hover:-translate-y-1 hover:shadow-xl transition-all"
    >
      {/* Ikon konténer: Kör alakú háttér, középre igazítás */}
      {/* group-hover:bg-[#4a3e38]: ha a kártya fölé viszik az egeret, az ikon háttere megváltozik */}
      <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-[#1c1c1c] text-white group-hover:bg-[#4a3e38] transition-colors mx-auto">
        {icon}
      </div>

      {/* Cím megjelenítése */}
      <h3 className="text-xl font-semibold mb-2 text-[#1c1c1c]">{title}</h3>

      {/* Leírás szöveg megjelenítése */}
      <p className="text-sm text-[#4a3e38] leading-relaxed">{desc}</p>
    </motion.div>
  );
};