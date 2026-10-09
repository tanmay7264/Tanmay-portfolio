import { portfolioData as tanmay } from '../../../data/portfolio';

export type Palette = { from: string; via: string; to: string; accent: string };
export type Metric = { value: string; label: string };
export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const profile = {
  fullName: tanmay.basics.name,
  displayName: tanmay.basics.name,
  firstName: 'TANMAY',
  seriesTag: 'THE SERIES',
  originalLabel: 'A NARNAWARE ORIGINAL',
  role: 'AI Growth Product Builder',
  tagline: ['AI Growth', 'Product', 'Technology'],
  intro: tanmay.basics.summary,
  location: tanmay.basics.location,
  email: tanmay.basics.email,
  links: {
    linkedin: tanmay.basics.links.find((link) => link.label === 'LinkedIn')!.url,
    github: tanmay.basics.links.find((link) => link.label === 'GitHub')!.url,
    instagram: tanmay.basics.links.find((link) => link.label === 'Instagram')!.url,
    medium: tanmay.mediumBlog.profileUrl,
  },
  resumePdf: '/assets/Tanmay-Narnaware-CV.pdf',
  portrait: {
    src: '/assets/tanmay-portrait.png',
    srcSet: '/assets/tanmay-portrait.png 992w',
    alt: 'Portrait of Tanmay Narnaware',
  },
  interests: ['AI-led growth', 'Product strategy', 'Digital transformation'],
};

export const education = tanmay.education.map((item) => ({
  school: item.institution,
  place: item.location,
  degree: item.degree,
  period: item.dates,
  score: item.field,
}));

export const experience = tanmay.experience.map((item) => ({
  company: item.company,
  role: item.role,
  place: item.location,
  period: item.dates,
  points: item.bullets,
}));

export const projects: Project[] = tanmay.projects.map((item, index) => ({
  id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
  title: item.title,
  year: item.timeframe,
  genre: item.role,
  logline: item.description,
  stack: item.stack,
  build: [item.problem, item.solution, item.impact],
  features: item.bullets,
  metrics: item.metrics.map(({ value, label }) => ({ value, label })),
  palette: [amber, violet, ocean][index % 3],
  motif: (['flow', 'tenants', 'flow'] as const)[index % 3],
}));

export type Achievement = { id: string; title: string; org: string; detail: string; laurel: string; link?: string };
export const achievements: Achievement[] = tanmay.achievements.map((item, index) => ({
  id: `moment-${index + 1}`,
  title: item.title,
  org: item.category,
  detail: item.description,
  laurel: item.category,
}));

export type Certification = { issuer: string; name: string; link?: string };
export const certifications: Certification[] = tanmay.certifications.map((item) => ({
  issuer: item.issuer,
  name: item.name,
}));

export const writing = tanmay.mediumBlog.featuredArticles.map(({ title, url }) => ({ title, url }));

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };
export const skillCategories: SkillCategory[] = Object.entries(tanmay.skills).map(([id, names]) => ({
  id,
  title: id[0].toUpperCase() + id.slice(1),
  subtitle: `${names.length} areas of experience`,
  skills: names.map((name) => ({ name, mono: name.slice(0, 2).toUpperCase() })),
}));

export const skillEvidence: Record<string, string[]> = {
  React: ['Apexon frontend delivery'],
  JavaScript: ['Apexon frontend delivery'],
  'Front End Development': ['2.5 years at Apexon'],
  'AI growth strategy': ['Lonavala Villas', 'WeSchool mentorship'],
  'Marketing strategy': ['Lonavala Villas', 'The Socials Web'],
  'Product management': ['The Socials Web'],
  'Team mentoring': ['Apexon', 'WeSchool mentorship'],
};

