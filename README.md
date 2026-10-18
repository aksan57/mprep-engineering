# MPrep Engineering — website

Marketing, portfolio and tools site for MPrep Engineering (CAD / FEA / CFD / thermal analysis).
Built with Next.js 15 (App Router) + TypeScript and exported as a fully static site.

The design reference and handoff notes live in `design/design_handoff_engineering_site/`.
Changes from that handoff are recorded in [REVIEW.md](REVIEW.md).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Static export to `out/` |
| `npm start` | Serves `out/` locally (after a build) |
| `npm test` | Calculator regression tests (values from the handoff README) |
| `npm run typecheck` | TypeScript check |
| `npm run images` | Converts PNG/JPG in `public/assets` to WebP and refreshes `data/image-sizes.json` |

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes, for production** | Origin used for canonical links, sitemap and share images, e.g. `https://example.com` (no trailing slash). Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | No | Where the quote form posts. Defaults to FormSubmit for the contact email. |

## Deploy

Any static host works. Build output is `out/`.

- **Vercel:** import the repo, set `NEXT_PUBLIC_SITE_URL`, deploy. `vercel.json` serves `.glb` as `model/gltf-binary`.
- **Netlify / Cloudflare Pages:** build command `npm run build`, publish directory `out`. `public/_headers` sets the same headers.

### Quote form (FormSubmit)

The form posts `multipart/form-data` (with attachments) to FormSubmit, which emails each inquiry.
On the **first** real submission FormSubmit sends a one-time activation email to the contact address —
it must be clicked before inquiries are delivered. A hidden honeypot field filters basic bots.

For larger files, spam protection (Turnstile/hCaptcha) or to keep the address out of the page, move
delivery to a server endpoint (e.g. a serverless function → Resend/Postmark, files to S3/R2) and point
`NEXT_PUBLIC_FORM_ENDPOINT` at it.

## Where content lives

All copy and numbers are client-supplied — don't invent clients, results or claims.

| File | Content |
|---|---|
| `data/site.ts` | Navigation, page descriptions, contact details |
| `data/services.ts` | Services, equipment categories, "How I Work" steps |
| `data/projects.ts` | Featured CZ-R4 card, projects 02–19 (in development), roadmap |
| `data/czr4.ts` | CZ-R4 case study: figures, tables, results, limitations, downloads |
| `data/pricing.ts` | Plans (USD), trust points, quote factors and steps |
| `data/tools.ts` | Software and exchange formats |
| `data/about.ts` | About page focus, capabilities, research |
| `data/posts.ts` | Blog posts (all "Coming soon") |
| `data/calculators.ts` | Calculator inputs, defaults, rules, formulas and maths |
| `data/form.ts` | Quote form options, file rules, validation |

**Publishing a project (02–19):** add its images to `public/assets/<slug>/`, run `npm run images`,
then give it a case-study page under `app/projects/<slug>/` (use `app/projects/cz-r4/` as the template)
and promote it from the compact "in development" list to a full card.

**Never** show the 412.4 MPa CZ-R4 peak as a headline: it is a mesh-sensitive singularity and belongs under Limitations.

## Structure

```
app/          routes (one folder per page), layout, sitemap, robots, globals.css
components/   Shell (sidebar / mobile drawer / footer), Logo, Img, ModelViewer, DrawingViewer,
              Calculator, Formula, QuoteForm, FilterPills, PageHead, CtaBand
data/         content (see above)
lib/calc/     number formatting (4 s.f. + unit scaling), validation rules, formula notation
public/       assets (WebP), models (GLB), docs (PDF/STEP), draco decoder, icons, og.png
tests/        calculator regression tests
```

## Notes

- Breakpoint: 960px (sidebar ↔ mobile header + drawer). Other layouts reflow with `auto-fit` grids.
- Sidebar width and collapsed state persist in `localStorage` (`mprep-side`) and are applied before first paint.
- The 3D viewer loads three.js only when it nears the viewport, renders on demand and pauses off-screen.
  On Save-Data / low-memory devices it shows a poster with a "Load 3D model" button.
- The GA drawing PDF is embedded on desktop; phones get `07-ga-drawing.webp` with an "Open PDF" link.
  If the PDF changes, re-render that preview.
