# Gigging Musician Companion — v1 Product Spec

_Working title. Single-page web app for a tablet on a music stand._

---

## 1. Problem

A gigging musician on stage juggles paper, PDFs, Ultimate Guitar tabs, and capo math — none of which adapt to their tempo, their key, their setlist. They need hands-free, glanceable chord charts that scroll in time with the song, transpose on demand, keep them locked to tempo, and run a full multi-set gig end-to-end.

## 2. Primary user

Solo or small-band gigging musician (guitar, keys, or any instrument that reads chord symbols) playing covers and originals at bars, weddings, restaurants. Tablet on a stand. Hands on the instrument. Eyes glance, don't read.

## 3. Core jobs-to-be-done

1. **Load a chord chart** — paste ChordPro or chords-over-lyrics text, or upload a `.cho` / `.txt` file.
2. **See BPM at a glance** — displayed prominently next to the song title.
3. **Stay locked to tempo** — a persistent **visual metronome** pulses at the song's BPM, visible in peripheral vision without blocking the chart.
4. **Auto-scroll in time with the song** — press play, chart scrolls smoothly with a moving highlight on the current line. Pause, restart, jump-to-section.
5. **Transpose on the fly** — `+` / `−` semitone buttons re-render chords instantly. Per-song transposition is remembered.
6. **Run a full gig** — organise songs into **Gig > Set > Song**. Open the app to tonight's gig, walk through each set, advance song-by-song, take a break, hit the next set.

## 4. Locked design decisions

| Area | Decision | Rationale |
|---|---|---|
| Chord source | Manual paste + ChordPro upload only | No scraping, no APIs, no auth. Ships fast. |
| Scroll sync | BPM-based timer (no audio) | No backing tracks required. Per-song scroll-speed slider for calibration. |
| Instrument | Agnostic — chord names only, no diagrams | Works for any instrument. Massively simpler render. |
| Top-level object | **Gig** (containing Sets, containing Songs) | Matches real gigging; supports multi-set nights with breaks. |
| Song library | Global, shared | Songs are referenced by sets, not copied. Edit once, propagates. |
| Section jumps | Tappable Verse / Chorus / Bridge buttons | Huge stage-UX win. Costs ~half a day. |
| Visual metronome | Persistent **beat dots row** pulsing at BPM, beat 1 brightest, honours time signature | Most precise glanceable reference; scales to 3/4 and 6/8. Positioned peripherally so it doesn't block the chart. |
| End of set | Show a **"Set complete" handoff card** with a button to start the next set | Explicit handoff — break lengths are unpredictable; no chart scrolling away in a bag. |
| Audio click | Optional toggle, off by default | Some musicians want a quiet click in IEMs. |
| Storage | Local-only via IndexedDB | Offline-first. Venues have bad wifi. No account needed. |
| Platform | Web app, iPad-first responsive | Vibecode-friendly. No app-store friction. PWA-installable. |

## 5. Feature list

### Must-have for v1

