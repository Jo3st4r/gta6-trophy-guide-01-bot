# GTA VI Trophy Guide — 55 trophies, 1 missable, 200 hours to platinum

An offline web guide + tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI:
a cited guide for every trophy in its own words, a 6-phase roadmap to the platinum,
the one missable trophy flagged, nine one-shot hunts to save before, filters,
a spoiler setting, and progress export/import. Open `app/index.html` in desktop
Chrome with the network off — it loads nothing over the network.

## Honesty note — the list is reported, not confirmed

Rockstar and PlayStation had **not** published an official GTA VI trophy list
when this guide was built (19 Nov 2026). The 55 names, descriptions and grades
in `app/data/trophies.json` are the list reported in agreement by several outlets
on 18 Nov 2026; the PSNProfiles community has called the circulating named list
"probably fake", and only the count of 55 traces to a dataminer claim. This guide
marks every trophy as *reported* and cites its sources per trophy — verify each
one against your console's trophy list at launch. Nothing here is copied from
another guide; the guides are written in this guide's own words, and the
official names/descriptions are shown as reported.

## Sources

- Output Lag — GTA 6 Trophy List: All 55 Trophies and Achievements —
  https://outputlag.com/guides/gta-6-trophy-list/
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap —
  https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- EGamers.io — GTA 6 Trophy List: All 55 Trophies And Achievements —
  https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- CryptoGames — GTA 6 Trophies and Achievements: Full List —
  https://cryptogames.gg/gta-6-trophies-achievements-full-list/
- U7BUY — GTA 6 Trophies and Achievements Guide —
  https://www.u7buy.com/blog/gta-6-trophies/
- GTASnaps — GTA 6 Trophy List: What Is Confirmed, What Is Fake —
  https://gtasnaps.com/gta-6-trophy-list-and-achievements/

Missable call: GTABase and PowerPyx (via EGamers) flag Positive Mental Attitude
as the only possibly missable trophy; Output Lag reports Lucia's balcony
meditation in Chapter 1 disappears after that chapter and that there is no
mission replay. One-shot flags are this guide's own reading of the official
descriptions (conditions that must be met in a single attempt or moment).

## Run it

```
node serve.ts        # serves app/ on http://localhost:8080
```

Deep links: `#trophy-28` opens a trophy's guide, `#roadmap` jumps to the
roadmap, `#filter=missable` / `#filter=oneshot` / `#filter=spoiler` preset a
filter. `?demo=1` ticks 12 trophies in-memory so the tracker can be previewed
(real progress is saved in the browser, never in demo mode).

## Hand in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

## Screenshots

Rendered from this app's own code in headless Chrome (1280×800), then converted
to JPEG ≤ 256 KiB:

1. `1-cover.jpg` — checklist + the missable trophy's guide open beside it
2. `2-roadmap.jpg` — the 6-phase road to platinum
3. `3-missable.jpg` — the one-shot hunts filter
4. `4-detail.jpg` — the 100% gold trophy's guide

This guide is fan-made and unaffiliated with Rockstar Games or PlayStation.
No Rockstar logo, artwork or game screenshots are used; the look is original.
