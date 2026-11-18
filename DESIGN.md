# Harith Bairagoni Portfolio — Design Direction

> Résumé update: the portfolio now includes the printer-inspired résumé experience documented in [résumé design notes](docs/resume-design.md), using the user-selected Founder’s Office CV Ver3 and original/ATS/plain-text downloads.

> Implementation update, 16 November 2026: the current source implements the later immersive direction. Selected Work now contains only TidyRow and ColdConnect; The Fashion Boardroom is excluded. See [the current build brief](scrollcraft/builds/harith/BRIEF.md) and [implementation and verification notes](scrollcraft/builds/harith/IMPLEMENTATION.md). The original planning document below is retained as history; these newer decisions take precedence.

**Status:** Design proposal for review  
**Prepared:** 16 November 2026  
**Product:** Personal portfolio and case-study site  
**Audience:** Founders and hiring teams recruiting for Founder’s Office, Chief of Staff, Strategy, and Special Projects roles  
**Implementation context:** React 19, Vite, Tailwind CSS 4, Motion  
**Primary reference:** `design landing page _ Havenly — Mental Wellness & Therapy Website Design (1).jpeg`

---

## 1. Executive direction

The portfolio should feel like an intelligent, warm conversation with someone who can enter an ambiguous situation, find the underlying system, and move the work forward.

The visual direction adapts the reference’s strongest characteristics:

- a rounded “page within a page” frame;
- a cinematic, warm-toned hero dominated by one human portrait;
- large, direct typography with restrained supporting copy;
- cream editorial sections separated by curved or layered transitions;
- small pill-shaped labels and controls;
- image-led storytelling rather than dense dashboards;
- generous space and a small number of purposeful interactions.

It should not copy the reference’s therapy content, generic lifestyle imagery, or decorative statistics. Every visual should help explain Harith’s work, judgment, or personality.

### Design thesis

> Warm enough to feel personal. Structured enough to feel strategic. Concrete enough to be credible.

### Primary visitor outcome

Within 30 seconds, a visitor should understand:

1. Harith works across strategy, execution, products, and special projects.
2. He has operated in real, high-ambiguity environments—not only conceptual projects.
3. TidyRow, ColdConnect, and The Fashion Boardroom demonstrate how he thinks.
4. Vivek Bio Products, LandSafe, and Telangana research demonstrate how he operates.
5. He is open to relevant conversations and easy to contact.

---

## 2. Experience principles

### 2.1 Human before technical

Begin with Harith’s face, point of view, and working style. Product screenshots and diagrams should appear after the visitor understands who built them and why.

### 2.2 Evidence before adjectives

Prefer a sample CSV transformation, project artifact, recommendation slide, or coordination map over claims such as “innovative,” “visionary,” or “results-driven.”

### 2.3 One idea per interaction

Every interactive element must answer a clear question:

- TidyRow: What changed between the original and cleaned file?
- ColdConnect: How does preparation move from research to rehearsal to follow-through?
- Vivek Bio Products: What did coordination between workstreams look like?
- LandSafe: What discrepancy appears when two records are compared?
- Telangana research: How did evidence become a briefing point?

### 2.4 Calm confidence

The page should have visual personality without behaving like a game. Remove secret-vault mechanics, bouncing badges, decorative live clocks, excessive pulses, and interactions that reward exploration without improving understanding.

### 2.5 Complete without motion

The narrative must remain fully understandable when animation is disabled, JavaScript is delayed, or the visitor uses reduced-motion settings.

---

## 3. Information architecture

### Primary navigation

`Work · Experience · About · Contact · Résumé`

- **Work** scrolls to Selected Work.
- **Experience** scrolls to professional experience.
- **About** scrolls to the personal narrative and bookshelf.
- **Contact** scrolls to the closing invitation.
- **Résumé** opens the current résumé in a new tab or downloads the PDF. It remains visually available at all times.

