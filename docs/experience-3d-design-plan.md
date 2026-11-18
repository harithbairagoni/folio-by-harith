# LandSafe and political analysis — design for review

Status: approved and implemented locally on codex/experience-scenes; browser polish with typed user feedback pending. Requested direction: cinematic, premium, using the existing portfolio theme. Scene decisions are recorded in experience-scene-spec.json; implementation checks are in experience-validation.md.

## Why the recent changes are easy to miss

The latest work samples sit inside native details panels that start closed, beneath long contribution lists. The existing parcel illustration and briefing sheet still dominate the sections, so adding evidence has not materially changed their first impression. This is confirmed in the component source. Whether the user's browser has an older build has not been established; do not attribute the issue to caching without checking the served page.

## Shared direction

## Added scope — Vivek plant reference and workstream scrolling

The user supplied a generated visual reference (2400 × 1792 PNG) for the Vivek section and requested that selection govern which elements respond to scrolling. Treat the image as design inspiration, not a photograph, engineering model, or evidence of the actual facility. Keep its dark forest setting, warm cream typography, sage structural elements, silver equipment, brass piping, and readable isometric composition. Remove its duplicated date in implementation. Preserve the user's current hero and newly selected About portrait.

### Behaviour to build

| Selection | Scroll-responsive elements | Stable context |
| --- | --- | --- |
| Civil works | Foundation layers, equipment plinths, and civil/site elements | Mechanical equipment and document elements stay in their assembled positions, visually subdued |
| Mechanical | Tanks, equipment, pipework, and equipment-support/access elements | Civil foundation stays grounded; document elements remain still |
| Clearances | Abstract document layers and a review/handoff marker | Plant geometry stays assembled; no equipment moves |
| Overview | A restrained, coordinated overview assembly | Base and spatial landmarks remain fixed |

The active group lifts or separates as the viewer scrolls forward, then returns along the same path on reverse scroll. Only the selected workstream receives this scroll-driven transform. At a parked scroll position, all movement stops. Non-selected groups are stationary context, not hidden without explanation. Base contact and attachment relationships must remain intelligible; an exploded study is illustrative and does not depict actual construction sequencing.

Use a single normalized section progress value and a selected-workstream state. Separate each group's assembly transform from its selection emphasis. When switching workstreams midway through the section, interpolate from the current visible transforms to the new target over a suggested 500–700ms; do not recreate the scene, reset scroll, jump the camera, or restart the whole assembly. The previous group settles while the new group becomes active. Camera orientation, model scale, lighting, and base remain constant. Returning to Overview uses the same current progress. Re-selecting an active workstream should have an explicit, consistent Overview action rather than an unexplained reset.

Keep the active label, model highlighting, progress description, and caption synchronized. Explain the selected group's coordination role using confirmed work history; do not invent personal engineering responsibilities, real permits, or a commissioning outcome. Controls remain visible during the section.

### Geometry ownership audit

The current scene already separates civil, mechanical, and clearance groups, but some structure is represented inside the mechanical group. Before implementation, classify objects by their explanatory role: foundations and site/civil elements; equipment, pipework, and equipment-support structures; abstract documentation. Do not classify every vertical column as civil solely from its shape. Confirm any ambiguous real-work attribution or keep the scene generically illustrative. Keep cross-group connectors attached or visually mark their separation during an exploded view.

### Phone and reduced motion

Phones retain the same selected-state meaning without a long pinned scroll. Provide a compact progress control or explicit “Inspect / Return” control if there is insufficient scroll distance for a useful reveal. Reduced motion shows the selected workstream in a stable emphasized view with matching text. The static fallback must reflect the selection through labels/overlays rather than showing a misleading unchanged highlight. All content remains available without WebGL.

### Verification for this addition

Capture Civil, Mechanical, Clearances, and Overview at section start, midpoint, and end; reverse scroll; switch modes at midpoint and near the end. Check that non-selected transforms stay fixed during scrolling, transitions remain continuous, and captions match the selected workstream. Verify support/connector relationships and inspect the generated reference against actual rendered desktop and phone frames. Do not claim the generated image itself is an implemented model.

Implementation order used: establish Vivek selection/scroll continuity, then build the LandSafe and political-analysis chapters below. Local implementation and verification are complete; user-directed visual polish is pending.

## Shared visual system

Keep the homepage order: selected products → Vivek → LandSafe → political analysis → About. Make LandSafe and political analysis two distinct editorial chapters rather than small supporting blocks. Each opens with role, dates, a concrete contribution, evidence strip, and a large spatial illustration. The key contribution and deliverable stay visible without opening a panel.

Use the current cream #fff9ee, forest #365345, rust #642910, amber surround #c88243, Plus Jakarta Sans headings, and Hanken Grotesk body. Match the plant scene's crafted presentation without repeating its construction metaphor. Custom Three.js geometry and HTML text use the existing React/Motion stack; no new asset licence or package is expected.

## Chapter 1 — LandSafe: from scattered records to a clearer decision

Desktop composition: approximately 42% editorial copy and 58% visual. Large isometric tabletop model: a fictional land parcel on a shallow terrain slab, with a few boundary markers, a neutral access path, and three document panels above it. Layer silhouettes must remain distinct at the normal viewing distance. The terrain uses matte sage, boundary markers dark forest, document faces warm paper, and selected edges muted amber. Soft shadows ground the objects. A fixed orthographic three-quarter camera keeps the comparison legible; no free-orbit requirement.

The three document panels represent **Records**, **Field verification**, and **Review report**. They contain generic headings and graphic lines, not original pages. This is an authored workflow illustration, not a real survey, GIS model, title validation engine, or client property.

Opening copy:

“Land records rarely arrive as one clear story. I coordinated field, GIS, and legal workstreams to bring the evidence into a structured property review.”

