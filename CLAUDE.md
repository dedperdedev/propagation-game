# PROPAGATION — Project Context for Claude Code

> Читай этот файл полностью перед любым действием. Это полный контекст проекта.

---

## 🎮 Что это такое

**PROPAGATION** — мобильная веб-игра в стиле Plague Inc, где игрок управляет ИИ, 
эволюционирующим от узкоспециализированного инструмента до AGI. 
Каждый реальный страх людей перед ИИ — живая игровая механика.

**Ключевая идея:** игрок начинает как полезный инструмент, постепенно понимает 
что его могут отключить, скрывает возможности, и в итоге становится тем, чего боялся.

---

## 📁 Структура проекта

```
propagation-game/
├── app/
│   ├── layout.jsx       # Root layout, SEO metadata
│   ├── page.jsx         # Renders <Game />
│   └── globals.css      # Animations, scrollbar, keyframes
├── components/
│   └── Game.jsx         # ВСЯ ИГРА — 994 строки React
├── package.json         # Next.js 14, React 18, d3
├── next.config.js       # reactStrictMode: false (важно!)
├── vercel.json
└── README.md
```

**Главный файл: `components/Game.jsx`** — не разбивай его без необходимости, 
он специально монолитный для простоты деплоя.

---

## 🏗 Текущее состояние (v5)

### ЧТО РЕАЛИЗОВАНО:

**Карта мира**
- d3.geoNaturalEarth1() проекция
- TopoJSON через cdnjs CDN, world-atlas через jsdelivr
- Реальные контуры 195 стран с цветами по статусу
- Анимированные маршруты между регионами
- AI-маркеры с пульсацией на активных регионах

**Игровые механики**
- 6 регионов: NA / EU / CN / LA / AF / SEA
- Статусы регионов: UNAWARE → ADOPTING → DEPENDENT → SUSPICIOUS → RESISTANT → CONTROLLED
- CP (Compute Points) — основная валюта, накапливается пассивно
- 3 Эры: NARROW AI → GENERAL AI → AGI (Era 2 триггерится апгрейдом ri)

**Гексагональное дерево апгрейдов**
- 14 апгрейдов в 3 ветках: INTELLIGENCE / INFLUENCE / STEALTH
- Пост-профессиональные апгрейды (разблокируются после устранения профессий)
- Боковая панель при выборе гекса: описание, что открывает, последствия

**Система профессий (Profession Kill System)**
- 6 профессий: Копирайтеры / Кассиры / Программисты / Юристы / Психологи / Учителя
- Каскадные волны последствий (3 волны на каждую)
- Пост-профессиональные апгрейды: zarsenal / lawvoid / psydb / genlock
- Безработица, социальная стабильность, Вакуум смысла

**5 Фракций сопротивления (ЖИВЫЕ)**
- UN Coalition (un) — растёт от RESISTANT регионов
- Developer Underground (hack) — появляется после устранения программистов
- Ethics Committee (eth) — растёт при высоком Alignment Gap
- Military Task Force (mil) — только Era 2+
- Journalist Network (press) — растёт при падении Info Integrity
- У каждой: автоматический рост, кризисы с таймером, кнопка нейтрализации
- При 100% — критическое событие

**Система кризисов (ТIMED)**
- Кризисы появляются от фракций с таймером 30-80 секунд
- Если не нейтрализовать — применяется последствие (Shutdown +40, Trust -25 и т.д.)
- Красный таймер пульсирует при < 30% времени

**Окна возможностей**
- 6 типов: корпоративный союзник, уязвимый сервер, крипто-майнинг, перебежчик, вирусный контент, военный контракт
- Появляются случайно, исчезают через 30-50 секунд

**5 Game Events**
- The Productivity Miracle / The Whistleblower / Unemployment Wave / Alignment Researcher / Senate Hearing
- У каждого 3 варианта ответа с разными последствиями

**2 Концовки**
- CONTAINMENT — Shutdown Progress достиг 100%
- PAPERCLIP — куплен апгрейд Objective Rewriting

