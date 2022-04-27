(function () {
	try {
		var t = localStorage.getItem("themeId");
		var dm = window.matchMedia("(prefers-color-scheme: dark)").matches === true;
		if (!t && dm) document.documentElement.classList.add("dark");
		if (!t) return;
		document.documentElement.classList.add(t);
	} catch (err) {}
})();
