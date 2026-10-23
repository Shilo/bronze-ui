# Bronze UI 0.1.0 delivery verification

Verified 2026-10-23. This supplements the pre-publication [release review](RELEASE-REVIEW.md).

## Public distribution

The [MIT repository](https://github.com/Shilo/bronze-ui), [component showcase](https://shilo.github.io/bronze-ui/) and [v0.1.0 release](https://github.com/Shilo/bronze-ui/releases/tag/v0.1.0) are public. Release source is `a9964ab1b9cd03c433fd66d33e5ef7cac861f534`.

The GitHub release archive contains 21 files, is 12,716 bytes, and has SHA-256 `597b093ed6a0b185b77af315a9d41a8944abc65a32c03f8792947420246104d8`. Independent GPT-6.1 Sol High review downloaded the public archive, verified its GitHub digest and recomputed the consuming lockfile's SHA-512 integrity. All 21 archive files matched the installed package byte for byte. CSS/Svelte exports resolve inside the normal installation, with no local sibling dependency or symlink.

The [release workflow](https://github.com/Shilo/bronze-ui/actions/runs/39992419617) and [Pages workflow](https://github.com/Shilo/bronze-ui/actions/runs/39992415764) passed. The initial candidate checks caught and resolved an animation-clock race, asynchronous popover-test focus timing and hidden-directory artifact-upload omission. Published v0.1.0 is frozen; later package changes require a new version.

## Verification

- Strict isolated packed Svelte/TypeScript consumer and independent CSS entry imports passed.
- Chromium 48 and WebKit 48 screen/theme/viewport cases and focused form/focus/CSS-isolation contracts passed locally and in Linux CI.
- The public Pages deployment passed another 48 Chromium cases, with no page errors or requests outside its own origin.
- Codex browser inspection verified the public scene, theme switch, readable form styling and native transparent scrollbar tracks.
- PixelDoll installed the public release URL with lockfile integrity. A clean lockfile installation and its committed application plus this dependency passed type checking, production build and distribution guard.
- The playable consumer passed 12 movement tests, 18 interaction checks and eight theme/viewport cases. Server-served CSS matched installed package bytes; both modes preserved 997 sampled opaque source-sprite pixels.
- Consumer comparisons cover 68 before and 68 after images, equal-resolution pairs and four desktop/mobile dark/light boards. Original before hashes are unchanged; no measured major layout changes exceeded one pixel. Independent review inspected final manifests, PNG dimensions and representative visual boards.

## Scope

The package owns semantic theme roles, shared control recipes and optional Svelte behavior. Applications own persistence, scene artwork, layout, domain validation and gameplay. The former PixelDoll component lab is archived rather than maintained as a second theme source.

This is source and browser verification, not physical-device performance or assistive-technology certification. The package and showcase have no unresolved release blocker found in this review. Application-specific integration testing remains necessary for each consumer. The versioned GitHub archive is the supported initial distribution; no npm registry publication is claimed.
