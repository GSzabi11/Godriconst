'use client';

type Props = {
  title: string;       // A nagy főcím 
  subtitle?: string;   // A kicsi, kísérő szöveg
  align?: 'left' | 'center'; // Igazítás - alapértelmezetten balra
  className?: string;  // Opcionális extra stílusok, ha szükséges
};

export const SectionTitle = ({ 
  title, 
  subtitle, 
  align = 'left', 
  className = '' 
}: Props) => {
  return (
    <div className={`mb-6 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {subtitle && (
        <p className="text-sm uppercase tracking-[0.25em] text-[#6b5b53] font-bold mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#1c1c1c]">
        {title}
      </h2>
    </div>
  );
};