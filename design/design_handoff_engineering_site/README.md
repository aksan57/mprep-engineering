# Handoff: MPrep Engineering Website

## Overview
A multi-page marketing, portfolio and tools site for **MPrep Engineering** (Material Preparation Engineering), a CAD / FEA / CFD / thermal-analysis consultancy run by Ilham Aksan Maulana (M.Sc. Chemistry, Universitas Indonesia). The site has 10 pages switched by hash routing. **CZ-R4 crystal-growth furnace** is the published case study. All copy is in English, and no Indonesian version is planned.

Target market: Indonesian university labs, BRIN, oil & gas / EOR labs, nickel downstream and battery-materials industry, biomass and activated-carbon producers, and road-material suppliers.

## About the Design Files
`Engineering Consultancy Site.dc.html` is a **design reference built in HTML**. It shows the intended look, content and behavior, but it is not production code to ship. Recreate it in a real codebase. If no project exists yet, use **Next.js (App Router) + TypeScript**: it gives SSR/SEO, one route per page and static export for cheap hosting. Use CSS Modules or Tailwind.

To view the reference, serve this folder (`python3 -m http.server`) and open the HTML. Use a server: it loads assets by relative path, and `file://` breaks that.
- `support.js` is the prototype runtime only. Do not port it.
- `media-slot.js` and `image-slot.js` are prototype upload widgets. Rebuild their **behavior** (see MediaSlot) as real components driven by content data. Drop the upload UI on the public site.

**Content rule:** every number, name and claim on the site is real and supplied by the client. Don't invent clients, certifications, testimonials or results. Projects 02–19 and the blog posts are honestly labelled "In development" / "Coming soon". The client will fill these in later, so keep the labels.

## Fidelity
**High-fidelity.** Match colors, type, spacing, copy and behavior exactly. The exact copy lives in the HTML template and in the data arrays inside the `<script data-dc-script>` logic class.

## Suggested project structure
```
app/
  layout.tsx            Sidebar (desktop) / MobileHeader + Drawer, Footer, fonts, metadata
  page.tsx              Home
  services/ projects/ projects/cz-r4/ process/ pricing/ tools/
  calculators/ about/ blog/ contact/
components/  Sidebar, NavItem, Logo, MediaSlot, ModelViewer, DrawingViewer, Fraction,
             CalculatorCard, PricingCard, ProjectCard, FilterPills, QuoteForm, …
data/        services.ts equipment.ts projects.ts roadmap.ts posts.ts plans.ts tools.ts
             about.ts czr4.ts calculators.ts
lib/         calc/format.ts (sig-fig + unit scaling), calc/validate.ts
public/      assets/ models/ docs/
```
Routing: the prototype uses `#/home`, `#/services` and so on. Use real routes in production (`/`, `/services`, …, `/projects/cz-r4`).

## Design Tokens
**Colors**
- Navy (hero, contact, CTA bands, logo): `#102A43` · Logo navy `#10213A` · Footer `#0C2236` · Dark image well `#1F2933`
- Teal (primary buttons, active nav, bullets, featured border): `#00A6A6`, hover `#008F8F` · Teal text on light `#007A7A` · Teal on dark `#2EC4C4`
- Page bg `#F5F8FA` · Cards `#FFFFFF` · Tint panel `#EAF0F4`
- Ink `#102A43` · Body `#263238` · Secondary `#334E68` / `#486581` · Muted `#627D98` · Faint `#829AB1`
- On-dark text: `#F5F8FA`, `#BCCCDC` (body), `#9FB3C8` (muted), `#CFE6EA` (links)
- Lines: `rgba(16,42,67,.08/.10/.12/.15/.22/.25)`
- Status colors:
  - Error `#A33A2A`
  - Amber warning: bg `#FBF3E2` / border `#D9B26A` / text `#4A3410`
  - Red warning: `#FBE9E7` / `#E3A196` / `#7A1F12`
  - Success: `#E6F5F0` / `#7FC8B4` / `#0F3D33`
- Focus ring: `2px solid #2EC4C4`, offset 2px

