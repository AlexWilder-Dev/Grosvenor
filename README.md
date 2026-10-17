# The Grosvenor Arms · Brixton

A speculative redesign for The Grosvenor Arms, 17 Sidney Road, London SW9 0TP: a mid-Victorian corner pub between Brixton and Stockwell with 25 beer and cider taps, pizza till 10pm and Sky & TNT Sports.

Front end only, on static data. No CMS, database, payments or backend.

**Live:** https://alexwilder-dev.github.io/grosvenor-arms-brixton/

## What it does

- **Open-now strip**, pinned to the top, worked out in Europe/London time from the real hours: "Open till 11:30pm" or "Opens 4pm", plus "Pizza till 10pm", which becomes "Kitchen closed" after 10pm.
- **Tap wall**: 25 clips laid out like the back wall, five across on desktop and a swipeable wall on phones. Filter by Pale & IPA, Lager, Dark, Sour or Cider; tap a clip to turn it over for brewery and style. It's a sample board: in the real version staff would update it as kegs change.
- **Pizza menu** with every price, the two deals and the Deliveroo link.
- **Booking sheet** at `#/book`, opened from every Book button. Occasion, group size (2 to 40+), a date, and times inside that day's opening hours (last slot an hour before close). It drafts a tidy email to the pub, shows the draft, then opens it in the visitor's email app ready to send.
- **Sport**, **story**, **find us and hours**, and a footer with socials and the sister pub.

## Demo clock

Add `?at=day-HH:MM` to set the clock, e.g.

- `?at=mon-15:30` – closed, opens 4pm
- `?at=sat-21:45` – open, last 15 minutes for pizza
- `?at=sat-22:30` – open, kitchen closed

A yellow tag in the strip shows when the demo clock is on; tap it to go back to the real time.

## Run it

```sh
npm install
npm run dev       # local dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the build at /grosvenor-arms-brixton/
npm run og        # rebuild public/og.jpg and the icons (one-off, uses sharp)
```

Vite, React, TypeScript, Framer Motion and React Router (HashRouter). Deploys to GitHub Pages from the default branch through `.github/workflows/deploy.yml`; set Pages to "GitHub Actions" in the repository settings. Asset paths are relative, so the build works whatever the repository is called.

## Media

All photos are the pub's own gallery shots from their current site, renamed by what they show, in `public/media/`.

---

Site by AlexWilder-Dev
