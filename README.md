# Harith’s portfolio

A React portfolio with the supplied portrait, original product branding, two local interactive examples, and an illustrative Three.js coordination model.

## Run locally

```sh
npm install
npm run dev:portfolio
```

Open http://127.0.0.1:4173. The earlier Express development command remains available as `npm run dev`.

## Build and review

```sh
npm run lint
npm run build
npm run preview
```

The production preview is http://127.0.0.1:4174. `dist/` is the deployment package. No API key is needed for the portfolio.

## Browser verification

`npm run verify:portfolio` tests the development preview in installed Google Chrome and writes desktop, 390px, compact 360px, reduced-motion, and no-WebGL evidence under `scrollcraft/builds/harith/verification/`. Set `PORTFOLIO_URL=http://127.0.0.1:4174` to test the production preview. The script disables native pointer locking and capture in automated contexts.

## Content and assets

- The two product examples use fictional, locally computed sample data. They are not the full product applications.
- The plant is an illustrative coordination scene, not an engineering simulation or as-built model.
- The animated résumé page uses the user-selected Founder’s Office CV Ver3. It offers the unchanged one-page original, a two-page single-column ATS PDF, plain text, and an accessible reader. See `docs/resume-design.md` for the reference, source decisions and checks.
- Book reflections are draft copy awaiting personal notes.
- Portrait original and alpha extraction master are retained in `scrollcraft/builds/harith/assets/`; compressed delivery assets live in `public/photos/`.
- TidyRow icon geometry and colors were taken from its original `TidyRowLogo.tsx`. ColdConnect uses its current Hanken Grotesk forest wordmark.

Read `scrollcraft/builds/harith/BRIEF.md` for creative decisions and `IMPLEMENTATION.md` for verified states and remaining limits.