- **Song library** — local CRUD, stored in IndexedDB. Songs are reusable across sets and gigs.
- **Song editor** — paste ChordPro / chords-over-lyrics, set title, BPM, original key, time signature.
- **Gig management** — create a gig with venue, date, time. List of upcoming and past gigs.
- **Set management within a gig** — add named sets (Set 1, Set 2, Encore), reorder, set planned duration.
- **Song management within a set** — add songs from library, reorder, remove.
- **Performance view** — large text, dark mode, chords above lyrics.
- **Auto-scroll** — play/pause, moving highlight on the current line.
- **Per-song scroll speed** — slider, calibrate once, saved.
- **Transpose** — `+` / `−` semitone, remembered per song. Sharps/flats rendered correctly (e.g. Bb not A#) for flat keys.
- **Section jump buttons** — tappable buttons that scroll to `{start_of_verse}`, `{start_of_chorus}`, `{start_of_bridge}` markers.
- **Visual metronome** — persistent indicator pulsing at the song's BPM with downbeat (beat 1) emphasis. Honours time signature. Stays visible during scroll; positioned peripherally so it doesn't obscure the chart.
- **Optional audio click** — toggleable per gig or globally. Off by default.
- **Next / previous song** within a set; auto-flow into next set when the current set ends.
- **Offline-first** — fully usable after first load.

### Deferred (v2+)

- Set break / interval countdown timer between sets
- Foot-pedal / Bluetooth keyboard control (page-up/down)
- Capo suggestions on transpose
- Gig / setlist import/export
- PWA install polish
- Per-gig notes (e.g. "no encore tonight", "Sarah on backing vocals")

### Out of scope (not v1, not v2)

- Online chord search / auto-fetch
- Backing tracks / audio sync
- Live mic listening for position tracking
- Multi-user or band sync
- Cloud accounts
- Chord diagrams (guitar / uke fretboards)
- PDF or image OCR

## 6. Data model (sketch)

```ts
Song {
  id: string
  title: string
  artist?: string
  originalKey: string        // "C", "Bb", "F#m", etc.
  bpm: number
  timeSignature: string      // "4/4", "3/4", "6/8"; default "4/4"
  chordPro: string           // raw ChordPro source
  scrollSpeed: number        // pixels per second, user-calibrated
  transposeOffset: number    // remembered semitone offset, e.g. -3
}

Set {
  id: string
  name: string               // "Set 1", "Encore"
  songIds: string[]          // ordered references into Song library
  plannedDurationMin?: number
}

Gig {
  id: string
  name: string               // "Friday at The Tavern"
  venue?: string
  date: Date                 // includes start time
  sets: Set[]                // ordered; sets are owned by the gig
  notes?: string
}
```

Note: `Set` is owned by a `Gig` (not a top-level entity). `Song` is global and referenced by ID. This means a song edit (e.g. fixing a typo, updating chords) flows through to every set and gig that uses it.

## 7. UI surfaces

1. **Gig home** — list of upcoming gigs (today highlighted) and past gigs. "+" to create a new gig.
2. **Gig view** — gig metadata (venue, date), ordered list of sets, each set showing song count and planned duration. Tap a set to open it. Edit/reorder sets here.
3. **Set view** — ordered songs in the set, each showing title, key, BPM, duration estimate. Tap a song to enter performance view. Add/remove/reorder songs from here, picking from the global library.
4. **Song library** — all songs, searchable. "+" to create. Reachable from set view (to add) and from main nav.
5. **Song editor** — title, artist, BPM, time signature, original key, ChordPro textarea, save.
6. **Performance view** — the one that matters most:
   - **Top bar**: song title, BPM, current key, transpose `−` / `+`, scroll-speed slider, position in set ("Song 3 of 8 — Set 1")
   - **Body**: rendered chords above lyrics, large font, dark mode, moving highlight on current line
   - **Persistent visual metronome**: positioned peripherally (corner or thin edge bar), pulses at BPM, downbeat emphasised, never overlaps lyric/chord text
   - **Footer**: Play/Pause, section jump buttons (Verse, Chorus, Bridge), restart, prev/next song
   - **End-of-set behaviour**: when the last song in a set ends, show a **"Set complete" handoff card** with the next set's name, song count, and a single "Start Set 2" button. Musician decides when to resume — no auto-advance.

## 8. Visual metronome — design notes

**Style: beat dots row.** A row of N small dots (N = beats per bar from the song's time signature), each lighting up in sequence on each beat. Beat 1 is brightest and visually distinct (e.g. larger, accent colour); other beats pulse softer.

Placement: top-right or bottom-centre of the performance view, in peripheral vision, never overlapping lyrics or chords. Compact (think ~24px dots) so it reads at a glance but doesn't dominate.

Rules:
- Pulses at song BPM, starts in sync with Play, stops with Pause.
- Respects time signature: 4/4 → 4 dots, 3/4 → 3 dots, 6/8 → 6 dots.
- Beat 1 visually distinct in size and colour.
- Reduced-motion mode (smaller pulse, no scaling) for users who find motion distracting.
- Shares its clock with the optional audio click so visual and audio stay locked together.

## 9. Tech stack

- **Next.js 15 + TypeScript + Tailwind** — fast to vibecode, great DX, deploys free to Vercel.
- **ChordSheetJS** — ChordPro parsing + transposition with correct sharps/flats.
- **Dexie** — thin IndexedDB wrapper for offline songs/sets/gigs.
- **Zustand** — lightweight state store for player state (current song, scroll position, play/pause, metronome).
- **Tone.js** — only for the optional audio click (precise timing). Visual metronome can use `requestAnimationFrame` + `performance.now()` for jitter-free pulsing.
- **Framer Motion** (optional) — smooth scroll and beat-pulse animation.

No backend. Pure client app. iPad Safari is the primary target.

## 10. Open risks

- **Scroll drift.** A flat timer can't know if the band slows down. Mitigation: easy nudge controls (slow down / speed up by a hair) on the performance view.
- **Metronome drift.** `setInterval` is jittery. Use a `performance.now()`-based scheduler that compensates per tick; both visual and audio click should share the same clock.
- **ChordPro variance.** User-pasted charts will be messy. ChordSheetJS handles standard ChordPro; we'll need a small "auto-detect chords-over-lyrics → ChordPro" helper for Ultimate Guitar-style copy-paste.
- **Highlight accuracy.** Highlight a *line* (simple, robust) rather than a *word* (overengineered for v1).
- **Song edits propagating.** Because sets reference songs by ID, a key/BPM edit changes every set using that song. This is the right default, but the editor should warn: "This song appears in 3 upcoming gigs."

## 11. Success criteria for v1

- Musician can create a gig with two sets totalling 18 songs, transpose any song on the fly, and play through both sets with auto-scroll, visual metronome, and section jumps — without touching the tablet between songs (except play/pause and next).
- Visual metronome stays locked to BPM for the duration of a 5-minute song without perceptible drift.
- Works fully offline on an iPad in Safari.
- From cold start to "playing the first song of tonight's gig" in under 10 seconds.
