import { createNavigation } from 'next-intl/navigation';
import { routing } from './I18nRouting';

// Az i18n-re felkészített navigációs segédfüggvények előállítása.
// A `usePathname` hook a lokalizált útvonalakat figyelembe véve tér vissza az aktuális elérési úttal.
export const { usePathname } = createNavigation(routing);
