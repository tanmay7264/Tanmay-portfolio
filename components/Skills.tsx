'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Code, Briefcase, Target } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

const skillCategories = [
  { key: 'technical', label: 'Technical Skills', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { key: 'leadership', label: 'Leadership', icon: Users, color: 'from-purple-500 to-pink-500' },
  { key: 'business', label: 'Business', icon: Briefcase, color: 'from-orange-500 to-red-500' },
  { key: 'domains', label: 'Domain Expertise', icon: Target, color: 'from-green-500 to-emerald-500' },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-right hidden xl:block">Skills</div>
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
            <span className="text-gradient">Skills & Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A blend of technical prowess and strategic thinking
          </p>
        </motion.div>

        {/* Top Skills highlight */}
        <motion.div
          className="mb-12 glass p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-4 text-center">Core Strengths</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {portfolioData.topSkills.map((skill, index) => (
              <motion.span
                key={index}
                className="px-6 py-3 bg-primary/20 text-primary rounded-full font-semibold border border-primary/30"
                whileHover={{ scale: 1.1, borderColor: 'rgba(99, 102, 241, 0.5)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Skills by category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const skills = portfolioData.skills[category.key as keyof typeof portfolioData.skills];

            return (
              <motion.div
                key={category.key}
                className="glass p-6 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + categoryIndex * 0.1 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{category.label}</h3>
                </div>

                {/* Skills list */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + categoryIndex * 0.1 + index * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
