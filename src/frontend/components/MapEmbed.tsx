'use client';

// A komponens által elfogadott paraméterek (props) típusainak definiálása
type Props = {
  height?: string | number; // A térkép magassága. Opcionális (?), mert van alapértelmezett értéke. Lehet szám (pixel) vagy string (pl. "50%").
};

// A MapEmbed komponens definíciója
export const MapEmbed = ({ height = 400 }: Props) => {
  return (
    // Külső konténer div stílusa (Tailwind CSS):
    <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#1c1c1c]/10 border border-white/60 bg-white w-full">
      
      {/* Google Maps iframe beágyazása */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41400.2345!2d25.601198!3d45.657975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1719083426509!5m2!1sen!2sro" // A térkép forrás URL-je (itt egy példa link szerepel)
        width="100%"      // Mindig kitölti a konténer teljes szélességét
        height={height}   // A magasságot a kapott prop határozza meg (vagy a 400-as alapérték)
        loading="lazy"    // Lusta betöltés: csak akkor töltődik be, ha a felhasználó odagörget
        referrerPolicy="no-referrer-when-downgrade" // Biztonsági beállítás a referrer header kezelésére
        className="w-full block border-0" // Stílus: blokk elem, keret nélkül
        title="Google Map" // Hozzáférhetőségi címke
      />
    </div>
  );
};