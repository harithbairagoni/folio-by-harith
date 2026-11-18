# Experience scenes — local implementation check

## Faster motion and published covers — 18 November 2026

User requested faster, smoother motion and stronger state changes across all three sections. Static meshes are now batched by material within each independently animated group. Group boundaries are preserved; camera/base continuity and selected-workstream isolation remain in place. Removed the plant's nested progress smoothing, shortened damping to a 38ms time constant, bounded settling, and reduced per-frame allocations. Pixel ratio is capped at 1.35, and shadow maps use 768px. New workflow scenes use a closer view and more separated record/note poses; report mode gathers the documents into one stack.

Local Chrome/SwiftShader checks recorded LandSafe settling in 348ms desktop / 299ms phone and political analysis in 285ms / 249ms, including click dispatch and polling. Recorded draw calls: plant 17, LandSafe 29, research 45. These are local observations, not FPS or real-device guarantees. No before/after timing ratio is claimed because the earlier build was not instrumented for that comparison.

Published cover images replaced all four placeholder books. Dopamine Detox author Thibaut Meurisse was confirmed by the user. Source/edition records are in book-cover-sources.md. Covers are displayed whole and have accessible titles and source links. Catalog covers for Positioning and Dopamine Detox are 128 × 192; the publisher images are 300 × 450 and 316 × 450. Higher-resolution Google requests returned unavailable/cropped images and were rejected after visual inspection.

Build and TypeScript passed. scripts/verify-motion-books.mjs checked transitions, loaded covers, book selection, horizontal overflow, and runtime errors at desktop and phone sizes; results and inspected frames are in tmp/motion-books/. Workstream/state regression results remain in tmp/spatial-experience/.

Implemented on codex/experience-scenes after user approval of the design plan. Traditional typed-feedback polish was selected; user visual acceptance remains pending. No push, deployment, or polish-completion commit was made.

## Built

- Vivek: fixed base and camera; selected civil, mechanical, or document group responds to normalized scroll progress. Other groups settle at assembled height. Continuous interpolation preserves the existing transforms when switching. Overview is explicit. Phones use a layer slider without a long pinned section.
- LandSafe: authored terrain parcel, fixed markers, field-comparison outline, and generic document panels; Records / Field verification / Review report controls and synchronized HTML captions.
- Political analysis: authored research tabletop, note panels, document stack, folder with bound-edge cover pivot; Research / Synthesize / Brief controls and captions.
- Visible case strips for problem, personal contribution, and deliverable; separate nomination-portfolio preparation card. Existing products, hero portrait, About portrait, and résumé remain in place.

## Observed and checked

Production build and TypeScript passed. scripts/verify-spatial-experience.mjs passed at 1440px desktop, 375px phone, 360px reduced-motion phone, and 390px WebGL-disabled fallback. Captures and results: tmp/spatial-experience/.

Checks cover civil isolation, mechanical isolation, document isolation, reverse civil scrolling, scene-stage buttons, matching selected/caption state, settled rendering, direct case anchors, horizontal overflow, and runtime errors. No missing local anchors or runtime errors were reported. Rendering parks when settled, off-screen, or hidden.

Visually inspected LandSafe field/review states, political briefing state, phone plant composition, and phone LandSafe state. These observations establish working local views, not user artistic approval. Existing source-reported metrics were retained without calculation. New public scene content was scanned for identifying client names and coordinates; no matches were found. No original documents or campaign records became textures or public downloads.

## Boundaries

The models explain workflows; they do not model a real parcel, plant engineering, legal verification, construction sequence, or campaign outcomes. Documentation blocks represent coordination, not actual licenses. Source documents support the anonymized method summaries. Individual source findings, private maps, people, transaction terms, and internal reporting structures remain withheld.

Three.js geometry was authored locally using existing dependencies. The 3Dviz workflow, lighting guidance, and subject-clarity guidance informed construction; no catalog kit was retrieved. folio-game principles were adapted to the approved cinematic page, not a separate game. Copy follows ce-noslop constraints. No claimed universal three-second load time or real-device certification.

## Review handoff

The existing Vite preview process was identified by its workspace and command and returned HTTP 200 at http://127.0.0.1:4174/. Codex browser-open request was queued. Direct review anchors: #experience, #landsafe, #political-analysis. Typed feedback should drive further polish. The local polish commit waits until the user ends that loop.
