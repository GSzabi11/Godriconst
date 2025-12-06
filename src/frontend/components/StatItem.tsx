'use client';

import CounterOnVisible from './CounterOnVisible';

type Props = {
  icon: string;
  end: number;
  label: string;
};

export const StatItem = ({ icon, end, label }: Props) => {
  return (
    <div className="stat rounded-3xl bg-white p-5 shadow-lg shadow-[#1c1c1c]/10 border border-white/60 flex items-center gap-4">
      <img 
        src={icon} 
        alt={label} 
        className="h-12 w-12" 
        loading="lazy" 
        draggable={false} 
      />
      <div>
        <CounterOnVisible end={end} />
        <p className="text-[#3a2f2a]">{label}</p>
      </div>
    </div>
  );
};