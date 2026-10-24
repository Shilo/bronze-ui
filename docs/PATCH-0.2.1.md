# Bronze UI 0.2.1 independent audit response

2026-10-23. Scope: upstream shared-theme findings in the independent PixelDoll redesign audit. Offline checks only; no production PixelDoll source, credentials, generations or stored projects touched.

## Findings accepted with bounded scope

- **F10 boundary:** standalone `.bu-select` used a decorative rim where the guide requires a meaningful field boundary. It now uses `--bu-border`, measured at least 3:1 against the closed field in both modes. Quiet `data-variant="quiet"` is appropriate inside an already bounded playback toolbar and preserves the host's dimensions/type, native picker and focus.
- **F12 busy dismissal:** reproduced in Chromium: third consecutive Escape closed a busy dialog. Preventing Escape's keydown default as well as handling native cancel keeps it open through four presses. Completion restores ordinary Escape close and opener focus. The fixture controls busy state explicitly; it does not depend on a timer.
- **F13 no-base recipes:** ordinary universal/element resets defeated the zero-specificity sizing/type net. Namespaced defaults now resist those resets, badge/steps SVGs receive shared dimensions, field messages and dialog headings own their spacing. Higher-specificity/unlayered overrides remain subject to the normal CSS cascade.
- **F14 specimen:** scene tiles now consume the public tile recipe; playback demonstrates the quiet native select. The independent no-base entry remains the isolation proof.
- **F15 docs:** corrected guide version, recipe index/composition requirements, missing material changelog, current standalone coverage, preserved historical lab evidence and recorded the immutable 0.2.0 release digest.
- **Material fallback gap:** existing action hover/outline/row/direction translucency bypassed opaque preference fallbacks. Their colors now use shared roles with reduced-transparency, increased-contrast and system-color variants.
- **Consumer integration need:** `--bu-focus-offset` keeps the default 3px focus geometry while allowing a host's fullscreen canvas to request -3px inset placement with the same themed 2px ring.

## Findings challenged

- The native select triangle differing from Lucide is not itself a defect. Native affordances are retained; no decorative mask was added.
- Transparent scrollbar tracks and classic versus overlay scrollbars are independent. The prefixed fallback remains documented, including possible classic gutters; no OS overlay guarantee is made.
- A reusable CSS recipe cannot promise immunity to arbitrary hostile host styles. Cascade-layer advice now explains that unlayered rules outrank layered styles; wrapping Bronze alone is not a fix.
- A component showcase need not duplicate PixelDoll's creator presets, mirror placement or frame validation. Those are consumer workflows. No speculative components were added to close a workflow inventory.
- Platform font fallback and Georgia display names are deliberate documented choices. F22 is a subjective redesign request, not a patch defect; the approved typography remains.
- A scene-specific worst-pixel contrast reading does not establish a defective global muted token. Work-surface contrast remains sound; consumers must provide suitable reading backing over their artwork.
- A literal dimension/mix ratio or a role used by one consumer is not automatically unnecessary code. Only the demonstrated missing preference fallbacks warranted changes; no public roles were removed.
- Different line endings in a local archive do not invalidate an immutable published artifact. Published digest provenance is recorded separately from the local patch archive.

## Validation

Pinned Node 24.22.1 and npm 11.19.1; Playwright 1.64.1, Chromium 156.0.8078.4 and managed WebKit revision 2370. Built-site base: `http://127.0.0.1:5215/bronze-ui/`.

- `npm run check`: zero errors/warnings. `npm run build`: package and two standalone entries built.
- `npm test`: archive contents and clean CSS-only consumer passed; isolated installed archive compiled with strict Svelte/TypeScript and Vite. Final local Windows archive: 15,465 bytes, 21 files, SHA-256 `1229f3174e05ce329b112d1f7dadf89c2608af45dcf096b8cf7aedddc7bec7c2`. This is a local test artifact, not the future CI release digest.
- `tests/contracts.mjs --chromium` / `--webkit`: form safety, initial radio keyboard operation, host foregrounds and four theme/geometry cases per engine passed.
- `tests/materials.mjs --chromium` / `--webkit`: eight viewport/theme cases per engine, each testing full/compact/quiet selects and code surfaces, passed.
- `tests/robustness.mjs --chromium` / `--webkit`: both appearances passed ordinary resets, field width/message spacing, independent SVG sizing, select contrast/quiet geometry, four busy Escapes followed by normal close/focus return, opaque preferences and forced-colors quiet focus.
- `tests/showcase.mjs` / `--webkit`: 48 screen/theme/viewport cases per engine passed, with no page errors/external requests. After the sole subsequent focus-offset geometry addition, rebuilt and reran contracts/robustness in both engines plus the final archive consumer test; those passed too.
- Final Chromium screenshots of both closed/open native pickers and the scene were captured under local `.evidence/`; light open picker and dark scene inspected for continuity. Earlier 390px light scene inspected as well.

Physical devices, assistive technology and exhaustive production workflows remain consumer integration checks. This patch does not constitute a complete application accessibility review.


## Published artifact verification

Published [v0.2.1 archive](https://github.com/Shilo/bronze-ui/releases/download/v0.2.1/shilo-bronze-ui-0.2.1.tgz) from immutable tag/source commit `36e9b63e2cdd691a929dabaa6a102f431fe26e3d`: **15,398 bytes / 21 files**. SHA-256 `a5d715362081444f16184b3145cb12dec96a34f99f09f025235eb2c7533258d6`; npm integrity `sha512-uksoZ1jzmDLSAKWzDctQE8EPPt/sJ2eZvIg9WxLOkid1F3ZyBvjVLplQZ8i7WeAo9Kf16azeLWQTs5Q9y5NsVg==`.

Downloaded the public release asset and recomputed both digests; SHA-256 matches GitHub's asset metadata. Every packaged file matches source/generated dist after CRLF/LF normalization. Only `styles/components.css`, `styles/tokens.css`, `package.json`, `README.md`, and `dist/Dialog.svelte` differ by line endings. The public Linux archive is distinct from the local Windows test archive described above.

[Main verification and Pages deployment](https://github.com/Shilo/bronze-ui/actions/runs/40042877863) succeeded. The public showcase serves the final `index-BwWP3Spu.js` / `index-BCd3uoBr.css` bundles. [Tag verification and release](https://github.com/Shilo/bronze-ui/actions/runs/40042878104) succeeded on attempt 2, including all Chromium/WebKit gates after the focus-offset addition. Attempt 1 stalled during apt mirror setup and was canceled; the authorized fresh-runner retry preserved the same source/tag and all release gates. No artifact or tag was overwritten.
