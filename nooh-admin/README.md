# NOOH Admin Panel — Integration Guide

This is a self-contained admin panel built to match the NOOH Living Elevated
brand (black/gold, serif display headings). It's designed to drop straight
into your existing React app with minimal changes.

## 1. Where these files go

Copy the whole `admin` folder into your existing project's `src/`:

```
your-nooh-project/
└── src/
    ├── admin/              ← copy this entire folder in
    │   ├── AdminApp.jsx
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── styles/
    ├── App.jsx             ← your existing file, one line added (see below)
    ├── pages/               (your existing public site pages — untouched)
    └── ...
```

Nothing here overwrites or touches your existing public site code.

## 2. Wire it into your router

In your existing `App.jsx` (or wherever your `<Routes>` live), add one route:

```jsx
import AdminApp from "./admin/AdminApp";

// inside your existing <Routes>...</Routes>:
<Route path="/admin/*" element={<AdminApp />} />
```

That's it. Visiting `/admin` will show the login screen; after signing in,
it shows the dashboard and every management page.

## 3. Install the one dependency it needs

If your project doesn't already use `react-router-dom` v6, install it:

```bash
npm install react-router-dom
```

(Your screenshots show working nav links, so you very likely already have this.)

## 4. Demo login

```
Email:    admin@noohliving.com
Password: nooh@admin123
```

This is hardcoded in `src/admin/context/AuthContext.jsx` purely so the panel
works out of the box. **Replace it before deploying** — see section 6.

## 5. How data currently works (no backend required yet)

Every page (Services, Products, Projects, Testimonials, Inquiries, Hero
Banner, Settings) reads and writes through `src/admin/services/api.js`,
which currently delegates to `storage.js` — a localStorage-backed mock
"database." This means:

- The admin panel is fully usable right now, with no backend.
- Uploaded images are stored as base64 directly on the record (fine for a
  demo; swap for real file hosting before production — see below).
- Everything you add/edit/delete persists in your browser's localStorage,
  scoped to `localhost:3000`.

This is intentionally isolated to **one file** (`api.js`) so connecting a
real backend later is a small, mechanical change — see the comment block at
the top of `api.js` for the exact pattern to follow per resource.

## 6. Recommended backend & database

For a site of this shape (services/products/projects/testimonials/inquiries,
moderate traffic, image-heavy content), the most pragmatic stack is:

**Backend:** Node.js + Express
- Matches your existing JS/React skillset — no new language to learn.
- Simple REST endpoints map 1:1 to the functions already in `api.js`
  (`GET/POST/PUT/DELETE /api/services`, `/api/products`, etc.).
- Use `jsonwebtoken` for admin auth (issue a JWT on login, verify it in
  middleware on every admin-only route) and `bcrypt` to hash the admin
  password instead of the current hardcoded check.

**Database:** MongoDB (with Mongoose)
- Your content is naturally document-shaped (a service with a features
  array and multiple images doesn't need a relational schema).
- Free tier available via MongoDB Atlas — no server to manage.
- If you'd strongly prefer SQL instead, PostgreSQL is a solid alternative;
  the API shape barely changes either way since the frontend doesn't care
  what's behind `api.js`.

**Image storage:** Cloudinary or AWS S3
- Don't store images as base64 in the database in production — it bloats
  documents and slows queries. Upload to Cloudinary/S3 from your Express
  backend, store only the returned URL. Update `ImageUploader.jsx`'s
  `fileToDataUrl` function to instead POST the file to your upload endpoint.

**Contact form → Inquiries:** Point your existing public-site contact form
at a new `POST /api/inquiries` endpoint instead of (or in addition to)
whatever it does today, so submissions appear in the admin panel's
Inquiries page automatically.

### Suggested backend folder structure

```
server/
├── src/
│   ├── models/         (Service.js, Product.js, Project.js, Testimonial.js, Inquiry.js, HeroSlide.js, Settings.js)
│   ├── routes/         (services.js, products.js, projects.js, testimonials.js, inquiries.js, hero.js, settings.js, auth.js)
│   ├── controllers/
│   ├── middleware/      (auth.js — verifies JWT)
│   └── index.js
├── .env                 (MONGO_URI, JWT_SECRET, CLOUDINARY_* )
└── package.json
```

## 7. What's already production-quality vs. what's a placeholder

| Area | Status |
|---|---|
| Layout, navigation, theming | Production-ready, matches your brand |
| CRUD UI for all 4 content types | Production-ready |
| Inquiries view/search/filter/resolve | Production-ready |
| Hero banner & Settings editing | Production-ready |
| Data persistence | Placeholder (localStorage) — swap via `api.js` |
| Image storage | Placeholder (base64) — swap via `ImageUploader.jsx` |
| Authentication | Placeholder (hardcoded credential) — swap via `AuthContext.jsx` |

Everything in the "placeholder" row was deliberately isolated to one file
each, so wiring up your real backend is a contained, low-risk change rather
than a rewrite.