Do not include separate Photos, ColdConnect, or Vault navigation items. Photos support the narrative; ColdConnect belongs under Work; the Vault does not support the hiring journey.

### Homepage sequence

```text
Availability strip
Navigation
Hero
Curved proof transition
Selected Work
Experience
About
Books I’d lend a friend
Contact
Footer
```

### Secondary pages

```text
/work/tidyrow
/work/coldconnect
/work/fashion-boardroom
/resume or public résumé PDF
```

Each case-study page uses the same sequence:

```text
Project masthead
Artifact or product screenshot
Problem
My contribution
Decision and evidence
Result / current status
What I would change
Next project
```

---

## 4. Global page frame

### Desktop

- Browser canvas: warm amber gradient.
- Main site shell: maximum width `1440px`.
- Outer margin: `24px` at 1280px and above.
- Shell radius: `32px`.
- Shell border: 1px translucent cream.
- Shell shadow: broad and subtle; never a floating-card shadow on every section.
- Content container: maximum width `1200px`.
- Main grid: 12 columns, `24px` gutters.
- Section padding: `112–144px` vertically.

### Tablet

- Outer margin: `12px`.
- Shell radius: `24px`.
- Content padding: `32px`.
- Main grid: 8 columns, `20px` gutters.

### Mobile

- Full-width canvas with no decorative outer margin.
- Shell radius: `0` or `20px` only on the opening hero’s lower corners.
- Content padding: `20px`.
- Main grid: 4 columns, `16px` gutters.
- Section padding: `72–88px` vertically.
- No horizontal scrolling or clipped essential copy.

---

## 5. Visual system

### 5.1 Color palette

The palette borrows the reference’s warmth while retaining the existing portfolio’s grounded green as a secondary signal.

| Token | Value | Use |
|---|---:|---|
| `--canvas-warm` | `#D58A43` | Desktop surround and opening atmosphere |
| `--hero-deep` | `#5A240D` | Dark edge of hero gradient |
| `--hero-rust` | `#9A4319` | Primary hero field |
| `--hero-amber` | `#D98B38` | Light source and warm accent |
| `--paper` | `#FFF9EE` | Primary page surface |
| `--paper-warm` | `#F4E8D2` | Alternate section surface |
| `--paper-white` | `#FFFEFA` | Cards and high-clarity surfaces |
| `--ink` | `#1D1A17` | Primary text |
| `--ink-soft` | `#625B52` | Secondary text; verify 4.5:1 contrast |
| `--brown` | `#6F2F12` | Strong buttons, dark section fields |
| `--forest` | `#31483B` | Secondary accent and work-system diagrams |
| `--sage` | `#98A78F` | Quiet highlights; not body text |
| `--line` | `#D8CCBC` | Borders and separators |
| `--focus` | `#1E5F8C` | Keyboard focus ring, chosen for visibility |
| `--error` | `#A12B25` | Errors only |

#### Color rules

- Use cream text on the dark hero and brown fields.
- Use `--ink` for all important body copy on paper backgrounds.
- Never use amber or sage alone for small text.
- Use color as atmosphere; use labels, icons, or patterns to communicate state.
- Do not assign a different bright brand color to every project.

### 5.2 Gradients

Hero:

```css
background:
  radial-gradient(circle at 72% 42%, rgba(244, 179, 92, .92), transparent 33%),
  linear-gradient(112deg, #5A240D 0%, #943F18 48%, #D98B38 100%);
```

Canvas surround:

```css
background: linear-gradient(180deg, #E7A85F 0%, #C36C2E 38%, #6F2F12 100%);
```

Avoid gradients on every card. The hero and closing contact section are the two primary color moments.

### 5.3 Typography

The reference relies on modern, direct sans-serif typography. The portfolio should follow that clarity while retaining one restrained editorial accent.

