import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom', // если тесты работают с DOM
		setupFiles: ['./vitest.setup.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'), // путь зависит от структуры проекта
		},
	},
});
