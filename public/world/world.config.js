// Tanmay's World: every chapter of Tanmay Narnaware's journey is a building you can walk into.
// Source of truth: the Context .md files (latest: Context_11_September_2026.md). Keep claims as worded there.
// Grid units: x left→right, z top→bottom of the plan; zones are centred on (x, z). Coordinates may go past
// 0..size: the world is two islands (India, Germany) and `size` only sets the scale/centre of the camera.
// `inside`: the beats Tanmay explains inside each building ([title, text]); `room`: what the interior looks like.
export const WORLD = {
  title: "Tanmay's World",
  intro: 'Engineer by foundation, entrepreneur by mindset, marketer by application, product thinker by evolution. Each building is a chapter: watch Tanmay walk in and explain it, fly with him to Germany, or click any building.',
  size: 32,
  seed: 19,
  home: { x: 30.5, z: 10.5, zoom: 0.42 },
  colors: {
    ground: '#2A3A52', trim: '#3B82F6', slab: '#1E293B', floor: '#0C1B2E', haze: '#0F172A', path: '#475569',
    accent: '#8B5CF6', foliage: ['#2F8F6B', '#3AA17A', '#27795C', '#4DB38A'],
  },
  // Model slabs. `label` = where the floating island name sits.
  islands: [
    { id: 'india', name: '🇮🇳 India · Pune & Mumbai', x: -5, z: -5, w: 42, d: 42, trees: 50, label: [16, -3] },
    { id: 'germany', name: '🇩🇪 Germany · Bamberg', x: 41, z: -16, w: 26, d: 22, trees: 26, label: [54, -15] },
  ],
  // [x, z, w, d, colour, solid]: lawns, pool, aprons… (solid = no trees on it)
  areas: [
    [2, 2, 28, 6.6, '#2E4560'], [2, 12, 28, 6.6, '#2E4560'], [2, 21.4, 28, 6.4, '#2E4560'],
    [28.2, 4.4, 1.6, 3, '#38BDF8', true],                                   // villa pool
    [-2.4, 26.2, 2.4, 2.4, '#3F4A5C', true],                                // India apron
    [42, -15, 24, 8.6, '#2E4560'], [44.5, -4.2, 19, 4.9, '#2E4560'],  // Germany lawns
  ],
  // [x, z, w, d]: streets and runways.
  paths: [
    [3, 9.3, 26, 1.4], [27.6, 9.3, 1.4, 11.4], [3, 19.3, 26, 1.4], [3, 19.3, 1.4, 10.4], [3, 28.3, 26, 1.4],
    [-0.6, 25.6, 3.7, 1.2],                                           // terminal → street
    [-4.6, 2, 2.2, 31],                                               // India runway
    [42.9, 0.8, 22.1, 1.4], [63.6, -5.7, 1.4, 7.9], [42.9, -5.7, 22.1, 1.4], [42.9, -5.7, 1.4, 7.9],
    [42.5, 3.0, 23, 1.3],                                             // Germany runway
  ],
  // [x, z, stripes top→bottom]
  flags: [[-1.6, 21.5, ['#FF9933', '#FFFFFF', '#138808']], [44, -13, ['#111111', '#DD0000', '#FFCE00']]],
  // The journey: walk a leg's street line stop by stop, fly between countries, walk on.
  tour: {
    beat: 6,                                                          // seconds per explained point inside a building
    airports: { in: { park: [-3.5, 27.6], dir: [0, -1] }, de: { park: [49.5, 3.65], dir: [1, 0] } },
    legs: [
      { route: [[3.7, 10], [28.3, 10], [28.3, 20], [3.7, 20], [3.7, 29], [28.3, 29]],
        stops: ['sinhgad', 'apexon', 'socialsweb', 'lonavala', 'weschool', 'batchmates', 'nurture', 'gcl', 'airport-in'] },
      { fly: ['in', 'de'], title: 'Flying to Germany', text: 'Mumbai → Germany for Summer Semester 2026: study, an internship and a new culture.' },
      { route: [[43.6, 1.5], [64.3, 1.5], [64.3, -5], [43.6, -5], [43.6, 1.5], [46.2, 1.5]], from: 'airport-de',
        stops: ['airport-de', 'bamberg', 'ism', 'sperber', 'munich', 'europe',
          { id: 'airport-de', at: 'end', inside: [['Heading home', 'Back to India with Outstanding Internship Recognition and a new way of seeing people, products and work.']] }] },
      { fly: ['de', 'in'], title: 'Flying home', text: 'Germany → India, carrying the research and lessons into the final year.' },
      { route: [[3.7, 10], [28.3, 10], [28.3, 20], [3.7, 20], [3.7, 29], [28.3, 29]], from: 'airport-in',
        stops: ['sirp', 'ailab', 'trophies'] },
    ],
  },
  zones: [
    /* ---------------- India ---------------- */
    { id: 'sinhgad', name: 'SKN Sinhgad College', kicker: 'CHAPTER 1 · FOUNDATION', x: 7, z: 6, w: 4.4, d: 3.4, h: 2.0, color: '#64748B', room: 'campus',
      step: 'Learning how technology is built.',
      blurb: 'B.E. in Computer Engineering at SKN Sinhgad College of Engineering, Pune, plus early leadership in student communities.',
      facts: [['Degree', 'B.E. Computer Engineering'], ['Years', '2017–2021']],
      inside: [
        ['Computer Engineering, 2017–21', 'B.E. at SKN Sinhgad College of Engineering, Pune. The base for everything after: programming, systems thinking and logical problem solving.'],
        ['CS Department Vice President', 'Directed cultural and technical events for 600+ students, using promotion and coordination to lift visibility and turnout.'],
        ['NSS Volunteer Head', 'Led awareness campaigns and 18+ social drives, supporting community participation and NGO visibility.'],
        ['Google Student Developer', 'Junior Community Lead, West Zone. Supported 20+ peers with debugging, project guidance and collaborative problem solving.'],
      ] },
    { id: 'apexon', name: 'Apexon', kicker: 'CHAPTER 2 · SOFTWARE ENGINEERING', x: 13.5, z: 6, w: 4.2, d: 3.4, h: 2.6, color: '#3B82F6', roof: 'flat', room: 'office',
      step: 'Senior Developer, connecting code to customer outcomes.',
      blurb: 'Senior Developer in Pune, building customer-facing web experiences with React, JavaScript and CSS in Agile/Scrum teams.',
      facts: [['Role', 'Senior Developer'], ['Tenure', 'Oct 2021 – Apr 2024 (30 months)'], ['Load speed', '+30%'], ['Engagement', '+20%'], ['Post-deployment defects', '−40%'], ['Delivery', '15% faster'], ['Client satisfaction', '95%+']],
      inside: [
        ['Senior Developer, 2021–24', '30 months in Pune building customer-facing web apps and digital experiences with React, JavaScript and CSS, in Agile/Scrum teams.'],
        ['Speed users can feel', 'Optimised website performance, improving load speed by 30% and lifting user engagement by 20%.'],
        ['Fewer fires after release', 'Resolved critical production bugs and recurring issues, cutting post-deployment defects by 40%.'],
        ['Product + marketing, together', 'Worked with product, QA and marketing to fold user feedback into features: 15% faster delivery and 95%+ client satisfaction.'],
        ['The AEM go-to', 'Led Adobe Experience Manager (AEM) solutions for the team and ran cross-team knowledge sharing.'],
      ] },
    { id: 'socialsweb', name: 'The Socials Web', kicker: 'CHAPTER 3 · DIGITAL VENTURE', x: 20, z: 6, w: 3.8, d: 3.2, h: 1.8, color: '#EC4899', roof: 'flat', room: 'office',
      step: 'Co-founding a web and digital-marketing studio.',
      blurb: 'Co-founded a digital venture delivering websites, SEO, content optimisation and campaigns, with KPI and ROI tracking.',
      facts: [['Role', 'Co-Founder'], ['On-time delivery', '100%'], ['Organic traffic', '+40%'], ['Session time', '+25%'], ['Online leads', '3×'], ['Conversion rate', '+20%']],
      inside: [
        ['Co-Founder', 'Built a digital studio delivering websites, SEO, content optimisation and campaigns, tracking KPIs and ROI for every client.'],
        ['Search that brings the right visitors', 'SEO and content work raised organic traffic by 40% and session time by 25%.'],
        ['Traffic into business', 'Campaigns and conversion work generated 3× online leads and improved conversion rates by 20%.'],
        ['Delivery discipline', '100% of client projects delivered on time.'],
      ] },
    { id: 'lonavala', name: 'Lonavala Villas', kicker: 'CHAPTER 4 · OPERATING A BUSINESS', x: 25.5, z: 6, w: 3.8, d: 3.2, h: 1.6, color: '#EA580C', room: 'villa',
      step: 'Growing a real hospitality business.',
      blurb: 'Founded Lonavala Villas by Tanmay: campaigns, pricing, guest experience, events and vendor partnerships.',
      facts: [['Role', 'Founder'], ['Occupancy', '45% → 80%'], ['Customer satisfaction', '95%+'], ['Ranking', 'Top 5 performer, two years running']],
      inside: [
        ['Founder', 'Ran a villa-rental business in Lonavala: pricing, social media, guest experience, events and vendor partnerships.'],
        ['Occupancy 45% → 80%', 'Seasonal campaigns and demand-aware pricing filled empty nights, lifting occupancy by 35 percentage points.'],
        ['Guests who come back', '95%+ customer satisfaction turned stays into repeat bookings and referrals.'],
        ['Top 5 performer', 'Ranked a Top 5 performer for two consecutive years.'],
      ] },
    { id: 'weschool', name: 'WeSchool, Mumbai', kicker: 'CHAPTER 5 · BUSINESS SCHOOL', x: 25.5, z: 16, w: 4.6, d: 3.4, h: 2.2, color: '#7C3AED', room: 'campus',
      step: 'Adding business, marketing and strategy.',
      blurb: 'PGDM E-Business (Marketing) at Welingkar Institute (WeSchool), Mumbai, 2025–2027.',
      facts: [['Programme', 'PGDM E-Business, 2025–2027'], ['Learning community', '1,400+ of 1,600 students'], ['We4Tech', 'Second Runner-Up, 90 teams']],
      inside: [
        ['PGDM E-Business (Marketing)', 'From building technology to the business around it: marketing, strategy, digital business and consumer behaviour at WeSchool, Mumbai, 2025–27.'],
        ['A 1,400-student learning community', 'Built a WhatsApp community connecting 1,400+ of 1,600 WeSchool students, with topic groups on AI, technology, case competitions and entrepreneurship.'],
        ['We4Tech: Second Runner-Up of 90', 'In the first 20 days of college, a randomly assigned cross-specialisation team built a centralised database prototype for railway concession passes.'],
        ['Smart India Hackathon', 'WeSchool nominated the team for the Smart India Hackathon.'],
      ] },
    { id: 'batchmates', name: 'BatchMates HQ', kicker: 'CHAPTER 6 · FOUNDER', x: 20, z: 16, w: 4.2, d: 3.4, h: 2.4, color: '#06B6D4', roof: 'flat', room: 'office',
      step: 'Meet → Collaborate → Grow.',
      blurb: 'Founded BatchMates, a student networking platform with verified profiles, skill-based discovery and cross-batch collaboration.',
      facts: [['Role', 'Founder & product builder'], ['Stage', 'Working pre-revenue pilot'], ['Also here', 'AI Dictionary · 30-Day AI Edge']],
      inside: [
        ['The problem', 'Students are surrounded by people but can\'t find the right ones: teammates, seniors, mentors, co-founders. Campus life is scattered across WhatsApp, LinkedIn and notice boards.'],
        ['The product', 'Verified profiles, skill-based discovery and cross-batch collaboration, with mentorship, communities and opportunities in one place. A working pre-revenue pilot.'],
        ['Founder work', 'Product strategy, positioning and onboarding; student and competitor research; go-to-market through campus pilots and buddy/team-leader activation; and technical development.'],
        ['AI Dictionary', 'Find the right AI tool for every problem: describe the need in plain language, then discover tools by use case, capability, category and pricing.'],
        ['30-Day AI Edge', 'A practical AI-learning system for students: daily tasks, curated tools and business applications, built on repeated practice.'],
      ] },
    { id: 'nurture', name: 'Nurture+', kicker: 'CHAPTER 7 · CONSUMER PRODUCT', x: 13.5, z: 16, w: 3.6, d: 3.0, h: 1.6, color: '#EAB308', room: 'home',
      step: 'Raise curious, kind, well-rounded kids.',
      blurb: 'An AI-powered parenting companion prototype for families from pregnancy to about age 12.',
      facts: [['Role', 'Founder / product creator'], ['Stage', 'Concept / prototype'], ['Concept validation', '200+ parents, paediatricians & teachers']],
      inside: [
        ['Raise curious, kind, well-rounded kids', 'An AI-powered parenting companion that follows a family from pregnancy to about age 12, in one calm app.'],
        ['What\'s inside', 'Daily routines, milestone and growth tracking, personalised guidance, and content on culture, religion, astronomy, motor development and creativity.'],
        ['Validated with 200+ people', 'Tested the concept with 200+ parents, paediatricians and teachers. It is a prototype, not a medical product.'],
      ] },
    { id: 'gcl', name: 'Vatsalya Trust · GCL', kicker: 'CHAPTER 8 · GIVING BACK', x: 7, z: 16, w: 4.2, d: 3.2, h: 1.8, color: '#22C55E', room: 'community',
      step: 'Teaching confidence and employability.',
      blurb: 'Global Citizen Leadership: skill-development workshops for underprivileged youth at Vatsalya Trust.',
      facts: [['Programme', 'Global Citizen Leadership'], ['Partner', 'Vatsalya Trust']],
      inside: [
        ['Global Citizen Leadership', 'Led skill-development initiatives for underprivileged youth at Vatsalya Trust.'],
        ['Workshops', 'Designed interactive sessions on communication, body language, public speaking, group discussions and spoken English.'],
        ['Measuring progress', 'Tracked confidence, classroom engagement and interview readiness through feedback and observation.'],
      ] },
    { id: 'airport-in', name: 'Airport · India', kicker: 'DEPARTURES', x: 0.3, z: 24.5, w: 3.2, d: 2.4, h: 1.4, color: '#94A3B8', roof: 'flat', room: 'terminal',
      step: 'Selected for an international exchange.',
      blurb: 'Where the Germany chapter begins.',
      facts: [['Exchange selection', '1 of 6 from 1,110'], ['Destination', 'Bamberg, Germany']],
      inside: [
        ['Selected: 1 of 6 from 1,110', 'Chosen for WeSchool\'s international student exchange with Otto-Friedrich-Universität Bamberg, Germany, for Summer Semester 2026.'],
        ['Next stop: Germany', 'A semester of study, a Product Management & Strategy internship, and life in a new culture.'],
      ] },
    { id: 'sirp', name: 'SIRP Library', kicker: 'CHAPTER 14 · RESEARCH', x: 7, z: 25, w: 4.0, d: 3.2, h: 1.8, color: '#0D9488', roof: 'flat', room: 'library',
      step: 'Why students adopt, and keep using, networking platforms.',
      blurb: 'Summer Internship Research Project: market segmentation and consumer adoption of peer-to-peer university networking platforms.',
      facts: [['Method', 'Systematic review + thematic analysis'], ['Evidence', '20 peer-reviewed studies, 2020–2026'], ['Models', 'TAM · UTAUT · DOI · ECM']],
      inside: [
        ['The question', 'Why do different students adopt, use and keep using university networking platforms?'],
        ['The method', 'Systematic review of 20 peer-reviewed studies (2020–2026), screened PRISMA-style and manually coded with six-phase thematic analysis. Written in Bamberg, August 2026.'],
        ['Theory, stitched together', 'TAM, UTAUT, DOI and ECM explain different stages of one journey: perception, conversion, diffusion and continuance.'],
        ['The finding', 'Segmentation shapes how students respond to adoption factors, and active participation matters more than sign-ups. These insights feed BatchMates\' onboarding, matching and retention.'],
      ] },
    { id: 'ailab', name: 'AI Lab', kicker: 'CHAPTER 15 · AI IN PRACTICE', x: 13.5, z: 25, w: 3.8, d: 3.2, h: 2.0, color: '#6366F1', roof: 'flat', room: 'lab',
      step: 'Human judgment first, AI acceleration, human validation.',
      blurb: 'Practical AI frameworks, automations and learning resources.',
      facts: [['Root-First', 'Problem before prompt'], ['Communication Roadmap', '12 weeks · 12 drills · 27 tasks']],
      inside: [
        ['Root-First', 'Understand the exact problem before asking AI to solve it. Then use AI to build, sharpen and accelerate the solution.'],
        ['Daily AI Brief', 'Automation blueprints across ChatGPT, Claude, Gemini, Copilot and Perplexity: schedule → search → summarise → deliver five updates a day.'],
        ['AI for marketing', 'A five-layer workflow (research, strategy, creation, automation, optimisation) that treats AI as an operating layer, not a content generator.'],
        ['Communication Roadmap', '12 weeks, 8 sections, 12 drills, 27 trackable tasks: Pyramid Principle, PREP, STAR and recorded practice with AI feedback.'],
      ] },
    { id: 'trophies', name: 'Trophy Hall', kicker: 'CHAPTER 16 · RECOGNITION', x: 21, z: 25, w: 5.4, d: 3.4, h: 2.2, color: '#D4A017', room: 'hall',
      step: 'Competitions, certifications and recognition.',
      blurb: 'Wins, finals and credentials collected along the way.',
      facts: [['InnoMUN 2025', 'Team winner (Pinapack)'], ['We4Tech', 'Second Runner-Up of 90'], ['Tata Imagination Challenge', 'Finalist'], ['AWS', 'Solutions Architect – Associate'], ['McKinsey', 'Forward Program'], ['HubSpot', 'Digital & Inbound Marketing']],
      inside: [
        ['InnoMUN: Marketing Parliament 2025', 'Team winner at BITS Pilani with Pinapack, a pineapple-fibre sustainable packaging concept.'],
        ['We4Tech & Tata Imagination', 'Second Runner-Up among 90 teams at We4Tech, and a finalist in the Tata Imagination Challenge.'],
        ['Certifications', 'AWS Certified Solutions Architect – Associate · McKinsey Forward Program · HubSpot Digital Marketing · HubSpot Inbound Marketing.'],
        ['Sustainability & ESG', 'A 16-hour workshop in collaboration with KPMG India on ESG frameworks, sustainability strategy and data analytics.'],
      ] },

    /* ---------------- Germany ---------------- */
    { id: 'airport-de', name: 'Airport · Germany', kicker: 'ARRIVALS', x: 46.2, z: -1.8, w: 2.8, d: 2.4, h: 1.4, color: '#94A3B8', roof: 'flat', room: 'terminal',
      step: 'Willkommen in Deutschland.',
      blurb: 'Gateway to the Germany chapter.',
      facts: [['Semester', '1 Apr – 30 Sep 2026']],
      inside: [['Willkommen in Bamberg', 'Exchange student (non-degree) for Summer Semester 2026, 1 April – 30 September.']] },
    { id: 'bamberg', name: 'Universität Bamberg', kicker: 'CHAPTER 9 · STUDENT EXCHANGE', x: 51.3, z: -1.8, w: 4.4, d: 2.8, h: 2.4, color: '#B91C1C', room: 'campus',
      step: 'Studying in a German classroom.',
      blurb: 'Exchange student at Otto-Friedrich-Universität Bamberg, Summer Semester 2026.',
      facts: [['Selection', '1 of 6 from 1,110'], ['Semester', 'Summer 2026'], ['Classmates', '~10 nationalities']],
      inside: [
        ['Exchange student, Summer 2026', 'Studied at Otto-Friedrich-Universität Bamberg as one of 6 selected from 1,110 WeSchool students.'],
        ['Coursework', 'International IT Project Management, Blockchain for Business, Corporate Responsibility & Product Management, Startup PR, Digital Business, Managing Digital Platforms, Sales & Marketing Management, German A1.'],
        ['The international classroom', 'Group projects across about 10 nationalities taught one lesson: structure is what survives translation. Say the important thing first.'],
        ['Living, not visiting', 'Groceries, laundry, budgeting, paperwork and a new city: independence built from hundreds of small decisions.'],
      ] },
    { id: 'ism', name: 'Chair of IS Management', kicker: 'CHAPTER 10 · INTERNSHIP', x: 57, z: -1.8, w: 4.0, d: 2.8, h: 2.2, color: '#0284C7', roof: 'flat', room: 'office',
      step: 'Product Management & Strategy Intern.',
      blurb: 'Product Management & Strategy Intern at the Chair of Information Systems Management (WIAI), Universität Bamberg, under Prof. Dr. Daniel Beimborn.',
      facts: [['Role', 'Product Management & Strategy Intern'], ['Dates', '1 May – 30 Aug 2026'], ['Project', 'Universität Bamberg Alumni Portal'], ['Recognition', 'Outstanding Internship Recognition']],
      inside: [
        ['Product Management & Strategy Intern', '1 May – 30 Aug 2026 at the Chair of Information Systems Management (WIAI), under Prof. Dr. Daniel Beimborn.'],
        ['The Alumni Portal', 'An invite-only, bilingual platform turning the alumni network into mentoring and careers: Identity → Discovery → Trust → Relationship → Opportunity.'],
        ['Three user groups', 'Designed journeys and prioritised features for students, alumni and administrators: onboarding, profiles, discovery, connections, messaging, jobs and admin.'],
        ['Explainable mentor matching', 'Matches scored on shared skills, skill gaps covered, career and study overlap, industry, location and profile completeness, so users can see why someone fits.'],
        ['Validated, then planned', 'Ran functional walkthroughs, matching checks and rules tests, logged defects honestly, and wrote a 4-phase launch plan with a 6-area KPI framework.'],
        ['Outstanding Internship Recognition', 'A Letter of Recommendation (30 Aug 2026) recognising product management & strategy excellence, research excellence, initiative and ownership.'],
      ] },
    { id: 'sperber', name: 'Autohaus Sperber', kicker: 'CHAPTER 11 · CONSULTING', x: 61.4, z: -1.8, w: 3.2, d: 2.8, h: 1.6, color: '#E11D48', roof: 'flat', room: 'garage',
      step: 'AI and customer-experience consulting for a car dealership.',
      blurb: 'AI and digital-transformation consulting during the internship: customer-experience analysis and a 90-day roadmap.',
      facts: [['Recommendations', '3 initiatives'], ['Roadmap', '90 days'], ['After-sales touchpoints', 'T+1 · T+7 · T+30 · T+90']],
      inside: [
        ['Diagnosing the customer experience', 'Analysed reachability, post-sale follow-up, listing freshness, reputation response and bilingual content at a car dealership.'],
        ['Three recommendations', 'Bilingual AI reception with WhatsApp triage; an after-sales journey at T+1, T+7, T+30 and T+90; and an AI-supported bilingual content engine.'],
        ['A 90-day roadmap', 'Listen and pilot → automate the loops → roll out the brand engine. Recommendations phased to learn before scaling.'],
      ] },
    { id: 'munich', name: 'Munich Tech Job Fair', kicker: 'CHAPTER 12 · CAREER', x: 60, z: -9.5, w: 4.4, d: 3.4, h: 2.6, color: '#84CC16', roof: 'flat', room: 'fair',
      step: 'Learning to pitch in 30 seconds.',
      blurb: 'A recruiter conversation is a short pitch.',
      facts: [['Lesson', 'Role → fit → one proof point']],
      inside: [
        ['Every chat is a pitch', 'At the Munich Tech Job Fair, recruiters have seconds, not minutes.'],
        ['Role → fit → one proof', 'Swapped the chronological life story for a sharper structure: the role I want, why I fit, and one proof point.'],
      ] },
    { id: 'europe', name: 'Berlin & Paris', kicker: 'CHAPTER 13 · PERSPECTIVE', x: 51, z: -9.5, w: 6, d: 3.4, h: 2.6, color: '#FBBF24', shape: 'landmarks',
      step: 'Travelling to understand, not just to photograph.',
      blurb: 'Weekend travel across Germany and Europe while living in Bamberg.',
      facts: [['Cities', 'Bamberg · Munich · Berlin · Paris']],
      inside: [
        ['Berlin', 'The Berlin Wall made history physical: cities carry the memory of division and reunification.'],
        ['Paris', 'Living in Europe made cross-border travel easy, and every city showed a different culture.'],
        ['Perspective', 'I went to Germany to study. I came back with a different way of seeing people, products, work and myself.'],
      ] },
  ],
};