| Role | Typeface | Weight | Notes |
|---|---|---:|---|
| Display and headings | Manrope | 500–600 | Modern, rounded, clear; use tight tracking |
| Body and UI | Inter | 400–600 | Existing font; dependable at small sizes |
| Editorial accent | Instrument Serif | 400 | Pull quotes, one-line reflections, project numerals only |

Remove JetBrains Mono from general labels. Compact uppercase Inter labels feel closer to the reference and remain easier to read.

#### Type scale

| Style | Desktop | Mobile | Line height |
|---|---:|---:|---:|
| Hero | `72–88px` | `46–54px` | `0.98–1.04` |
| Section title | `52–64px` | `36–42px` | `1.02–1.10` |
| Project title | `34–44px` | `28–34px` | `1.08–1.15` |
| Lead paragraph | `19–22px` | `17–19px` | `1.45–1.55` |
| Body | `16–18px` | `16px` | `1.55–1.70` |
| Label | `12–13px` | `12px` | `1.2` |

Keep body text at 16px minimum. Limit long text lines to `62–68ch`.

### 5.4 Shape language

- Page shell: `32px` radius.
- Hero and major media: `24px` radius.
- Project cards: `20px` radius.
- Pills and primary CTAs: fully rounded.
- Small information blocks: `12–14px` radius.
- Use one-pixel borders more often than shadows.
- Do not put every paragraph inside a bordered card.

### 5.5 Iconography

- Use Lucide icons already present in the project.
- Standard icon size: `18–20px`.
- Icon-only controls require accessible names and visible tooltips.
- Do not use emojis, stars, or decorative icons as evidence markers.

---

## 6. Core components

### Availability strip

A slim cream strip above the navigation inside the shell.

**Copy:** `Open to Founder’s Office, Strategy & Special Projects roles`  
**Action:** `Start a conversation ↗`

- Height: `36–40px`.
- Centered on desktop; left-aligned on mobile.
- Hide secondary action on screens below 375px if necessary.
- This replaces the reference’s promotional banner with useful portfolio status.

### Navigation

- Transparent over the hero at the top.
- Becomes a lightly blurred cream pill after leaving the hero.
- Brand left: `Harith Bairagoni`.
- Links center or right.
- Résumé is the visually distinct cream button in the dark hero state.
- Mobile uses a labeled `Menu` button with a full-height sheet; no icon-only hamburger.
- Active section indicator uses a small underline or dot, not a large color change.

### Section eyebrow

Small bordered pill containing an icon and label, such as `Selected work` or `Experience`.

- Height: `30–32px`.
- Border: `--line` on light surfaces; translucent cream on dark surfaces.
- Text: 12px Inter Medium.
- Use once per section, not above every subsection.

### Buttons

**Primary:** cream on dark surfaces or brown on light surfaces.  
**Secondary:** transparent with one-pixel border.  
**Text link:** sentence case plus arrow.

- Minimum touch target: `44 × 44px`.
- Arrow moves `3–4px` on hover.
- Active state scales to `0.98` for a brief tactile response.
- Keyboard focus uses a two-pixel `--focus` outline plus two-pixel offset.

### Artifact frame

A reusable container for screenshots, CSV samples, slides, maps, and diagrams.

- Warm-white background.
- 1px border.
- 16–20px radius.
- Fixed aspect ratio declared before the image loads.
- Optional top rail contains `Artifact`, `Illustrative`, or `Demo data` labels.
- Never use a browser-window decoration unless it helps identify a real web product.

### Proof stat

Use only for confirmed, properly scoped information.

```text
₹152 Cr
project scale
```

The label must distinguish project scale from Harith’s personal responsibility. No vanity numbers or fabricated precision.

---

## 7. Homepage specification

## 7.1 Hero

### Purpose

Establish Harith’s face, point of view, breadth, and next action in one screen.

### Desktop composition

