'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, ui } = useLanguage();

  return (
    <section id="testimonials" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-right hidden xl:block">{ui.testimonials.sideLabel}</div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{ui.testimonials.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ui.testimonials.subheading}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioData.testimonials.map((testimonial: typeof portfolioData.testimonials[number], index: number) => (
            <motion.figure
              key={`${testimonial.name}-${index}`}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/35 transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -4 }}
            >
              <Quote className="w-6 h-6 text-primary mb-4" />
              <blockquote className="text-foreground/80 leading-relaxed mb-5">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
