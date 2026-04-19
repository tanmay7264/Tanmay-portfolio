'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-left hidden xl:block">Projects</div>
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
            <span className="text-gradient">Entrepreneurial Ventures</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scaling online businesses and delivering digital solutions
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, index) => (
            <motion.div
              key={index}
              className="glass panel-shift p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Project header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-accent font-semibold">{project.role}</p>
                </div>
                {project.links.length > 0 && (
                  <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>

              {/* Description */}
              <p className="text-foreground/80 mb-6">{project.description}</p>

              {/* Bullets */}
              <div className="space-y-2 mb-6">
                {project.bullets.map((bullet, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-primary mt-1.5 text-xs">▹</span>
                    <p className="text-foreground/70">{bullet}</p>
                  </div>
                ))}
              </div>

              {/* Stack (if available) */}
              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          className="mt-12 glass p-6 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-lg text-foreground/80">
            <span className="font-semibold text-primary">Freelance Web Developer</span> — 
            Available for freelance and consulting opportunities
          </p>
        </motion.div>
      </div>
    </section>
  );
}
