import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

export const db = drizzle(path.resolve(process.env.DB_FILE_NAME!), {
	schema: { ...schema },
});
