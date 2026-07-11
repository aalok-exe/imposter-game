# The Imposter

A pass-and-play party game: everyone gets the same secret word except the
imposter(s), who get a related clue instead. Talk it out, vote out loud, then
reveal who was lying.

This is a local, single-device game — no accounts, no backend, no internet
needed once loaded.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. For the real pass-and-play feel, open it on
your phone's browser instead of desktop (see "test on your phone" below).

## Project structure

```
src/
  types.ts               # Player, WordPair, Category, GameSession types
  data/categories.ts      # word/clue pairs, grouped by category
  data/categoriesHard.ts   # harder, more indirect clue set
  utils/gameLogic.ts      # shuffle, pick imposters, pick starting player
  components/
    SetupScreen.tsx        # Step 1: players, imposter count, category
    RevealScreen.tsx        # Step 2: pass-and-play card reveal
    BriefingScreen.tsx      # Step 3: starting player + how to play out loud
    ResultsScreen.tsx       # Step 4: reveal word, clue, imposter(s)
    StepTabs.tsx / StampButton.tsx   # shared UI
  styles/global.css        # the whole visual design (CSS variables at top)
  App.tsx                 # phase state machine tying screens together
public/pwa/               # generated PWA icons (192/512/maskable/apple-touch)
assets/                   # source icon for Capacitor's asset generator
android/                  # native Android Studio project (via Capacitor)
vite.config.ts            # includes vite-plugin-pwa manifest/service worker config
capacitor.config.ts       # Capacitor app id, name, web dir
```

## Add more words

Everything lives in `src/data/categories.ts`. Each entry is a
`{ word, clue }` pair — `word` goes to civilians, `clue` goes to the
imposter. Add a new category or extend an existing one's `pairs` array; no
other code needs to change. Good clues are related but distinct enough that
an imposter has to bluff (e.g. `Beach` / `Desert`, `Titanic` / `Avatar`).

## Test on your phone (same wifi)

```bash
npm run dev -- --host
```

Vite will print a `Network:` URL — open that on your phone's browser while
it's on the same wifi network as your computer.

## Deploy for free (so anyone can open a link)

```bash
npm run build
```

This produces a `dist/` folder — a fully static site (no server needed).

- **Fastest / no account:** go to
  [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dist`
  folder in. You get a live public URL immediately.
- **Durable / connected to git:** push this repo to GitHub, then import it on
  [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com) —
  build command `npm run build`, output directory `dist`. Every push
  auto-deploys.
- **GitHub Pages:** also works for a static Vite build; see
  [Vite's deployment guide](https://vite.dev/guide/static-deploy.html) for
  the `base` config tweak it needs.

## Install it on Android (already set up — no Play Store needed)

The app is a full **PWA** (`vite-plugin-pwa`): once it's deployed to any
HTTPS URL above, open that URL in Chrome on Android, tap the **⋮ menu →
"Add to Home screen" / "Install app"**, and it installs with a real icon,
splash screen, and offline support (via the generated service worker) — no
Android Studio, no APK, no Play Store review.

## Build a real Android APK (Capacitor — already scaffolded)

The `android/` folder is a ready-to-open native Android Studio project,
wired up via [Capacitor](https://capacitorjs.com/) with generated adaptive
launcher icons. You'll need [Android Studio](https://developer.android.com/studio)
installed locally (it manages the Android SDK/Gradle downloads itself):

```bash
npm run cap:sync   # rebuilds the web app and copies it into android/
npm run cap:open   # opens the project in Android Studio
```

From Android Studio: **Run ▶** to test on an emulator/device, or
**Build → Generate Signed App Bundle/APK** to produce a release build you can
sideload or upload to the Play Store. `capacitor.config.ts` has the app id
(`com.imposter.thegame`) and name — change the app id before a real release
if you plan to publish it.

Whenever you edit anything in `src/`, re-run `npm run cap:sync` before
opening/rebuilding in Android Studio — the native project only sees what's
in `dist/`.

## Ideas for v2
##<b>Coming Soon</b>

- Custom word packs (let players type in their own word before the game)
- A "spicy" difficulty: clues that are much closer to the real word
- Imposter can win by guessing the secret word correctly after being caught
- Simple stats: track win/loss across a game night
- Online multiplayer (would need a real backend — WebSockets — bigger jump
  from this pass-and-play version)
