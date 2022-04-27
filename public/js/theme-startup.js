(function () {
	try {
		var mode = localStorage.getItem("themeId");
		var supportDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches === true;
		if (!mode && supportDarkMode) document.documentElement.classList.add("dark");
		if (!mode) return;

		document.documentElement.classList.add(mode);
	} catch (err) {}
})();
