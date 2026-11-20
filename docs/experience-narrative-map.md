# Experience narrative map

The workspace has no deck, numbered export, or attachment that identifies the original 33 slides or their order. The brief specifies 13 narrative beats. The table below accounts for 33 available portfolio reference frames: 18 former desktop scroll samples, nine former phone states, and six earlier responsive chapter captures. These are browser views of the existing portfolio, and several show the same visual at different scroll positions or sizes. The numbers are audit IDs, with no implied relationship to the unavailable slide numbering. The selectable nomination sample is also carried forward from the existing code and résumé-backed material.

| ID | Available reference | What the frame shows | Where it goes |
| --- | --- | --- | --- |
| 1 | desktop-ethanol-0.06.png | Plant overview and three workstreams | Vivek A. Overview establishes the assembled facility and workstream lanes. |
| 2 | desktop-ethanol-0.24.png | Planning bars start to move beside the plant | Vivek A → B. A foundation focus replaces the undifferentiated bars. |
| 3 | desktop-ethanol-0.42.png | Handoffs from the workboard toward the plant | Vivek B → C. The civil dependency gives way to equipment placement. |
| 4 | desktop-ethanol-0.58.png | Vendor-to-installation handoff and a second route | Vivek C → D. Equipment and clearance focus pass through different model groups. |
| 5 | desktop-ethanol-0.76.png | Readiness review and open items | Vivek D → E. Clearance review stays visible as the groups reunite. |
| 6 | desktop-ethanol-0.94.png | Connected facility and readiness finish | Vivek E. Components settle and the readiness label arrives. |
| 7 | desktop-land-0.06.png | Three record slips, parcel and specialist lane | LandSafe A. Records enter with an explicit follow-up state. |
| 8 | desktop-land-0.24.png | Trace starts between documents and the parcel | LandSafe A → B. The records lead to field comparison. |
| 9 | desktop-land-0.42.png | Boundary comparison, reference markers and flagged question | LandSafe B. The observed edge traces against the original boundary. |
| 10 | desktop-land-0.58.png | Specialists and parcel with an emerging report | LandSafe C. Field, records and legal inputs meet before report delivery. |
| 11 | desktop-land-0.76.png | Report arriving next to site observations | LandSafe C → D. The checks stay in view while the report assembles. |
| 12 | desktop-land-0.94.png | LandSafe-branded report and review items | LandSafe D. Follow-up remains visible on the final document. |
| 13 | desktop-research-0.06.png | Telangana map, research tally and material | RASTRA A. Reveal geographic context and the 15-constituency scope. |
| 14 | desktop-research-0.24.png | Three source cards beside the map | RASTRA A → B. Bring the research inputs into a shared view. |
| 15 | desktop-research-0.42.png | Source cards align with synthesis labels | RASTRA B → C. Align the evidence before introducing its role in the brief. |
| 16 | desktop-research-0.58.png | Question, evidence and implication with a nascent brief | RASTRA C. Connect source material to the briefing structure. |
| 17 | desktop-research-0.76.png | Notes converge and the briefing grows prominent | RASTRA C → D. The organized sources recede as the brief assembles. |
| 18 | desktop-research-0.94.png | Complete leadership brief | RASTRA D. Hold on the deliverable. |
| 19 | phone-ethanol-0.png | Stacked facility overview | Vivek A. Place the active copy before the same plant stage. |
| 20 | phone-ethanol-1.png | Stacked handoff caption and relevant workstreams | Vivek B–D. Use short stage controls and focus one contribution at a time. |
| 21 | phone-ethanol-2.png | Stacked readiness outcome | Vivek E. Finish on the assembled plant and open-items label. |
| 22 | phone-land-0.png | Record slips and a survey parcel | LandSafe A. Keep record cards and parcel legible at phone width. |
| 23 | phone-land-1.png | Field comparison and specialist review | LandSafe B–C. Use separate field and specialist beats on one parcel. |
| 24 | phone-land-2.png | Property report and next steps | LandSafe D. Give the report a dedicated side of the stage. |
| 25 | phone-research-0.png | Map, tally and raw research | RASTRA A–B. Retain the count and disclose the source categories progressively. |
| 26 | phone-research-1.png | Synthesis card stack | RASTRA C. Keep the three briefing roles distinct. |
| 27 | phone-research-2.png | Final leadership brief | RASTRA D. Keep the brief and footer inside the stage. |
| 28 | compact-landsafe.png | Earlier compact records explanation and parcel study | LandSafe A–D. Expose every beat with controls on short viewports; keep substantive detail in the disclosure. |
| 29 | compact-political.png | Earlier compact research explanation and portfolio sample | RASTRA A–D and nomination sample. Keep both available without pinning short viewports. |
| 30 | desktop-landsafe.png | Earlier split view with evidence text, parcel and outcomes | LandSafe A–D. Move active copy beside the graphic; keep aggregate metrics in the disclosure. |
| 31 | desktop-political.png | Earlier split research and briefing view | RASTRA A–D. Synchronize the active copy with the map, source cards and brief. |
| 32 | phone-landsafe.png | Earlier stacked verification narrative | LandSafe A–D. Present copy above the parcel and move supporting detail below the story. |
| 33 | phone-political.png | Earlier stacked briefing and nomination narrative | RASTRA A–D and nomination sample. Give briefing and nomination separate selectable treatments. |