- Hero occupies `760–820px`, depending on viewport height.
- Left column: 5 of 12 columns.
- Right portrait: 7 of 12 columns, visually bleeding into the lower edge.
- Text aligns left; portrait is large and expressive, not a small profile card.
- A translucent working-style card may overlap the lower-right portrait edge.
- Three short proof chips sit along the lower-left edge.

### Proposed copy

**Eyebrow:** `Strategy · Products · Execution`

**Headline:**  
`I like being thrown into problems without an instruction manual.`

**Supporting copy:**  
`I’ve coordinated work on an ethanol plant, built a tool for messy CSV files, and designed a product for preparing for high-stakes conversations.`

**Primary CTA:** `Explore how I think`  
**Secondary CTA:** `View résumé`

### Working-style overlay

Replace the reference’s mood selector with a static, human proof card:

```text
What I’m useful for
Ambiguous briefs · Cross-functional work · Building from zero
```

This is informational, not a quiz.

### Portrait requirements

- Use one high-resolution portrait with warm directional light.
- Subject should look toward the headline or slightly upward, creating compositional flow.
- Photograph should feel candid and confident rather than corporate.
- Provide AVIF and WebP variants plus JPEG fallback.
- Art direction needs separate mobile crop.

### Mobile

- Copy first, portrait second.
- Headline maximum four to five lines.
- Buttons stack only below 360px; otherwise remain side by side.
- Working-style card becomes a full-width strip beneath the portrait.
- No mouse parallax or scroll-driven outward movement.

---

## 7.2 Curved proof transition

### Purpose

Bridge the human hero into the work narrative using artifacts from Harith’s real projects.

### Composition

A cream section rises over the hero with a broad arc. Five small artifact cards follow the curve:

1. TidyRow before/after CSV.
2. ColdConnect preparation screen.
3. Vivek Bio Products site or approved industrial image.
4. LandSafe fictional parcel comparison.
5. The Fashion Boardroom recommendation slide.

The cards should feel like selected evidence on a desk—not a carousel of stock portraits.

### Center statement

**Eyebrow:** `How I work`  
**Heading:** `Find the system. Make the decision clear. Move the work forward.`

**Body:** One sentence connecting engineering, field research, operations, and product work.

### Proof row

Use no more than four confirmed proof points. Candidate set:

- `3` featured cases.
- `₹152 Cr` project scale.
- `15` constituencies researched.
- `1st` place, Fashion Boardroom.

Each requires source confirmation before publication.

### Responsive behavior

- Desktop: cards follow a gentle arc.
- Tablet: shallow fan of three visible cards plus two partially behind.
- Mobile: a two-by-two grid plus one full-width card. Do not create sideways scrolling.

---

## 7.3 Selected Work

### Section introduction

**Eyebrow:** `Selected work`  
**Heading:** `Three problems. Three different ways of making progress.`

Use three editorial case rows instead of equal dashboard cards.

### Case 01 — TidyRow

TidyRow is the lead case and receives the largest initial artifact.

**Layout:** Copy left, interactive before/after table right.  
**Key question:** How do you make messy CSV cleanup understandable and reversible?  
**Interaction:** Toggle `Original` and `Cleaned`, or drag a divider where keyboard alternatives are provided.  
**Visible information:** Problem, Harith’s contribution, one product decision, status.  
**CTA:** `Read the TidyRow case`.

Do not claim transformations that are not implemented or verified. Confirm the strongest product decision before final copy.

### Case 02 — ColdConnect

**Layout:** Warm forest field with product screenshot on the left and narrative on the right.  
**Sequence:** `Prepare → Rehearse → Follow through`.  
**Interaction:** Clicking each step swaps one representative screen and two lines of explanation.  
**Demo:** Keep one fictional contact and label all generated examples as sample output.  
**CTA:** `Try the guided demo` and secondary `Read the case`.

Avoid opening the complete existing demo by default. A guided preview should come first; the full prototype is optional depth.

### Case 03 — The Fashion Boardroom

