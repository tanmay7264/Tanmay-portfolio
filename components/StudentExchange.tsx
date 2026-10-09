'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Briefcase, Compass, Instagram, Lightbulb, Linkedin, MapPin, Search, Sparkles, Users } from 'lucide-react'
import { CSSProperties, useEffect, useState } from 'react'
import { portfolioData } from '@/data/portfolio'

type Lens = 'life' | 'work' | 'research'

const lenses: { id: Lens; label: string; icon: typeof Compass }[] = [
  { id: 'life', label: 'Life abroad', icon: Compass },
  { id: 'work', label: 'Product work', icon: Briefcase },
  { id: 'research', label: 'Research thinking', icon: Search },
]

const chapters = [
  {
    number: '01', tag: 'THE ARRIVAL', title: 'I went for an exchange. I came back with a new operating system.',
    deck: 'The official version was a semester abroad. The honest version was learning how to operate inside another system.',
    quote: 'An exchange is not a change of location. It is a change of defaults.',
    icon: Compass,
    facts: ['Selected 1 of 6 from a cohort of 840 students', 'Bamberg, Germany · Summer Semester 2026'],
    paragraphs: [
      'I arrived in Germany carrying a mixed professional identity: Computer Engineering, around 30 months at Apexon, entrepreneurial experiments, and a PGDM in E-Business at WeSchool.',
      'I was interested in marketing, product, research, AI, and strategy, but they still felt like separate boxes. The exchange was the environment where those boxes started to collide—and become useful together.',
    ],
  },
  {
    number: '02', tag: 'THE CITY', title: 'Bamberg taught me through ordinary decisions.',
    deck: 'The most valuable lessons were not landmarks. They were the small decisions nobody could make for me.',
    quote: 'Independence is built through hundreds of small decisions rather than one dramatic moment.',
    icon: MapPin,
    facts: ['Home: Bamberg, Germany', 'Beyond the city: Munich · Berlin · Paris', 'A daily life built from scratch'],
    paragraphs: [
      'Accommodation, groceries, laundry, transport, schedules, documents, classes, assignments, work, budgeting, and the occasional problem all became my responsibility.',
      'Travel made the summer memorable. Living inside an unfamiliar system made it useful. A new city became university, workplace, home, friends, routine, exploration, and reflection at the same time.',
    ],
  },
  {
    number: '03', tag: 'THE CLASSROOM', title: 'The classroom connected technology to the reasons behind it.',
    deck: 'Product, digital business, project management, marketing, startup PR, and German changed the questions I asked.',
    quote: 'Technology tells you what can be built. Product and strategy force you to ask what should be built.',
    icon: BookOpen,
    facts: ['International IT Project Management', 'Digital Business + Managing Digital Platforms', 'Product Management + Sales and Marketing'],
    paragraphs: [
      'The coursework was valuable because of the intersection. IT project management made technology feel like a business system. Product management connected customer needs to priorities. Marketing connected value with behaviour. Startup PR reminded me that a good product still needs a story.',
      'Working across approximately ten nationalities made communication part of the curriculum. I learned to put the important point first, remove unnecessary context, explain assumptions, and make the logic visible.',
    ],
  },
  {
    number: '04', tag: 'THE REALITY CHECK', title: 'A job fair taught me that relevance beats completeness.',
    deck: 'Trying to explain an entire career is often a way of avoiding the one thing a listener needs to know.',
    quote: 'The discipline is not saying everything. It is saying what matters.',
    icon: Users,
    facts: ['Munich Tech Job Fair', 'Role I want → Why I fit → One proof point', 'A lesson now applied to CVs, pitches, and networking'],
    paragraphs: [
      'My instinct was to explain chronologically: education, work, projects, interests, and everything else. A recruiter does not have unlimited attention.',
      'The useful structure became shorter: the role I want, why I fit, and one proof point. That small shift changed how I think about professional positioning—and product communication too.',
    ],
  },
  {
    number: '05', tag: 'THE PRODUCT', title: 'The Alumni Portal made me think beyond screens.',
    deck: 'The exchange gave me the environment. The internship gave me a problem that needed ownership.',
    quote: 'A product is not a collection of features. It is a set of decisions about what deserves to exist.',
    icon: Briefcase,
    facts: ['Product Management & Strategy Intern', 'Otto-Friedrich-Universität Bamberg', '1 May – 30 August 2026'],
    paragraphs: [
      'At the Chair of Information Systems Management, I worked on the Universität Bamberg Alumni Portal: an invite-only, bilingual platform for mentoring, networking, career opportunities, alumni engagement, jobs, communication, and administration.',
      'The work crossed stakeholder requirements, user journeys, product strategy, MVP boundaries, feature prioritisation, risk, governance, validation, testing, and phased launch planning. The sequence changed from “How do we build this?” to “Who needs this, and what is the smallest useful solution?”',
    ],
  },
  {
    number: '06', tag: 'THE WORKFLOW', title: 'AI became useful when it changed a workflow.',
    deck: 'The consulting work made the difference between an AI idea and an AI-enabled operating model impossible to ignore.',
    quote: 'Start with the workflow and the business problem. Then find the technology opportunity.',
    icon: Sparkles,
    facts: ['AI + digital-transformation consulting', 'Autohaus Sperber case', '90-day implementation thinking'],
    paragraphs: [
      'One documented assignment looked at reachability, after-sales follow-up, listing freshness, reputation management, bilingual content, and CRM journeys for Autohaus Sperber.',
      'The proposed streams were practical: bilingual AI reception and WhatsApp triage, a structured after-sales journey, and an AI-supported bilingual brand and content engine. AI mattered because it improved the workflow, not because it appeared in the slide deck.',
    ],
  },
  {
    number: '07', tag: 'THE RESEARCH', title: 'The SIRP replaced comfortable intuition with evidence.',
    deck: 'The research asked a harder question: not whether students adopt a platform, but which students do, why, and what makes them stay.',
    quote: 'Use intuition to ask the question. Use evidence to decide how confident you should be.',
    icon: Search,
    facts: ['Systematic review + thematic analysis', 'TAM · UTAUT · DOI · ECM', 'Seven connected adoption determinants'],
    paragraphs: [
      'My Summer Internship Research Project studied market segmentation and consumer adoption of peer-to-peer university networking platforms. It was secondary research: no survey, interviews, focus groups, or statistical hypothesis testing.',
      'The review connected perceived usefulness, ease of use, trust and privacy, social influence, facilitating conditions, community engagement, and network effects. Initial adoption was only one stage; sustained participation required trust, personalisation, and a healthy community.',
    ],
  },
  {
    number: '08', tag: 'THE RETURN', title: 'I did not become an expert in everything. I became better at connecting things.',
    deck: 'The exchange, internship, and research were separate on paper. Together, they clarified the kind of builder I want to become.',
    quote: 'Build the bridge between disciplines. Do not just collect disciplines.',
    icon: Lightbulb,
    facts: ['Communication + cultural adaptability', 'Product + strategy + research discipline', 'Technology × business × marketing × AI'],
    paragraphs: [
      'The exchange strengthened my communication and adaptability. The internship strengthened my product and strategy thinking. The SIRP strengthened my research discipline. The consulting work strengthened my understanding of digital transformation.',
      'The honest conclusion is that I can now connect a technical system to a user problem, a market question to a product decision, and AI to a measurable workflow. Germany was not the destination of the story. It was the environment in which the story changed.',
    ],
  },
]

