# Bronze UI 0.2.2 patch

2026-10-23. Found during the PixelDoll production/prototype visual review; offline checks only.

## Findings

- **Floating blur lost in minified builds.** PixelDoll's Vite 8 production build (lightningcss) rewrote `.bu-floating { backdrop-filter:…; -webkit-backdrop-filter:… }` to the prefixed declaration only. Chromium ignores that alias, so menus and popovers rendered 92% surface with no blur and underlying text showed through. Reproduced directly: standard-then-prefixed collapses to `-webkit-` only; prefixed-then-standard keeps both. Shared recipes and the reduced-transparency/forced-colors overrides now author the prefixed form first.
- **Top-aligned customizable select values.** `appearance:base-select` lays the select out as `inline-flex` with `align-items:normal`, so a host-sized select taller than its content (PixelDoll's 44px playback move picker) showed its value at the top. The shared select recipe now centers it.

## Validation

Pinned Node 24.22.1 / npm 11.19.1; Playwright 1.64.1 with managed Chromium and WebKit 2370; built showcase served locally.

- `npm run check`: zero errors/warnings. `npm run build`: package and standalone entries built.
- `npm test`: archive and clean consumer passed; the packed Svelte consumer's minified Vite CSS is now asserted to keep the standard `backdrop-filter`. The assertion fails with the old declaration order and passes with the fix.
- `tests/contracts.mjs`, `tests/materials.mjs`, `tests/robustness.mjs`, `tests/showcase.mjs` (48 cases): passed in Chromium and WebKit.

## Published artifact

[v0.2.2 archive](https://github.com/Shilo/bronze-ui/releases/download/v0.2.2/shilo-bronze-ui-0.2.2.tgz) from tag/source commit `e4a33434c2c8c8ef3d5c0983c9ddbb66ff0ecd2f`: **15,445 bytes / 21 files**. SHA-256 `c87ae359ac37ce33fcb7ba0b627bdb64b5d1df968f4a7d7844dfe4acf9dbf256` (matches GitHub asset metadata); npm integrity `sha512-npckGHTepLm7/w24Qh0eT/bLA4LdH5HobR+izTewPHrrTQ16LffhiFaLwCdFlBlFYM5g/Y8LZYGlBewiWLScpA==`. The downloaded archive's `components.css` carries the prefixed-first order. [Tag verification and release](https://github.com/Shilo/bronze-ui/actions/runs/40067949059) succeeded (verify and release jobs).