export type Episode = { code: string; title: string; description: string; tags: string[]; runtime: string; palette: Palette };
export type Season = { number: number; title: string; period: string; synopsis: string; episodes: Episode[] };
export const seasons: Season[] = [
  {
    number: 1,
    title: 'Engineering Foundations',
    period: '2017 – 2021',
    synopsis: 'Computer Science at Savitribai Phule Pune University, followed by a start in software delivery.',
    episodes: [
      { code: 'S01 E01', title: 'The Engineer', description: education[2].degree, tags: ['Computer Science', 'Pune'], runtime: education[2].period, palette: ocean },
      { code: 'S01 E02', title: 'First Opportunities', description: tanmay.education[2].placementOffers?.[0] ?? '', tags: ['Campus placements', 'Technology'], runtime: '2021', palette: amber },
    ],
  },
  {
    number: 2,
    title: 'The Apexon Years',
    period: '2021 – 2024',
    synopsis: 'Four roles across 2.5 years, from associate engineer to senior frontend developer.',
    episodes: [...tanmay.experience].reverse().map((item, index) => ({
      code: `S02 E0${index + 1}`,
      title: item.role,
      description: item.description,
      tags: ['Apexon', 'Frontend', 'Customer experience'],
      runtime: item.dates,
      palette: [crimson, ocean, violet, amber][index],
    })),
  },
  {
    number: 3,
    title: 'Building Growth Systems',
    period: 'Entrepreneurship & community',
    synopsis: 'Direct-booking growth, a client delivery studio, and practical AI mentorship.',
    episodes: projects.map((item, index) => ({
      code: `S03 E0${index + 1}`,
      title: item.title,
      description: item.logline,
      tags: item.stack,
      runtime: item.year,
      palette: item.palette,
    })),
  },
  {
    number: 4,
    title: 'The Business Lens',
    period: '2025 – 2027',
    synopsis: 'PGDM E-Business in Mumbai, an exchange in Bamberg, and a focus on product-led growth.',
    episodes: [
      { code: 'S04 E01', title: 'WeSchool', description: tanmay.education[0].highlights[0], tags: ['PGDM', 'E-Business'], runtime: education[0].period, palette: jade },
      { code: 'S04 E02', title: 'The Exchange', description: tanmay.education[1].highlights[0], tags: ['Bamberg', 'Digital transformation'], runtime: education[1].period, palette: violet },
      { code: 'S04 E03', title: 'AI Community', description: tanmay.achievements.find((item) => item.title === 'Community Mentorship')!.description, tags: ['AI', 'Mentorship', '500+'], runtime: 'WeSchool', palette: crimson },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };
export const topPicks: TopPick[] = [
  { label: 'Professional journey', title: 'Apexon', detail: '2.5 years in frontend and customer experience', palette: crimson },
  { label: 'Business education', title: 'WeSchool', detail: 'PGDM E-Business · 2025–27', palette: amber },
  { label: 'International chapter', title: 'Bamberg', detail: 'Student exchange · 2026', palette: ocean },
  { label: 'Growth venture', title: 'Lonavala Villas', detail: '+28% direct inquiry share', palette: violet },
  { label: 'Founder story', title: 'The Socials Web', detail: '22+ campaigns delivered', palette: jade },
  { label: 'Community', title: '500+', detail: 'WeSchool members mentored', palette: crimson },
  { label: 'Hackathon', title: 'We4Tech', detail: 'Second runner-up among 90 teams', palette: amber },
  { label: 'Innovation', title: 'InnoMUN', detail: '2025 winner at BITS Pilani', palette: ocean },
  { label: 'Cloud credential', title: 'AWS', detail: 'Certified Solutions Architect – Associate', palette: violet },
  { label: 'Writing', title: 'Medium', detail: 'Technology, business and growth essays', palette: jade },
];

export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };
export const introSlides: IntroSlide[] = [
  { kicker: 'Current chapter', title: 'PGDM · E-Business', lines: ['WeSchool, Mumbai · 2025–27', 'Student exchange · University of Bamberg · 2026'], chips: ['Product', 'Growth', 'Digital business'] },
  { kicker: 'Experience', title: 'The Apexon Years', lines: ['2.5 years across four frontend roles', 'Customer experience, performance and mentoring'], chips: ['React', 'JavaScript', 'UX'] },
  { kicker: 'Originals', title: 'Growth Systems', lines: projects.map((item) => item.title), chips: ['Lonavala Villas', 'The Socials Web', 'WeSchool'] },
  { kicker: 'Milestones', title: 'Top Moments', lines: ['Student exchange in Germany', 'InnoMUN 2025 winner', 'We4Tech second runner-up'], chips: ['Innovation', 'Leadership'] },
  { kicker: 'Next chapter', title: 'AI-Led Product Growth', lines: ['Building products and growth systems that move business metrics.'], chips: tanmay.topSkills },
];

export type ProfileId = 'tanmay' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';
export const viewerProfiles: { id: ProfileId; name: string; blurb: string; color: string; order: SectionId[] }[] = [
  { id: 'tanmay', name: 'Tanmay', blurb: 'The full series, in order', color: '#e5132b', order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'] },
  { id: 'recruiter', name: 'Recruiter', blurb: 'Resume, achievements & skills first', color: '#4cc9ff', order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks'] },
  { id: 'developer', name: 'Developer', blurb: 'Projects, stack & GitHub first', color: '#46e3a8', order: ['originals', 'skills', 'journey', 'moments', 'about', 'picks', 'story'] },
  { id: 'creative', name: 'Creative', blurb: 'The story arc & highlights first', color: '#ffb547', order: ['journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'] },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Education & experience', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((count, season) => count + season.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'My Projects', meta: `${projects.length} Originals • Growth systems`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Ten career highlights', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: { nav: 'Moments', card: 'My Achievements', meta: `${achievements.length} Moments • ${certifications.length} Certifications`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};
