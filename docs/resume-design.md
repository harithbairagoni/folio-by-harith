# Résumé page

## Cinematic refinement — 17 November 2026

User reaffirmed the earlier retro-printer reference and requested alignment with the current portfolio. Retained the original SVG printer, live paper feed, replay, original/ATS reader, original PDF, ATS PDF, and plain text. Matched the homepage's amber #c88243 surround, cream #fff9ee surface, rust #642910 heading accent, forest #365345 controls, rounded frame, and existing two typefaces. Desktop uses editorial copy beside the printer; phone exposes reading/download actions before the scene. The paper-open button now clears the sheet on small screens. Introduction uses a 20px, 0.65-second reveal with reduced-motion bypass. Removed internal CV version language from public copy.

Design cards, moodboard, and asset checklist: refs/cards.md. Verification screenshots: tmp/resume-review/cinematic-printer-final/. Build and TypeScript checks passed. Desktop, phone, compact phone, and reduced-motion checks cover horizontal overflow, reader layouts, section navigation, Escape close, actual ATS download, original PDF identity, and plain text. No résumé source wording or downloadable documents were changed.

## Reference and observed behavior

The supplied Wall of Portfolios listing links to Sudar's actual résumé at https://sudarveldesignportfolio.framer.website/resume. Inspected on 16 November 2026 with Firecrawl and desktop Chrome screenshots. The listing is a wrapper, not the résumé itself.

The actual résumé page uses a centered introduction, a beige printer, and a paper document feeding out of a slot. Browser inspection confirmed its paper transform changed from `translateY(-465.412px) rotateX(14deg)` to `translateY(-235.738px) rotateX(14deg)` during the captured interval. “Read it” opens a dialog; download and print actions remain separate. Screenshots of the opening, settled page and reader are saved under `tmp/resume-review/reference-*.png`.

Firecrawl reported DM Serif Display headings, Inter body, a light-blue photographic setting, navy type and a neon-green accent. These are observations of the reference. The implemented version uses the portfolio's Plus Jakarta Sans/Hanken Grotesk, warm cream, rust-brown text, and forest controls. Its printer is an original SVG illustration with separate live HTML paper, not a copied image. The 3.2-second feed, visible progress, accessible reader, and replay action are authored adaptations.

## Source and format

The user explicitly selected the Founder’s Office CV Ver3 PDF: `Copy of Bairagoni Harith c7 FOCOS CV Ver3.docx.pdf`. Its source screenshot was inspected. The original one-page document has a narrow section-label column, yellow headings, right-aligned dates and a dense main text column.

`src/data/resume.json` is the shared transcription. Section order, roles, dates, contact details, bullets and metrics follow that source. The résumé is not rewritten to add portfolio projects or new claims. The original PDF is served byte-for-byte unchanged. Its claims are supplied résumé content, not independently audited outcomes.

The paper preview and desktop “Original layout” reader preserve the section-label arrangement, substituting subdued amber for yellow. On phones, sections stack for readable text. “ATS reading” is a linear reading layout. The generated ATS PDF is a two-page, single-column text document with embedded fonts, conventional headings and no tables or graphics. Plain text uses the same section sequence. No universal ATS score or guarantee is claimed.

## Implementation

- `resume.html` is a Vite entry that loads `src/resume-main.tsx` and `ResumePage.tsx`.
- The existing homepage's Résumé links already target `/resume.html`.
- The animation starts once and can be replayed. Reading and downloads remain available during animation.
- The reader uses a native dialog with keyboard focus handling and Escape closure, a section index, original/ATS layout selection, print and download actions.
- Reduced motion shows the completed paper. Reduced transparency uses solid chrome. Mobile gets a separate printer/paper scale.
- Browser print CSS renders only the résumé in a single column. The direct ATS PDF remains the stable application download.

## Verification

`scripts/build-resume.py` generates the PDF/TXT and checks PDF extraction against 94 content fields plus source section order. An early Arial-font run lacked the rupee glyph; the final embedded Ubuntu font preserves it. Both final PDF pages were rendered and visually inspected, including the corrected internship heading page break.

`scripts/verify-resume.mjs` checks desktop, 390px phone, 360px compact phone and reduced motion. It exercises replay, reader opening, layout switching, Escape, section jumps, actual PDF downloading, original-PDF byte identity and plain text. Initial results: no horizontal overflow, no page errors or missing local resources, all ten sections present, preview content within its A4 bounds. Evidence is under `tmp/resume-review/final/`; final refinements have a separate evidence directory when rerun.

Original and ATS downloads remain distinct so the user can retain the exact one-page source while also offering a linear application document. Full ATS-vendor testing and real-device Safari testing are not claimed.

Final evidence is in `tmp/resume-review/refined/`: all four viewport/motion runs passed after the heading-space correction. The original file matched its SHA-256 comparison; the ATS download event delivered the expected filename; all ten sections were available in the reader. The browser print path contains the name once, includes the final Skills section and rupee characters, and excludes the animation controls. Browser printing currently paginates to three pages; the dedicated ATS PDF is two pages and the untouched source CV is one page. No form submissions or external publishing occurred.
