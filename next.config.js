// @ts-check

// Before adding anything, review it with v4 to v5 migration:
//   https://webpack.js.org/migrate/5/

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	swcMinify: true,
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
	experimental: {
		largePageDataBytes: 512 * 1000, // default: 128k
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

module.exports = nextConfig;
