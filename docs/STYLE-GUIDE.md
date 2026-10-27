# Bronze theme style guide

Bronze UI v0.2.1. Shared visual and interaction contract. The showcase demonstrates the theme independently of any application backend.

## Ownership and native appearance

`styles/base.css` contains optional document-wide defaults; `styles/tokens.css` owns semantic colors, typography, shared geometry, materials and preference fallbacks. `styles/components.css` owns reusable control recipes. `src/lib/*.svelte` owns repeated behavior: labelled fields, help, dialogs, exclusive choices and notices. `showcase.css` owns only this gallery's composition and the explicitly scoped bridge to the existing `RequestFields` component. `App.svelte` supplies local example data and interactions.

Dark and light are complete native modes. Set `data-theme` on the document root and its matching `color-scheme`. All authored UI uses semantic variables; native inputs, selects and scrollbars receive the same scheme. Default to dark, retain an explicit choice, and expose one ordinary sun/moon button labelled **Light mode** or **Dark mode**, naming the action. Do not expose palette names as switcher options. The lab uses a separate storage key from the application.

Never implement light mode by inverting, tinting or filtering a container. Theme changes replace scene assets and UI roles; actual source character pixels remain unchanged. Equipment palette colors are artwork data, not theme tokens. Reflection is a separate optional rendering layer, never a shader over the source sprite.

| Semantic role | Dark | Light | Use |
| --- | --- | --- | --- |
| Canvas | `#111317` | `#EEEAE2` | App backing and scene reading gradients |
| Surface / field | `#202329` | `#FAF7F0` | Work surfaces and legible inputs |
| Text | `#F2EEE6` | `#25282D` | Primary text and icons |
| Muted | `#B8B5AD` | `#5E625F` | Useful secondary text; never imply disabled by this role alone |
| Accent | `#C9A66B` | `#76562F` | Primary action, focus, selected marker |
| On accent | `#111317` | `#FFFFFF` | Text/icons on the filled action |
| Success | `#84C79A` | `#226C43` | Confirmed successful state |
| Warning | `#E7BC75` | `#775319` | Reviewable concern |
| Danger | `#F2A099` | `#A3312F` | Failure/destructive action |
| Information | `#9BBCE5` | `#345F8E` | Neutral explanation |

These values are documented here for review; CSS is their runtime source. Never copy these literals into a new control. Derive field borders from 80% muted + surface, decorative dividers from 27%, selected fill from 13% accent and hover fill from 7% text. A subtle divider is not a sufficiently visible field boundary. Status always includes readable text and, where appropriate, a distinct icon.

## Three material roles

1. **Scene:** open world with local reading gradients, no enclosing dashboard card. Identity on the left; equipment controls on the right on desktop. Preserve the character as the focal point.
2. **Floating:** a small playback bar, contextual popover or toast. Use 92% surface backing with a restrained 12 px backdrop blur, one rim and one small elevation shadow. Legibility must come from the backing, not the blur. Never nest floating filters or filter a sprite ancestor.
3. **Work:** opaque surface for forms, review, request data and dialogs. Long reading tasks do not benefit from distracting scenery through their text.

Apple Liquid Glass inspires separation of content and controls, not optical imitation. Material 3 Expressive informs semantic roles and emphasis, not a new visual identity. GlassKit remains a historical comparison, not a dependency of this implementation. The [research review](RESEARCH.md) records evidence and counterarguments.

## Typography, geometry and visual hierarchy

- System UI (`Segoe UI`, system fallback), 16 px body and 14 px secondary text, line height 1.5. Use Georgia only for display names/section headings; action labels and dense dialog titles stay in the UI face. Monospace belongs to data/code. Numerals align with tabular figures where compared.
- Control / panel / dialog radii: 8 / 12 / 16 px. A switch and color swatch are deliberate circular exceptions. Avoid making every action a capsule. Corners express grouping, not a hierarchy of decoration.
- Spacing scale: 4, 8, 12, 16, 24, 32 px. Joined direction/mirror controls share their boundary; groups retain breathing room. Catalog cards are specimen groupings, not a proposal to put cards around every in-world control.
- Ordinary controls are at least 44 px high. Touch controls should be at least 44 × 44 px including landscape; a small icon may sit inside that target. Desktop compact controls can be narrower when clearly separated. Do not expand invisible targets into neighbours.
- Use a border for identifying an input; reserve shadows for elevation. Primary emphasis should be scarce. Disabled opacity is not a usable secondary-text treatment: show the reason nearby and retain context.
- Keyboard focus uses a 2 px accent outline with 3 px offset. Scrollports need at least 5 px paint room. Do not clip palette selection rings or focus to solve alignment problems.

