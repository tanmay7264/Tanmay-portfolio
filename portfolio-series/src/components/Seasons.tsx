import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasons } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import { RailButtons } from './Rail';

const siteBasePath = import.meta.env.BASE_URL.replace(/\/netflix\/?$/, '').replace(/\/$/, '');

export default function Seasons() {
  const [active, setActive] = useState(seasons.length - 2);
  const season = seasons[active];
  const rail = useRef<HTMLDivElement>(null);

  return (
    <>
      <SectionHeading
        kicker={`${seasons.length} Seasons`}
        title="My Journey"
        aside={<p className="max-w-xs text-sm text-mist">Every stage of the resume, told as a season — select one to see its episodes.</p>}
      />

      <div className="gutter mb-10">
        <a
          href={`${siteBasePath}/student-exchange?from=netflix`}
          className="group grid overflow-hidden rounded-2xl bg-ink-2 ring-1 ring-white/15 transition hover:ring-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-2 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]"
        >
          <div className="relative min-h-64 overflow-hidden md:min-h-[360px]">
            <img
              src={`${siteBasePath}/images/exchange-intro-tanmay.jpg`}
              alt="Tanmay during his student exchange in Europe"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[center_55%] transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.26em] text-bone">Bamberg, Germany · 2026</span>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-crimson-2">The Germany chapter · Interactive storybook</p>
            <h3 className="font-display text-4xl leading-[0.95] text-bone sm:text-5xl">A semester abroad. A different way of thinking.</h3>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-mist sm:text-base">The exchange connected life in a new country with product work, research and a new way of communicating across cultures. Go beyond the résumé and read the eight-chapter story.</p>
            <span className="mt-6 w-fit border-b border-crimson-2 pb-1 text-sm font-bold text-bone transition group-hover:text-crimson-2">Explore the Student Exchange ↗</span>
          </div>
        </a>
      </div>

      {/* season selector */}
      <div className="rail gutter mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="Seasons">
        {seasons.map((s, i) => (
          <button
            key={s.number}
            role="tab"
            aria-selected={i === active}
            type="button"
            onClick={() => {
              setActive(i);
              rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition ${i === active ? 'text-ink' : 'text-mist hover:text-bone'}`}
          >
            {i === active && <motion.span layoutId="season-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
            <span className="relative block text-[10px] font-bold tracking-[0.24em]">SEASON {String(s.number).padStart(2, '0')}</span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
              <span className="text-outline mr-3">S{String(season.number).padStart(2, '0')}</span>
              {season.title}
            </h3>
            <span className="text-sm text-mist">
              {season.period} · {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
            </span>
          </div>
          <p className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75">{season.synopsis}</p>

          <div className="group/rail relative">
            <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
              {season.episodes.map((e, i) => (
                <EpisodeCard key={e.code} episode={e} index={i} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