**Layout:** Large original slide or competition photo, with a narrow decision timeline.  
**Interaction:** Reveal the shift from influencer/UGC thinking to professional piercers, dermatologists, and factory visits.  
**Result:** Attribute first place and recommendations to the team.  
**CTA:** `See how the recommendation changed`.

### Shared case-row rules

- Alternate media direction only when it preserves reading order.
- Keep problem and contribution visible without interaction.
- One interaction per case.
- Use `aria-expanded` for disclosures.
- Use real artifacts wherever possible.
- Close each row with a plain-language lesson, not a slogan.

---

## 7.4 Experience

### Section introduction

**Eyebrow:** `Experience`  
**Heading:** `Operating when the problem is real and the path is unclear.`

### Composition

Vivek Bio Products is a full-width feature. LandSafe and Telangana form a paired row below it.

```text
┌──────────────────────────────────────────────────────┐
│ VIVEK BIO PRODUCTS                                   │
│ role + dates + contribution     coordination drawing │
└──────────────────────────────────────────────────────┘
┌──────────────────────────┐ ┌─────────────────────────┐
│ LANDSAFE                 │ │ TELANGANA RESEARCH      │
│ parcel comparison        │ │ briefing reconstruction│
└──────────────────────────┘ └─────────────────────────┘
```

### Vivek Bio Products

- Label: `Industrial execution`.
- Role and dates visible immediately.
- Personal contribution separated from project scale.
- Visual: blueprint with three lanes—Civil works, Mechanical installation, Clearances.
- Interaction: `See what I coordinated` highlights one lane and its handoff to a shared readiness checkpoint.
- Caption: `Illustrative coordination map—replace with a confirmed project handoff before publication.`

### LandSafe

- Label: `Operations and venture building`.
- Visual: fictional parcel with two record boundaries.
- Interaction: `Compare records` reveals the discrepancy and a short review note.
- Do not present fictional scores, coordinates, exposure protected, or deterministic verification as real evidence.

### Telangana election research

- Label: `Field research and decision support`.
- Visual: stack of briefing pages.
- Interaction: `See the briefing point` reveals `Question → Evidence → Briefing point`.
- Use an approved excerpt or label it `Illustrative reconstruction`.

### Remove from the current implementation

- Four-stage capital scrubber with unsupported engineering detail.
- Simulated land provenance scores and precise coordinates.
- Duplicate inline expansion plus modal documentation.
- Equal visual weight for all three experiences.
- “Full documentation” language unless documentation is publicly available.

---

## 7.5 About

### Purpose

Explain the connective tissue across mechanical engineering, industrial execution, political research, entrepreneurship, and product building.

### Composition

- Warm paper section with a large candid portrait or two-image editorial collage.
- Copy occupies a maximum of 6 columns.
- One short pull quote in Instrument Serif.
- A small “currently” card can contain location, current focus, and availability.

### Copy structure

1. First-person opening: how Harith approaches unfamiliar problems.
2. Two short paragraphs connecting the transitions in his path.
3. Three working principles, each one sentence.
4. Link to résumé.

Avoid uploading or replacing photos from the public interface. Photo management belongs in the repository or a private CMS, not on the published portfolio.

---

## 7.6 Books I’d lend a friend

### Composition

A low wooden or paper-toned shelf sits beneath About.

- Desktop: four vertical spines in one row.
- Tablet: four smaller spines or two-by-two.
- Mobile: two-by-two grid.
- Selecting a book opens an adjacent note, not a blocking modal.
- The selected state uses position, border, and text—not color alone.

### Book order

1. *Zero to One* — Peter Thiel with Blake Masters.
2. *Positioning: The Battle for Your Mind* — Al Ries and Jack Trout.
3. *Dopamine Detox* — author and edition to confirm.
4. *The Power of Your Subconscious Mind* — Joseph Murphy.

### Note template

