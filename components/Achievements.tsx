'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Users, Rocket, Calendar, Award, Briefcase } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const categoryIcons: Record<string, any> = {
  Leadership: Users,
  Entrepreneurship: Rocket,
  Events: Calendar,
  Professional: Briefcase,
};

const categoryColors: Record<string, string> = {
  Leadership: 'from-blue-500 to-cyan-500',
  Entrepreneurship: 'from-purple-500 to-pink-500',
  Events: 'from-orange-500 to-red-500',
  Professional: 'from-green-500 to-emerald-500',
};

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, ui } = useLanguage();

  // Group achievements by category
  const groupedAchievements = portfolioData.achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, typeof portfolioData.achievements>);

  // Top 3 Impact highlights
  const topHighlights = ui.achievements.topHighlights;

  return (
    <section id="achievements" className="section-shell lg:snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="side-label side-label-right hidden xl:block">{ui.achievements.sideLabel}</div>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{ui.achievements.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {ui.achievements.subheading}
          </p>
        </motion.div>

        {/* Top 3 Impact Strip */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {topHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="glass panel-shift p-6 rounded-2xl text-center border-2 border-primary/30 hover:border-primary/60 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20 glow">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">{highlight.title}</h3>
              <p className="text-lg font-semibold mb-2">{highlight.subtitle}</p>
              <p className="text-sm text-muted-foreground">{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements by category */}
        <div className="space-y-12">
          {Object.entries(groupedAchievements).map(([category, achievements], categoryIndex) => {
            const Icon = categoryIcons[category] || Award;
            const gradient = categoryColors[category] || 'from-gray-500 to-gray-700';

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{category}</h3>
                </div>

                {/* Achievement cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                      whileHover={{ x: 10 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + categoryIndex * 0.1 + index * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                            {achievement.title}
                          </h4>
                          <p className="text-foreground/70">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-lg text-muted-foreground mb-4">
            {ui.achievements.cta}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
