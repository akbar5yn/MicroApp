# Taste

## Communication
- Communicates in casual Indonesian (Bahasa Indonesia), using colloquial slang like "gua" and "ngga"; prefers responses in Indonesian. Confidence: 0.9

## Tooling & Stack
- Works on a pnpm monorepo orchestrated with Turborepo (`turbo.json`), using scripts like `pnpm dev:mfe`. Confidence: 0.9
- Microfrontend architecture: an Astro host site that loads Vue microsites (e.g. `apps/microsite/home`) via dynamic import of a `bootstrap.ts` and registers them as custom elements (e.g. `<my-home>`); microsites are built with Vite. Confidence: 0.9
