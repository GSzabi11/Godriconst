# Godriconst

A projekt egy Next.js alapú, többnyelvű webalkalmazás, amely Supabase-re és Cloudinary-ra támaszkodik a tartalomkezeléshez. A frontend React 19-gyel és TypeScript-tel készül, a felhasználói felületet MUI és saját komponensek alkotják, a fordításokat pedig a `next-intl` kezeli.

## Követelmények
- Node.js 20 vagy újabb
- npm

## Telepítés és futtatás
1. Függőségek telepítése:
   ```bash
   npm install
   ```
2. Fejlesztői szerver indítása (Turbopackkel):
   ```bash
   npm run dev
   ```
3. Produkciós build készítése és futtatása:
   ```bash
   npm run build
   npm start
   ```

## Környezeti változók
Hozz létre egy `.env.local` fájlt a projekt gyökerében az alábbi kulcsokkal:


- `ADMIN_PAGE_PASSWORD` - Az admin oldal elérésének a jelszava
- `NEXT_PUBLIC_SUPABASE_URL` – a Supabase projekt URL-je.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – publikus Supabase anon kulcs a kliensoldali hívásokhoz.
- `SUPABASE_SERVICE_ROLE_KEY` – szolgáltatás kulcs a szerveroldali műveletekhez.
- `NEXT_PUBLIC_ADMIN_SECRET` – admin jogosultságot igazoló fejléc értéke a galéria API-khoz.
- `CLOUDINARY_CLOUD_NAME` – Cloudinary felhő azonosító.
- `CLOUDINARY_API_KEY` és `CLOUDINARY_API_SECRET` – Cloudinary API hozzáférés.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – SMTP szerver adatai a kapcsolatfelvételi űrlaphoz.
- `CONTACT_EMAIL` – cím, ahová az űrlapüzenetek érkeznek.

## Fontos funkciók
- **Galéria feltöltés/frissítés**: Cloudinary-ra tölti fel a képeket, és `x-admin-auth` fejlécet vár a `NEXT_PUBLIC_ADMIN_SECRET` értékével a védett műveletekhez.
- **Kapcsolatfelvételi űrlap**: SMTP-n keresztül e-mailt küld a beérkező üzenetekről, Zod alapú validációval és spam-ellenőrzéssel.
- **Supabase integráció**: szerver- és kliensoldali kliensek a hitelesítéshez és adatkezeléshez, a Supabase session cookie-k megfelelő kezelésével.
- **Többnyelvűség**: a `[locale]` útvonalak és a `next-intl` konfiguráció gondoskodnak a lokalizált oldalak metaadatairól és tartalmáról.

## Mappa-struktúra
- `src/app` – Next.js útvonalak, API endpointok és lokalizált oldalak.
- `src/frontend` – komponensek, stílusok és sablonok a felhasználói felülethez.
- `src/backend` – Supabase, Cloudinary és egyéb szerveroldali segédfüggvények.

## Hasznos script-ek
- `npm run dev` – fejlesztői környezet.
- `npm run build` / `npm start` – produkciós build és szerver indítása.
