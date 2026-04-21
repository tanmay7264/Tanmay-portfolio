'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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

function LanguageSelectModal({ onSelect }: { onSelect: (language: Language) => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 px-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-background/95 p-8 text-center shadow-2xl">
        <h2 className="font-display mb-3 text-4xl text-foreground">Choose your language</h2>
        <p className="mb-8 text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Select portfolio language
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => onSelect('en')}
            className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-4 text-sm font-semibold transition-all hover:border-primary hover:bg-primary/20"
          >
            English
          </button>
          <button
            onClick={() => onSelect('de')}
            className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-4 text-sm font-semibold transition-all hover:border-primary hover:bg-primary/20"
          >
            Deutsch
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { language, setLanguage, ui } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  if (!language) {
    return <LanguageSelectModal onSelect={setLanguage} />;
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