const lensNotes: Record<Lens, { label: string; intro: string; ending: string }> = {
  life: { label: 'Read it as a personal story', intro: 'Follow the small decisions, unfamiliar rooms, and changes in how daily life felt.', ending: 'The life lesson: independence is a practice, not a personality trait.' },
  work: { label: 'Read it as a product story', intro: 'Follow the movement from context to problem, from problem to decision, and from decision to workflow.', ending: 'The work lesson: ownership starts before implementation.' },
  research: { label: 'Read it as a research story', intro: 'Follow the shift from intuition to evidence, segmentation, adoption, and sustained participation.', ending: 'The research lesson: a better question is often the first useful finding.' },
}

const imageBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const galleryImages = Array.from({ length: 67 }, (_, index) => index + 1)
  .filter((number) => number !== 51)
  .map((number) => `${imageBasePath}/images/exchange-gallery/${String(number).padStart(2, '0')}.jpg`)

export default function StudentExchange() {
  const [active, setActive] = useState(0)
  const [lens, setLens] = useState<Lens>('life')
  const [direction, setDirection] = useState(1)
  const [portfolioHref, setPortfolioHref] = useState('/')
  const chapter = chapters[active]
  const ChapterIcon = chapter.icon

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('from') === 'netflix') {
      setPortfolioHref('/netflix/index.html?portfolio=netflix')
    }
  }, [])

  const turnTo = (next: number, fromControls = false) => {
    setDirection(next >= active ? 1 : -1)
    setActive(Math.max(0, Math.min(chapters.length - 1, next)))
    if (fromControls && window.matchMedia('(max-width: 900px)').matches) {
      document.querySelector('.exchange-book-stage')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }

  return <main className="exchange-book-page" style={{ '--exchange-hero-image': `url("${imageBasePath}/images/bamberg-hero.jpg")`, '--exchange-wall-image': `url("${imageBasePath}/images/travel-wall.jpg")` } as CSSProperties}>
    <header className="exchange-book-nav"><Link href={portfolioHref} className="exchange-book-brand"><span>TN</span><strong>Tanmay Narnaware<small>FIELD NOTES</small></strong></Link><div className="exchange-book-nav-center"><span>GERMANY · 2026</span><b>{String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</b></div><Link href={portfolioHref} className="exchange-book-back"><ArrowLeft size={15} /> Portfolio</Link></header>

    <section className="exchange-book-personal-intro exchange-book-shell" aria-label="About Tanmay">
      <img src={`${imageBasePath}/images/exchange-intro-tanmay.jpg`} alt="Tanmay during his summer in Europe" width="1350" height="1800" fetchPriority="high" />
      <div>
        <span className="exchange-book-kicker">A NOTE FROM ME</span>
        <p>I’m Tanmay Narnaware — a computer engineer, PGDM student, and someone who has always been curious about what happens when technology meets real-world problems.</p>
        <p>During my summer exchange at the University of Bamberg in Germany, I came with the usual expectations of studying abroad. But the experience became much more than classrooms and coursework. Along the way, I worked on a university alumni product, explored how research and AI could solve practical business problems, met people who challenged the way I thought, and learned from the small decisions and everyday moments that rarely make it into a résumé.</p>
        <p>This is the story of that summer — the people I met, the work I took on, the things I learned, and the moments that changed the way I see technology, business, and myself.</p>
        <div className="exchange-book-intro-socials">{portfolioData.basics.links.filter(({ label }) => label === 'LinkedIn' || label === 'Instagram').map(({ label, url }) => { const Icon = label === 'LinkedIn' ? Linkedin : Instagram; return <a key={label} href={url} target="_blank" rel="noopener noreferrer"><Icon size={16} aria-hidden="true" />{label}<ArrowUpRight size={14} aria-hidden="true" /></a> })}</div>
      </div>
    </section>

    <section className="exchange-book-intro exchange-book-shell"><div><span className="exchange-book-kicker">AN INTERACTIVE STORYBOOK</span><h1>Germany,<br /><em>the exchange</em><br />&amp; the SIP.</h1><p>A semester abroad became a crash course in product, research, culture, and professional life.</p><div className="exchange-book-meta"><span><MapPin size={14} /> Bamberg, Germany</span><span><Sparkles size={14} /> WeSchool × University of Bamberg</span></div></div><div className="exchange-book-cover"><div className="exchange-book-cover-glow" /><div className="exchange-book-cover-inner"><img src={`${imageBasePath}/images/bamberg-university.jpg`} alt="Universität Bamberg exchange materials" /><div className="exchange-book-cover-shade" /><strong>THE<br /><em>SUMMER</em><br />THAT CHANGED<br />THE QUESTIONS</strong><span>TN · 2026</span></div><div className="exchange-book-cover-page" /></div></section>

    <section className="exchange-book-reader exchange-book-shell"><div className="exchange-book-reader-head"><div><span className="exchange-book-kicker">CHOOSE YOUR STORY LENS</span><h2>{lensNotes[lens].label}</h2><p>{lensNotes[lens].intro}</p></div><div className="exchange-book-lenses">{lenses.map(({ id, label, icon: Icon }) => <button key={id} className={lens === id ? 'is-active' : ''} onClick={() => setLens(id)}><Icon size={15} />{label}</button>)}</div></div>

      <div className="exchange-book-progress"><span style={{ width: `${((active + 1) / chapters.length) * 100}%` }} /></div>
      <div className="exchange-book-layout"><aside className="exchange-book-chapters" aria-label="Story chapters"><span className="exchange-book-side-label">CONTENTS</span>{chapters.map((item, index) => <button key={item.number} className={index === active ? 'is-active' : ''} onClick={() => turnTo(index)}><span>{item.number}</span><strong>{item.tag}</strong><small>{item.title}</small></button>)}</aside>
        <div className="exchange-book-stage"><div className="exchange-book-shadow" /><AnimatePresence mode="wait" custom={direction}><motion.article key={`${chapter.number}-${lens}`} className="exchange-book-spread" custom={direction} initial={{ opacity: 0, rotateY: direction > 0 ? 16 : -16, x: direction > 0 ? 36 : -36 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: direction > 0 ? -16 : 16, x: direction > 0 ? -36 : 36 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}><div className="exchange-book-page-left"><div className="exchange-book-page-mark"><span>{chapter.number}</span><ChapterIcon size={18} /></div><span className="exchange-book-kicker">{chapter.tag}</span><h3>{chapter.deck}</h3><img className="exchange-book-chapter-photo" src={galleryImages[(active * 7 + 4) % galleryImages.length]} alt={`Visual field note for ${chapter.tag.toLowerCase()}`} /><blockquote>“{chapter.quote}”</blockquote><div className="exchange-book-page-footer"><span>TN / FIELD NOTES</span><span>{String(active + 1).padStart(2, '0')}</span></div></div><div className="exchange-book-page-right"><span className="exchange-book-kicker">{String(active + 1).padStart(2, '0')} / {chapter.tag}</span><h2>{chapter.title}</h2><div className="exchange-book-copy">{chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="exchange-book-facts">{chapter.facts.map((fact) => <span key={fact}><i />{fact}</span>)}</div><p className="exchange-book-lens-note"><Sparkles size={15} /> {lensNotes[lens].ending}</p><div className="exchange-book-page-footer"><span>GERMANY · EXCHANGE · SIP</span><span>{active === chapters.length - 1 ? 'END' : '→'}</span></div></div></motion.article></AnimatePresence><div className="exchange-book-controls"><button onClick={() => turnTo(active - 1, true)} disabled={active === 0} aria-label="Previous chapter"><ArrowLeft size={17} /></button><span>Turn the page</span><button onClick={() => turnTo(active + 1, true)} disabled={active === chapters.length - 1} aria-label="Next chapter"><ArrowRight size={17} /></button></div></div>
      </div>
    </section>

    <section className="exchange-book-gallery exchange-book-shell" aria-label="Student exchange photo gallery"><div className="exchange-book-gallery-heading"><div><span className="exchange-book-kicker">THE FIELD REEL</span><h2>Some chapters only make sense in pictures.</h2></div><p>A visual diary of the places, people, classrooms, meals, journeys, and small surprises that made the exchange real. Let the moments roll by.</p></div><div className="exchange-book-gallery-window"><div className="exchange-book-gallery-track">{[...galleryImages, ...galleryImages].map((src, index) => <figure key={`${src}-${index}`}><img src={src} alt={`Student exchange photo ${index % galleryImages.length + 1}`} loading="lazy" /></figure>)}</div></div></section>

    <section className="exchange-book-ready exchange-book-shell"><div><span className="exchange-book-kicker">BEFORE YOU GO</span><h2>Want to know how ready you are?</h2><p>Take the free five-minute Student Exchange Compatibility Test before you plan your own chapter abroad.</p></div><a href="https://www.batchmates.tech/products/exchange-compatibility" target="_blank" rel="noreferrer" className="exchange-book-ready-link"><span><Users size={18} />Quick self-check</span><strong>Check your exchange readiness</strong><ArrowUpRight size={20} /></a></section>

    <footer className="exchange-book-footer exchange-book-shell"><Link href={portfolioHref}>← Back to Tanmay&apos;s portfolio</Link><span>© {new Date().getFullYear()} Tanmay Narnaware</span><span>GERMANY · EXCHANGE · SIP</span></footer>
  </main>
}