```text
What stayed with me
[Harith’s personal takeaway in 1–2 sentences]

I’d lend it to
[A specific kind of person or situation]
```

The note must use Harith’s real takeaway rather than generic summaries.

---

## 7.7 Contact

### Composition

A dark brown closing section echoes the hero and completes the color journey.

**Eyebrow:** `Start a conversation`  
**Heading:** `If the problem is messy, cross-functional, and worth solving, I’d like to hear about it.`

Role chips:

- Founder’s Office
- Chief of Staff
- Strategy
- Special Projects

Primary CTA: `Email Harith`  
Secondary links: `LinkedIn`, `Résumé`

### Contact behavior

- Use a direct mail link unless a maintained form backend exists.
- Show the email address in text so visitors can copy it.
- Do not hide contact details behind an animation or modal.
- Include a short response expectation only if Harith wants to commit to it.

---

## 7.8 Footer

- Name and location.
- `Designed and built by Harith Bairagoni` if accurate.
- Last updated month and year.
- LinkedIn, email, résumé.
- Small `Back to top` action.
- No live status indicator unless it reflects real state.

---

## 8. Case-study page template

Each case page should feel related to the homepage but allow denser reading.

### Masthead

- Breadcrumb: `Work / TidyRow`.
- Project title and one-sentence thesis.
- Role, timeframe, status, collaborators.
- Primary artifact occupying at least half the first viewport.

### Body grid

- Sticky chapter index on desktop.
- Main reading column: maximum `760px`.
- Evidence rail: `280–320px` for screenshots, notes, and facts.
- Mobile collapses to one reading column in DOM order.

### Chapters

1. The situation.
2. What I owned.
3. What I learned from users or evidence.
4. The decision.
5. How the product or recommendation changed.
6. Result and current status.
7. What I would change now.

### Evidence labels

- `Product behavior` — verified in the current build.
- `Sample output` — generated or fictional demonstration.
- `Illustrative reconstruction` — recreated to protect confidentiality or fill an unavailable artifact.
- `Team recommendation` — not an individual claim.
- `Project scale` — contextual scale, not personal ownership.

---

## 9. Motion system

Motion should direct attention and clarify relationships. Use Motion already installed; do not add GSAP unless a later prototype proves Motion cannot deliver the required behavior.

### Motion tokens

| Token | Duration | Easing | Use |
|---|---:|---|---|
| `--motion-fast` | `160ms` | ease-out | Color, border, icon feedback |
| `--motion-base` | `260ms` | cubic-bezier(.2,.8,.2,1) | Buttons, tabs, disclosures |
| `--motion-enter` | `420ms` | cubic-bezier(.16,1,.3,1) | Section/media entrance |
| `--motion-story` | `600ms` | cubic-bezier(.16,1,.3,1) | Hero and artifact choreography |

### Approved patterns

- Hero portrait fades and settles upward by 16px.
- Headline lines reveal with a short stagger on first load.
- Curved artifact cards rotate into their final positions once.
- Project artifacts crossfade when a step changes.
- Buttons provide immediate hover, active, and focus feedback.
- Experience diagrams trace or highlight the selected relationship.

### Avoid

- Scroll-jacking.
- Continuous bobbing or pulsing.
- Animating every card when it enters view.
- Height animation on long content.
- Mouse-following parallax on essential elements.
- Motion that changes reading order.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:

- render all content in its final visible state;
- disable parallax, fan rotation, tracing, and smooth scrolling;
- retain instant state changes and focus feedback;
- do not hide information behind hover.

---

## 10. Responsive behavior

### Breakpoints

Use content-driven breakpoints aligned to the existing Tailwind system:

- Base: `0–639px`.
- Small: `640px+`.
- Medium: `768px+`.
- Large: `1024px+`.
- Extra large: `1280px+`.

### Rules

