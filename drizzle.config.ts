import { defineConfig } from 'drizzle-kit';
import path from 'path';

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: path.resolve(process.cwd(), process.env.DB_FILE_NAME || 'db.sqlite'),
	},
});