Always-visible proof strip: **40% shorter verification turnaround · ₹4 lakh early-stage revenue · 20+ properties verified**. These are existing résumé figures about broader work; they are not outcomes inferred from the supplied client report.

Interaction states:

1. **Records** — lift the title-chain and supporting-record panels slightly; highlight their connection to the report. Caption explains ownership-chain organization and encumbrance-document review.
2. **Field verification** — lower those panels, highlight the fictional parcel perimeter and a deliberately offset comparison outline. Explain comparing records with physical observations. Do not animate an uncertain boundary into a “legally correct” boundary.
3. **Review report** — return the parcel to a quiet state and assemble generic report sections into one paper panel: title flow, encumbrances, compliance, physical observations, recommendations. Describe synthesis and specialist escalation; do not show a fabricated safety score or approval stamp.

Three visible buttons select these states. An optional short entrance separates the layers; the default Records state is already understandable when motion is disabled. The active state is authoritative for geometry, highlights, button state, and caption. Nothing endlessly spins.

Below the scene: a visible three-part case strip, **The problem → My contribution → The deliverable**. Optional deeper reading can stay expandable, but the work sample's existence and its key content cannot be hidden.

## Chapter 2 — Political analysis: from field evidence to a leadership briefing

Desktop composition reverses the balance: spatial document scene on the left, editorial copy on the right. A tactile research desk carries an abstract cluster of unlabelled note cards, a working analysis sheet, and a structured briefing folder. Use paper edges, folded tabs, and a slim forest binding for identity. Avoid a generic glowing network, control-room screens, or a literal reconstruction of the private war-room chart.

Opening copy:

“I synthesized research across 15 constituencies into campaign insights and briefing notes for ministers and MLCs.”

Always-visible scope: **15 constituencies · Political Analyst · Jun 2023–Jul 2024**. This is research scope, not a claim of electoral impact.

Interaction states:

1. **Research** — note cards are separated into broad, generic source categories. Caption: constituency research, booth-level analysis, and community engagement. Do not display voter details, demographic segments, actual booth labels, rankings, or tactical recommendations.
2. **Synthesize** — the cards align beside the working sheet; highlight “Question / Evidence / Implication” as a generic analytical structure. Label it an illustrative workflow, not a verbatim internal briefing.
3. **Brief** — the folder opens to a readable HTML preview with generic section labels. Caption covers executive briefing notes, policy research, and debate preparation. No invented quote or unverified recommendation.

Below this scene, a separate visible card reads **A second deliverable: nomination portfolio preparation**. Show a small abstract bound document and three section tabs: profile material, professional record, supporting documentation. Explain Harith's confirmed document-preparation responsibility. Do not present the subject's achievements as Harith's, connect this deliverable causally to campaign outcomes, or imply nomination approval. Omit a specific dossier completion date until the source-date discrepancy is reconciled.

## Motion and construction

Suggested values, not measurements of a reference: scene entrance 700–900ms; state transitions 500–700ms; object movement modest, with no camera roll. Entrance occurs once when the chapter enters view. Button/touch/keyboard selection controls subsequent states. Scroll can reveal the chapter's copy but never overrides a deliberate selection or traps scrolling.

Use layered custom geometry: extruded terrain perimeter, instanced boundary markers, paper stacks with restrained page thickness, and separately hinged folder covers. Preserve physical attachment and clearance; paper should not pass through the desk or cover. HTML headings and captions remain readable independently of WebGL. Consider a constrained sticky visual only on wide/tall screens if the resulting content height justifies it; no long pinned section by default.

Lighting implementation must follow the skill's lighting-direction-and-scale guidance before authoring the rig. Proposed look: soft warm studio key, gentle neutral fill, controlled ambient light, matte materials, and a common ground plane. Inspect highlights and shadows on both paper and terrain; do not add glow as a substitute for form.

## Mobile, access, and performance

- Stack heading and proof strip → scene → three state controls and caption → visible deliverable summary. Target scene height about 280–340px, adjusted after inspection.
- No hover-only behaviour; controls support keyboard, visible focus, and minimum 44px touch targets.
- Reduced motion shows the chosen state immediately. WebGL failure shows a static illustration plus the same controls/text.
- Load scenes near the viewport. Park rendering when stable and off-screen; animate only during meaningful transitions. Do not keep Vivek and both new scenes rendering continuously.
- Keep full copy as HTML. No confidential text in textures, metadata, hidden nodes, accessibility labels, JSON, source maps, or downloadable source PDFs.

## Implementation sequence after approval

1. Verify the served build and direct section anchors; make updated content unmistakable.
2. Build the LandSafe first view and three states; inspect desktop and phone views before creating the second scene.
3. Build the research-to-briefing scene and separate nomination card using the same lighting/material language.
4. Replace the existing supporting-block layout, make anonymized evidence visible, and preserve résumé/product flows.
5. Inspect entrance, mid-transition, every selected state, reset if offered, keyboard operation, reduced motion, WebGL fallback, and section navigation. Check document/terrain joins and label alignment at close-up.
6. Run build/typecheck, targeted responsive browser checks, and a sensitive-identifier scan of public assets and built text. Present desktop/mobile screenshots for visual review. No public deployment is included.

## Acceptance criteria

Within the first view of each chapter, a recruiter can identify the role, what Harith did, and the evidence/deliverable. Each control causes a meaningful visible change and matching explanation. Every essential point is available without animation or expanding a panel. The sections retain the portfolio's warm cinematic identity and reveal no client-specific property or political information.

Approval requested for this design direction before website code changes. This plan uses the 3Dviz skill's workflow and subject-clarity guidance; no catalog kit was retrieved, no scene has been built, and no artistic result is claimed yet.
