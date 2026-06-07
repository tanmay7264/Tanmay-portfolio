'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, BookMarked, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function MediumBlog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { ui } = useLanguage();

  return (
    <section id="blog" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-right hidden xl:block">{ui.mediumBlog.sideLabel}</div>
      <div className="max-w-5xl mx-auto">
        {/* Header with hook */}
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
            <BookMarked className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {ui.mediumBlog.badge}
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{ui.mediumBlog.heading}</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {ui.mediumBlog.subheading}
          </p>
          
          <motion.p
            className="text-base sm:text-lg text-foreground/85 max-w-3xl mx-auto font-medium italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            &quot;{ui.mediumBlog.hook}&quot;
          </motion.p>
        </motion.div>

        {/* Featured Articles */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {ui.mediumBlog.featuredArticles.map((article, index) => (
            <motion.a
              key={`article-${index}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 transition-all duration-300 hover:border-primary/40 hover:from-primary/10 hover:to-primary/5 hover:shadow-lg hover:shadow-primary/10"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-3 pr-6 line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {article.preview}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                  {article.readTime}
                </span>
                <span className="text-xs text-muted-foreground">
                  {article.date}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href={ui.mediumBlog.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
          >
            <Sparkles className="h-5 w-5" />
            {ui.mediumBlog.ctaText}
            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>

        {/* Call-to-action text */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {ui.mediumBlog.footerText}
        </motion.p>
      </div>
    </section>
  );
}
