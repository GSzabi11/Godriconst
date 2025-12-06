'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  desc: string;
  delay?: number;
};

export const ValueCard = ({ icon, title, desc, delay = 0 }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group rounded-3xl bg-[#f9f6f3] p-6 shadow-lg shadow-[#1c1c1c]/10 border border-white/70 hover:-translate-y-1 hover:shadow-xl transition-all"
    >
      <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-[#1c1c1c] text-white group-hover:bg-[#4a3e38] transition-colors mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[#1c1c1c]">{title}</h3>
      <p className="text-sm text-[#4a3e38] leading-relaxed">{desc}</p>
    </motion.div>
  );
};