References 1–27 were inspected under `tmp/visual-stories/`; references 28–33 under `tmp/experience-review/`. These are local QA outputs, so they are ignored by Git. Existing illustrations, portfolio copy, private-source boundaries and metric attribution came from the repo's current Experience implementation, `src/data/work-samples.json`, `docs/safe-source-review.md` and `docs/experience-visual-storytelling-plan.md`. The three recommendation images in the request describe design directions and do not identify individual portfolio slides.

## Implementation notes

- One continuous document with native scrolling. A shared sequence maps scroll progress to a fractional beat. Copy and diagram layers interpolate from that same value. A sticky stage anchors the right-hand illustration. Stage buttons move the native scroll position and leave the user free to interrupt it. On short viewports and with reduced motion, buttons select the same meaningful poses in flow.
- The model's focused groups follow the fractional beat directly. Only the plant uses Three.js. Technical routes, survey traces, report pages and map layers use SVG and CSS with the existing Motion runtime.
- Two brief chapter bridges continue the diagram motif through the dark-to-cream and cream-to-sage transitions. Grid rotations and route drawing follow scroll. Each chapter introduction settles as it enters.
- Layout corrections include a reserved offset below the floating header, a consistent split grid, height-aware pinning, a stable caption area, a separate lane for plant workstreams, and compact document layouts. These address variable-height narration, cramped phone labels and the prior motionless plant overview, visible in the reference frames.

## Verification

- TypeScript and the production build passed. Three.js remains lazy-loaded. Vite reports the existing large-chunk warning for the plant scene bundle.
- Chrome checks sampled every beat and the midpoint between beats at 1440 × 960, 820 × 1024 and 390 × 844. They checked the active caption, stage bounds relative to navigation, intermediate transforms, reverse poses and model group isolation. Final LandSafe and RASTRA document visibility was checked alongside the nomination sample.
- Checks also covered the 360 × 640 controls, reduced motion, WebGL unavailable, viewport resizing, anchor navigation and keyboard access to the detail disclosures. The broader portfolio browser suite passed with no runtime errors, failed images or horizontal overflow.
- Visual review caught overlaid captions, connector paths appearing above text and small-screen notes crowding the research tally. The revised frames were captured and inspected after correcting these issues. Browser checks used emulated viewport sizes.

## Supplied illustration sequences

The nine images added on 20 November 2026 are generated illustrations. They depict the existing workflow examples. Their marks, document text, map boundaries, and seals carry no underlying project or campaign data. The portfolio records the web-ready paths on the corresponding experience entries.

| Chapter | Supplied frame | Use |
| --- | --- | --- |
| Vivek | Image 1 | Foundations and site readiness |
| Vivek | Image 2 | Tanks and equipment appear above the pads |
| Vivek | Image 3 | Connected facility and clearance paperwork |
| LandSafe | Image 7 | Overlapping records and boundary evidence |
| LandSafe | Image 8 | Field survey and GIS comparison |
| LandSafe | Image 9 | Evidence layers and consolidation into a report |
| RASTRA | Image 4 | Geographic research context |
| RASTRA | Image 5 | Sources connecting across the research illustration |
| RASTRA | Image 6 | Documents assembled for briefing |

Each source is 2752 × 1536. The site serves 768w and 1664w WebP variants with the original framing. The artwork follows the same progression as the factual captions. Each chapter also offers the earlier workflow diagram at the current stage. On reduced-motion and compact layouts the stage controls show complete frames.
