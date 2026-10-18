# Prototype review — decisions for the build

Reviewed 2026-10-18 against `design/design_handoff_engineering_site/`. These override the handoff README where they differ.

## Decisions (client-approved)
1. **CFD.** Keep CFD in Services, Pricing and the quote form. On the Tools page, replace "Capability in development" with wording that marks it as a newer service with a growing portfolio (e.g. "Available · growing portfolio"). Change PrePoMax / CalculiX from "Developing" to "Working knowledge", since the CZ-R4 study used it.
2. **FEA / CFD / thermal pricing card.** The headline becomes **From $500** per study, and the note becomes "Thermal studies from $700 · CFD studies from $800".
3. **Projects 02–19.** Drop the image slots and show them as a compact text list (number, category, title, description, TYPE / FOCUS), keeping the "In development" label. CZ-R4 stays the full-width hero card. A project gets the full card treatment when it is published.
4. **CTA band.** Remove the TKDN subtext line ("Locally designed equipment… (TKDN) requirements.").

## Fixes to make during the build
- In the case-study view, the "Selected Projects" H2 and intro still render above "← All projects". Show them on the list view only.
- `06-deformation.png` is used for both "Corrected run" (verification) and "Displacement" (results). Confirm with the client which figure belongs in each place.
- Raise tap targets below 44px to at least 44px: the MENU button (40px), the filter pills (36px), the calculator mode toggles (34px) and the "Read the case study →" link (19px).
- Mobile drawer: Esc does not close it, focus does not move into it, and there is no focus trap. Add `aria-modal`.
- Images: `portrait.png` is 1.5 MB, and the simulation PNGs are about 450 KB each (about 4.6 MB on the case study in total). Serve them through `next/image` as WebP or AVIF.
- On phones, the GA drawing PDF iframe doesn't render. Show a PNG preview with an "Open PDF" link on small screens.
- 3D viewer hint: rewrite "Double-click Reset to recentre" as "Double-click or press Reset to recentre".

## Verified OK
- All 14 calculator defaults and all 4 README edge cases match.
- Quote-form validation: inline alerts, `aria-invalid`, and focus moves to the first invalid field.
- Every asset, model and doc path resolves. The 240 KB GLB lazy-loads and renders.
- No horizontal overflow at 375px on any page.