**Type** (Google Fonts)
- UI: **IBM Plex Sans** 300–600 · Labels, values, formulas: **IBM Plex Mono** 400/500
- Logo only: **Archivo 800** ("MPrep") + **JetBrains Mono 500** ("ENGINEERING", letter-spacing .42em)
- Sizes:
  - H1 clamp(36px,4.6vw,62px)/1.04, weight 500, -0.02em
  - H2 clamp(30px,3.4vw,46px)/1.08, weight 500, -0.02em
  - H3 17–24px, weight 500
  - Body 15–17px/1.65
  - Small 12.5–14.5px
  - Mono labels 10.5–12px, letter-spacing .08–.12em, uppercase
- **No numbered eyebrows** like "01 —" above section titles. Project numbers on cards are fine.

**Spacing & shape**
- Section padding: `clamp(64px,8vw,112px) clamp(20px,5vw,72px)`. Content max-width 1240px.
- Radius: buttons 5px, cards 6px, figures/tables 4px, pills 13–18px.
- **No drop shadows.** Hairline grids use `gap:1px` over a line-colored background.
- Grids use `repeat(auto-fit|auto-fill, minmax(min(100%, Npx), 1fr))`, so layouts reflow without breakpoints. The single hard breakpoint is **960px** (sidebar vs. mobile header and drawer).
- Interactive targets are ≥44px.

## Logo
- **Mark:** a pointy-top hexagon (`M60 7 106 33.5v53L60 113 14 86.5v-53Z`, viewBox 0 0 120 120) filled with a triangulated FEA-style mesh. The full path is in the HTML. Round caps and joins.
- **Sidebar:** 52px mark + wordmark on plain white, in a 120px block. Collapsed: 40px mark only.
- **Mobile header:** 38px mark. **Drawer:** 28px mark. **Footer:** 26px white mark on navy.
- **Favicon:** a simplified mesh on a 32px navy rounded square.
- Source artboard: `logo/HexFlow.dc.html`. Export SVG/PNG files for production.

## Layout shell
- **Sidebar (≥960px):**
  - White, sticky, 100vh. Top to bottom: Logo block → Collapse button (directly above Home) → Nav (scrolls) → "Request a Quote" button.
  - Width 256px expanded, 76px collapsed. Draggable right edge clamps 76–380px. Dragging below 150px snaps to collapsed. Double-click on the edge toggles collapse.
  - Persist `{collapsed, w}` in localStorage.
  - Active nav item: teal 10% background + 2px teal left bar.
- **Mobile (<960px):** sticky full-width top bar (logo + menu button) and a right drawer `min(320px,86vw)`. Add Esc-to-close and a focus trap.
- **Footer:** navy, mark + "© 2026 MPrep Engineering" + mono line "CAD · FEA · CFD · Thermal · Process equipment".

## Pages
**Home**
- Navy hero: H1 "Material Preparation Equipment, Engineered.", lead, "Explore Projects" (teal) and "Discuss a Project" (outline), and a 4:3 media slot.
- Service strip.
- **Equipment focus:** 7 categories (Powder Preparation … Material Coating & Processing, Crystal Growth & Melt Processing, Electrochemical & Photoelectrochemical Cells). Each card lists EQUIPMENT and CAD / FEA / CFD WORK.
- **Selected project teaser:** CZ-R4 text + thumbnail (`assets/cz-r4/00-buckling-mode1.png`, links to the case study) + 3 cells (Scope / Type / Status).

**Services:** 6 cards (mono tag, title, summary, deliverables, applications, value box). Data: `SERVICES`.

**Projects** (two views of the same route; production: `/projects` and `/projects/cz-r4`)
- *List view:*
  - H2 "Selected Projects" + intro.
  - Filter pills: All · Thermal · Electrochemical · Process · Oil & Gas · Minerals & Metallurgy · Mechanical. "All" is the default. Active pill is navy-filled. The row scrolls horizontally on mobile.
  - **Card 01 CZ-R4** spans full width: teal border, "PUBLISHED CASE STUDY" badge, image left, TYPE / FOCUS, and a "View case study" button. It shows for All and Thermal only.
  - **Cards 02–19** in an auto-fill grid (min 360px: 1 column mobile, 2 desktop, 3 wide). Each card: number + category, "IN DEVELOPMENT" badge, 16:9 image slot whose placeholder text is the suggested visual, title, description, TYPE, FOCUS. Data: `PROJECTS`.
  - **On the Roadmap:** R1–R10, each label in a small muted tag. Data: `ROADMAP`.
  - **Documentation standard** block.
