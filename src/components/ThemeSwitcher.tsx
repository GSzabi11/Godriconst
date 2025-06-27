'use client';

import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDark(true);
    }
  }, []);

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