- Visual order and DOM order must agree.
- Alternate case rows should return to `copy → media` on mobile.
- All tap targets are at least 44px.
- No body text below 16px.
- Pills may wrap; their labels must not truncate silently.
- Diagrams need text summaries beneath them.
- Decorative arcs may crop, but artifacts and text may not.
- Sticky navigation must not cover anchor targets; use `scroll-margin-top`.
- Test at 320, 375, 768, 1024, and 1440px.

---

## 11. Accessibility requirements

- Meet WCAG 2.2 AA for text and interactive controls.
- Maintain 4.5:1 contrast for normal text and 3:1 for large text and control boundaries.
- Include a visible `Skip to content` link.
- Use semantic landmarks: header, nav, main, section headings, footer.
- Preserve a logical heading hierarchy with one H1.
- All interactions work with keyboard alone.
- Visible focus must never be removed.
- Use `aria-expanded`, `aria-controls`, and accessible names for disclosures.
- Provide useful alternative text for meaningful images; decorative images use empty alt text.
- Do not rely on hover, color, or animation alone.
- Announce dynamic demo changes only when the update matters to screen-reader users.
- Dialogs, if retained, need focus trapping, Escape close, labeled title, and focus return.

---

## 12. Performance requirements

- Target LCP below 2.5 seconds on a mid-range mobile connection.
- Reserve image dimensions to keep CLS below 0.1.
- Hero portrait: preload only the exact responsive candidate required above the fold.
- Other images: lazy-load and decode asynchronously.
- Provide AVIF and WebP, with compressed fallback.
- Avoid base64 image storage in localStorage.
- Pause or avoid offscreen animation work.
- Use CSS transforms and opacity for motion.
- Split full ColdConnect demo and case-study modules from the initial homepage bundle.
- Profile before memoizing; keep components focused and typed.

---

## 13. Content integrity

Before publication, every metric or outcome must be assigned one of these statuses:

- **Verified:** Supported by a résumé, artifact, repository behavior, or source Harith can stand behind.
- **Contextual:** Describes project or team scale, clearly separated from personal ownership.
- **Illustrative:** A fictional or reconstructed example, visibly labeled at the point of use.
- **Remove:** Unsupported precision or a claim that cannot be responsibly explained.

### Current claims requiring review

- Vivek Bio Products engineering quantities, milestone status, defect rates, safety results, and commissioning details.
- Personal attribution for project-wide schedule or financial outcomes.
- LandSafe coordinates, provenance scores, title-verification certainty, and exposure protected.
- ColdConnect timing, scoring, and AI reliability claims not demonstrated by the current build.
- Any usage, adoption, revenue, or customer outcome not supported by evidence.

The design must make labels such as `Illustrative example` and `Sample output` feel intentional rather than apologetic.

---

## 14. Asset plan

### Required before implementation is final

1. Hero portrait with landscape desktop crop and portrait mobile crop.
2. TidyRow original and cleaned sample files/screens.
3. Three ColdConnect screens: Prepare, Rehearse, Follow through.
4. Fashion Boardroom original slide or approved reconstruction.
5. Vivek Bio Products approved site photograph or neutral blueprint base.
6. LandSafe fictional parcel base map.
7. Telangana approved excerpt or reconstructed briefing sheet.
8. One candid About photograph.
9. Current résumé PDF.
10. Book cover images only if licensing and consistency are acceptable; otherwise use typographic spines.

### Image treatment

- Warm photographs, natural skin tones, restrained grain.
- Avoid heavy orange filters that flatten contrast.
- Screenshots remain color-accurate inside neutral artifact frames.
- Industrial and research images should feel documentary, not stock-like.
- Never generate evidence-looking project photos and present them as real.

---

## 15. Mapping from the current codebase

