import createMiddleware from 'next-intl/middleware';
import { routing } from '@backend/libs/I18nRouting';

// Létrehozzuk a middleware-t a routing konfiguráció alapján
export default createMiddleware(routing);

export const config = {
  // Ugyanaz a matcher maradhat, hogy a statikus fájlokat ne fogja meg
  matcher: '/((?!_next|.*\\..*).*)',
};