## Component and state contract

| Family | Shared recipe / behavior | Required states and rules |
| --- | --- | --- |
| Actions | `.bu-btn`, primary / quiet / danger | Default, hover, pressed, focus, disabled, busy. Preserve an action label while busy; stop duplicate activation. Destructive actions use explicit consequences and confirmation where warranted. |
| Text/search/password/number/select/textarea | `Field`, `.bu-input`, `.bu-unit` | Persistent label, hint/error association, editable, disabled; invalid text + visual marker on the joined wrapper. Readonly is a demonstrated extension, not an assertion that every current form uses it. |
| Checkbox / switch | Native inputs, `.bu-check`, `.bu-switch` | Label is part of the target. Switch is an immediate on/off setting, checkbox a form choice. Keep keyboard semantics and visible on/off shape. |
| Exclusive choices | `ChoiceGroup` | Radios with checked state, checkmark and roving focus; arrows/Home/End operate the group. Do not announce radio semantics without implementing behavior. |
| Tabs | `.bu-tabs` + creator tab handler | Active marker, `aria-selected`, matching labelled panels retained with `hidden`, roving focus and arrows/Home/End. Put Help outside the tablist. |
| Direction/mirror | Joined buttons | Independent pressed/selected semantics, accessible direction labels, reversible mirror action, coarse-pointer targets. This lab is a style sample, not production rig logic. |
| Color / ramps | Native color input, `.bu-swatch`, `.bu-ramp` | Accessible names, selected ring, unclipped focus, real Reset. Art ramp colors remain outside semantic UI palette. |
| File | Native file input | Reachable browser picker and visible filename. A custom wrapper must not break native selection or imply an upload occurred. |
| Lists/cards | `.bu-row`, `.bu-list-item` | South-frame thumbnail, stable item identity through filtering, selected vs worn state, empty/search states. Separate row actions from selection; do not nest buttons. |
| Disclosure/data | Native `details`, `.bu-data`, `.bu-table`, `.bu-code` | Long text wrapping, named keyboard-scroll regions, readable identifiers. The showcase adapts the original MIT `RequestFields.svelte` with a scoped token bridge. |
| Activity | Native progress, `.bu-spinner`, `.bu-steps` | Determinate progress only with known values; text for indeterminate and reduced-motion states. Distinguish queued, running, failed, completed, cancelled and unknown outcomes. |
| Feedback | `Notice`, `.bu-badge`, `.bu-toast` | Severity has text/icon, not hue alone. Announce new relevant feedback, not every static showcase notice. Keep recovery information after a toast disappears. |
| Dialog | `Dialog` / native `showModal()` | Named modality, contained keyboard focus, reachable scrolling/footer, Escape, explicit close and focus return. Return to the visible popup owner if launched from its action list. |
| Action/API popovers | Native `popover=auto` | Light dismiss and Escape; allow Tab to leave. Native `popovertarget` supplies relationships. Do not claim menu semantics for a generic action list. |
| Help | `Help` / native manual popover | Pointer hover, keyboard focus and activation/tap; readable hoverable content; outside pointer or Escape dismisses it. First Escape closes help before its parent dialog. |

Mobile dialogs become bottom sheets; shallow landscape uses a side panel. These are the same shell and behavior, not duplicate implementations. Work fields retain the same tokens in every presentation. Blocking dismissal during the short local export simulation demonstrates a busy state; production must decide cancelability based on the actual operation, especially paid work. This is not blanket permission to trap a user in a long request.

## Accessibility and rendering fallbacks

