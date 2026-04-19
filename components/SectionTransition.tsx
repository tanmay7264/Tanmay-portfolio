'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface SectionTransitionProps {
  label: string;
  index: number;
}

export default function SectionTransition({ label, index }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className="sticky top-20 z-30 mx-4 my-8 sm:mx-6 lg:mx-8"
      style={{ opacity }}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-background/80 backdrop-blur-xl"
        style={{ scale }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-cyan-400/5" />
        <div className="relative flex items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-foreground/40">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="h-6 w-px bg-foreground/20" />
            <span className="section-label text-xs text-foreground/70 sm:text-sm">
              {label}
            </span>
          </div>
          
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary/60"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
