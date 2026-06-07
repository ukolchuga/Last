# Notarity Landing + AI Assistant Booking Screen

## Overview
Replace the placeholder home with a Notarity-style landing screen. Clicking **Book an appointment** swaps to a second "AI assistant" screen with a staged entrance animation. Single route, no page reload.

## Color tokens (locked)
- Background: `#f8f8f8`
- Headline / primary text: `#13044f`
- Accent (button, "AI assistant" gradient highlight): `#501dff`
- Muted text: derived slate/violet-gray for sub copy.

## Typography
- Modern sans (Inter), oversized bold headlines in `#13044f`, accent words in `#501dff`.

## Landing screen (`#landing-screen`)
- **Nav**: "notarity" logo · For Business · For Individuals · How it works · About · Login · `[Book an appointment]` accent button.
- **Hero (centered)**:
  - Eyebrow: `ANYWHERE & ANYTIME`
  - H1: `Notarise Documents Online`
  - Sub: `Simplify your business processes…`
  - CTAs: `[Book a notary appointment]` (accent) + `[Book a Demo]` (outline).
  - Visual: CSS-built phone-mockups + calendar card cluster (no external images).

## Booking screen (`#booking-screen`, AI assistant)
Matches the second screenshot:
- H1: `I am your ` + `<span class="accent">AI assistant</span>.`
- H2 (muted): `Where should we begin?`
- Sub: `Drop a document for structure analysis, or describe your situation for a tailored notary solution.`
- Two cards side by side:
  1. **Drop a document** — dashed border card, upload icon, `PDF, DOCX, or Images`.
  2. **Describe situation** — solid white card, edit icon, placeholder `e.g. I need to notarize a power of attorney…` (textarea).
- Small back link to return to landing.

## Transition logic
- React state `view: 'landing' | 'booking'`. No mount-time `setTimeout`.
- Clicking either "Book an appointment" or "Book a notary appointment":
  1. Set `view = 'booking'`.
  2. Add `is-loaded` to `<body>` immediately, then `is-transitioned` after ~400ms.

### Staged entrance on the booking screen
Driven by CSS keyframes + per-element delays (no JS per element):
1. **0 ms** — H1 + H2 fade-in and slide up from `translateY(24px)` → `0`.
2. **250 ms** — Sub copy fades in + slides up.
3. **500 ms** — The two cards (drop + describe) fade in + slide up together with a slight scale-in (`0.97 → 1`).

Each element uses `animation: slideUp 0.6s ease-out both` with staggered `animation-delay`. The body's `is-transitioned` class is the trigger so animations only run after the view switch, not on initial page load.

## Files
- **Edit** `src/routes/index.tsx` — landing + booking markup, view state, click + body-class handlers.
- **Edit** `src/styles.css` — color tokens, hero gradient washes, `@keyframes slideUp`, `.is-loaded` / `.is-transitioned` hooks, staged delays for booking-screen elements.
- No new routes, no backend, no new packages.

## Out of scope
- Real upload handling / AI calls — the cards are visual placeholders (textarea is interactive but not submitted anywhere).
- Persisting which screen the user is on across reloads.