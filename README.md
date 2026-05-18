# Catalyst Music Companion

A single-page web app for gigging musicians — chord charts that auto-scroll in time, transpose on demand, and run a full multi-set gig end-to-end.

**Live app:** https://zhikang-wong.github.io/catalyst-music-companion/

## Features

- **Gig > Set > Song hierarchy** — organize your night's setlists
- **Left sidebar table of contents** — jump across sets and songs in one tap
- **Auto-scroll** — BPM-aware scroll with a moving highlight on the current line
- **Visual metronome** — beat-dots row pulses at the song's BPM with downbeat emphasis
- **Transpose on the fly** — +/− semitones with correct enharmonic spelling (Bb not A#)
- **Section jumps** — Verse / Chorus / Bridge buttons for quick navigation
- **Progress bar** — elapsed / remaining time at the current scroll speed
- **End-of-set handoff** — explicit "Start next set" card; no auto-advance into a break
- **Works offline** — single HTML file, no backend, no accounts

## Stack

- One HTML file (no build step)
- Vanilla JS + CSS Grid layout
- Two-line chord-over-lyric parser converts pasted tabs to inline ChordPro
- `requestAnimationFrame` scheduler for jitter-free metronome and scroll

## Running locally

Open `index.html` in any modern browser. That's it.

## Deploying

Pushed to GitHub Pages. Enable Pages on the repo (Settings → Pages → Source: `main` branch, root) and the live URL above will serve `index.html`.
