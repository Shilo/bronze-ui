# Bronze UI 0.1.1 repair review

2026-10-23. Two generic component defects were established during the PixelDoll consumer audit:

- Multiline `.bu-code` inside a plain disclosure container remained inline, fragmenting its padded border. A grid parent masked this in the other specimen. The recipe now owns block layout and wrapping.
- Native option/picker colors lived only in PixelDoll. Shared `.bu-input` selects and the picker-only `.bu-select` opt-in now own both appearances, guarded customizable-select enhancement, fallback option colors, and disabled choices. Unrelated host selects are untouched. Compact playback dimensions remain in the consumer.

GPT-6.1 Sol High independently challenged ownership and the patch. Its disabled-option finding was valid and fixed; hover and checked emphasis now exclude disabled choices, including inherited optgroup disability. Its test-isolation suggestion was accepted with a direct native host appearance assertion. No other earlier package defect was established: scene gradients, canvas centering, menu stacking/anchors, mirror joins and workflow-specific control geometry remain PixelDoll responsibilities.

Validation: Svelte check (zero diagnostics), production build, archive validation and isolated CSS-only/Svelte+strict-TypeScript consumers passed. The 48-case showcase matrix and host behavior contracts passed in Chromium and WebKit. Eight focused material cases per browser cover both appearances at desktop, phone, narrow phone and landscape sizes, code rectangles/long-name wrapping, actual disclosure/dialog surfaces, actual picker selection/Escape, disabled skipping, native fallback and host-style isolation. A development-server WebKit run was interrupted by rebuild hot reload; the passing repeat used the built preview. Native rendering is captured before assertions because WebKit's unpainted fixture can report provisional inherited styles.

Both bug fixes ship in the package; no demo-only material workaround was added. The archive version is 0.1.1. Existing 0.1.0 artifacts are immutable. The normal main/tag workflow verifies and publishes Pages and the release archive.
