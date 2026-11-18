# Cinematic portfolio — element cards

Direction confirmed by Harith: Cinematic. Preserve the earlier retro-printer résumé concept. Use the current portfolio as the visual-system reference. Existing references and stated preferences supply the brief; no new reference questionnaire is needed.

## Element card — warm editorial frame

From: current portfolio, src/components/premium-portfolio.css.
Element: cream page inside an amber surround, with oversized editorial headings.
Why it works: makes the résumé feel like the same person's portfolio.
Technique: editorial columns, oversized headings, paper background, rounded frame.
Details: **read from source** — amber #c88243, paper #fff9ee, forest #365345, rust #642910; Plus Jakarta Sans headings and Hanken Grotesk body; homepage frame 28px radius and 18px margin. **suggested and implemented** — desktop résumé uses copy/actions beside the printer; phone stacks actions before the printer so downloads are available sooner.
Grab: homepage screenshot for reference; existing CSS tokens and font names.
Use for: résumé shell, introduction, actions, footer.
Prompt line: Match the existing amber-framed cream portfolio, using rust headings and forest-green pill controls.

## Element card — retro printer and emerging résumé

From: earlier user-supplied reference https://www.wallofportfolios.in/portfolios/sudar/ and the existing local résumé implementation.
Element: retro desktop printer feeding a résumé sheet.
Why it works: gives the résumé one memorable physical metaphor while keeping it readable and downloadable.
Technique: illustrated object, paper-feed animation, live HTML document preview, reader dialog.
Details: **read from local implementation** — original SVG printer, 800 × 430 viewBox; feed duration 3.2 seconds; easing [0.2, 0.65, 0.3, 1]; paper translates from -100% to 0%; reduced motion starts with paper out. These values describe our local implementation, not measurements of the external reference. **suggested and implemented** — preserve printer geometry, replay, and live paper; use the homepage frame and move primary actions into the opening composition.
Grab: local before/after screenshots in tmp/resume-review/; original printer SVG remains in ResumePage.tsx. No third-party illustration is needed.
Use for: résumé scene.
Prompt line: Keep the retro printer as the visual centrepiece, feeding the actual résumé out of its front slot, with reading and ATS download available throughout.

## Element card — quiet opening motion

From: current portfolio's restrained cinematic approach and reduced-motion handling.
Element: a brief introduction reveal followed by the printer's paper movement.
Why it works: establishes rhythm without delaying access to the document.
Technique: fade-up reveal, one-shot object animation.
Details: **suggested and implemented** — intro rises 20px over 0.65 seconds; printer uses existing 3.2-second feed; no looping, sound, scroll lock, or forced waiting. Reduced motion skips the reveal and feed.
Grab: optional short recording of the local page for review.
Use for: résumé opening.
Prompt line: Use a restrained fade-up and one paper-feed sequence, respecting reduced motion and keeping every action usable immediately.

## Moodboard

- **Love:** cinematic, tactile, warm, premium, readable; a real document inside a playful physical metaphor.
- **Borrow:** homepage paper/amber frame and typography; earlier reference's retro-printer concept; existing local reader and ATS download.
- **Avoid:** purple gradients, skill percentage bars, autoplay music, handshake stock photography, extra typefaces, repeated animations, tiny preview text as the only reading option.

Page boxes: portfolio navigation → introduction + printer + read/download controls → résumé section index → contact. On phones, controls precede the printer. Homepage structure remains hero → products → experience → about/books → contact.

## Mix check

The earlier beige full-page scene diverged from the homepage's framed cream surface. Use the homepage colours for the page and controls while retaining the printer's beige casing. The document retains plain black text and its original content; cinematic styling applies to its presentation. The reader supports original and single-column layouts; PDF and text downloads remain available.

## Download checklist

- Fonts: Plus Jakarta Sans and Hanken Grotesk, Google Fonts, SIL Open Font License 1.1. Already referenced; no paid font files to copy.
- Icons: existing lucide-react package, ISC licence. Reuse existing arrows, document, replay, download, print, and close icons.
- Printer: original inline SVG already exists; no asset download needed.
- Portrait: existing user-selected original and delivery images; no new image required for this résumé page.
- Résumé: retain selected source PDF, ATS PDF, and plain text under public/resume/.
- Reference screenshots and recordings are design-review material only; do not publish external site screenshots as portfolio content.
- No new imagery is needed for this fix. Project evidence screenshots remain an independent gap from intake.

Next: run folio-visuals for missing images, then folio-prd.