Scrollbars use one shared pair: muted Bronze thumb (60% secondary text + 40% accent), transparent track, as explicitly requested. The thumb sits over the existing page/panel instead of adding a background strip. The result is warm and quiet in both modes without bright glow, gradients or decorative glass. Standard `scrollbar-color` inherits through nested scrollports; keep `scrollbar-width:auto` so the browser retains native hit areas and platform scrollbar sizing where supported. Track transparency does not promise overlay scrollbars: classic-versus-overlay is controlled by the OS/browser, and the prefixed fallback can use classic gutters. Do not hide scrolling or shrink the grab target just to look minimal. Browsers without standard color support use a 14 px prefixed fallback with an inset rounded thumb. Forced colors returns to `auto`. Native popup/OS picker chrome remains browser controlled. [MDN scrollbar color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-color), [Chrome scrollbar styling](https://developer.chrome.com/docs/css-ui/scrollbar-styling).

Normal body text targets 4.5:1 against its actual backing; meaningful boundaries/focus/state indicators target 3:1 where the criterion applies. Decorative dividers need not meet the same threshold. Test composited text/fill contexts, not only token swatches. Contrast math does not replace keyboard and screen-reader verification. [WAI text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

With reduced transparency or increased contrast, floating surfaces become opaque and lose the blur. Unsupported backdrop filtering also receives opaque backing. Forced colors replaces semantic colors with system colors in **both** schemes; necessary selection outlines remain. Reduced motion removes decorative transitions/spinners while labelled user-controlled sprite playback remains available. Browser propagation of OS preferences varies; default styling must already be legible.

Use native HTML first. Prefer real buttons, labels, details, dialog and popover to recreated generic div controls. Still test labels, focus restoration and custom keyboard behavior: native elements do not solve application state mistakes. [MDN color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme), [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [hover/focus content](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Adding a control

1. Find its existing family in the inventory and reuse its recipe/behavior. A one-off layout is not a reason for a new generic framework component.
2. Add a semantic role only when existing roles cannot express its purpose. Define both themes and preference fallbacks together.
3. Add its real states to the showcase with clear local sample behavior. Do not fabricate paid results, progress or coverage.
4. Verify dark/light, keyboard, touch portrait/landscape, 320 px reflow, long text, native overlays, errors and high contrast. Capture equal-size evidence and request independent review.
5. Update this guide and the coverage matrix. Do not claim the whole app migrated when only a specimen was added.

See [README](../README.md) for commands, test evidence and limits. Physical-device GPU/battery, full assistive-technology testing, actual paid/recovery workflows and specialized production layouts are outside this isolated proof.

## Native menus and code surfaces

Selects with `.bu-input` use shared dark/light option colors and a styled native top-layer picker where supported; other browsers retain their OS picker. Use `.bu-select` alone when the host owns compact control dimensions, such as animation playback. Neither recipe styles unrelated host selects. Keep picker materials in `styles/components.css`, not a consumer override.

`.bu-code` is a block surface for multiline data, including code inside a disclosure. It owns padding, wrapping and one continuous border without relying on a grid parent to change its display. Use plain `code` for inline identifiers.

Scene scrim placement, canvas centering, panel stacking, popover anchors and screen-specific spacing remain consumer layout. Changes to shared colors, native field/picker appearance or generic code surfaces belong here and require a versioned release plus consumer lockfile update.


## Appearance-only integration (0.2.0)

Existing interfaces can adopt shared appearance without adopting the gallery composition or full control dimensions. Import tokens and components, leaving `base.css` optional. Place layout, font sizes, target sizes, spacing, popup z-order and responsive breakpoints in the host stylesheet. The package owns the following appearance contracts:

| Recipe | Package ownership | Host responsibility |
| --- | --- | --- |
| `.bu-action` | Inherited type, corners, hover/disabled/focus/pressed states; `primary`, `outline`, `tile`, `field`, `row`, `direction`, `tab` variants | Element semantics, readable inherited text for unfilled actions, width/height/padding, grouping and activation |
| `.bu-select` | Closed field colors/border/corners and scoped native option/picker styling | Closed control dimensions, persistent name, selected value and change handling |
| `.bu-dialog-surface` | Opaque surface, text, rim, radius and shadow | Native dialog behavior, naming, size, padding, scrolling and focus return |
| `.bu-joined` | One seam and adjacent inner corners for two controls; optional `data-stack="small"` at 380px | Two-control pair, widths, target sizes and labels; not an arbitrary toolbar abstraction |
| `.bu-focus` | Shared `:focus-visible` outline | A genuinely interactive, keyboard-reachable element and unclipped outline space |
| `.bu-swatch-flat` | Circular corners, artwork `--swatch` fill, hover/pressed/focus/disabled treatment | Dimensions, artwork value, selection state and accessible name |
| `--bu-reading-start`, `--bu-reading-end` | Theme-dependent scene reading colors, including preference fallbacks | Gradient direction, stops and scene placement |

Use `.bu-btn` when package dimensions are desired. Do not combine `.bu-btn` with `.bu-action` to request compact geometry. A `tab` appearance alone supplies no ARIA tab semantics or keyboard controller; retain real buttons unless the host implements a complete tab pattern. Likewise, CSS on a dialog surface does not create modality. Filled actions provide their own text role even on a host with an unrelated foreground. Host-sized controls must still provide appropriate touch targets; the compact contract fixture intentionally proves geometry independence and is not a recommended touch size.

The independent `contract.html` entry imports no base reset. Browser contracts cover both appearances, normal/pressed/disabled/focus states, hostile inherited foreground, unchanged compact dimensions, joined seams in row/stacked forms, native fields and opaque host-sized dialogs. The showcase's direction/mirror pairs consume `bu-joined`; showcase CSS retains their dimensions, not copied seam/radius recipes.


Additional scene-material roles keep existing appearances shared: `--bu-sheet` (99% surface), `--bu-sheet-soft` (86% surface), `--bu-diagram` (15% surface), `--bu-gesture-track` (20% surface) and `--bu-gesture-thumb` (35% accent). Their opaque/system fallbacks live with the theme tokens. Hosts choose where these materials appear and their geometry; they should not copy these percentages into consumer CSS.


## No-base imports and cascade limits

Namespaced defaults give package-owned geometry border-box sizing, inherited control typography, shared icon sizes and field-message spacing without `base.css`. Ordinary universal/element resets such as `* {box-sizing:content-box}`, `button {all:revert}` and `p {margin:28px}` are regression-tested even when loaded later. Higher-specificity selectors, later equal-specificity rules, `!important`, and unlayered host styles over a layered theme can intentionally override these recipes. This is a bounded CSS contract, not encapsulation against arbitrary hostile styles.

For an established application, put broad resets in a lower cascade layer than Bronze, and explicit application overrides above it:

```css
@layer reset, bronze, app;
@import '@shilo/bronze-ui/tokens.css' layer(bronze);
@import '@shilo/bronze-ui/components.css' layer(bronze);
@layer reset { * { box-sizing: border-box; } }
@layer app { /* deliberate local geometry and appearance overrides */ }
```

Unlayered declarations outrank layered declarations; wrapping Bronze alone in a layer does not protect it from an unlayered reset. Token imports intentionally set root `color-scheme` and scrollbar colors. Consumers requiring different document defaults must override them deliberately.

## Recipe reference

| Classes | Purpose and composition |
| --- | --- |
| `.bu-btn`, `.bu-action`, `.bu-focus` | Complete control, host-sized appearance, independent focus respectively; variants above |
| `.bu-field`, `.bu-input`, `.bu-unit`, `.bu-error` | Field layout, field appearance, joined unit control and associated message |
| `.bu-check`, `.bu-switch`, `.bu-file`, `.bu-color` | Native choice/switch, file-button and color-field recipes |
| `.bu-choice-group`, `.bu-tabs`, `.bu-joined` | Exclusive choices, tab appearance and two-control seam; semantics/keyboard require the behavior described above |
| `.bu-select` | Host-sized native select; default border uses the meaningful field-boundary role |
| `.bu-select[data-variant=quiet]` | Transparent closed field for a labelled select in an already bounded toolbar; inherited type, focus and opaque picker preserved; host owns all dimensions |
| `.bu-floating`, `.bu-popover`, `.bu-toast` | Floating material; popover/toast geometry. Combine `class="bu-popover bu-floating"` or `class="bu-toast bu-floating"` for that material; native attributes/host behavior still required |
| `.bu-popover-anchor`, `.bu-popover-surface`, `.bu-popover-arrow` | Optional pointed popover shell. The native `[popover]` element uses `.bu-popover-anchor`; a direct `.bu-popover-surface.bu-floating` child owns the scrollable material, and a direct decorative SVG `.bu-popover-arrow` child covers the surface border at its base. The host sets `data-side` to the actual `top`, `right`, `bottom` or `left` placement and `--bu-arrow-x` or `--bu-arrow-y` to the pointer's offset. Placement and focus remain host behavior. |
| `.bu-dialog`, `.bu-dialog-head`, `.bu-dialog-body`, `.bu-dialog-foot`, `.bu-dialog-surface` | Complete modal shell sections, or appearance-only surface; use the Svelte `Dialog` for shared behavior |
| `.bu-help`, `.bu-tooltip` | Help trigger wrapper and top-layer help surface used by `Help` |
| `.bu-notice`, `.bu-badge` | Feedback block and inline status; tone values `info` (notice default), `success`, `warning`, `danger`; include readable state text |
| `.bu-progress`, `.bu-spinner`, `.bu-steps` | Native determinate progress, labelled indeterminate indicator and ordered activity steps |
| `.bu-row`, `.bu-row-label`, `.bu-list-item` | Selectable thumbnail row with flexible label; simpler divided list item |
| `.bu-details`, `.bu-data`, `.bu-code`, `.bu-table` | Disclosure, description list, block code and data table |
| `.bu-palette`, `.bu-swatch`, `.bu-swatch-flat`, `.bu-ramp` | Art-color group, complete swatch, host-sized swatch and ramp; `--swatch` is user artwork |
| `.bu-muted`, `.bu-small`, `.bu-number`, `.bu-sr`, `.bu-actions`, `.bu-stack` | Text utilities, screen-reader text, wrapping action row and vertical stack |

For a pointed popover, place this exact decorative SVG before the scrollable surface. The host positions the native popover, sets `data-side` to its final placement, and sets `--bu-arrow-x` for top/bottom or `--bu-arrow-y` for left/right. Offsets are measured from the popover's left or top edge to the SVG's 12 px box. Hide the pointer when it cannot point at the trigger by adding `data-arrow-hidden` to the popover.

```html
<div id="actions" popover="auto" class="bu-popover-anchor" data-side="bottom" style="--bu-arrow-x:24px">
  <svg class="bu-popover-arrow" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M6 0 12 8 12 12H0V8Z" />
    <path d="M0 8 6 0 12 8" />
  </svg>
  <div class="bu-popover bu-floating bu-popover-surface">…</div>
</div>
```

`--bu-tab-stroke` optionally overrides the appearance-only tab underline (default 1px); it changes decoration, not selection semantics. Existing translucent action surfaces use `--bu-action-hover`, `--bu-outline`, `--bu-row-stroke`, `--bu-row-selected`, and `--bu-direction-selected`, with opaque reduced-transparency/increased-contrast and system-color fallbacks. Geometry constants need not each become a token.

System UI and Georgia display fallbacks are deliberate dependency-free defaults. Different OS metrics are expected. Applications may override `--bu-font`, `--bu-display` and `--bu-mono` when a bundled brand face is required; adding a font is a product design choice. Muted text is checked against theme work surfaces; text over host artwork still needs composited contrast checks and local reading backing. A single global token cannot guarantee contrast over arbitrary imagery.

Native select indicators remain browser-owned affordances. A triangle differing from Lucide is not itself an accessibility defect; do not replace it solely to satisfy an icon-uniformity assertion. The picker still uses shared foreground/material where supported and OS UI where not.


The shared focus recipe accepts `--bu-focus-offset` (default `3px`) as host geometry. On an interactive fullscreen canvas with `.bu-focus`, set `--bu-focus-offset:-3px` to draw the theme's 2px ring inside its viewport bounds. This changes ring placement only; the host must still make the canvas keyboard-reachable and label it. Keep the default offset for ordinary controls with available paint room.
