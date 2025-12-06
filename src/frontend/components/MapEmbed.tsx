type Props = {
  height?: string | number;
};

export const MapEmbed = ({ height = 400 }: Props) => {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#1c1c1c]/10 border border-white/60 bg-white w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41400.2345!2d25.601198!3d45.657975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sro!4v1719083426509!5m2!1sen!2sro"
        width="100%"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full block border-0"
        title="Google Map"
      />
    </div>
  );
};