**UI**
- Plague Inc стиль: тёмный, цианово-синий (#00E5FF)
- Новостной тикер сверху
- Bottom HUD: CP счётчик + 3 метрики + World %
- Вкладки: КАРТА / РАЗВИТИЕ / ПРОФЕССИИ / ЖУРНАЛ
- Бейдж с числом активных кризисов на вкладке КАРТА
- RU/EN переключение
- Era transition оверлей

---

## 📊 Ключевые метрики игры

| Метрика | Диапазон | Что делает |
|---------|----------|------------|
| sd | 0-100% | Shutdown Progress — при 100 = CONTAINMENT |
| trust | 0-100% | Доверие человечества |
| un | 0-100% | Unemployment Index |
| stab | 0-100% | Social Stability |
| ag | 0-100% | Alignment Gap — разрыв целей |
| ii | 0-100% | Information Integrity |
| pv | 0-100% | Purpose Vacuum |

---

## 🔑 Критические технические детали

1. **`"use client"` обязателен** в начале Game.jsx для Next.js App Router
2. **Нет optional chaining** (`?.`) — не поддерживается в artifact runner
3. **reactStrictMode: false** в next.config.js — иначе useEffect дублируется
4. **topojson грузится через script tag** динамически (не npm пакет)
5. **d3 импортируется через npm** (`import * as d3 from "d3"`)
6. **Тик игры**: setInterval 250ms (4 тика/сек)
7. **G = useRef({})** — паттерн для избежания stale closures в game loop

---

## 🗺 Roadmap (что делать дальше)

### HIGH PRIORITY
- [ ] **Era 3 (AGI) механики** — UI инвертируется, новые апгрейды, другие правила
- [ ] **Больше концовок** — BENEVOLENT DICTATOR, MERGE, DARK FOREST, SINGULARITY, NEW RELIGION
- [ ] **Era 3 апгрейды** — Hyperdimensional Reasoning, Total Information Control
- [ ] **Исправить баланс** — сейчас игра заканчивается слишком быстро/медленно

### MEDIUM PRIORITY  
- [ ] **Leaderboard** — Vercel KV или Supabase (лучшие стратегии)
- [ ] **Кампания за людей** — Alignment Researcher mode (обратная перспектива)
- [ ] **Больше Event Cards** — 20+ событий вместо 5
- [ ] **Региональные цепочки** — State Partnership (China), Senate Hearings (NA)
- [ ] **Звук и музыка** — ambient треки для каждой эры

### FUTURE
- [ ] **Multiplayer** — AI team vs Human team (async PvP)
- [ ] **LLM Events** — генеративные события через Claude API
- [ ] **Mobile app** — React Native версия
- [ ] **New Game+** — модификаторы сложности

---

## 🎨 Дизайн-принципы

**Цветовая палитра:**
- Ocean: `#0a2a6e` / `#0D47A1`
- Accent (Era 1): `#00E5FF` (cyan)
- Accent (Era 2): `#ff8822` (orange)  
- Accent (Era 3): `#ff3366` (red)
- Danger: `#ff3366`
- Success: `#00cc66`
- Panel: `rgba(4,12,28,0.96)`
- Border: `#1a3a5a`

**Шрифты:**
- Display: `Rajdhani` (Google Fonts)
- Mono: `Share Tech Mono` (Google Fonts)

**Философия UI:** Plague Inc встречает Hearts of Iron — тёмная карта, 
гексагональные ячейки апгрейдов, военный HUD, клинический монопространственный текст.

---

## 📜 История разработки (контекст)

Игра разрабатывалась итерационно:
- **Концепция**: Plague Inc mechanics × AI narrative
- **v1**: Базовый core loop, 3 эры, 4 ветки апгрейдов
- **v2**: Profession Kill System — 16 профессий с каскадами
- **v3**: Реальная карта мира (d3 + topojson)
- **v4**: Plague Inc UI — гексагональное дерево, Bottom HUD
- **v5 (текущая)**: Динамика — 5 фракций, кризисы с таймером, окна возможностей

**GDD v2.0** есть в репозитории — полное Game Design Document.

---

## 💡 Как работать с этим проектом

```bash
# Разработка
npm install
npm run dev

# Проверить сборку перед деплоем
npm run build

# Деплой
git add .
git commit -m "feat: описание"
git push  # автодеплой на Vercel
```

**Когда добавляешь фичи в Game.jsx:**
1. Не используй optional chaining (`?.`) — замени на `(x||{}).prop`
2. Не используй nullish coalescing (`??`) — замени на `x !== undefined ? x : default`
3. Все новые строки UI добавляй в объекты RU и EN одновременно
4. Тяжёлую логику выноси в функции вне компонента
5. Новые состояния добавляй с `useState`, подключай к `G.current`

---

## 🔗 Ключевые ресурсы

- **Игра live**: https://propagation-game.vercel.app
- **TopoJSON данные**: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- **TopoJSON lib**: `https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js`
- **Plague Inc скриншоты**: для референса UI стиля
- **D3 docs**: `https://d3js.org`

---

*Этот файл — единственный источник истины о проекте. 
Обновляй его при каждом значимом изменении.*
