// Before adding anything, review it with v4 to v5 migration:
//   https://webpack.js.org/migrate/5/

module.exports = {
	reactStrictMode: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}

		return config;
	},
};
