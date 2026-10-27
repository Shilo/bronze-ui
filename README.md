# Bronze UI

A lightweight, CSS-first theme for immersive interfaces. Warm Bronze accents, quiet surfaces, readable controls, and native light and dark modes. Built for character tools and equally usable in other focused applications.

**[Live component showcase](https://shilo.github.io/bronze-ui/)** · [Style guide](docs/STYLE-GUIDE.md) · [Releases](https://github.com/Shilo/bronze-ui/releases) · [MIT license](LICENSE)

## Install

Releases are distributed as an npm-compatible **GitHub release tarball**. It is not published to the npm registry.

```sh
npm install https://github.com/Shilo/bronze-ui/releases/download/v0.2.3/shilo-bronze-ui-0.2.3.tgz
```

Commit your lockfile to retain the resolved archive and integrity hash. The installed package name is `@shilo/bronze-ui`. CSS has **zero JavaScript dependencies**. The example gallery, artwork and development tools are excluded from the package archive.

## CSS quick start

```js
import '@shilo/bronze-ui/style.css';
```

```html
<html lang="en" data-theme="dark">
  <!-- Set data-theme="light" to switch both custom and native controls. -->
  <button type="button" class="bu-btn" data-variant="primary">Create character</button>
  <label class="bu-field">Name <input class="bu-input" /></label>
</html>
```

For existing applications, import **tokens + components** and keep your existing page resets/layout:

```js
import '@shilo/bronze-ui/tokens.css';
import '@shilo/bronze-ui/components.css';
// Optional: document-wide body/type/icon/reset defaults.
// import '@shilo/bronze-ui/base.css';
```

`style.css` opts into all three files. Tokens set root color roles, native color-scheme and transparent-track scrollbars. Component selectors use the `bu-` namespace. `base.css` intentionally changes document typography and native element defaults: do not import it blindly into an established app. Theme state/persistence belong to your application; the showcase demonstrates a single Light mode / Dark mode action.

## Appearance without layout migration

Use `.bu-action` on host-sized buttons and links. Its `data-variant` values are `primary`, `outline`, `tile`, `field`, `row`, `direction` and `tab`. The package owns their surfaces, borders, colors and interaction states; the host retains width, height, padding, placement and typography. `.bu-btn` remains the full control recipe when shared dimensions are desired. Set a readable inherited foreground for unfilled actions; filled variants provide their own foreground.

`.bu-select` provides closed native field and progressive picker appearance without input dimensions. Use `data-variant="quiet"` inside an already bounded toolbar to keep its closed surface transparent while retaining the themed picker and keyboard focus. `.bu-dialog-surface` supplies opaque work material without dialog geometry or behavior. `.bu-focus` adds the shared keyboard focus indicator to an existing interactive element; `--bu-focus-offset` optionally moves it inside a fullscreen canvas (default `3px`, inset example `-3px`). `.bu-swatch-flat` colors an existing host-sized swatch using `--swatch` without imposing dimensions.

Use `.bu-joined` for a pair of adjacent controls sharing one border seam. `data-stack="small"` stacks that pair at widths up to 380px. It is a two-control recipe; a single child retains its corners. The host chooses sizes, accessible labels and state/keyboard behavior. Root `--bu-reading-start` and `--bu-reading-end` roles support scene reading gradients without copying theme colors into the host. See the [style guide](docs/STYLE-GUIDE.md) for the ownership contract.

## Optional Svelte 5 components

CSS does not need Svelte. Consumers of the Svelte entry must install **both optional peers**:

```sh
npm install svelte@5.57.2 @lucide/svelte@1.61.0
```

```svelte
<script>
  import { ChoiceGroup, Help } from '@shilo/bronze-ui/svelte';
  import '@shilo/bronze-ui/style.css';
  let view = $state('Preview');
</script>
<ChoiceGroup label="View" options={['Preview', 'Top-down', 'Side-scroller']} bind:value={view} />
<Help label="View help" text="Preview keeps the character stationary." />
```

Exports: `ChoiceGroup`, `Field`, `Help`, `Notice`, `Dialog`, with generated TypeScript declarations and source Svelte exports. Import the shared CSS separately. All internal action buttons use `type="button"`. Choice groups remain keyboard-reachable when initially unselected. For `Dialog`, pass `returnTo={event.currentTarget}` when opening it so pointer activation restores focus consistently in WebKit; otherwise it falls back to the active element. If the opener can be removed, provide a focusable host `<main tabindex="-1">` for the final fallback. Labels, content and actual workflow validation remain consumer responsibilities.

## Design contract

- Complete semantic dark/light pairs; no inversion filters or artwork recoloring.
- Three roles: open scene, restrained floating controls, opaque work surfaces.
- 8 / 12 / 16 px corners, 16 px body and 14 px secondary type; shared visible focus and states.
- Quiet themed scrollbar thumbs with **transparent tracks**, native width and high-contrast system fallback.
- Reduced-motion/transparency and forced-colors support. Blur is an enhancement, never the source of legibility.
- Native fields, dialogs, disclosures and popovers; no custom window manager or scrolling engine.

This is a theme and a small set of behaviors, not a complete application framework or an accessibility certification. See [coverage and limits](docs/COVERAGE.md). Physical mobile performance and assistive-technology combinations need testing in each host application.

## Develop and verify

Use Node 24.22.1 (`.nvmrc`) and npm 11.19.1 with the committed lockfile.

```sh
npm ci
npm run package
npm run dev
# http://127.0.0.1:5204/bronze-ui/
npm run check
npm run build
npm test
npx playwright install chromium webkit
npm run preview
# in a second terminal:
npm run e2e
npm run test:contracts
```

The showcase is a standalone Vite/Svelte site. Its six sections cover Scene, Controls, Creator, Library, Feedback and Overlays with genuine states, local demo artwork and no account/API connection. Actions labelled sample are local simulations. Assets are committed with [provenance](showcase/assets/README.md), so a clean checkout builds independently. It is deployed from `site/` using GitHub Actions Pages with the `/bronze-ui/` base path.

## Repository layout

`styles/` owns reusable CSS; `src/lib/` owns optional Svelte behaviors; `dist/` is generated package output; `showcase/` owns the independent gallery and demo art; `tests/` covers the package/browser contract; `docs/` records design, scope and reviews. Built site, evidence, node_modules and release archives are not committed.

Pull requests run checks, package validation, build and offline browser tests. Main deploys Pages after checks. Tags matching `v*` publish a GitHub release containing the verified npm archive; tags and archives must not be overwritten. No npm token or paid service credentials are required.

## License and attribution

MIT © 2026 Shilo. Originated in [PixelDoll](https://github.com/Shilo/PixelDoll). Lucide/Feather and demo-media provenance are documented in [NOTICE.md](NOTICE.md). Showcase artwork is not part of the reusable theme package.
