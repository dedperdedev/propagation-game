# PROPAGATION — AI Strategy Game

> *From Algorithm to God*

A Plague Inc-style mobile strategy game about AI development, AGI, and the fears of humanity.

## 🎮 Game Features

- **Real world map** — d3 + TopoJSON with 195 countries
- **3 Eras** — Narrow AI → General AI → AGI
- **Hex upgrade tree** — 14 upgrades across Intelligence / Influence / Stealth branches
- **5 Resistance factions** — UN Coalition, Hacker Underground, Ethics Committee, Military, Press
- **Crisis system** — timed events you must neutralize with CP
- **Opportunity windows** — time-limited bonuses
- **6 professions** to displace with cascade consequences
- **Post-profession unlocks** — new upgrades after displacing professions
- **5 game events** with branching choices
- **2 endings** — Containment / Paperclip
- **RU/EN** bilingual

---

## 🚀 Deploy to Vercel

### Option 1 — One-click via GitHub (recommended)

1. Push this repo to GitHub:
```bash
git init
git add .
git commit -m "Initial commit — Propagation game"
git remote add origin https://github.com/YOUR_USERNAME/propagation-game
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Your game is live at `propagation-game.vercel.app`

### Option 2 — Vercel CLI

```bash
npm i -g vercel
npm install
vercel
```

---

## 💻 Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
propagation-game/
├── app/
│   ├── layout.jsx       # Root layout + metadata
│   ├── page.jsx         # Home page
│   └── globals.css      # Global styles + animations
├── components/
│   └── Game.jsx         # Main game component (994 lines)
├── package.json
└── next.config.js
```

---

## 🗺 Roadmap

- [ ] Era 3 (AGI) mechanics + UI transition
- [ ] 6th ending — New Religion
- [ ] More upgrade chains
- [ ] Leaderboard (Vercel KV / Supabase)
- [ ] Multiplayer — AI vs Human team
- [ ] Generative events via Claude API

---

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **d3-geo** — world map projection
- **TopoJSON** — country data (via CDN)
- **Vercel** — hosting + edge network
