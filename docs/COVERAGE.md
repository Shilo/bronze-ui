# Standalone package coverage

Bronze UI is a CSS theme, five optional Svelte components and three framework-neutral DOM behaviors, not a complete Studio implementation or accessibility certification.

| Gate | What it checks | Limits |
| --- | --- | --- |
| `npm run check` | Svelte/TypeScript components and showcase | No runtime accessibility claim |
| `npm run build` | Generated package and standalone Vite site | No deployed-site claim |
| `npm test` | Archive contents; clean CSS-only consumer; isolated packed Svelte + strict TypeScript consumer | No registry publication |
| `tests/showcase.mjs` | Six sections × two themes × four viewports, real sample state, focus, native overlays, fallback modes and no external requests | Offline simulated work, no backend or paid requests |
| `tests/contracts.mjs` | No-base imports, form safety, choice keyboard behavior, appearance, centered toast icons, surface activation/close separation and host-owned geometry | Ordinary CSS cascade, not arbitrary host override immunity |
| `tests/materials.mjs` | Code surfaces, native/advanced select options, disabled choices and unrelated host controls | OS picker chrome remains native |
| `tests/navigation.mjs` | Tab marker, navigation rail `aria-current` styling (and `false`), filled dot and hidden scrollbar, tile status tones, dimmed art and sibling options button (rest, expanded, focus), edge fades only toward remaining content, tile selected/empty/add appearance and label baseline, sticky header fade position and clearing, no header backing, top toast region anchoring and width cap, forced-colors mask removal, tile outline, dashed dimmed tile and underlined current header, at 900 and 320 px in both themes | Fixed fixture geometry; real smooth-scroll timing and the rail's arrow keys (a showcase helper) are covered by the showcase |
| `tests/robustness.mjs` | Element resets, width containment, independent icons/errors, select boundary contrast, quiet geometry, four busy Escapes and opaque material fallbacks | Chromium/WebKit automation, no physical device/assistive technology claim |

Use `--chromium` or `--webkit` on the browser scripts to select an engine. Set `BRONZE_BASE_URL` when using another localhost port. The standard contract command runs all contract scripts in both engines. Browser binaries must match the pinned Playwright revision.

The showcase intentionally demonstrates component families with local data. Its creator presets, compass and frame controls are representative examples, not the PixelDoll application's validation/rig workflow. The independent `contract.html` imports tokens/components without the optional document reset. Scene tiles consume the same `.bu-action[data-variant=tile]` recipe as hosts; playback demonstrates the quiet native select. Typography uses intentional platform font fallbacks.

No full production migration, exhaustive component/state/context coverage, screen-reader certification, physical mobile/GPU testing, complete queue/cost/recovery workflow, or arbitrary cascade isolation is claimed. The original extraction record is retained as [historical PixelDoll lab evidence](HISTORICAL-PIXELDOLL-LAB.md). Release evidence is recorded separately in the release/patch reviews.
