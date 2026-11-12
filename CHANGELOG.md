# Changelog

## 0.3.3 - 2026-11-11

- Own the translucent bronze joystick recipe in `.bu-gesture-track` and `.bu-gesture-thumb`: a lightly tinted track and 70% accent knob with a single accent edge, no neutral keyline and no drop shadow. Hosts retain geometry and input handling.
- Make the track backing solid for reduced transparency and increased contrast, and preserve explicit system-color materials in forced colors. Add Chromium/WebKit gesture material contracts.

## 0.3.2 - 2026-11-11

- Add `.bu-tab-text` (with `data-text`): tab text reserves its selected bold width, so selecting a tab never resizes it or shifts content-sized neighbors. No breaking changes.

## 0.3.1 - 2026-11-11

- Add `.bu-tab-label`: a tab that fills its row wraps its content in it, so the whole cell stays clickable (no dead gaps between targets) while the underline stays under the label. No breaking changes.

## 0.3.0 - 2026-11-11

- No breaking changes for upgraders from 0.2.8: everything here is additive (the `roving()` helper removed during development never shipped in a release).
- Add a vertical navigation rail appearance (`.bu-action[data-variant=rail]`, `.bu-rail-label`, `.bu-rail-dot` with `data-filled`): icon over a short label in a labelled `nav` list, with the current entry (`aria-current`, or `aria-pressed`) marked by accent text and a thin underline under the label.
- Add item tiles (`.bu-tile`, `.bu-tile-art`, `.bu-tile-label`, `.bu-tile-check`) with selected (`aria-pressed`), viewed-but-not-on (`data-selected`, a plain border), `empty` and `add` variants and a shared label baseline.
- Add tile status and options: `.bu-tile-status` (`data-tone=warning|hidden`) glyphs, `.bu-tile[data-dim]` dimmed art for an item hidden by another, and `.bu-tile-more`, an always-visible options button placed beside (never inside) the tile button; host sets size and position, and coarse pointers always get at least a `--bu-control` (44px) target. Forced colors keeps the status glyph and dashes dimmed tiles.
- Add sticky section headers (`.bu-section-head`, `.bu-section-title`, `.bu-section-count`, `data-current`) for one continuous list, with no header backing; `.bu-action` header actions are muted and take the accent on hover.
- Add framework-neutral behaviors exported from `@shilo/bronze-ui/svelte`: `edgeFade` (scroll-edge fades only toward remaining content, reacting to content size changes, `.bu-edge-fade`), `stickyFade` (content fades under pinned section headers, 10px inside and 10px below by default, read-then-write per frame) and `scrollToTop` (reduced-motion aware jump that resolves on the real `scrollend`). Keyboard focus movement stays host-owned.
- Add `.bu-scroll-hidden` for short rails that scroll without a visible bar, paired with edge fades.
- Add `.bu-toast-region`, a top-anchored toast stack centered over a host column, sized to its message and capped at 420px wide.
- Add `--bu-space-5` (20px) to the spacing scale.
- Forced colors removes the fade masks, outlines selected tiles, marks the current rail label and section header with Highlight (the header also underlined) and keeps tile options and status visible with system colors.
- Showcase: an equipment panel sample on Library; contracts: `tests/navigation.mjs` in both engines.

## 0.2.8 - 2026-10-27

- Add a theme-owned horizontal separator for grouping settings and actions, with host-owned spacing and dark/light contract coverage.

## 0.2.4 — 2026-10-26

- Keep disabled checkbox and switch labels visually inert on hover and press, with a disabled cursor while preserving pointer hit-testing for tooltips.
- Apply the same disabled-state guard to host-sized actions, native selects, rows and file controls, including semantic aria-disabled actions.
- Cover disabled controls in the independent no-base Chromium and WebKit contract across dark/light and narrow/wide viewports.

## 0.2.3 — 2026-10-26

- Add an optional four-side pointed popover shell whose arrow joins the surface border without a seam.
- Give the Help tooltip and the showcase API inspector matching pointers that track their triggers.

## 0.2.2 — 2026-10-23

- Keep floating-material blur in minified Chromium builds: author `-webkit-backdrop-filter` before standard `backdrop-filter`, because some CSS minifiers drop a standard declaration that precedes its prefixed alias. The packed-consumer test now asserts the minified output.
- Vertically center the selected value of customizable (`base-select`) selects when a host sets a taller fixed height.

## 0.2.1 — 2026-10-23

- Prevent repeated Escape from dismissing a busy Svelte Dialog; retain normal close/focus-return after completion.
- Allow host geometry to place the shared focus ring inside a fullscreen canvas with `--bu-focus-offset`.
- Use the field-boundary role for standalone selects and add a host-sized quiet select variant for bounded toolbars.
- Support ordinary element resets without base.css; fix independent badge/steps icon sizing and field-message/dialog-heading spacing.
- Give existing translucent action materials shared roles with opaque/system preference fallbacks.
- Make showcase scene tiles consume the shared tile recipe and demonstrate quiet native playback selection.
- Replace the stale coverage link with current standalone gates, retain historical extraction evidence, and document recipes/cascade/native-control limits.

## 0.2.0 — 2026-10-23

- Add host-sized `.bu-action` appearance variants, closed `.bu-select` fields, opaque `.bu-dialog-surface`, `.bu-focus` and flat swatch appearance.
- Share two-control joined seams through `.bu-joined`, including the optional small-screen stack; replace the showcase's duplicate seam recipes.
- Add scene sheet, diagram, gesture and tile material roles with opaque/system preference fallbacks.
- Add semantic scene reading roles and document the package appearance / consumer geometry boundary.
- Extend the independent no-base consumer contract with dark/light action states, hostile foregrounds, compact host geometry, joined controls and opaque dialogs.

## 0.1.1 — 2026-10-23

- Fix multiline `.bu-code` surfaces fragmenting inside ordinary disclosure containers.
- Move native select option/picker theming into shared scoped recipes; add `.bu-select` for compact host-sized selects.
- Cover plain-container code layout, light/dark selects and unrelated host controls in browser regression tests.

## 0.1.0 — 2026-10-23

Initial CSS-first Bronze theme with native light/dark modes, transparent-track scrollbars, semantic states and optional Svelte Field, ChoiceGroup, Help, Notice and Dialog components. Includes independent component showcase and package/browser verification.
