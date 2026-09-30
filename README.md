# TurNorge (TrailApp) — [WIP]

A modern, privacy-focused Norwegian hiking and outdoor guide application featuring a matte Scandinavian forest aesthetic, secure Supabase cloud sync, interactive trip planning, and full WCAG accessibility compliance.

> **Status:** Work in Progress (WIP) — Active feature implementation, refactoring, and performance optimizations underway.

---

## 🛠️ Technical Architecture & Stack

TurNorge is built with a robust, scalable client-side architecture leveraging modern web standards:

- **Frontend Framework:** React 18+ with TypeScript (Strict Mode) for type-safe UI development.
- **Build Tooling:** Vite for lightning-fast HMR (Hot Module Replacement) and optimized production builds.
- **Component & Design System:** Mantine UI (v7) utilizing custom theme tokens, responsive hooks, and dynamic color scheme management (Dark/Light mode).
- **Routing & Navigation:** React Router v6 featuring declarative routing, nested layout nesting (`AppLayout`), and protected route wrappers.
- **Backend & Persistence Layer:** Supabase Backend-as-a-Service (BaaS) providing:
  - **Supabase Auth:** Secure JWT-based authentication, session persistence, and authorization guards.
  - **PostgreSQL Database:** Relational tables handling user profiles, preferences, and cross-device favorite trail syncing.
  - **Supabase Storage:** Cloud storage buckets optimized for handling custom avatar and media uploads with secure access policies.
- **Accessibility & Standards:** WCAG 2.1 AA Compliant, featuring semantic HTML5 structural landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`), high-contrast color ratios, and explicit ARIA labeling.

---

## ✨ Features & Capabilities

- **User Authentication & Protected Routes:** Secure registration, login workflows, and session management powered by Supabase Auth, restricting private dashboard views (`/profile`) to authenticated users.
- **Profile Customization & Storage:** Personalized user profiles with custom avatar uploads backed by Supabase storage buckets and reactive header dropdown menus.
- **Cloud-Synced Favorites:** Bookmark favorite hiking trails and instantly synchronize telemetry and preferences across devices anywhere in the world via PostgreSQL database bindings.
- **Interactive Trip Planner:** Dynamic itinerary generator tailored to custom route constraints, distance metrics, and safety preferences.
- **Trail Explorer:** Comprehensive Norwegian trail discovery featuring regional data and open standard references.
- **Allemannsretten Guide:** Detailed educational toolkit explaining Norway's traditional Right to Roam laws (_Allemannsretten_), safety etiquette, and landowner considerations.
- **Legal & Safety Compliance:** Fully responsive **Terms & Conditions** page (`/terms`) detailing user account policies, data ownership, and mountain safety disclaimers.
- **Matte Scandinavian Aesthetic:** Carefully curated forest-themed UI tokens mirroring classic Nordic outdoor design principles with smooth theme toggling.

---

## ⚙️ Getting Started

### Clone the Repository

```bash
git clone [https://github.com/Nirush4/TurNorge](https://github.com/Nirush4/TurNorge)
cd TurNorge
```

```bash
npm install
````

```bash
npm run dev
```

```bash
npm run build
```

### Configure Environment Variables

Create a `.env` file in the root directory of your project and add your Supabase project credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author 👨‍💻​

• [Nirushan Rajamanoharan](https://github.com/Nirush4)

**Happy coding!**