- *Case study view (CZ-R4):*
  - "← All projects" link.
  - Navy header: title, summary, `<dl>` TYPE / CONTEXT / TOOLS / STATUS.
  - Body grid `230px | 1fr` on desktop with a sticky TOC, one column on mobile.
  - Chapters: Overview (4 parts) · CAD assembly (2 images + GA drawing PDF viewer + 6 subsystem cells) · Assumptions & parameters (Parameter / Value / Basis table) · Thermal model (6 BCs, temperature field, run 1 vs run 2) · FEA methodology (3 steps + mesh) · Verification (Hand calc vs FEA table + "catching a missing load" image pair) · Results & limitations (stress + displacement, 4 KPI tiles, buckling modes 1–3, 6 limitations) · Conclusions (Findings / Next steps) · Interactive 3D model · Documentation (3 downloads).
  - **Never show 412.4 MPa as a headline number.** It is a mesh-sensitive singularity and appears only under Limitations.
  - Data: `czParts`, `subsystems`, `params`, `bcs`, `feaSteps`, `verify`, `results`, `limitations`, `findings`, `nextSteps`, `docs`.
- *Shared CTA band (both views):* "Need equipment designed around your process?" + TKDN subtext + "Discuss your project" + tagline "Design. Analyse. Document. Improve."

**How I Work:** 6 step cards. Data: `steps`.

**Pricing:** H2 "Engagement models" + intro (USD).
- **4 cards**, equal height. The first is featured (teal border). The price is the dominant element (Plex Mono 36px), with "From" and the unit in muted 13px. The CTA is pinned to the bottom.
  1. FIXED SCOPE · MOST COMMON: *Design project*, From **$450** per project
  2. ENGINEERING ANALYSIS: *FEA / CFD / thermal study*, From **$700** per study. Note under price: "Simple structural FEA from $500 · CFD studies from $800"
  3. FLEXIBLE · ON DEMAND: *Hourly engineering support*, **$40** per hour
  4. ONGOING COLLABORATION: *Monthly engineering retainer*, From **$650** per month. Badge: "Effective rate ~$32/hour". Footnote "Additional hours…". CTA "Discuss Your Requirements".
- **Trust strip:** 4 points with 20px teal line icons. Then the centered line "Have a project that doesn't fit these packages? Tell us about it →".
- **What affects your quote?** (6 factors) → **How it works** (4 steps) → navy CTA banner.
- Data: `plans`, `trustPoints`, `quoteFactors`, `quoteSteps`.
- Do not add tiers, discounts or currencies.

**Tools:** 7 groups with software + level (Autodesk Fusion, AutoCAD, Fusion Simulation, PrePoMax / CalculiX "Developing", CFD solver "Capability in development", Excel, Word / PowerPoint). Exchange formats are grouped into Native (F3D, DWG), 3D exchange (STEP, GLB) and Drawings & reports (DXF, PDF). Data: `toolGroups`, `formats`.

**Calculators:** see the dedicated section below.

**About:**
- Portrait (`assets/about/portrait.png`, 4:5) + name, tagline, 3 paragraphs.
- Engineering Design Focus (5).
- Technical Capabilities (4 cells).
- Research & Engineering Background (4 entries, each with "Engineering relevance").
- Navy "Design approach" band.
- Data: `aboutFocus`, `aboutCaps`, `aboutResearch`.

**Blog** ("Engineering notes"):
- Filter All · Thermal · FEA · CFD · CAD · Equipment. A post can belong to several categories (`cats[]`).
- 10 posts, each with a label, number, title, summary, topics and "Coming soon".
- Closing navy band "Engineering knowledge, documented."
- Data: `POSTS`.

**Contact:**
- Navy page. Left column: intro + DIRECT CONTACT:
  - Email `ilhamaksanmaulana579@gmail.com` (mailto)
  - LinkedIn company `https://www.linkedin.com/company/mprep-engineering/`
  - Founder `https://www.linkedin.com/in/ilhamaksan/`
  - Location "Indonesia · Remote projects worldwide"
