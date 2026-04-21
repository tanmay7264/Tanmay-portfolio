'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface Education {
  institution: string;
  degree: string;
  field: string;
  dates: string;
  location: string;
  highlights?: string[];
  exposure?: string[];
  coreAreas?: string[];
  academicPractical?: string[];
  skillsDeveloped?: string[];
  placementOffers?: string[];
}

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, ui } = useLanguage();

  return (
    <section id="education" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-left hidden xl:block">{ui.education.sideLabel}</div>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{ui.education.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {ui.education.subheading}
          </p>
        </motion.div>

        {/* Education cards */}
        <div className="space-y-8 mb-16">
          {portfolioData.education.map((edu: Education, index: number) => (
            <motion.div
              key={index}
              className="glass p-8 rounded-2xl hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{edu.institution}</h3>
                  <p className="text-xl text-primary font-semibold mb-4">
                    {edu.degree} - {edu.field}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.dates}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  {edu.highlights && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/90">
                        Key Highlights
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                        {edu.highlights.map((item: string, highlightIndex: number) => (
                          <li key={highlightIndex} className="flex gap-2">
                            <span className="mt-1 text-primary text-xs">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {edu.exposure && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/90">
                        Academic & Practical Exposure
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                        {edu.exposure.map((item: string, exposureIndex: number) => (
                          <li key={exposureIndex} className="flex gap-2">
                            <span className="mt-1 text-primary text-xs">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {edu.coreAreas && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/90">
                        Core Areas of Study
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                        {edu.coreAreas.map((item: string, coreAreaIndex: number) => (
                          <li key={coreAreaIndex} className="flex gap-2">
                            <span className="mt-1 text-primary text-xs">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {edu.academicPractical && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/90">
                        Academic & Practical Work
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                        {edu.academicPractical.map((item: string, practicalIndex: number) => (
                          <li key={practicalIndex} className="flex gap-2">
                            <span className="mt-1 text-primary text-xs">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {edu.skillsDeveloped && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/90">
                        Skills Developed
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.skillsDeveloped.map((skill: string, skillIndex: number) => (
                          <span
                            key={skillIndex}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/80"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {edu.placementOffers && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/90">
                        Placement Outcomes
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                        {edu.placementOffers.map((item: string, placementIndex: number) => (
                          <li key={placementIndex} className="flex gap-2">
                            <span className="mt-1 text-primary text-xs">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {ui.education.certifications}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.certifications.map((cert: { name: string; issuer?: string }, index: number) => (
              <motion.div
                key={index}
                className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ x: 10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {cert.name}
                    </h4>
                    {cert.issuer && (
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Highlights */}
        <motion.div
          className="mt-12 glass p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">{ui.education.additionalContext}</h3>
          <div className="space-y-2">
            {portfolioData.extra.map((item: string, index: number) => (
              <motion.p
                key={index}
                className="text-foreground/70 flex gap-2 items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <span className="text-primary mt-1.5 text-xs">▹</span>
                {item}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
