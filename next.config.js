// Before adding anything, review it with v4 to v5 migration:
//   https://webpack.js.org/migrate/5/

module.exports = {
	swcMinify: true,
	reactStrictMode: true,
	compiler: {
		removeConsole: true,
		styledComponents: true,
	},
	redirects: async () => {
		return [
			{
				source: "/docs",
				destination: "/docs/getting-started",
				permanent: true,
			},
			{
				source: "/integrations",
				destination: "/integrations/visual-studio-code",
				permanent: true,
			},
		];
	},
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
