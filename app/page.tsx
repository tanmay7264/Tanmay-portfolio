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
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="relative min-h-screen lg:snap-y lg:snap-proximity">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Splash Screen */}
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      {!showSplash && (
        <>
          <Navigation />
          <div id="hero">
            <Hero />
          </div>
          
          <SectionTransition label="Business Journey" index={0} />
          <Experience />
          
          <SectionTransition label="Achievements & Impact" index={1} />
          <Achievements />
          
          <SectionTransition label="Case Studies" index={2} />
          <Projects />
          
          <SectionTransition label="Expertise" index={3} />
          <Skills />
          
          <SectionTransition label="Education" index={4} />
          <Education />
          
          <SectionTransition label="Get in Touch" index={5} />
          <Contact />
        </>
      )}
    </main>
  );
}
