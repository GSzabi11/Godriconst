'use client';

import { useEffect, useState } from 'react';

// Egyszerű téma váltó gomb, amely a localStorage-ban tárolja a választást.
// A `dark` osztályt állítja a <html> elemen, így a Tailwind dark mód szabályai aktiválódnak.
// Komponensfüggvény, amely beolvassa az előző választást és kezeli a váltásokat.
export default function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  // Betöltéskor ellenőrzi, hogy korábban sötét módot választott-e a felhasználó.
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDark(true);
    }
  }, []);

  // A `dark` állapot változásakor frissíti a DOM-ot és a tárolt preferenciát.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark(d => !d)}
      className="rounded border px-2 py-1 text-sm"
      aria-label="Toggle Theme"
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}