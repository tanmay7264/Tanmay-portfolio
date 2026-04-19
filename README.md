# Portfolio Website

A futuristic, high-converting portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ✨ Futuristic design with glassmorphism and animations
- 🎭 Cinematic splash screen with animated monogram
- 🎨 Dark mode optimized with subtle gradients
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessibility-first with reduced motion support
- 🎯 Smooth scroll animations and microinteractions
- 🚀 Optimized performance with Canvas animations
- 📊 Interactive timeline for experience
- 🏆 Achievement cards with category grouping
- 💼 Projects showcase
- 🎓 Education and certifications
- 📞 Contact section with social links

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Portfolio/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and themes
├── components/
│   ├── AnimatedBackground.tsx  # Canvas particle animation
│   ├── SplashScreen.tsx        # Loading animation
│   ├── Navigation.tsx          # Nav with scroll progress
│   ├── Hero.tsx                # Hero section
│   ├── Experience.tsx          # Experience timeline
│   ├── Achievements.tsx        # Achievements showcase
│   ├── Projects.tsx            # Projects grid
│   ├── Skills.tsx              # Skills categorized
│   ├── Education.tsx           # Education & certifications
│   └── Contact.tsx             # Contact form
├── data/
│   └── portfolio.ts        # Portfolio data from resume
└── lib/
    └── utils.ts            # Utility functions
```

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## Customization

To update portfolio content, edit `/data/portfolio.ts` with your information.

## Performance

- Canvas animations run at 60fps with adaptive particle counts
- Mobile-optimized with reduced particle counts
- Respects `prefers-reduced-motion` for accessibility
- Smooth scroll with `requestAnimationFrame`

## License

© 2026 Tanmay Narnaware. All rights reserved.
