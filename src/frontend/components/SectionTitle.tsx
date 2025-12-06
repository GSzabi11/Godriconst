'use client'; 

// A komponens által elfogadott paraméterek (props) típusainak definiálása
type Props = {
  title: string;       // A nagy főcím
  subtitle?: string;   // A kicsi, kísérő szöveg a főcím felett 
  align?: 'left' | 'center'; // Szöveg igazítása - alapértelmezetten balra
  className?: string;  // Opcionális extra CSS osztályok, ha kívülről kellene még formázni
};

// A SectionTitle komponens definíciója
export const SectionTitle = ({ 
  title, 
  subtitle, 
  align = 'left', 
  className = '' 
}: Props) => {
  return (
    // A külső konténer div, amely összefogja az alcímet és a főcímet.
    <div className={`mb-6 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      
      {/* Feltételes renderelés: Csak akkor rajzoljuk ki ezt a <p> elemet, ha a 'subtitle' prop létezik (nem undefined/null/üres) */}
      {subtitle && (
        <p className="text-sm uppercase tracking-[0.25em] text-[#6b5b53] font-bold mb-3">
          {subtitle}
        </p>
      )}

      {/* A főcím megjelenítése */}
      <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#1c1c1c]">
        {title}
      </h2>
    </div>
  );
};