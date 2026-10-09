'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { portfolioData as portfolioDataEn } from '@/data/portfolio';

export type Language = 'en' | 'de';

type PortfolioData = typeof portfolioDataEn;

interface UiCopy {
  languageName: string;
  languagePromptTitle: string;
  languagePromptSubtitle: string;
  splashLoading: string;
  navigation: {
    home: string;
    experience: string;
    achievements: string;
    projects: string;
    services: string;
    testimonials: string;
    insights: string;
    education: string;
    contact: string;
    start: string;
  };
  sectionTransitions: {
    journey: string;
    impact: string;
    caseStudies: string;
    services: string;
    testimonials: string;
    insights: string;
    expertise: string;
    education: string;
    contact: string;
  };
  hero: {
    roleLine: string;
    roleHeading: string;
    summary: string;
    whyHireButton: string;
    whyHireHeading: string;
    whyHireIntro: string;
    valueHighlightsLabel: string;
    valueHighlights: { value: string; label: string }[];
    uniqueQualitiesLabel: string;
    skillsLabel: string;
    impactSignalsLabel: string;
    uniqueQualities: string[];
    impactSignals: string[];
    ctaJourney: string;
    ctaDownloadCv: string;
    ctaContact: string;
    chips: string[];
    ticker: string;
  };
  experience: {
    sideLabel: string;
    heading: string;
    subheading: string;
    storyCards: string;
    stats: { value: string; label: string }[];
  };
  achievements: {
    sideLabel: string;
    heading: string;
    subheading: string;
    cta: string;
    topHighlights: { title: string; subtitle: string; description: string }[];
  };
  projects: {
    sideLabel: string;
    heading: string;
    subheading: string;
    businessGoal: string;
    timeframe: string;
    problem: string;
    solution: string;
    impact: string;
    metrics: string;
    positioningLabel: string;
    positioningText: string;
  };
  services: {
    sideLabel: string;
    heading: string;
    subheading: string;
  };
  testimonials: {
    sideLabel: string;
    heading: string;
    subheading: string;
  };
  thoughtLeadership: {
    sideLabel: string;
    heading: string;
    subheading: string;
    readMore: string;
  };
  mediumBlog: {
    sideLabel: string;
    badge: string;
    heading: string;
    subheading: string;
    hook: string;
    featuredArticles: { title: string; preview: string; date: string; readTime: string; url: string }[];
    profileUrl: string;
    ctaText: string;
    footerText: string;
  };
  skills: {
    sideLabel: string;
    heading: string;
    subheading: string;
    coreStrengths: string;
    categories: {
      technical: string;
      leadership: string;
      business: string;
      domains: string;
    };
  };
  education: {
    sideLabel: string;
    heading: string;
    subheading: string;
    certifications: string;
    additionalContext: string;
  };
  contact: {
    sideLabel: string;
    heading: string;
    subheading: string;
    email: string;
    location: string;
    ctaText: string;
    ctaButton: string;
    footerRights: string;
    builtWith: string;
  };
}

interface LanguageContextValue {
  language: Language | null;
  setLanguage: (language: Language) => void;
  portfolioData: PortfolioData;
  ui: UiCopy;
}

