import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const standardUrl = import.meta.env.DEV ? 'http://127.0.0.1:3000/?portfolio=standard' : '../?portfolio=standard';
const choiceLines = [
  'Same portfolio. Different vibe. Your call.',
  'Explore the details or watch the story unfold.',
  'Choose the experience that feels right for you.',
];

export default function PortfolioChoice({ onNetflix }: { onNetflix: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setLineIndex((current) => (current + 1) % choiceLines.length), 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-y-auto bg-[#080b15] px-4 py-8 text-bone sm:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-choice-title"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.17),transparent_38%),radial-gradient(circle_at_85%_75%,rgba(229,19,43,0.14),transparent_40%)]" />
      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col justify-center">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.35em] text-bone/50">Tanmay Narnaware · Portfolio</p>
        <h1 id="portfolio-choice-title" className="text-center font-display text-4xl leading-none sm:text-6xl">How would you like to explore my work?</h1>
        <div className="mx-auto mb-9 mt-5 flex min-h-16 w-full max-w-xl items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
          <AnimatePresence mode="wait">
            <motion.p key={lineIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="text-sm leading-relaxed text-bone/75 sm:text-base">
              {choiceLines[lineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <a href={standardUrl} className="group relative min-h-72 overflow-hidden rounded-3xl border border-white/15 bg-[#111b31] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:p-8">
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-cover bg-[center_28%] opacity-50 transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/tanmay-portrait.png)` }} />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c172d] via-[#0c172d]/90 to-[#0c172d]/35" />
            <span aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(147,197,253,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.6)_1px,transparent_1px)] [background-size:28px_28px]" />
            <span className="relative inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">01 · Classic view</span>
            <span className="relative mt-12 block font-display text-4xl sm:text-5xl">Standard</span>
            <span className="relative mt-2 block max-w-sm text-sm leading-relaxed text-bone/65">A clear, professional view of my experience, projects and skills. Available in English and German.</span>
            <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition group-hover:gap-3">View Standard <span aria-hidden>↗</span></span>
          </a>

          <button type="button" onClick={onNetflix} data-cursor="play" className="group relative min-h-72 overflow-hidden rounded-3xl border border-white/15 bg-[#151013] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-red-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:p-8">
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(229,19,43,0.55),transparent_55%)]" />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-no-repeat opacity-75 transition duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/tanmay-opening-cutout.png)`, backgroundSize: 'auto 108%', backgroundPosition: 'right -38px bottom' }} />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#150b0f] via-[#150b0f]/85 to-[#150b0f]/25" />
            <span className="relative inline-flex rounded-full border border-red-300/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-200">02 · Cinematic view</span>
            <span className="relative mt-12 block font-display text-4xl sm:text-5xl">Netflix Style</span>
            <span className="relative mt-2 block max-w-sm text-sm leading-relaxed text-bone/65">Watch my journey unfold through chapters, featured work and a cinematic introduction.</span>
            <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-red-200 transition group-hover:gap-3">View Netflix Style <span aria-hidden>▶</span></span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
