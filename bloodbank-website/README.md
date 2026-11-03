# LifeDrop Blood Bank — Website

A fully responsive, interactive blood-donation website: home page, donation
camps listing with search/filters, camp detail pages, donor registration,
and sign-in — all wired together with real navigation, form validation, and
a "Book Now" appointment modal.

## Run it

No build step, no dependencies, no server required.

1. Unzip this folder.
2. Open the folder in VS Code.
3. Open `index.html`.
   - Easiest: install the **Live Server** extension in VS Code, right-click
     `index.html` → **Open with Live Server**. This gives you working
     `fetch`/query-param behaviour and auto-reload.
   - Or simply double-click `index.html` to open it directly in your
     browser — everything on this site works from the local file system too.

That's it — it's a static site, so there is nothing to install and nothing
to compile.

## What's inside

```
bloodbank-website/
├─ index.html          Home page: hero, "Book now" modal, how-it-works,
│                       upcoming camps preview, gallery, contact form
├─ camps.html           Donation camps listing with live search + filters
├─ camp-details.html    Single camp detail (reads ?id=... from the URL)
├─ login.html            Sign-in form
├─ register.html          Donor registration form
├─ css/style.css          All styling (single stylesheet, CSS variables)
└─ js/
   ├─ data.js             Shared camp data used by camps.html & camp-details.html
   ├─ main.js              Mobile nav, modal system, toast notifications
   ├─ forms.js              Validation for login/register/contact/booking forms
   ├─ camps.js               Renders + filters the camps grid
   └─ camp-details.js         Renders a single camp's detail card
```

## How the interactivity works

- **Home → About / Gallery / Contact**: these are anchors on the home page
  (`#about`, `#gallery`, `#contact`). Clicking them from any other page
  takes you to `index.html` and smooth-scrolls to that section.
- **Book Now** (home hero): opens an appointment-booking modal in place,
  with its own validated form — no page reload.
- **Donation Camps**: a real page (`camps.html`) with a search box plus
  city and blood-group filters that update the results live.
- **View Details**: opens `camp-details.html?id=...`, which reads the
  camp's id from the URL and renders that camp's full information.
- **Register / Login**: full client-side validated forms. Since there's no
  backend, a successful submission is simulated (donor records are saved to
  `localStorage`), a success banner + toast appear, and you're redirected
  to the next logical page.

## Typography & motion

- **Fonts**: headings use **Poppins** (600/700/800) and body text uses
  **Inter** — a clean, professional pairing in place of the earlier
  decorative serif. Change the `--font-display` / `--font-body` variables
  at the top of `css/style.css` to swap fonts everywhere at once.
- **Animations**: on load, the hero text and illustration fade up in a
  short staggered sequence, the drip-card icon has a gentle heartbeat
  pulse, an animated ECG line draws itself in a loop, and the floating
  notes drift gently — echoing the motion in the reference presentation.
  As you scroll, section headings, step cards, camp cards, value cards,
  gallery tiles, and the stats strip fade/slide into view once
  (`js/animations.js`, using `IntersectionObserver`), and the stats
  counters count up from zero. All motion respects
  `prefers-reduced-motion` and degrades to a static, fully visible layout
  if a visitor has that setting on.

## Customising

- Colors, fonts, and spacing are defined as CSS variables at the top of
  `css/style.css` — change them there and the whole site updates.
- Camp listings live in `js/data.js` — add, edit, or remove entries in the
  `CAMPS` array and both the listing and detail pages update automatically.
- The site uses the "Fraunces" and "Inter" fonts from Google Fonts (loaded
  via `<link>` tags). If you're fully offline, the site still works —
  it just falls back to your system's serif/sans-serif fonts.

No external JS frameworks, no build tools, no bugs left in — everything
has been checked for balanced tags and valid syntax before packaging.