const copyByLanguage: Record<Language, UiCopy> = {
  en: {
    languageName: 'English',
    languagePromptTitle: 'Choose your language',
    languagePromptSubtitle: 'Select a language to continue to the portfolio.',
    splashLoading: 'Loading portfolio...',
    navigation: {
      home: 'Home',
      experience: 'Experience',
      achievements: 'Achievements',
      projects: 'Case Studies',
      services: 'Services',
      testimonials: 'Testimonials',
      insights: 'Insights',
      education: 'Education',
      contact: 'Contact',
      start: 'Start',
    },
    sectionTransitions: {
      journey: 'Journey',
      impact: 'Achievements & Impact',
      caseStudies: 'Case Studies',
      services: 'Services',
      testimonials: 'Recommendations',
      insights: 'Thought Leadership',
      expertise: 'Expertise',
      education: 'Education',
      contact: 'Get in Touch',
    },
    hero: {
      roleLine: "PGDM E-Business '27 | Ex-Apexon | AWS Certified",
      roleHeading: 'PRODUCT & GROWTH BUILDER',
      summary:
        'I connect engineering, customer insight and growth. My work spans frontend delivery at Apexon, entrepreneurship, and product strategy at the University of Bamberg.',
      whyHireButton: 'Why Hire Me?',
      whyHireHeading: 'What Makes Me a Strong Hire',
      whyHireIntro:
        'I combine execution speed with business clarity and product thinking to move from idea to measurable impact quickly.',
      valueHighlightsLabel: 'Value Snapshot',
      valueHighlights: [
        { value: '2.5+', label: 'Years in delivery roles' },
        { value: '1,400+', label: 'Students in learning community' },
        { value: '3×', label: 'Online leads at The Socials Web' },
      ],
      uniqueQualitiesLabel: 'Unique Qualities',
      skillsLabel: 'Top Skills',
      impactSignalsLabel: 'Impact Signals',
      uniqueQualities: [
        'Business-first mindset backed by technical execution',
        'Fast experiment cycles with measurable learning',
        'Strong storytelling across product, growth, and customer value',
      ],
      impactSignals: [
        'Converts ambiguous briefs into clear execution roadmaps',
        'Aligns product decisions to measurable business outcomes',
        'Builds cross-functional momentum from strategy to launch',
      ],
      ctaJourney: 'View Journey',
      ctaDownloadCv: 'Download CV',
      ctaContact: 'Get In Touch',
      chips: ['AI Product Builder', 'Growth Systems', "PGDM E-Business '27", 'Ex-Apexon'],
      ticker:
        'AI GROWTH STRATEGY • PRODUCT STORYTELLING • EXPERIMENT-LED EXECUTION • AI GROWTH STRATEGY • PRODUCT STORYTELLING • EXPERIMENT-LED EXECUTION •',
    },
    experience: {
      sideLabel: 'Experience',
      heading: 'Professional Journey',
      subheading: 'Product strategy at the University of Bamberg and 30 months of frontend delivery at Apexon',
      storyCards: 'Career Story Cards',
      stats: [
        { value: '2.5+', label: 'Years Experience' },
        { value: '5', label: 'Career Milestones' },
        { value: 'Global', label: 'Client Reach' },
      ],
    },
    achievements: {
      sideLabel: 'Achievements',
      heading: 'Achievements & Impact',
      subheading: 'Leadership, entrepreneurship, and professional milestones',
      cta: 'Passionate about leveraging technology and business insights to create impactful solutions',
      topHighlights: [
        {
          title: '2.5 Years',
          subtitle: 'At Apexon',
          description: 'Building scalable solutions for global clients',
        },
        {
          title: 'Dept. President',
          subtitle: 'CSE Leadership',
          description: 'Led Computer Science Engineering department',
        },
        {
          title: 'AWS Certified',
          subtitle: 'Solutions Architect',
          description: 'Associate level certification',
        },
      ],
    },
    projects: {
      sideLabel: 'Case Studies',
      heading: 'Product & Growth Case Studies',
      subheading: 'Built with a business-first lens: Problem, Solution, and measurable Impact.',
      businessGoal: 'Business Goal',
      timeframe: 'Timeframe',
      problem: 'Problem',
      solution: 'Solution',
      impact: 'Impact',
      metrics: 'Key Metrics',
      positioningLabel: 'Positioning:',
      positioningText: 'AI Product Builder with a Growth Marketing Lens',
    },
    services: {
      sideLabel: 'Services',
      heading: 'What I Can Do For You',
      subheading: 'Focused offers for founders, startups, and growth teams that need speed with business clarity.',
    },
    testimonials: {
      sideLabel: 'Testimonials',
      heading: 'Recommendations',
      subheading: 'Short feedback from collaborators who have seen my work style and delivery quality up close.',
    },
    thoughtLeadership: {
      sideLabel: 'Insights',
      heading: 'Blog & Thought Leadership',
      subheading: 'Perspectives on AI, growth strategy, and product execution.',
      readMore: 'Read post',
    },
    mediumBlog: {
      sideLabel: 'Stories',
      badge: 'Medium Blog',
      heading: 'Thoughts That Move Business Metrics',
      subheading: 'Deep dives on AI-led growth, product execution, and building sustainable systems that actually deliver results.',
      hook: 'I write about the intersection of technology and business outcomes—helping builders think faster, ship smarter, and measure impact.',
      featuredArticles: [
        {
          title: 'I Left India for Germany',
          preview: 'The biggest culture shock wasn\'t what I expected. A personal journey of adaptation, challenges, and unexpected perspectives.',
          date: '2d ago',
          readTime: '5 min read',
          url: 'https://medium.com/@tanmay19/i-left-india-for-germany-520e85d4fa21'
        },
        {
          title: 'An AI Got $100,000, a Credit Card, and a 3-Year Lease. Then It Opened a Store and Hired Humans.',
          preview: 'This isn\'t a demo. This isn\'t behind closed doors. This is already happening on a street in San Francisco.',
          date: 'Apr 28',
          readTime: '6 min read',
          url: 'https://medium.com/@tanmay19/an-ai-got-100-000-a-credit-card-and-a-3-year-lease-then-it-opened-a-store-and-hired-humans-dcd31d84b617'
        },
        {
          title: 'The Cost of Intelligence Is Collapsing. Here\'s Where the Value Is Going.',
          preview: 'Seven stories. One pattern. Here\'s what it means for the rest of us.',
          date: 'Apr 27',
          readTime: '7 min read',
          url: 'https://medium.com/@tanmay19/the-cost-of-intelligence-is-collapsing-heres-where-the-value-is-going-abd18953b31d'
        },
        {
          title: 'What MBA + Engineering Taught Me About Building Better Products',
          preview: 'The best product thinkers I\'ve ever met speak two languages fluently — the language of systems and the language of people.',
          date: 'Apr 23',
          readTime: '7 min read',
          url: 'https://medium.com/@tanmay19/what-mba-engineering-taught-me-about-building-better-products-3e3f4190778c'
        }
      ],
      profileUrl: 'https://medium.com/@tanmay19',
      ctaText: 'Explore All Articles on Medium',
      footerText: 'Stories about growth, product strategy, and building with AI. Published on Medium.',
    },
    skills: {
      sideLabel: 'Skills',
      heading: 'Skills & Expertise',
      subheading: 'A blend of technical prowess and strategic thinking',
      coreStrengths: 'Core Strengths',
      categories: {
        technical: 'Technical Skills',
        leadership: 'Leadership',
        business: 'Business',
        domains: 'Domain Expertise',
      },
    },
    education: {
      sideLabel: 'Education',
      heading: 'Education & Certifications',
      subheading: 'Building expertise through continuous learning',
      certifications: 'Certifications',
      additionalContext: 'Additional Context',
    },
    contact: {
      sideLabel: 'Contact',
      heading: "Let's Connect",
      subheading:
        'Currently exploring internships and projects in consulting, product management, and digital transformation',
      email: 'Email',
      location: 'Location',
      ctaText: 'Open to opportunities in FMCG, product management, and digital transformation',
      ctaButton: 'Send a Message',
      footerRights: 'All rights reserved.',
      builtWith: 'Built with Next.js, TypeScript, Tailwind CSS & Framer Motion',
    },
  },
  de: {
    languageName: 'Deutsch',
    languagePromptTitle: 'Sprache waehlen',
    languagePromptSubtitle: 'Waehle eine Sprache, um mit dem Portfolio fortzufahren.',
    splashLoading: 'Portfolio wird geladen...',
    navigation: {
      home: 'Start',
      experience: 'Erfahrung',
      achievements: 'Erfolge',
      projects: 'Fallstudien',
      services: 'Services',
      testimonials: 'Empfehlungen',
      insights: 'Insights',
      education: 'Ausbildung',
      contact: 'Kontakt',
      start: 'Start',
    },
    sectionTransitions: {
      journey: 'Beruflicher Weg',
      impact: 'Erfolge und Wirkung',
      caseStudies: 'Fallstudien',
      services: 'Services',
      testimonials: 'Empfehlungen',
      insights: 'Thought Leadership',
      expertise: 'Kompetenzen',
      education: 'Ausbildung',
      contact: 'Kontakt',
    },
    hero: {
      roleLine: "PGDM E-Business '27 | Ex-Apexon | AWS zertifiziert",
      roleHeading: 'PRODUCT & GROWTH BUILDER',
      summary:
        'Ich verbinde technische Umsetzung, Kundenverständnis und Wachstum. Meine Arbeit reicht von Frontend-Entwicklung bei Apexon bis zu Produktstrategie an der Universität Bamberg.',
      whyHireButton: 'Warum mich einstellen?',
      whyHireHeading: 'Was mich zu einer starken Besetzung macht',
      whyHireIntro:
        'Ich verbinde schnelle Umsetzung mit Business-Klarheit und Product Thinking, um Ideen zuegig in messbare Wirkung zu verwandeln.',
      valueHighlightsLabel: 'Value Snapshot',
      valueHighlights: [
        { value: '2.5+', label: 'Jahre in Delivery-Rollen' },
        { value: '1.400+', label: 'Studierende in der Lerncommunity' },
        { value: '3×', label: 'Online-Anfragen bei The Socials Web' },
      ],
      uniqueQualitiesLabel: 'Einzigartige Staerken',
      skillsLabel: 'Top Skills',
      impactSignalsLabel: 'Wirkungssignale',
      uniqueQualities: [
        'Business-orientiertes Denken kombiniert mit technischer Umsetzung',
        'Schnelle Experimentzyklen mit messbaren Learnings',
        'Klare Storytelling-Staerke fuer Produkt, Wachstum und Kundennutzen',
      ],
      impactSignals: [
        'Macht aus vagen Briefings klare Umsetzungs-Roadmaps',
        'Richtet Produktentscheidungen auf messbare Business-Ziele aus',
        'Schafft funktionsuebergreifenden Drive von Strategie bis Launch',
      ],
      ctaJourney: 'Beruflichen Weg ansehen',
      ctaDownloadCv: 'CV herunterladen',
      ctaContact: 'Kontakt aufnehmen',
      chips: ['KI Product Builder', 'Growth Systeme', "PGDM E-Business '27", 'Ex-Apexon'],
      ticker:
        'KI GROWTH STRATEGIE • PRODUCT STORYTELLING • EXPERIMENTGETRIEBENE UMSETZUNG • KI GROWTH STRATEGIE • PRODUCT STORYTELLING • EXPERIMENTGETRIEBENE UMSETZUNG •',
    },
    experience: {
      sideLabel: 'Erfahrung',
      heading: 'Beruflicher Weg',
      subheading: 'Produktstrategie an der Universität Bamberg und 30 Monate Frontend-Arbeit bei Apexon',
      storyCards: 'Karriere Stationen',
      stats: [
        { value: '2.5+', label: 'Jahre Erfahrung' },
        { value: '5', label: 'Karrierestufen' },
        { value: 'Global', label: 'Kundenreichweite' },
      ],
    },
    achievements: {
      sideLabel: 'Erfolge',
      heading: 'Erfolge und Wirkung',
      subheading: 'Leadership, Unternehmertum und berufliche Meilensteine',
      cta: 'Leidenschaft fuer Technologie und Business-Insights, um messbare Wirkung zu erzeugen',
      topHighlights: [
        {
          title: '2.5 Jahre',
          subtitle: 'Bei Apexon',
          description: 'Skalierbare Loesungen fuer globale Kunden entwickelt',
        },
        {
          title: 'Abteilungspraesident',
          subtitle: 'CSE Leadership',
          description: 'Leitung der Computer Science Engineering Abteilung',
        },
        {
          title: 'AWS zertifiziert',
          subtitle: 'Solutions Architect',
          description: 'Associate Level Zertifizierung',
        },
      ],
    },
    projects: {
      sideLabel: 'Fallstudien',
      heading: 'Product und Growth Fallstudien',
      subheading: 'Mit Business-Fokus umgesetzt: Problem, Loesung und messbare Wirkung.',
      businessGoal: 'Business Ziel',
      timeframe: 'Zeitraum',
      problem: 'Problem',
      solution: 'Loesung',
      impact: 'Wirkung',
      metrics: 'Kernmetriken',
      positioningLabel: 'Positionierung:',
      positioningText: 'AI Product Builder mit Growth Marketing Perspektive',
    },
    services: {
      sideLabel: 'Services',
      heading: 'Was ich fuer dich umsetzen kann',
      subheading: 'Klare Leistungen fuer Founder, Startups und Growth Teams, die schnell validieren und skalieren wollen.',
    },
    testimonials: {
      sideLabel: 'Empfehlungen',
      heading: 'Empfehlungen',
      subheading: 'Kurzes Feedback von Menschen, die meine Arbeitsweise und Delivery-Qualitaet direkt erlebt haben.',
    },
    thoughtLeadership: {
      sideLabel: 'Insights',
      heading: 'Blog und Thought Leadership',
      subheading: 'Perspektiven zu KI, Growth Strategie und Product Umsetzung.',
      readMore: 'Beitrag lesen',
    },
    mediumBlog: {
      sideLabel: 'Stories',
      badge: 'Medium Blog',
      heading: 'Gedanken, Die Geschäftsmetriken Bewegen',
      subheading: 'Tiefgreifende Analysen zu KI-gesteuertem Wachstum, Produktausführung und dem Aufbau nachhaltiger Systeme, die tatsächlich Ergebnisse liefern.',
      hook: 'Ich schreibe über die Schnittmenge von Technologie und Geschäftsergebnissen – und helfe Builderin, schneller zu denken, intelligenter zu verschiffen und Wirkung zu messen.',
      featuredArticles: [
        {
          title: 'Ich bin von Indien nach Deutschland gezogen',
          preview: 'Der größte Kulturschock war nicht das, was ich erwartet hatte. Eine persönliche Reise der Anpassung und unerwarteten Perspektiven.',
          date: 'vor 2 Tagen',
          readTime: '5 Min',
          url: 'https://medium.com/@tanmay19/i-left-india-for-germany-520e85d4fa21'
        },
        {
          title: 'Eine KI bekam 100.000 Dollar, eine Kreditkarte und einen 3-Jahres-Mietvertrag. Dann öffnete sie einen Laden und stellte Menschen ein.',
          preview: 'Das ist keine Demo. Das ist nicht hinter verschlossenen Türen. Das passiert bereits auf einer Straße in San Francisco.',
          date: '28. Apr',
          readTime: '6 Min',
          url: 'https://medium.com/@tanmay19/an-ai-got-100-000-a-credit-card-and-a-3-year-lease-then-it-opened-a-store-and-hired-humans-dcd31d84b617'
        },
        {
          title: 'Die Kosten für Intelligenz stürzen ab. Hier ist der Wert hin.',
          preview: 'Sieben Geschichten. Ein Muster. Hier ist, was es für den Rest von uns bedeutet.',
          date: '27. Apr',
          readTime: '7 Min',
          url: 'https://medium.com/@tanmay19/the-cost-of-intelligence-is-collapsing-heres-where-the-value-is-going-abd18953b31d'
        },
        {
          title: 'Was MBA + Engineering mir über bessere Produkte beigebracht hat',
          preview: 'Die besten Produktdenker, die ich je getroffen habe, sprechen zwei Sprachen fließend — die Sprache der Systeme und die Sprache der Menschen.',
          date: '23. Apr',
          readTime: '7 Min',
          url: 'https://medium.com/@tanmay19/what-mba-engineering-taught-me-about-building-better-products-3e3f4190778c'
        }
      ],
      profileUrl: 'https://medium.com/@tanmay19',
      ctaText: 'Alle Artikel auf Medium erkunden',
      footerText: 'Geschichten über Growth, Produktstrategie und Bauen mit KI. Veröffentlicht auf Medium.',
    },
    skills: {
      sideLabel: 'Skills',
      heading: 'Skills und Expertise',
      subheading: 'Eine Kombination aus technischer Staerke und strategischem Denken',
      coreStrengths: 'Kernstaerken',
      categories: {
        technical: 'Technische Skills',
        leadership: 'Leadership',
        business: 'Business',
        domains: 'Branchenexpertise',
      },
    },
    education: {
      sideLabel: 'Ausbildung',
      heading: 'Ausbildung und Zertifikate',
      subheading: 'Kompetenzen durch kontinuierliches Lernen ausbauen',
      certifications: 'Zertifikate',
      additionalContext: 'Zusaetzlicher Kontext',
    },
    contact: {
      sideLabel: 'Kontakt',
      heading: 'Lass uns sprechen',
      subheading:
        'Aktuell offen fuer Praktika und Projekte in Consulting, Product Management und digitaler Transformation',
      email: 'E-Mail',
      location: 'Standort',
      ctaText: 'Offen fuer Chancen in FMCG, Product Management und digitaler Transformation',
      ctaButton: 'Nachricht senden',
      footerRights: 'Alle Rechte vorbehalten.',
      builtWith: 'Erstellt mit Next.js, TypeScript, Tailwind CSS und Framer Motion',
    },
  },
};

