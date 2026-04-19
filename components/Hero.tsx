'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown, Download, Mail, Linkedin } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-shell lg:snap-start relative min-h-screen flex items-center justify-center px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-0 top-24 hidden -rotate-90 text-xs uppercase tracking-[0.25em] text-foreground/45 xl:block">
        Portfolio 2026
      </div>
      <div className="side-label side-label-right hidden xl:block">Home</div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Professional profile image */}
        <motion.div
          className="mx-auto mb-8 w-fit"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-cyan-400/30 blur-lg" />
            <div className="glass panel-shift relative h-40 w-40 overflow-hidden rounded-full border border-primary/40 sm:h-48 sm:w-48">
              <Image
                src="/images/Image.png"
                alt="Tanmay Narnaware professional profile"
                fill
                priority
                sizes="(max-width: 640px) 160px, 192px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          className="section-label mb-3 text-sm text-primary/90"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          PGDM E-Business &apos;27 | Ex-Apexon | AWS Certified
        </motion.p>

        {/* Name with animation */}
        <motion.h1
          className="font-display text-6xl leading-none sm:text-8xl lg:text-[9rem] mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-gradient">{portfolioData.basics.name}</span>
        </motion.h1>

        <motion.h2
          className="font-display mb-8 text-4xl uppercase leading-none text-foreground/90 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
        >
          Always Curious
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {portfolioData.basics.tagline}
        </motion.p>

        {/* Title chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {['PGDM E-Business \'27', 'Ex-Apexon', 'AWS Certified', 'Entrepreneur'].map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 glass rounded-full text-sm font-medium border border-primary/30"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.p
          className="text-base sm:text-lg text-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Front End Developer with 2.5 years at Apexon building scalable solutions. 
          Now pursuing strategic leadership through PGDM E-Business. 
          Founder of Lonavala Villas & Co-founder of The Socials Web.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            onClick={() => scrollToSection('experience')}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold 
                     hover:bg-primary/90 transition-all duration-300 glow hover:scale-105
                     flex items-center gap-2"
          >
            View Experience
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-4 glass rounded-lg font-semibold 
                     hover:bg-white/10 transition-all duration-300 
                     border border-primary/50 hover:border-primary
                     flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Get In Touch
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href={`mailto:${portfolioData.basics.email}`}
            className="p-3 glass rounded-lg hover:bg-white/10 transition-all hover:scale-110 glow"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href={portfolioData.basics.links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 glass rounded-lg hover:bg-white/10 transition-all hover:scale-110 glow"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </motion.div>

        <motion.div
          className="ticker-track mt-12 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-2"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
        >
          <motion.div
            className="section-label whitespace-nowrap text-sm text-foreground/70"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            CUSTOMER EXPERIENCE LEADERSHIP • BUSINESS ALIGNMENT • DECISION OWNERSHIP • CUSTOMER EXPERIENCE LEADERSHIP • BUSINESS ALIGNMENT • DECISION OWNERSHIP •
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