- Right column: the quote form (see below).

## Quote form
- **Fields:** Full name*, Company / Organization, Work email*, Required service* (8 options), Project description* (helper text), Drawings & reference files (drop zone + file list + shareable-link input), Target timeline (4 options), Estimated budget, then consent text and "Submit inquiry".
- **Validation on submit:**
  - name required
  - email `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - service required
  - description ≥ 20 chars
  - Errors show inline with `role="alert"` and `aria-invalid`, and focus moves to the first invalid field.
- **Files:** up to 5 files, 20 MB each. Accepted: `.pdf .step .stp .iges .igs .stl .dwg .dxf .f3d .zip .jpg .jpeg .png`. Reject others with a message, de-duplicate, and allow removal.
- **Delivery (prototype):** `POST https://formsubmit.co/ajax/ilhamaksanmaulana579@gmail.com` as `multipart/form-data` with fields `_subject`, `_template=table`, `_captcha=false`, `_replyto`, all form fields, and each file as `attachment`.
  - States: "Sending…" (button disabled) → green "Inquiry sent." (form resets), or a red error that points to the email address. Never fake success.
  - FormSubmit sends a one-time **activation email** on the first submission, and the owner must click it.
- **Production recommendation:** move delivery server-side (Next.js route handler → Resend / Postmark / SMTP, files to S3 / R2 with signed links). This keeps the email address out of the client bundle, enables spam protection (Turnstile / hCaptcha + honeypot) and allows larger files. Configure via env: `FORM_ENDPOINT` or `RESEND_API_KEY`, `INQUIRY_TO`.

## Calculators (must be exact)
**Groups:** THERMAL, STRUCTURAL, CFD & FLUID FLOW. Formulas render with **stacked fractions**: numerator over denominator with a 1.5px rule, subscripts as `<sub>`. Results recalculate live in an `aria-live` region. Spec: the `CALC_GROUPS` array in the HTML (inputs, defaults, rules, helper text, run functions, notes).

**Formatting**
- 4 significant figures (`toPrecision(4)`). Values ≥1e4 use thousands separators, and values <1e-3 use exponent notation.
- Auto-scale units: W/kW/MW, J/kJ/MJ/GJ, N/kN/MN, Pa/kPa/MPa.

**Validation:** inline red error under the field, and no result while any field is invalid.
- `pos` > 0
- `nonneg` ≥ 0
- `eps` in (0, 1]
- `eta` in (0, 100]
- `tabs`: °C value + 273.15 > 0
- Empty or non-numeric input → "Enter a number"
- Hollow shaft: di < d

**Helpers:** every ΔT field shows "A difference of 1 K equals 1 °C."

**Modes (segmented toggle)**
- Torsion: Solid / Hollow (adds di, formula switches)
- Darcy–Weisbach: Enter f manually / Calculate f (adds μ and roughness ε). Calculated mode uses Re → laminar `64/Re`, otherwise **Colebrook–White solved iteratively** (seeded with Haaland, 30 iterations). Transitional regime (2300 ≤ Re < 4000) shows an amber warning.

**Special logic**
- Radiation: if Ts < Tsur, show the absolute value labelled "Net radiative heat gain" plus an info note.
- Pressure vessel: t/D > 0.05 → amber warning, t/D > 0.10 → red warning.
- Buckling: r = √(I/A), λ = KL/r, λc = √(2π²E/Sy). If λ ≥ λc use Euler, else Johnson `A·[Sy − Sy²λ²/(4π²E)]` with an amber note.
- Pump: hydraulic power is shown above shaft power.

**Verified defaults (regression tests)**

