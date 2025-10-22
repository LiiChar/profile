import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
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
	webpack: (config) => {
		config.resolve.alias['@'] = path.resolve(__dirname, 'src');
		return config;
	},
	turbopack: {
		resolveAlias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
};

export default nextConfig;
