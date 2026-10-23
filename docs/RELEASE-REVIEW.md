# Bronze UI 0.1.0 review

Reviewer: GPT-6.1 Sol High. Date: 2026-10-23.

## Final standalone correction review

**Verdict: no unresolved release blocker found in the reviewed standalone 0.1.0 scope.** All first-pass P1 findings above are resolved. The package and standalone showcase are ready for the authorized GitHub release and Pages deployment, subject to the actual remote verification/deployment steps. This verdict does not claim those remote actions have occurred or that the PixelDoll dependency integration has already been reviewed.

Reviewed artifact: `.evidence/shilo-bronze-ui-0.1.0.tgz`, **12,716 bytes / 21 files**, SHA-256 `597b093ed6a0b185b77af315a9d41a8944abc65a32c03f8792947420246104d8`. The archive now also includes a CSS side-effect declaration, with typed CSS export conditions so strict TypeScript 6 consumers do not need Vite ambient globals merely to import the styles. Final archive inspection confirmed intended styles/components/declarations, MIT license and notices, and no showcase media or parent-source dependencies.

### Correction evidence

- **CSS isolation:** file styling now requires `.bu-file`; namespaced hidden components retain `display:none` independently of base.css; Bronze surface-backed controls own their foreground. Independently repeated Chromium and WebKit tests with explicit opposite host body colors found correct dark `rgb(242,238,230)` and light `rgb(37,40,45)` button/input text. Hidden grid stayed hidden. Unowned file inputs retained native widths (253px Chromium, 221px WebKit) instead of expanding across the page.
- **Form and focus behavior:** independently passed in Chromium and WebKit revision 2370: actual Tab entry to an unselected radio group; Arrow/Home/End selection; Help and dialog Close inside a host form with zero accidental submissions; native modal state and return focus to the visible opener. Empty choices render safely. Native top-layer dialog/popover behavior remains adequate; no portal manager is required.
- **Focus fallback:** README now explicitly requires a focusable host `<main tabindex="-1">` when an opener can be removed, and documents explicit `returnTo` for pointer/WebKit restoration. This is an acceptable bounded 0.1.0 contract rather than an unresolved generic fallback promise.
- **Packaged consumer:** the lead's completed `npm test` installs the tarball into an OS-temporary directory, resolves CSS without Svelte dependencies, explicitly installs the optional peers/tools, and passes strict Svelte/TypeScript checking and Vite production build. Source inspection confirms it tests the installed artifact rather than resolving the package through a parent node_modules. This addresses the original packaging evidence gap; I did not independently rerun the lead's installation/build command.
- **Browser reports:** inspected the final standalone JSON reports: Chromium **48 passed**, WebKit **48 passed**, with empty error and external-request lists. These are newly generated standalone results, distinct from imported historical PixelDoll evidence. My own independent layout passes covered the six sections, both modes and 1440×1000 / 320×568 / 844×390 before completing the focused correction checks.
- **Visual check:** inspected the current generated dark desktop Scene and light phone Creator captures. The open scene, crisp unshaded sprite, quiet controls, readable light fields, joined direction controls and mobile form hierarchy remain coherent. This is a bounded visual spot check, not physical-device validation.
- **Distribution/docs:** Svelte's installed MIT copyright/license is now retained alongside Lucide ISC/Feather MIT in both repository/package notices and built-site notice source. README code fences are corrected. Imported research/coverage records are explicitly marked historical upstream evidence. Vite includes both showcase and consumer-contract entry points; contract.html works under the `/bronze-ui/` preview prefix.
- **Release workflow:** verify precedes Pages/release, release jobs have scoped permissions, and the tag now must equal `v` + package version. The workflow does not overwrite an existing release. Actual GitHub execution and immutable artifact URL remain deployment verification tasks.

The documentation appropriately limits the library's claims: root-scoped themes, host-owned persistence, no full accessibility certification, and remaining physical-device/assistive-technology testing. Do not expand the first release to speculative widgets or a theme provider to address those evidence limits.



## Publication and consumer follow-up

See [delivery verification](DELIVERY.md) for the public release, installed artifact checks and final consumer evidence. The pre-publication qualifications above remain a historical record.
