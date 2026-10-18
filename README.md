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
| `NEXT_PUBLIC_SHEET_ENDPOINT` | No | Google Apps Script web-app URL (`…/exec`) that logs each inquiry to a Google Sheet. Empty = off. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | No | Where the quote form posts (a normal multipart POST). Defaults to FormSubmit's standard endpoint for the contact email. |

## Deploy

Any static host works. Build output is `out/`.

- **Vercel:** import the repo, set `NEXT_PUBLIC_SITE_URL`, deploy. `vercel.json` serves `.glb` as `model/gltf-binary`.
- **Netlify / Cloudflare Pages:** build command `npm run build`, publish directory `out`. `public/_headers` sets the same headers.

### Quote form (FormSubmit)

The form is validated in the page. When it's valid, it builds a hidden native `<form>` and submits it
as a normal `multipart/form-data` POST to FormSubmit's standard endpoint (`https://formsubmit.co/<email>`).
The browser goes to FormSubmit, which emails the inquiry with its attachments, then redirects to
`/contact/thanks/` (the `_next` field). That page is `noindex` and isn't in the sitemap.

- **Why not fetch/AJAX:** FormSubmit's `/ajax/` endpoint delivers the text but silently drops attachments.
- **Attachments:** up to 5 files and **10 MB in total** (FormSubmit's limit), sent as `attachment1`…`attachment5`.
  Bigger files are rejected with a prompt to paste a shareable link instead.
- **Field names** in the email: Name, Company, Email, Service, Timeline, Budget, Reference link, Project description.
- **Back button:** if the visitor comes back from FormSubmit, the "Sending…" state is reset.
- **Activation:** on the **first** real submission FormSubmit sends a one-time activation email to the contact
  address. It must be clicked before inquiries are delivered.
- **Spam:** a hidden `_honey` field catches basic bots.

**Inquiry log (optional):** if `NEXT_PUBLIC_SHEET_ENDPOINT` is set, each valid, non-bot inquiry is also posted
to a Google Sheet just before the email is sent: same fields plus file names/sizes and the site origin, one row per
inquiry with a "Status" column for follow-up. It's fire-and-forget and never blocks or delays the email.
Setup steps are in the header of [`scripts/google-sheets-inquiries.gs`](scripts/google-sheets-inquiries.gs).

`NEXT_PUBLIC_FORM_ENDPOINT` can point at another service, but it must accept a normal multipart POST with the same
field names and redirect to `_next`. For spam protection (Turnstile/hCaptcha), larger files or to keep the address
off the page, move delivery to a server endpoint (e.g. a serverless function → Resend/Postmark, files to S3/R2).

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
