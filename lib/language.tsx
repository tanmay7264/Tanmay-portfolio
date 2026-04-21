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
      roleHeading: 'AI GROWTH BUILDER',
      summary:
        'I turn ambiguous business problems into AI-powered product and growth experiments. My work is built around one framework: Problem -> Solution -> Impact, with clear metrics, rapid execution, and customer-centered storytelling.',
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
      subheading: '2.5 years of building scalable, user-centric solutions at Apexon',
      storyCards: 'Career Story Cards',
      stats: [
        { value: '2.5+', label: 'Years Experience' },
        { value: '4', label: 'Career Milestones' },
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
      roleHeading: 'AI GROWTH BUILDER',
      summary:
        'Ich verwandle unklare Geschaeftsprobleme in KI-gestuetzte Produkt- und Wachstumsexperimente. Meine Arbeit folgt einem klaren Rahmen: Problem -> Loesung -> Wirkung, mit messbaren Ergebnissen, schneller Umsetzung und starkem Kundenfokus.',
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
      subheading: '2.5 Jahre Aufbau skalierbarer, nutzerzentrierter Loesungen bei Apexon',
      storyCards: 'Karriere Stationen',
      stats: [
        { value: '2.5+', label: 'Jahre Erfahrung' },
        { value: '4', label: 'Karrierestufen' },
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

  data.basics.title = "AI Growth Product Builder | PGDM E-Business '27 | Ex-Apexon";
  data.basics.tagline = 'Ich baue KI-gestuetzte Produkte und Wachstumssysteme, die Business-Metriken bewegen.';
  data.basics.location = 'Mumbai, Maharashtra, Indien';
  data.basics.summary =
    'Ich entwickle mich von Frontend-Execution zu KI-gestuetzter Product- und Growth-Fuehrung. Ueber Apexon, Campus-Communities und unternehmerische Projekte hinweg folge ich einem Muster: Problem erkennen, digitale Loesung bauen und Wirkung messen.';

  data.topSkills = [
    'KI Growth Strategie',
    'Problem-Loesung-Wirkung Storytelling',
    'Experimentgetriebene Product Umsetzung',
  ];

  data.keyHighlights = [
    'PGDM E-Business (2025-27) | WeSchool, Mumbai',
    '2.5 Jahre bei Apexon | Front End Web Entwickler (React, JavaScript, UX)',
    'AWS Certified Solutions Architect | Freelance Web Entwickler',
    'Leadership: Abteilungspraesident (CSE) und NSS Teamleiter',
    'Unternehmerische Erfahrung: Villa Rental Marketing und The Socials Web',
    'Event Organisation: Dandiya Nights und NGO Spendenaktionen',
  ];

  data.experience = [
    {
      company: 'Apexon',
      role: 'Senior Front End Entwickler (Customer Experience Fokus)',
      dates: 'November 2023 - April 2024',
      duration: '6 Monate',
      location: 'Pune, Maharashtra, Indien',
      description:
        'Arbeit in einer Senior Rolle mit Verantwortung fuer Customer Experience und Mentoring, ausgerichtet auf Business- und Marketingziele.',
      bullets: [
        'Frontend-Verantwortung fuer zentrale kundenorientierte Module uebernommen.',
        'Marketingziele in skalierbare digitale Umsetzung uebersetzt.',
        'UX-Entscheidungen mit Verhaltensdaten und Performance-Signalen gesteuert.',
        'Junior Entwickler begleitet, um Experience- und Brand-Qualitaet sicherzustellen.',
      ],
    },
    {
      company: 'Apexon',
      role: 'Frontend Entwickler',
      dates: 'Januar 2023 - Oktober 2023',
      duration: '10 Monate',
      location: 'Pune, Maharashtra, Indien',
      description:
        'Fokus auf Verbesserung digitaler Erlebnisse mit Blick auf Engagement, Performance und Brand-Konsistenz fuer globale Kunden.',
      bullets: [
        'UX und UI verbessert, um Engagement und Nutzbarkeit zu steigern.',
        'Frontend-Performance optimiert, um Absprungraten zu senken.',
        'Digitale Interfaces auf Brand Positionierung und Kundenerwartungen abgestimmt.',
        'Iterative Experimente und Feature-Rollouts unterstuetzt.',
      ],
    },
    {
      company: 'Apexon',
      role: 'Software Engineer',
      dates: 'April 2022 - Dezember 2022',
      duration: '9 Monate',
      location: 'Pune, Maharashtra, Indien',
      description:
        'Eigenverantwortung fuer kundenorientierte Module, bei denen digitale Flows Nutzerreisen und Conversion-Verhalten beeinflusst haben.',
      bullets: [
        'Nutzerfluesse in Webanwendungen aufgebaut und optimiert.',
        'Mit Product- und Design-Teams zur Verbesserung von Customer Journeys gearbeitet.',
        'Schnelle UI-Iterationen fuer Experimentzyklen umgesetzt.',
        'Konsistenz ueber Geraete hinweg fuer Reichweite und Accessibility sichergestellt.',
      ],
    },
    {
      company: 'Apexon',
      role: 'Associate Software Engineer',
      dates: 'Oktober 2021 - Maerz 2022',
      duration: '6 Monate',
      location: 'Pune, Maharashtra, Indien',
      description:
        'Einstieg mit Fokus auf kundenorientierte digitale Experiences und fruehem Verstaendnis, wie Interface und Messaging Nutzerbindung und Markenwahrnehmung beeinflussen.',
      bullets: [
        'UX-Wireframes und Brand-Guidelines in responsive Web-Interfaces uebersetzt.',
        'UI-Fixes und Usability-Verbesserungen auf Basis von Feedback umgesetzt.',
        'In agilen Teams gearbeitet und schnelle Iterationszyklen begleitet.',
        'Experience-Probleme geloest, die zu Nutzerabbruechen fuehren konnten.',
      ],
    },
  ];

  data.achievements = [
    {
      category: 'Akademische Exzellenz',
      title: 'CMAT Aufnahmepruefung - 99.37 Perzentil',
      description:
        '99.37 Perzentil im Bereich Innovation und Entrepreneurship unter 63.000 Teilnehmenden in Indien.',
    },
    {
      category: 'Innovation und Hackathons',
      title: 'We4Tech Zweiter Platz',
      description:
        'Unter 90 Teams: Prototyp fuer eine zentrale Datenbank zur Loesung des Railway Concession Pass Problems entwickelt.',
    },
    {
      category: 'Innovation und Hackathons',
      title: 'InnoMUN 2025 Gewinner',
      description:
        'BITS Pilani: Umwandlung von Ananasblatt-Agrarabfaellen in biologisch abbaubare Verpackung.',
    },
    {
      category: 'Innovation und Hackathons',
      title: 'Smart India Hackathon',
      description: 'Vom WeSchool Team fuer den Smart India Hackathon nominiert.',
    },
    {
      category: 'Leadership und Mentoring',
      title: 'Community Mentoring',
      description:
        '500+ WeSchool Community Mitglieder in KI, Technologie und Entrepreneurship begleitet.',
    },
    {
      category: 'Leadership und Mentoring',
      title: 'Vizepraesident - Computer Science Department',
      description:
        'Kulturelle und technische Events fuer 600+ Studierende geleitet und Sichtbarkeit durch Promotions gesteigert.',
    },
    {
      category: 'Soziale Wirkung',
      title: 'NSS Volunteer Head',
      description:
        'Aufklaerungskampagnen und 18+ soziale Aktionen geleitet, Community-Engagement fuer die NGO gestaerkt.',
    },
    {
      category: 'Beruflich',
      title: 'Google Student Developer',
      description:
        'Junior Community Lead, West Zone, Indien. 20+ Peers bei Debugging und Projekten unterstuetzt.',
    },
    {
      category: 'Unternehmertum',
      title: 'Gruender: Lonavala Villas',
      description: 'Online Villa Rental Venture mit Marketing-Fokus skaliert.',
    },
    {
      category: 'Unternehmertum',
      title: 'Co-Founder: The Socials Web',
      description: 'The Socials Web als digitales Venture mit aufgebaut und skaliert.',
    },
    {
      category: 'Beruflich',
      title: '2.5 Jahre bei Apexon',
      description: 'Front End Web Entwickler mit skalierbaren, nutzerzentrierten Loesungen fuer globale Kunden.',
    },
  ];

  data.projects = [
    {
      title: 'Lonavala Villas Wachstumssystem',
      role: 'Gruender | AI Growth Builder',
      description:
        'Aufbau einer Demand Generation Engine fuer ein Villa Rental Business und Verlagerung von Plattformabhaengigkeit zu direkten Kanaelen.',
      problem:
        'Leads waren volatil und stark von Aggregatoren abhaengig, mit Margendruck und geringer Transparenz im Funnel.',
      solution:
        'Persona-basierten Akquise-Funnel aufgebaut, Positionierung geschaerft und ein SLA-basiertes Lead-Response-Modell eingefuehrt.',
      impact:
        'Buchungseffizienz und Channel-Mix-Qualitaet verbessert, mit staerkerer Kontrolle ueber Intent und Marge.',
      businessGoal: 'Mehr direkte, hochwertige Buchungen und geringere Abhaengigkeit von Drittplattformen.',
      timeframe: '12 Wochen Growth Sprint',
      metrics: [
        {
          label: 'Anteil direkter Anfragen',
          value: '+28%',
          detail: 'Verschiebung weg vom aggregatorlastigen Lead-Mix',
        },
        {
          label: 'Lead-zu-Buchung Conversion',
          value: '+17%',
          detail: 'nach Einfuehrung des Response-Playbooks',
        },
        {
          label: 'Lead Response Zeit',
          value: '3x schneller',
          detail: 'SLA-gesteuerte Bearbeitung ueber alle Kanaele',
        },
      ],
      screenshot: '/images/case-lonavala.svg',
      stack: ['Growth Funnel Design', 'Content Strategie', 'Lead Operations'],
      bullets: [
        'Angebot auf Premium Gruppenreise-Anlaesse neu positioniert.',
        'Drop-off Punkte analysiert und Follow-up Sequenzen neu aufgebaut.',
        'Demand Ops mit woechentlichen Conversion Reviews standardisiert.',
      ],
      links: [],
    },
    {
      title: 'The Socials Web Client Studio',
      role: 'Co-Founder | Product und Delivery',
      description:
        'Ein modulares Delivery Studio aufgebaut, das rohe Founder-Briefs in marktreife GTM Assets und messbare Growth Experimente uebersetzt.',
      problem:
        'SMB-Kunden konnten Ideen schwer in Marktausfuehrung uebersetzen, weil Product-, Design- und Kampagnenverantwortung fragmentiert war.',
      solution:
        'Ein Sprint-Modell ueber Positionierung, Landing-Page-Launch und Kampagnen-Iteration mit KI-gestuetzten Workflows eingefuehrt.',
      impact:
        'Umsetzungsgeschwindigkeit und Conversion-Klarheit verbessert, sodass Kunden schneller launchen und optimieren konnten.',
      businessGoal: 'Go-to-Market Zyklus verkuerzen und Conversion-Qualitaet fuer SMB-Kunden verbessern.',
      timeframe: 'Quartalsweise Sprint-Zyklen',
      metrics: [
        {
          label: 'Launch Durchlaufzeit',
          value: '-40%',
          detail: 'durch Templates und KI-gestuetzte Production Ops',
        },
        {
          label: 'Gelieferte Kampagnen',
          value: '22+',
          detail: 'mehrstufige GTM-Projekte umgesetzt',
        },
        {
          label: 'Landing Page CVR',
          value: '+31%',
          detail: 'durchschnittlicher Uplift ueber getrackte Projekte',
        },
      ],
      screenshot: '/images/case-socials.svg',
      stack: ['GTM Sprint Planung', 'Landing Page Strategie', 'KI-gestuetzte Operations'],
      bullets: [
        'Unscharfe Kundenanfragen in klare Growth Roadmaps uebersetzt.',
        'Wiederverwendbare Kampagnen- und Creative-Templates aufgebaut.',
        'Woechentliche Performance Readouts fuer schnellere Iteration eingefuehrt.',
      ],
      links: [],
    },
    {
      title: 'WeSchool AI Mentorship Flywheel',
      role: 'Community Mentor | Growth Enabler',
      description:
        'Ein AI Learning Flywheel aufgebaut, das Interesse durch strukturierte Cohorts, Mentoring Loops und praktische Aufgaben in Umsetzung verwandelt.',
      problem:
        'Das Interesse an KI war hoch, aber die Conversion von Awareness zu praktischer Anwendung war niedrig und inkonsistent.',
      solution:
        'Ein cohort-basiertes Mentoring-Modell mit handlungsorientierten Workshops, Peer Accountability und konkreten Umsetzungsaufgaben entwickelt.',
      impact:
        'Nachhaltige Teilnahme und praktische KI-Adoption innerhalb der Studierenden-Community gesteigert.',
      businessGoal: 'Praktische KI-Adoption und Retention in einer interessierten Community erhoehen.',
      timeframe: '2 akademische Semester',
      metrics: [
        {
          label: 'Begleitete Community Mitglieder',
          value: '500+',
          detail: 'Guidance in KI und Entrepreneurship',
        },
        {
          label: 'Workshop Sessions',
          value: '12',
          detail: 'hands-on, umsetzungsorientierte Module',
        },
        {
          label: 'Wiederkehrende Teilnahme',
          value: '68%',
          detail: 'Retentionsindikator des Cohort-Modells',
        },
      ],
      screenshot: '/images/case-weschool.svg',
      stack: ['Community Growth', 'KI Education', 'Programm Design'],
      bullets: [
        'Eine wiederholbare Lernreise vom Beginner zum Builder aufgebaut.',
        'Peer Loops strukturiert, um Adoptionsdynamik zu halten.',
        'Teilnahme und Abschlussraten gemessen, um Programmqualitaet zu verbessern.',
      ],
      links: [],
    },
  ];

  data.testimonials = [
    {
      quote:
        'Tanmay verbindet technische Umsetzung mit Business-Denken. Er stoppt nicht beim Feature-Launch, sondern optimiert auf echte Ergebnisse.',
      name: 'Ehemaliger Team Lead',
      role: 'Apexon',
    },
    {
      quote:
        'Sein Growth-Mindset ist stark. Tanmay uebersetzt unklare Ideen in strukturierte Experimente und klare Aktionsplaene.',
      name: 'Startup Kollaborator',
      role: 'The Socials Web',
    },
    {
      quote:
        'Als Mentor hat er KI fuer Studierende praktisch nutzbar gemacht - mit Fokus auf Umsetzung und messbaren Fortschritt.',
      name: 'Community Koordinator',
      role: 'WeSchool',
    },
  ];

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
      url: 'https://www.linkedin.com/in/ktanmayn/',
    },
  ];

  data.skills = {
    leadership: [
      'Cross-funktionale Leadership',
      'Business Alignment',
      'Entscheidungsverantwortung',
      'Team Mentoring',
      'Abteilungsleitung',
    ],
    technical: [
      'React',
      'JavaScript',
      'Front End Entwicklung',
      'UX/UI Design',
      'Performance Optimierung',
      'Responsive Web Design',
      'AWS Solutions Architektur',
    ],
    business: [
      'KI Growth Strategie',
      'Product Management',
      'Marketing Strategie',
      'Entrepreneurship',
      'Strategische Planung',
      'Experiment Design',
    ],
    domains: ['FMCG', 'E-Business', 'Customer Experience', 'Digitales Marketing'],
  };

  data.education = [
    {
      institution: 'Prin. L. N. Welingkar Institute of Management',
      degree: 'Post Graduate Diploma in Management',
      field: 'E-Business',
      dates: '2025 - 2027',
      location: 'Mumbai, Indien',
      highlights: [
        'Spezialisierung auf digitale Business-Modelle, E-Commerce und plattformgesteuerte Wachstumsstrategien',
        'Fokus auf Technologie, Analytik und digitale Kanäle für skalierbare Business-Lösungen',
        'Verständnis des indischen digitalen Ökosystems und der Consumer-Internet-Landschaft',
      ],
      coreAreas: [
        'E-Commerce und Online-Marketplace-Strategie',
        'Digital Marketing und Performance Analytics',
        'Plattform-Business-Modelle und Netzwerk-Effekte',
        'Business Analytics und datengesteuerte Entscheidungsfindung',
        'Innovation und Technologie-Management',
      ],
      academicPractical: [
        'Analyse von echten digitalen Geschäften wie Marktplätze, D2C-Brands und SaaS-Modelle',
        'Anwendung von Metriken wie CAC, LTV, Konversionsraten und Retention zur Bewertung von Wachstumsstrategien',
        'Arbeit an Projekten mit digitalen Go-to-Market-Strategien und Revenue-Modellen',
      ],
      skillsDeveloped: [
        'Digitale Strategie und Business-Modell-Design',
        'Performance Marketing und Funnel Optimization',
        'Analytisches Denken mit Business-Metriken',
        'Marktforschung und Wettbewerbsanalyse',
        'Problemlösung in Tech-getriebenen Business-Kontexten',
      ],
    },
    {
      institution: 'Otto-Friedrich University of Bamberg',
      degree: 'Student Exchange Program',
      field: 'Management, Innovation & Digital Transformation',
      dates: 'März 2026 - August 2026',
      location: 'Bamberg, Deutschland',
      highlights: [
        'Teilnahme an internationalem akademischen Austausch mit Fokus auf Management, Innovation und digitale Transformation',
        'Einsicht in europäische akademische Rahmen mit fallgestütztem Lernen und Forschungskursen',
        'Zusammenarbeit mit diversen, multikulturellen Kohorten für interkulturelle Kommunikation',
        'Kurse zu aufstrebenden Business-Trends wie Hybrid Intelligence und digitale Ökosysteme',
      ],
      exposure: [
        'Studienfächern mit Technologie und Management Decision-Making kombiniert',
        'Angewendetes analytisches Denken auf echte Business-Probleme durch Aufgaben und Projekte',
        'Verständnis europäischer Business-Umgebung, Richtlinien und Marktdynamiken',
      ],
      skillsDeveloped: [
        'Interkulturelle Kommunikation und globale Perspektive',
        'Strategisches Denken und Problemlösung',
        'Adaptabilität in internationalen Umgebungen',
        'Akademische Forschung und strukturierte Analyse',
        'Zusammenarbeit in diversen Teams',
      ],
    },
    {
      institution: 'Savitribai Phule Pune University',
      degree: 'Bachelor of Engineering (B.E.)',
      field: 'Computer Science',
      dates: '2017 - 2021',
      location: 'Pune, Indien',
      highlights: [
        'Starke Grundlagen in Datenstrukturen, Algorithmen, DBMS, Betriebssystemen und Computernetzwerken',
        'Projekte mit Webanwendungen und Software-Systemen, Frontend und Backend kombiniert',
        'Erfahrung in Programmierung, Debugging und Software Development Lifecycle',
        'Analytisches Denken und Problemlösung durch strukturierte Codierung und akademische Arbeit',
      ],
      academicPractical: [
        'Anwendung von Klassenzimmer-Konzepten auf praktische Software-Entwicklung und akademische Projekte',
        'Arbeit über Frontend und Backend-Aufgaben beim Aufbau praktischer Webanwendungen',
      ],
      skillsDeveloped: [
        'Programmierung und Debugging',
        'Software Development Lifecycle Praktiken',
        'Analytisches Denken und Problemlösung',
        'Frontend und Backend Anwendungsentwicklung',
      ],
      placementOffers: [
        '4 finale Placement-Angebote von MNCs wie Infosys, Apexon, Atos Syntel und Synerzip erhalten',
      ],
    },
  ];

  data.certifications = [
    {
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
    },
    {
      name: 'Grundlagen des digitalen Marketings',
      issuer: '',
    },
  ];

  data.extra = [
    'Leidenschaft fuer den Einsatz von Technologie und Business-Insights, um Loesungen mit Wirkung zu schaffen.',
    'Aktuell auf der Suche nach Praktika und Projekten in Consulting, Product Management und digitaler Transformation.',
    'Freelance Web Entwickler',
  ];

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
