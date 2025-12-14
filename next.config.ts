import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	productionBrowserSourceMaps: true,
	headers: async () => [
		{
			source: '/_next/static/(.*)',
			headers: [
				{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
			],
		},
	],
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '/**',
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '100mb'
		}
	},
	webpack: config => {
		config.externals = [...config.externals, 'bcrypt'];
		config.resolve.alias['@'] = path.resolve(__dirname, 'src');
		config.optimization = {
			...config.optimization,
			splitChunks: {
				chunks: 'all',
			},
		};
		return config;
	},
	turbopack: {
		resolveAlias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
};

export default nextConfig;
