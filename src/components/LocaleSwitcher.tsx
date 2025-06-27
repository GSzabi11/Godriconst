'use client';

import type { ChangeEventHandler } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh(); // Ensure the page takes the new locale into account related to the issue #395
  };

  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 text-gray-500"
      />
      <select
        defaultValue={locale}
        onChange={handleChange}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {routing.locales.map(elt => (
          <option key={elt} value={elt}>
            {elt.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};
