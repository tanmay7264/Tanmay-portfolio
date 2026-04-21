'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { portfolioData as portfolioDataShape } from '@/data/portfolio';
import { useLanguage } from '@/lib/language';

interface ExperienceItemProps {
  data: (typeof portfolioDataShape.experience)[number];
  index: number;
}

function ExperienceItem({ data, index }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />

      {/* Card */}
      <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
        <motion.div
          className="glass p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 ml-8 md:ml-0"
          whileHover={{ scale: 1.02 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{data.role}</h3>
              <p className="text-lg text-primary font-semibold">{data.company}</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{data.dates}</span>
              <span className="text-primary ml-1">({data.duration})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-foreground/80 mb-4">{data.description}</p>

          {/* Expandable content */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 pt-4 space-y-2">
              {data.bullets.map((bullet, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-2 items-start group"
                >
                  <span className="text-primary mt-1.5 text-xs">▹</span>
                  <p className="text-foreground/70 group-hover:text-foreground transition-colors">
                    {bullet}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, ui } = useLanguage();

  return (
    <section id="experience" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-left hidden xl:block">{ui.experience.sideLabel}</div>
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
            <span className="text-gradient">{ui.experience.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {ui.experience.subheading}
          </p>
        </motion.div>

        <motion.div
          className="panel-shift mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative h-48 sm:h-56">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-cyan-400/20" />
            <div className="absolute -left-8 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute right-8 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-accent/30 blur-3xl" />
            <div className="section-label absolute left-6 top-6 text-foreground/70">{ui.experience.storyCards}</div>
            <div className="font-display absolute bottom-6 left-6 text-4xl text-foreground/90 sm:text-5xl">Apexon 2021-2024</div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50" />

          {/* Experience items */}
          <div className="space-y-12">
            {portfolioData.experience.map((exp, index) => (
              <ExperienceItem key={index} data={exp} index={index} />
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {ui.experience.stats.map((stat, idx) => (
            <div key={idx} className="glass p-6 rounded-xl text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
