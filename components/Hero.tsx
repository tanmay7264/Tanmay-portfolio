'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown, Download, Mail, Linkedin, Github, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function Hero() {
  const [showWhyHire, setShowWhyHire] = useState(false);
  const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const { portfolioData, ui, language, setLanguage } = useLanguage();
  const resumeHref = `${pagesBasePath}${portfolioData.basics.resumeUrl}`;
  const linkedinLink = portfolioData.basics.links.find((link: typeof portfolioData.basics.links[number]) => link.label.toLowerCase() === 'linkedin');
  const githubLink = portfolioData.basics.links.find((link: typeof portfolioData.basics.links[number]) => link.label.toLowerCase() === 'github');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-shell lg:snap-start relative min-h-[92svh] flex items-center justify-center px-4 pt-24 pb-14 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-0 top-24 hidden -rotate-90 text-xs uppercase tracking-[0.25em] text-foreground/45 xl:block">
        Portfolio 2026
      </div>
      <div className="side-label side-label-right hidden xl:block">{ui.navigation.home}</div>

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        {/* Professional profile image */}
        <motion.div
          className="mx-auto mb-8 w-fit"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-cyan-400/30 blur-lg" />
            <div className="glass panel-shift relative h-32 w-32 overflow-hidden rounded-full border border-primary/40 sm:h-48 sm:w-48">
              <Image
                src={`${pagesBasePath}/images/Image.png`}
                alt="Tanmay Narnaware professional profile"
                fill
                priority
                sizes="(max-width: 640px) 128px, 192px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.p
          className="section-label mx-auto mb-3 max-w-[92vw] text-[10px] leading-relaxed tracking-[0.08em] [overflow-wrap:anywhere] text-primary/90 sm:text-sm sm:tracking-[0.12em]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {ui.hero.roleLine}
        </motion.p>

        {/* Name with animation */}
        <motion.h1
          className="font-display mb-4 text-[clamp(2.3rem,11vw,3.6rem)] leading-[0.95] [text-wrap:balance] sm:text-7xl lg:text-[9rem]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-gradient">{portfolioData.basics.name}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mb-4 text-base leading-relaxed [overflow-wrap:anywhere] [text-wrap:balance] text-muted-foreground sm:text-2xl lg:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {portfolioData.basics.tagline}
        </motion.p>

        {/* Title chips */}
        <motion.div
          className="mx-auto mb-8 flex max-w-md flex-wrap justify-center gap-2 px-1 sm:mb-10 sm:max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {ui.hero.chips.map((tag: string, i: number) => (
            <span
              key={i}
              className="glass w-full rounded-full border border-primary/30 px-2.5 py-2 text-center text-[10px] font-medium leading-tight [overflow-wrap:anywhere] sm:w-auto sm:px-4 sm:text-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.p
          className="mx-auto mb-10 max-w-3xl px-1 text-sm leading-relaxed [overflow-wrap:anywhere] text-foreground/80 sm:px-0 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {ui.hero.summary}
        </motion.p>

        <motion.div
          className="mx-auto mb-8 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <button
            onClick={() => setShowWhyHire((current) => !current)}
            aria-expanded={showWhyHire}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-primary/25 hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            {ui.hero.whyHireButton}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${showWhyHire ? 'rotate-180' : ''}`}
            />
          </button>

          <motion.div
            initial={false}
            animate={{
              height: showWhyHire ? 'auto' : 0,
              opacity: showWhyHire ? 1 : 0,
              marginTop: showWhyHire ? 20 : 0,
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl border border-white/15 p-5 text-left sm:p-6">
              <h3 className="mb-3 text-lg font-semibold text-primary sm:text-xl">{ui.hero.whyHireHeading}</h3>
              <p className="mb-5 text-sm leading-relaxed text-foreground/85 sm:text-base">{ui.hero.whyHireIntro}</p>

              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary/90">
                  {ui.hero.valueHighlightsLabel}
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {ui.hero.valueHighlights.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3"
                    >
                      <div className="text-xl font-bold text-primary sm:text-2xl">{item.value}</div>
                      <div className="mt-1 text-xs text-foreground/75 sm:text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary/90">
                    {ui.hero.uniqueQualitiesLabel}
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {ui.hero.uniqueQualities.map((quality: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{quality}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary/90">
                    {ui.hero.skillsLabel}
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {portfolioData.topSkills.map((skill: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary/90">
                    {ui.hero.impactSignalsLabel}
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {ui.hero.impactSignals.map((signal: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mb-10 flex flex-col items-stretch justify-center gap-3 sm:mb-12 sm:flex-row sm:items-center sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            onClick={() => scrollToSection('experience')}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground 
                     hover:bg-primary/90 transition-all duration-300 glow hover:scale-105
                     sm:px-8 sm:py-4 sm:text-base"
          >
            {ui.hero.ctaJourney}
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>

          <a
            href={resumeHref}
            download
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/50 bg-white/5 px-6 py-3 text-sm font-semibold
                     hover:bg-white/10 transition-all duration-300 
                     hover:border-primary sm:px-8 sm:py-4 sm:text-base"
          >
            <Download className="w-5 h-5" />
            {ui.hero.ctaDownloadCv}
          </a>

          <button
            onClick={() => scrollToSection('contact')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
          >
            <Mail className="w-5 h-5" />
            {ui.hero.ctaContact}
          </button>
        </motion.div>

        {/* Quick language switcher for smaller screens */}
        <motion.div
          className="mb-8 flex justify-center lg:hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="flex w-full max-w-xs items-center justify-between gap-1 rounded-full border border-white/15 bg-white/[0.03] p-1.5">
            {([
              { code: 'en', label: 'English' },
              { code: 'de', label: 'Deutsch' },
            ] as const).map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`flex-1 rounded-full px-3 py-2 text-center text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                  language === item.code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/75 hover:bg-white/10'
                }`}
                aria-label={`Switch language to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href={`mailto:${portfolioData.basics.email}`}
            className="p-2.5 glass rounded-lg hover:bg-white/10 transition-all hover:scale-110 glow sm:p-3"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
          {linkedinLink && (
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 glass rounded-lg hover:bg-white/10 transition-all hover:scale-110 glow sm:p-3"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 glass rounded-lg hover:bg-white/10 transition-all hover:scale-110 glow sm:p-3"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          )}
        </motion.div>

        <motion.div
          className="ticker-track mt-10 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-2 sm:mt-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
        >
          <motion.div
            className="section-label whitespace-nowrap text-xs text-foreground/70 sm:text-sm"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            {ui.hero.ticker}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
