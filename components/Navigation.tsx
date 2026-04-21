'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Menu, X, Home, Briefcase, Award, FolderGit2, GraduationCap, Mail, HandCoins, MessagesSquare, NotebookText } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export default function Navigation() {
  const { ui, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollPercent, setScrollPercent] = useState(0);
  const navItems = useMemo(
    () => [
      { id: 'hero', label: ui.navigation.home, icon: Home },
      { id: 'experience', label: ui.navigation.experience, icon: Briefcase },
      { id: 'achievements', label: ui.navigation.achievements, icon: Award },
      { id: 'projects', label: ui.navigation.projects, icon: FolderGit2 },
      { id: 'services', label: ui.navigation.services, icon: HandCoins },
      { id: 'testimonials', label: ui.navigation.testimonials, icon: MessagesSquare },
      { id: 'insights', label: ui.navigation.insights, icon: NotebookText },
      { id: 'education', label: ui.navigation.education, icon: GraduationCap },
      { id: 'contact', label: ui.navigation.contact, icon: Mail },
    ],
    [ui]
  );
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = total > 0 ? Math.round((window.scrollY / total) * 100) : 0;
      setScrollPercent(Math.max(0, Math.min(100, current)));

      const sections = navItems.map((item) => item.id);
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      {/* Desktop Navigation */}
      <motion.nav
        className="hidden lg:block fixed top-0 left-0 right-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-6 mt-4 rounded-xl border border-white/15 bg-background/70 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="section-label text-xl leading-none text-foreground"
            >
              Tanmay
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>{ui.navigation.start}</span>
              <span className="text-foreground">{String(scrollPercent).padStart(2, '0')}%</span>
            </div>

            <div className="hidden items-center gap-2 xl:flex">
              <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1">
              {([
                { code: 'en', label: 'English' },
                { code: 'de', label: 'Deutsch' },
              ] as const).map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`rounded px-2 py-1 text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                    language === item.code
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-white/10'
                  }`}
                  aria-label={`Switch language to ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-md px-3 py-2 text-xs uppercase tracking-[0.14em] transition-all duration-300
                    ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/80 hover:bg-white/10'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Burger Menu */}
      <motion.button
        className="lg:hidden fixed top-4 right-4 z-50 p-3 glass rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] p-2">
              {([
                { code: 'en', label: 'English' },
                { code: 'de', label: 'Deutsch' },
              ] as const).map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] transition-colors ${
                    language === item.code
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              </div>
            </div>

            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-3 text-2xl font-semibold hover:text-primary transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation - Mobile */}
      <motion.nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                ${activeSection === item.id ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.nav>
    </>
  );
}
