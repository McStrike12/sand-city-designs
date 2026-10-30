# Sand City Designs website

The site for Sand City Designs, a website design and custom software studio in Manhattan Beach, CA, run by Sarah (design, branding, SEO) and Mike (software and systems). Live at https://sandcitydesigns.com.

## Working together
Two people edit this site, each with their own Claude Code.
- Before starting: `git pull` so you have the other person's latest changes.
- When done: commit with a clear message and `git push`. Pushing to `main` deploys the live site automatically through Vercel (project `sand-city-designs`, team `mtmtraining`). Check the live page after a push.
- If a pull has conflicts, resolve them carefully and keep both people's changes; ask if unsure.

## How the site is built
Plain static HTML, CSS and JavaScript. No build step, no React, no Tailwind, no TypeScript. It started from the 8B ONDO event template; `AGENTS.md` is that template's original guide and is mostly out of date (ignore its event, lineup and ticket wording).
- `index.html`: the homepage. All its CSS is inline in `<style data-8b-part="section:...">` blocks and its animation in `<script data-8b-part="scene:...">` blocks (GSAP, ScrollTrigger and Lenis from jsDelivr). Keep the `id`, `data-8b-*` attributes and class names the scripts use.
- `assets/site.css`: shared styles for every other page.
- `services/website-design-branding.html`, `services/custom-software-systems.html`
- `start-a-project.html`: the project form. It posts to `api/inquiry.js`, a Vercel function that emails the inquiry through Resend (env vars `RESEND_API_KEY`, `INQUIRY_TO`, optional `INQUIRY_FROM`, set in Vercel, never in the code).
- `work/*.html`: case studies. Each ends with a "Next project" link; the chain is Beach City Baseball → Material Distributors → Personalized Performance → Ever-Clear Pools → This Is It Team → Light It Up → Light It Up Dashboard → back to Beach City Baseball. Keep it a loop when adding one.
- `privacy.html`
- `vercel.json`: clean URLs plus temporary redirects. `/work` (the Our Work page) and `/work/gvl-golf-lounge` are hidden by redirect until there's more work / GVL is finished.
- `assets/work/`: case study screenshots and card images.
- `CREDITS.md`: photo credits; keep it in sync when photos change.

## Homepage sections, in order
Hero (beach video) · `#lineup` five sliding pain-point cards · `#about` and `#team` · `#looks` services in two tabs (`section-script:looks`) · `#tickets` Featured Work gallery: a row of photo panels that widen on hover, swipeable cards on phones (items in the `.gl` markup, styles in `section:gallery`, no script) · `#contact` · footer.

## Brand
Colours are tokens in `:root`: `--color-1` #452b25 brown, `--color-2` #57809d blue, `--color-3` #fbf1c0 light yellow, `--color-4` #000, `--color-5` #ddb24e dark yellow, `--color-6` #c3dded light blue, `--color-7` #fff. Headings use the Hero font (`assets/Hero-Bold.otf`, `--font-2`). Use the tokens, not new hex values. Body text needs 4.5:1 contrast, and the page must read fully with reduced motion.

## Rules
- Never publish client private data: blur names, emails, phone numbers, revenue and players in screenshots.
- Keep health claims about client products off the site.
- No secrets, passwords or API keys in this repo.
- Check pages at phone width as well as desktop before pushing.

## Previewing locally
`python3 -m http.server 8000` from this folder, then open http://localhost:8000/index.html (clean URLs like `/start-a-project` only work on Vercel; add `.html` locally).
