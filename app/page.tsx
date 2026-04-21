'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import SplashScreen from '@/components/SplashScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SectionTransition from '@/components/SectionTransition';
import Experience from '@/components/Experience';
import Achievements from '@/components/Achievements';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import ThoughtLeadership from '@/components/ThoughtLeadership';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import { LanguageProvider, Language, useLanguage } from '@/lib/language';

function LanguageSelectModal({
  onSelect,
  onClose,
  canClose,
}: {
  onSelect: (language: Language) => void;
  onClose?: () => void;
  canClose?: boolean;
}) {
  const hookLines = useMemo(
    () => [
      'Pick a language, unlock a different storytelling rhythm.',
      'Same portfolio. Different vibe. Your call.',
      'Choose your mode: crisp global pitch or local narrative depth.',
    ],
    []
  );
  const [hookIndex, setHookIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHookIndex((current) => (current + 1) % hookLines.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [hookLines.length]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 px-4 backdrop-blur-md">
      <motion.div
        className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-background/95 p-8 text-center shadow-2xl"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/90">Live Language Mode</span>
        </div>

        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/15 px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:bg-white/10"
            aria-label="Close language picker"
          >
            Close
          </button>
        )}

        <h2 className="font-display mb-3 text-4xl text-foreground">Choose your language</h2>
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">Select portfolio language</p>

        <div className="mb-7 min-h-14 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={hookIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="text-sm text-foreground/85"
            >
              {hookLines[hookIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => onSelect('en')}
            className="group rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-4 text-left transition-all hover:border-primary hover:bg-primary/20"
          >
            <span className="block text-base font-semibold">English</span>
            <span className="block text-xs text-foreground/65">Global pitch mode</span>
          </button>
          <button
            onClick={() => onSelect('de')}
            className="group rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-4 text-left transition-all hover:border-primary hover:bg-primary/20"
          >
            <span className="block text-base font-semibold">Deutsch</span>
            <span className="block text-xs text-foreground/65">Localized narrative mode</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HomeContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { language, setLanguage, ui } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  const handleLanguageSelect = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  if (!language) {
    return <LanguageSelectModal onSelect={handleLanguageSelect} canClose={false} />;
  }

  return (
    <main className="relative min-h-screen pb-24 lg:pb-0 lg:snap-y lg:snap-proximity">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Splash Screen */}
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      {!showSplash && (
        <>
          <button
            onClick={toggleLanguage}
            className="fixed bottom-6 right-6 z-50 hidden rounded-full border border-primary/40 bg-gradient-to-r from-primary/90 to-accent/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_10px_28px_rgba(34,211,238,0.30)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_36px_rgba(34,211,238,0.40)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 lg:inline-flex"
            aria-label={language === 'de' ? 'Switch language to English' : 'Sprache auf Deutsch wechseln'}
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white/90" />
            {language === 'de' ? 'Deutsch -> English' : 'English -> Deutsch'}
          </button>

          <Navigation />
          <div id="hero">
            <Hero />
          </div>
          
          <SectionTransition label={ui.sectionTransitions.journey} index={0} />
          <Experience />
          
          <SectionTransition label={ui.sectionTransitions.impact} index={1} />
          <Achievements />
          
          <SectionTransition label={ui.sectionTransitions.caseStudies} index={2} />
          <Projects />

          <SectionTransition label={ui.sectionTransitions.services} index={3} />
          <Services />

          <SectionTransition label={ui.sectionTransitions.testimonials} index={4} />
          <Testimonials />

          <SectionTransition label={ui.sectionTransitions.insights} index={5} />
          <ThoughtLeadership />
          
          <SectionTransition label={ui.sectionTransitions.expertise} index={6} />
          <Skills />
          
          <SectionTransition label={ui.sectionTransitions.education} index={7} />
          <Education />
          
          <SectionTransition label={ui.sectionTransitions.contact} index={8} />
          <Contact />

        </>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
