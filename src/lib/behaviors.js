// Framework-neutral DOM behaviors. Each returns a cleanup function, so it works as a
// Svelte attachment ({@attach stickyFade()}) or from any host's own lifecycle.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Shows edge fades on a scroll container only where more content exists. Add the
 * `.bu-edge-fade` class (and `data-axis="x"` for horizontal) to the same element.
 * @param {{ axis?: 'x' | 'y', size?: number }} [options]
 * @returns {(node: HTMLElement) => () => void}
 */
export function edgeFade({ axis = 'y', size = 24 } = {}) {
	return (node) => {
		const update = () => {
			const pos = axis === 'x' ? node.scrollLeft : node.scrollTop,
				view = axis === 'x' ? node.clientWidth : node.clientHeight,
				full = axis === 'x' ? node.scrollWidth : node.scrollHeight;
			node.style.setProperty('--bu-fade-start', pos > 2 ? size + 'px' : '0px');
			node.style.setProperty('--bu-fade-end', pos + view < full - 2 ? size + 'px' : '0px');
		};
		// Content can grow without the container resizing, so watch its children too.
		const observer = new ResizeObserver(update);
		observer.observe(node);
		for (const child of node.children) observer.observe(child);
		const mutations = new MutationObserver((records) => {
			for (const record of records)
				for (const added of record.addedNodes) if (added instanceof Element && added.parentElement === node) observer.observe(added);
			update();
		});
		mutations.observe(node, { childList: true, subtree: true });
		node.addEventListener('scroll', update, { passive: true });
		update();
		return () => {
			observer.disconnect();
			mutations.disconnect();
			node.removeEventListener('scroll', update);
		};
	};
}

/**
 * Fades content as it passes under sticky section headers, with no header backing.
 * Each header (`headSelector`) masks its following siblings from `inside` px above its
 * lower edge to `outside` px below it. Hosts with a different structure pass selectors.
 * @param {{ headSelector?: string, inside?: number, outside?: number }} [options]
 * @returns {(node: HTMLElement) => () => void}
 */
export function stickyFade({ headSelector = '.bu-section-head', inside = 10, outside = 10 } = {}) {
	return (node) => {
		let frame = 0;
		const apply = () => {
			frame = 0;
			// Read every rect and style first, then write, so one pass never forces layout per element.
			// Scaled ancestors (zoomed previews) report transformed rects; convert back to CSS px.
			const zoom = node.getBoundingClientRect().height / (node.offsetHeight || 1) || 1;
			/** @type {[HTMLElement, number | null][]} */
			const writes = [];
			for (const head of /** @type {NodeListOf<HTMLElement>} */ (node.querySelectorAll(headSelector))) {
				const box = head.getBoundingClientRect(),
					parent = /** @type {HTMLElement} */ (head.parentElement);
				// Only a pinned header covers content; one resting in its section must not fade the row below it.
				const pinned =
					!!parent &&
					(box.top - parent.getBoundingClientRect().top) / zoom -
						parseFloat(getComputedStyle(parent).paddingTop) >
						0.5;
				for (let el = head.nextElementSibling; el; el = el.nextElementSibling) {
					const target = /** @type {HTMLElement} */ (el);
					const y = (box.bottom - target.getBoundingClientRect().top) / zoom;
					writes.push([target, !pinned || y <= -outside ? null : y]);
				}
			}
			for (const [target, y] of writes) {
				if (y === null) {
					if (target.hasAttribute('data-bu-fade')) {
						target.removeAttribute('data-bu-fade');
						target.style.removeProperty('--bu-fade-y');
					}
					continue;
				}
				target.setAttribute('data-bu-fade', '');
				target.style.setProperty('--bu-fade-y', y.toFixed(1) + 'px');
				target.style.setProperty('--bu-fade-in', inside + 'px');
				target.style.setProperty('--bu-fade-out', outside + 'px');
			}
		};
		const schedule = () => (frame ||= requestAnimationFrame(apply));
		const observer = new ResizeObserver(schedule);
		observer.observe(node);
		const mutations = new MutationObserver(schedule);
		mutations.observe(node, { childList: true, subtree: true });
		node.addEventListener('scroll', schedule, { passive: true });
		apply();
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			mutations.disconnect();
			node.removeEventListener('scroll', schedule);
		};
	};
}

/**
 * Scrolls `target` to the top of its scroll container, instantly under reduced motion.
 * Resolves when scrolling really ends: on `scrollend` where supported (with only a long
 * safety timeout), after a short delay where it is not, and right away for an instant jump.
 * @param {HTMLElement} container
 * @param {HTMLElement} target
 * @param {number} [offset] extra px to scroll past the target's top
 * @returns {Promise<void>}
 */
