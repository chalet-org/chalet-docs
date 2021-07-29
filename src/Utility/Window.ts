const getWindowWidth = () => {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

const getWindowHeight = () => {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

const isElementInViewport = (el: any) => {
	if (!el) return false;

	const rect = el.getBoundingClientRect();
	return rect.top >= 0 && rect.left >= 0 && rect.bottom <= getWindowHeight() && rect.right <= getWindowWidth();
};

export { getWindowHeight, getWindowWidth, isElementInViewport };
