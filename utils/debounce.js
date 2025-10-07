export function debounce(fn, delay = 1000) {
	let timerId = null;
	return (...args) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => fn(...args), delay);
	};
}
