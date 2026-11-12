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
