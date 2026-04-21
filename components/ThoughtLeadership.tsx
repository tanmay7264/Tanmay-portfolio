'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, BookOpenText } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function ThoughtLeadership() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, ui } = useLanguage();

  return (
    <section id="insights" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-left hidden xl:block">{ui.thoughtLeadership.sideLabel}</div>
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{ui.thoughtLeadership.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{ui.thoughtLeadership.subheading}</p>
        </motion.div>

        <div className="space-y-4">
          {portfolioData.thoughtLeadership.map((post: typeof portfolioData.thoughtLeadership[number], index: number) => (
            <motion.a
              key={`${post.title}-${index}`}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.05]"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/15 p-2">
                  <BookOpenText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.platform}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                {ui.thoughtLeadership.readMore}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
