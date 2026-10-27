# Changelog

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
