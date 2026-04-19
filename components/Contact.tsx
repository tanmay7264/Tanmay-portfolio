'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Linkedin, MapPin, Send, Instagram } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

const getSocialIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'linkedin':
      return <Linkedin className="w-6 h-6 text-primary" />;
    case 'instagram':
      return <Instagram className="w-6 h-6 text-primary" />;
    default:
      return <Linkedin className="w-6 h-6 text-primary" />;
  }
};

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contact" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-right hidden xl:block">Contact</div>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">Let&apos;s Connect</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Currently exploring internships and projects in consulting, product management, and digital transformation
          </p>
        </motion.div>

        {/* Contact card */}
        <motion.div
          className="glass p-8 sm:p-12 rounded-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Contact info */}
          <div className="space-y-6 mb-8">
            <motion.a
              href={`mailto:${portfolioData.basics.email}`}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              whileHover={{ x: 10 }}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold group-hover:text-primary transition-colors">
                  {portfolioData.basics.email}
                </p>
              </div>
            </motion.a>

            {portfolioData.basics.links.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ x: 10 }}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  {getSocialIcon(link.label)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{link.label}</p>
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {link.label === 'LinkedIn' ? 'Tanmay Narnaware' : `@tanmay__19`}
                  </p>
                </div>
              </motion.a>
            ))}

            <motion.div
              className="flex items-center gap-4 p-4 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <div className="p-3 rounded-lg bg-primary/20">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold">{portfolioData.basics.location}</p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            className="text-center pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <p className="text-muted-foreground mb-4">
              Open to opportunities in FMCG, product management, and digital transformation
            </p>
            <a
              href={`mailto:${portfolioData.basics.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 glow hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Send a Message
            </a>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          <p>© {new Date().getFullYear()} {portfolioData.basics.name}. All rights reserved.</p>
          <p className="mt-2">Built with Next.js, TypeScript, Tailwind CSS & Framer Motion</p>
        </motion.div>
      </div>
    </section>
  );
}
