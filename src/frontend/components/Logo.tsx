import Link from 'next/link';

/*Logo megjelenítése és a Home page -re való irányítása*/
export const Logo = () => {
  return (
    <div className="w-full flex justify-center lg:justify-start items-center">
      <Link href="/" className="block">
        <img
          src="/assets/images/logo.png"
          alt="Logo"
          className="h-24 w-auto lg:h-20"
          loading="lazy"
          draggable={false}
        />
      </Link>
    </div>
  );
};