function clonePortfolioData(): PortfolioData {
  return JSON.parse(JSON.stringify(portfolioDataEn)) as PortfolioData;
}

function getPortfolioDataByLanguage(language: Language): PortfolioData {
  if (language === 'en') {
    return portfolioDataEn;
  }

  const data = clonePortfolioData();

  data.basics.title = "Product & Growth Builder | PGDM E-Business '27 | Ex-Apexon";
  data.basics.tagline = 'Ich verbinde Technologie, Kundenbedürfnisse und Wachstum zu Produkten, die Menschen wieder nutzen.';
  data.basics.location = 'Mumbai, Maharashtra, Indien';
  data.basics.summary =
    'Bei Apexon habe ich erlebt, wie technische Entscheidungen das Kundenerlebnis prägen. Meine Arbeit mit Lonavala Villas und The Socials Web zeigte mir, wie wichtig Buchungen, Leads und Vertrauen sind. Mit BatchMates und meinem Praktikum in Bamberg verbinde ich diese Erfahrungen in der Produktstrategie.';

  data.topSkills = ['Produktstrategie und Kundenverständnis', 'Digitales Wachstum und SEO', 'Technologieorientierte Umsetzung'];
  data.keyHighlights = portfolioDataEn.keyHighlights;
  data.experience = portfolioDataEn.experience;
  data.achievements = portfolioDataEn.achievements;
  data.projects = portfolioDataEn.projects;

  data.services = [
    {
      title: 'KI Growth Strategie',
      description: 'Growth-Experimente, Funnel-Hypothesen und KPI-Frameworks an klaren Business-Zielen ausrichten.',
    },
    {
      title: 'Landing Pages und Conversion UX',
      description: 'Responsive Landing Pages mit klarer Positionierung, Message-Fit und Conversion-Tracking bauen.',
    },
    {
      title: 'Product und GTM Sprint Support',
      description: 'Rohideen in validierte Product- und Go-to-Market-Sprintplaene mit konkreten Meilensteinen verwandeln.',
    },
  ];

  data.thoughtLeadership = [
    {
      title: 'Wie AI Growth Builder ueber Experimentgeschwindigkeit denken sollten',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ktanmayn/',
    },
    {
      title: 'Von Frontend Execution zu Product-led Growth: Mein Framework',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ktanmayn/',
    },
    {
      title: 'Was MBA plus Engineering mich ueber bessere Produkte gelehrt hat',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/pulse/what-mba-engineering-taught-me-building-better-tanmay-narnaware-uz2xe',
    },
  ];

  data.skills = portfolioDataEn.skills;
  data.education = portfolioDataEn.education;
  data.certifications = portfolioDataEn.certifications;
  data.extra = portfolioDataEn.extra;

  return data;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'portfolio-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'de') {
      setLanguageState(stored);
      return;
    }

    setLanguageState(null);
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  const resolvedLanguage = language ?? 'en';

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      portfolioData: getPortfolioDataByLanguage(resolvedLanguage),
      ui: copyByLanguage[resolvedLanguage],
    }),
    [language, resolvedLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