export function scrollToTop(container, target, offset = 0) {
	const zoom = container.getBoundingClientRect().height / (container.offsetHeight || 1) || 1;
	const top =
		container.scrollTop +
		(target.getBoundingClientRect().top - container.getBoundingClientRect().top) / zoom +
		offset;
	const max = container.scrollHeight - container.clientHeight;
	const destination = Math.max(0, Math.min(max, top));
	if (Math.abs(destination - container.scrollTop) < 1) return Promise.resolve();
	if (reduced()) {
		container.scrollTo({ top: destination, behavior: 'instant' });
		return Promise.resolve();
	}
	return new Promise((resolve) => {
		const done = () => {
			clearTimeout(timer);
			container.removeEventListener('scrollend', done);
			resolve();
		};
		const timer = setTimeout(done, 'onscrollend' in window ? 3000 : 600);
		container.addEventListener('scrollend', done, { once: true });
		container.scrollTo({ top: destination, behavior: 'smooth' });
	});
}

/**
 * Keeps every matching select at least as wide as its longest option (capped at its container by the theme, and at a
 * host's pixel max-width), so the
 * control never resizes as the choice changes: Chromium's `appearance: base-select` sizes to the chosen option. It
 * measures a hidden copy with each option chosen, again when options or their text change (a language switch) or a
 * hidden select first gets a size. Attach it once near the root ({@attach fitSelects()}) to cover selects added later.
 * @param {{ selector?: string }} [options]
 * @returns {(root: HTMLElement) => () => void}
 */
export function fitSelects({ selector = 'select.bu-input, select.bu-select' } = {}) {
	return (root) => {
		/** @type {Set<HTMLSelectElement>} */
		const pending = new Set();
		/** Selects measured while visible; a hidden one is measured again once it has a size. */
		const fitted = new WeakSet();
		const watched = new WeakSet();
		let frame = 0;
		const isProbe = (/** @type {Element} */ node) => node.hasAttribute('data-bu-fit-probe');
		/** @param {HTMLSelectElement} select */
		const measure = (select) => {
			if (!select.isConnected || !select.parentElement) return;
			const probe = /** @type {HTMLSelectElement} */ (select.cloneNode(true));
			probe.removeAttribute('id');
			probe.removeAttribute('name');
			probe.setAttribute('data-bu-fit-probe', '');
			probe.setAttribute('aria-hidden', 'true');
			probe.tabIndex = -1;
			probe.style.cssText +=
				';position:absolute;visibility:hidden;pointer-events:none;inset-block-start:0;inset-inline-start:0;width:auto;min-inline-size:0;max-inline-size:none';
			select.after(probe);
			let widest = 0;
			for (let index = 0; index < probe.options.length; index++) {
				probe.selectedIndex = index;
				widest = Math.max(widest, probe.getBoundingClientRect().width);
			}
			probe.remove();
			if (!widest) return;
			// A host's own pixel cap still holds: a minimum would otherwise override it.
			const cap = getComputedStyle(select).maxWidth;
			if (cap.endsWith('px')) widest = Math.min(widest, parseFloat(cap));
			fitted.add(select);
			select.style.setProperty('--bu-select-fit', `${Math.ceil(widest)}px`);
		};
		const flush = () => {
			frame = 0;
			for (const select of pending) measure(select);
			pending.clear();
		};
		const queue = (/** @type {HTMLSelectElement} */ select) => {
			pending.add(select);
			frame ||= requestAnimationFrame(flush);
		};
		const resize = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const select = /** @type {HTMLSelectElement} */ (entry.target);
				if (!fitted.has(select) && entry.contentRect.width > 0) queue(select);
			}
		});
		const watch = (/** @type {Element} */ node) => {
			if (!(node instanceof HTMLSelectElement) || isProbe(node) || watched.has(node)) return;
			watched.add(node);
			resize.observe(node);
			queue(node);
		};
		const remeasure = (/** @type {Node | null} */ node) => {
			const select = (node instanceof Element ? node : node?.parentElement)?.closest('select');
			if (select && !isProbe(select) && select.matches(selector)) {
				fitted.delete(select);
				queue(select);
			}
		};
		for (const select of root.querySelectorAll(selector)) watch(select);
		const mutations = new MutationObserver((records) => {
			for (const record of records) {
				for (const added of record.addedNodes) {
					if (!(added instanceof Element) || isProbe(added)) continue;
					if (added.matches(selector)) watch(added);
					for (const select of added.querySelectorAll(selector)) watch(select);
				}
				remeasure(record.target);
			}
		});
		mutations.observe(root, { childList: true, subtree: true, characterData: true });
		document.fonts?.ready.then(() => {
			for (const select of root.querySelectorAll(selector)) remeasure(select);
		});
		return () => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			mutations.disconnect();
		};
	};
}
