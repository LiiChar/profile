import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
// import { runFactory } from './content';

const dbPath = path.resolve(process.cwd(), process.env.DB_FILE_NAME || 'db.sqlite');

let db: BetterSQLite3Database<typeof schema>;
try {
	db = drizzle(dbPath, {
		schema: { ...schema },
	});
	console.log('Database connection established successfully');
} catch (error) {
	console.error('Error connecting to database:', error);
	console.error('dbPath:', dbPath);
	// console.error('Directory exists:', fs.existsSync(dbDir));
	console.error('File exists:', fs.existsSync(dbPath));
	throw error;
}

export { db };
