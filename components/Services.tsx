'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Rocket, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const icons = [Briefcase, Rocket, Wrench] as const;

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, ui } = useLanguage();

  return (
    <section id="services" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-left hidden xl:block">{ui.services.sideLabel}</div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{ui.services.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{ui.services.subheading}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioData.services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.article
                key={service.title}
                className="glass panel-shift rounded-2xl p-6 border border-white/10 hover:border-primary/40 transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -4 }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-foreground/75 leading-relaxed">{service.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
