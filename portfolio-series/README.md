# Tanmay — The Series

A cinematic portfolio for Tanmay Narnaware, adapted from [Portfolio_series](https://github.com/Sushmitadasari/Portfolio_series).

## Run locally

From this directory:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173). Run `npm run build` for a production build.

The direct Vite preview shows the portfolio choice first. To open Standard from that choice, run the root Next.js app on port 3000 as well. The root build includes Netflix Style at `/netflix/index.html` for the published site.

Personal details come from `../data/portfolio.ts`, shared with the existing portfolio. This app adds the series storyline and presentation in `src/data/portfolio.ts`. The portrait and CV are in `public/assets/`.