| Calculator | Expected |
|---|---|
| Conduction | 800.0 W |
| Convection | 550.0 W |
| Radiation | 15.85 kW |
| Heating | 4.000 MJ / 1.111 kW |
| Expansion (α = 12 ×10⁻⁶) | 9.600 mm |
| Torsion solid / hollow (di 10) | 31.83 MPa / 33.95 MPa |
| Axial | 100.0 MPa |
| Pressure vessel | 25.00 / 12.50 MPa, t/D 0.02000 |
| Buckling | 26.32 kN, Euler, λ 173.2, λc 125.7 |
| FoS | 2.500 |
| Impeller Re | 960.0, Transitional |
| Pipe velocity | 0.6791 m/s |
| Darcy manual | 9.000 kPa |
| Pump | 333.3 W hydraulic / 476.2 W shaft |

**Edge cases**
- Pressure vessel t = 60 → red warning.
- Buckling L = 300 → Johnson, λ 51.96, **91.45 kN**. The client brief said ≈93.1, but the Johnson formula gives 91.45, so keep 91.45.
- Radiation Ts = 0 °C → "Net radiative heat gain" 105.9 W.
- Darcy calc defaults → Re 37,500, Turbulent, f ≈ 0.0269 (Colebrook), Δp ≈ 12.11 kPa.

## MediaSlot (every image area)
- **Production:** content-driven. Each slot is `{ type: 'image'|'model'|'drawing', src, alt, poster? }`.
- **Image:** JPG/PNG/WebP, `object-fit: contain` for simulation screenshots (they carry legends), `cover` for photos.
- **3D model** (GLB/glTF/STL/OBJ):
  - three.js orbit viewer with damping, slow auto-rotate until the user interacts, auto-framing, hemisphere + key + teal fill lights, ACES tone mapping, faint teal grid, navy radial background.
  - **Performance (already in `media-slot.js`):**
    - lazy-load three.js only when the slot is within 200px of the viewport
    - render on demand; auto-spin capped at ~30 fps
    - pause when off-screen or the tab is hidden
    - pixel ratio ≤ 1.5, no antialiasing on high-DPR screens, `powerPreference: low-power`
    - dispose geometry and textures on teardown
    - Draco + Meshopt decoders enabled
  - Show the poster image on low-power devices.
- **Drawing:** SVG pan/zoom (wheel to the cursor, drag, pinch, double-click to fit). PDF in an embedded viewer.
- DWG/DXF are rejected with a message explaining how to export.

## Assets
- `assets/cz-r4/`:
  - `00-buckling-mode1.png` (card thumbnail)
  - `01-assembly-overview.png`
  - `02-section-hot-zone.png`
  - `03-temperature-distribution.png`
  - `04-mesh-global.png`
  - `05-stress-von-mises.png`
  - `06-deformation.png`
  - `verification-run1-missing-load.png`
  - `thermal-run1-conduction-only.png`
  - `thermal-run2-with-radiation.png`
  - `buckling-mode2.png`
  - `buckling-mode3.png`
- `assets/about/portrait.png` (800×1000, already mirror-corrected and cropped)
- `models/cz-r4-furnace.glb` (240 KB)
- `docs/`: `cz-r4-analysis-report.pdf`, `cz-r4-general-arrangement.pdf`, `cz-r4-simplified-assembly.step`
- Software names (AutoCAD, Fusion, PrePoMax, C++) appear as **text only**. Don't use vendor logos.

## Metadata / launch checklist
- Title: "MPrep Engineering — Engineering Equipment for Material Preparation". The meta description is in `<helmet>`.
- Add per-page titles and descriptions, OG/Twitter tags with an OG image (logo on navy), favicon set, sitemap.xml, robots.txt, and `lang="en"`.
- Respect `prefers-reduced-motion`. Motion is limited to the sidebar width (.2s) and smooth scroll.
- Hosting: Vercel or Netlify (static export works). Serve `.glb` as `model/gltf-binary`.

## Files
- `Engineering Consultancy Site.dc.html`: full design (markup + logic class with all content data and calculator logic)
- `media-slot.js`: reference implementation of MediaSlot (3D / 2D / image)
- `image-slot.js`, `support.js`: prototype runtime only
- `logo/HexFlow.dc.html`: logo artboard
- `assets/`, `models/`, `docs/`: production assets
- `screenshots/`: top-of-page captures of all 10 pages + the CZ-R4 case-study view, taken at about 909px wide (below the 960px breakpoint, so they show the mobile header). Use them as a visual reference only. For full pages, open the HTML.
