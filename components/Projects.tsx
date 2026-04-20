'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { TrendingUp, Target, Lightbulb } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const pathname = usePathname();
  const pagesBasePath = pathname.startsWith('/Tanmay-portfolio') ? '/Tanmay-portfolio' : '';

  return (
    <section id="projects" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-left hidden xl:block">Case Studies</div>
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
            <span className="text-gradient">Product & Growth Case Studies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with a business-first lens: Problem, Solution, and measurable Impact.
          </p>
        </motion.div>

        {/* Case studies */}
        <div className="grid grid-cols-1 gap-8">
          {portfolioData.projects.map((project, index) => (
            <motion.div
              key={index}
              className="glass panel-shift p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.01, y: -4 }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-accent font-semibold uppercase tracking-wide text-sm">{project.role}</p>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Business Goal</p>
                  <p className="text-sm text-foreground/85">{(project as any).businessGoal}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Timeframe</p>
                  <p className="text-sm text-foreground/85">{(project as any).timeframe}</p>
                </div>
              </div>

              <p className="text-foreground/80 mb-6">{project.description}</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                  <Image
                    src={`${pagesBasePath}${(project as any).screenshot}`}
                    alt={`${project.title} case study screenshot`}
                    width={1200}
                    height={720}
                    className="h-auto w-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-red-300">
                      <Target className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">Problem</span>
                    </div>
                    <p className="text-sm text-foreground/80">{(project as any).problem}</p>
                  </div>

                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-cyan-300">
                      <Lightbulb className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">Solution</span>
                    </div>
                    <p className="text-sm text-foreground/80">{(project as any).solution}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-emerald-300">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">Impact</span>
                    </div>
                    <p className="text-sm text-foreground/80">{(project as any).impact}</p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="mb-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">Key Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {((project as any).metrics || []).map((metric: any, i: number) => (
                    <div key={i} className="rounded-lg border border-primary/30 bg-primary/15 px-3 py-3">
                      <p className="text-2xl font-bold text-primary leading-none mb-1">{metric.value || metric}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-foreground/80 mb-1">{metric.label || 'Metric'}</p>
                      <p className="text-xs text-foreground/65">{metric.detail || ''}</p>
                    </div>
                  ))}
                </div>
              </div>

              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-sm text-foreground/80 border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {project.bullets.map((bullet, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-primary mt-1.5 text-xs">▹</span>
                    <p className="text-foreground/70">{bullet}</p>
                  </div>
                ))}
              </div>
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
            <span className="font-semibold text-primary">Positioning:</span> AI Product Builder with a Growth Marketing Lens
          </p>
        </motion.div>
      </div>
    </section>
  );
}