| Current component | Proposed action |
|---|---|
| `Navbar.tsx` | Simplify to five primary items; add availability strip and mobile sheet |
| `portfolio-scroll-hero.tsx` | Replace workspace-object collage, clock, upload controls, and mouse parallax with portrait-led hero |
| `PhotoGalleryBento.tsx` | Remove as a standalone section; reuse selected images and artifacts in the curved proof transition and About |
| `WorkExperienceSection.tsx` | Rebuild as one Vivek feature plus paired LandSafe and Telangana stories |
| `IndustrialScrubberSandbox.tsx` | Replace with scoped coordination blueprint |
| `CadastralVerificationSandbox.tsx` | Replace with fictional boundary comparison and clear label |
| `ProjectsSection.tsx` | Expand into three Selected Work case rows led by TidyRow |
| `ColdConnectDemo.tsx` | Lazy-load behind a guided three-step preview |
| `AboutSection.tsx` | Remove public upload behavior; rewrite as narrative plus portrait |
| `ResumeSection.tsx` | Remove the long homepage résumé; provide a compact résumé link or dedicated page/PDF |
| `ContactSection.tsx` | Rebuild as the dark closing invitation |
| `DossierClearance.tsx` | Remove |
| `SecretVaultModal.tsx` | Remove from the primary experience |

### New components

```text
SiteFrame
AvailabilityStrip
HeroPortrait
ArtifactArc
ProofStatRow
SelectedWorkSection
CaseStudyRow
BeforeAfterArtifact
ExperienceFeature
ParcelComparison
BriefingReveal
BookShelf
ContactPanel
CaseStudyLayout
EvidenceLabel
```

---

## 16. Recommended implementation sequence

### Phase 1 — Foundation

- Confirm public name spelling and contact details.
- Audit and classify all claims.
- Add tokens, typography, site shell, navigation, and accessibility primitives.
- Prepare responsive image pipeline.

### Phase 2 — First 30 seconds

- Build availability strip, hero, and curved proof transition.
- Validate portrait crop and copy on mobile and desktop.
- Test navigation and résumé access.

### Phase 3 — Core evidence

- Build TidyRow, ColdConnect, and Fashion Boardroom rows.
- Add labels for demo data, team work, and illustrative reconstruction.
- Build case-study page template.

### Phase 4 — Experience

- Build the Vivek coordination map.
- Build LandSafe comparison.
- Build Telangana briefing reveal.
- Validate every public claim.

### Phase 5 — Personality and conversion

- Build About and bookshelf.
- Build contact close and footer.
- Add final motion and reduced-motion behavior.

### Phase 6 — Quality pass

- Keyboard-only audit.
- Screen-reader landmark and control audit.
- Contrast audit.
- Responsive checks at required widths.
- Performance profile and image optimization.
- Content proofread and source verification.

---

## 17. Acceptance criteria

The redesign is ready to publish when:

- A first-time visitor can describe Harith’s positioning after the hero and first transition.
- TidyRow, ColdConnect, and The Fashion Boardroom are visible as the three selected cases.
- Vivek Bio Products clearly leads Experience.
- Project scale and personal responsibility are visually and verbally separated.
- Every illustrative or sample artifact is labeled at the point of use.
- The page works completely with reduced motion and keyboard navigation.
- No public upload controls, secret-vault mechanics, autoplaying demos, or unsupported precise claims remain.
- Mobile has no horizontal overflow at 320px.
- The hero image does not cause layout shift.
- Contact and résumé are accessible from the navigation and final section.

---

## 18. Open decisions before build

1. Confirm whether the public display name is **Harith Bairagoni** or **Bairagoni Harith**.
2. Select the hero portrait and approve its desktop/mobile crops.
3. Confirm the strongest product decision for TidyRow.
4. Confirm which Fashion Boardroom artifact can be published.
5. Confirm one real Vivek Bio Products handoff or approve the illustrative label.
6. Confirm whether a Telangana excerpt can be shared.
7. Provide personal notes for the four books.
8. Confirm the résumé file and public LinkedIn URL.

Until those decisions are resolved, implementation can use clearly labeled placeholders but should not invent final content.
