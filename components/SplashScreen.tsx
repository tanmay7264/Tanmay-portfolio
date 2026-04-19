'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Monogram */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="text-8xl font-bold text-gradient"
          animate={{
            filter: ['drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))', 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.8))'],
          }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        >
          TN
        </motion.div>
        
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
        />
      </motion.div>

      {/* Loading bar */}
      <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeInOut' }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Loading portfolio...
      </motion.p>
    </motion.div>
  );
}
