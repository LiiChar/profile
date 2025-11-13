import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

const dbPath = path.resolve(process.cwd(), process.env.DB_FILE_NAME || 'db.sqlite');
console.log('Database path:', dbPath);
console.log('DB_FILE_NAME:', process.env.DB_FILE_NAME);
console.log('process.cwd():', process.cwd());

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
	console.log('Creating database directory:', dbDir);
	fs.mkdirSync(dbDir, { recursive: true });
}

let db: BetterSQLite3Database<typeof schema>;
try {
	db = drizzle(dbPath, {
		schema: { ...schema },
	});
	console.log('Database connection established successfully');
} catch (error) {
	console.error('Error connecting to database:', error);
	console.error('dbPath:', dbPath);
	console.error('Directory exists:', fs.existsSync(dbDir));
	console.error('File exists:', fs.existsSync(dbPath));
	throw error;
}

export { db };
