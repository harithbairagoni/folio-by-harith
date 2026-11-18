# Portfolio intake — handoff

Source: selected Founder’s Office CV Ver3, transcribed in `src/data/resume.json`; user messages; conversation handoff as contextual notes. Existing assistant-written website copy is not evidence of personal ownership. Required intake fields are filled; optional evidence gaps remain below.

TidyRow and ColdConnect are the two selected hero projects. Fashion Boardroom is excluded as requested. Sorting fields deliberately remain empty. No deployment or application code was changed.

| Field | Missing | Why it matters | Fix in 10 minutes |
| --- | --- | --- | --- |
| Hero projects: number | TidyRow and ColdConnect outcomes or scale | Establishes evidence without invented traction | Supply users, files, tests, interviews, or state no measurement yet |
| Projects: proof_url | Public proof for TidyRow, carbide tool-life, and MLC nomination; working ColdConnect live demo | Lets a visitor inspect the work | Supply a public demo, redacted document, or screenshot. ColdConnect public GitHub repo is recorded; its only Vercel deployment is ERROR |
| contact.linkedin | Selected résumé LinkedIn retained; older homepage differs | Avoids sending visitors to an outdated account | Check the résumé profile is the preferred public profile |
| Testimonials | No authentic quotes supplied | Adds corroboration | Ask a colleague for two lines; do not draft their quote |
| me.location | Current base | Helps recruiters assess fit | Supply current city or skip |
| Work/internship projects: team_size | Team sizes unknown | Clarifies ownership | Supply sizes or skip |
| Project dates | Schema has no project date fields | Preserves chronology for later case studies | Source dates: tool optimization Feb–Apr 2023; MLC dossier Sep–Oct 2023; product dates not supplied |
| Project cover, shots, writeup | Product screenshots and case covers missing; anonymized LandSafe diligence and nomination writeups now exist | Provides inspectable visual evidence | Capture product screens with safe data; do not use original client pages as public screenshots |
| Photos: candids | No additional images selected | Optional personal context | Select originals; use consistent light/background for headshots |
| Logos: worked_with, tools | No employer/tool logos selected | Keeps brand use authentic | Supply transparent SVG/PNG files; existing public/brand/tidyrow-icon.svg is a product mark, not an employer/tool logo |
| me.unusual; outside links/photos | Connection between outside activities and target role unknown | Makes About personal and grounded | Describe one activity and the connection; supply evidence or skip |
| education: school year | All Saints completion year unknown | Completes chronology | Supply year or skip |
| wins: year | Award years unknown | Dates achievements accurately | Supply years or skip |
| contact.calendar_url | No scheduling link supplied | Optional contact convenience | Supply link or skip |

## Target companies — user preference, 17 November 2026

Prefers startups with good valuations, probably Series A or Series B. No named target companies; target_companies deliberately remains empty. No valuation threshold or industry restriction was supplied. This company-stage preference fills me.domain without inventing an industry focus.

## TidyRow — user account, 17 November 2026

Built solo, starting as a college project. Problem: cleaning messy spreadsheets into structured data. The key decision was ease of use for data analysts who are not tech savvy. User reports one-click formatting for HubSpot and Salesforce, testing with real company sales and performance metrics files, and a demo file included in the platform. This records the user's feature account; independent platform import validation has not been established. No test count, adoption figure, time saving, or public demo URL was supplied. Learning: the project developed how Harith thinks about a problem. Required problem/contribution/role fields and team size are now filled.

## ColdConnect — user account and account lookup, 17 November 2026

Solo personal project for tracking professional connections, preparing relevant questions before meetings, following up through LinkedIn and Gmail, and scheduling next meetings. Self-tested; no other tester counts, adoption, or outcome measures supplied. This records the user's intended workflow; automated sending, calendar integration, and end-to-end reliability have not been independently verified. Required problem/contribution/role fields and team size are now filled.

GitHub metadata confirms `https://github.com/harithbairagoni/coldconnect` is public; stored as proof_url. Vercel account lookup found project coldconnect and verified domain `coldconnect-pink.vercel.app`, but the only production deployment was ERROR (commit `8fb901bd42dbd538c4fd5e8c4d9a68c2ac18fa1f`). The domain is not presented as a working demo. No deployment changes were made.

## MLC nomination portfolio — user account, 17 November 2026

Harith confirmed responsibility for preparing the MLC portfolio sent to the Legislative Council for formal nomination and approval proceedings. The role field describes this responsibility, not an invented formal job title. Supporting life-event documentation and records come from the selected résumé. Submission is established; approval outcome is not claimed. Team size and shareable proof remain unknown.

## Files and image quality

- Inspected and copied the user-selected portrait unchanged to `assets/me/headshot.jpg`: JPEG, 2336 × 3098, above the 1600px width guideline.
- Existing edited delivery assets `public/photos/harith-cutout.webp` (1088px wide) and `public/photos/harith-about.webp` (700px wide) are below 1600px; the original is retained for intake.
- Plant poster is an illustrative render, not a real project photograph. Portfolio verification screenshots are not product proof.
- `contact.resume_url` is an existing local source PDF path, not a published URL. Use the ATS PDF already in `public/resume/` for ATS download; public deployment URL remains pending.
- Empty asset directories were created for the four projects, employer/tool logos, and optional writeups. File paths in portfolio.json were checked against disk.

## Bio draft for review (under 60 words)

From mechanical engineering and plant operations to field research and building products, I like making sense of unfamiliar problems. I co-founded LandSafe and built TidyRow and ColdConnect to simplify spreadsheet cleanup and managing professional connections. I’m looking to bring that approach to a Founder’s Office or Chief of Staff role at a startup.

Revised at the user's request against the current homepage's About and Selected Work sections, using the user's confirmed product ownership. Keeps the portfolio's theme of making unfamiliar problems useful; replaces the résumé-style education chronology. Funding-stage terms removed from the bio at the user's request. 52 words.

User accepted the revised bio and confirmed public name **Harith Bairagoni** and email **harith.bairagoni2027@mastersunion.org** on 17 November 2026. Those values already match portfolio.json. The existing portfolio hook is retained. The website still has older contact links; synchronize them during implementation.

Next: run folio-sort.
