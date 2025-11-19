import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { runFactory } from './content';
import { execSync } from 'child_process';

const dbPath = path.resolve(process.cwd(), process.env.DB_FILE_NAME || 'db.sqlite');

let db: BetterSQLite3Database<typeof schema>;
try {
	db = drizzle(dbPath, {
		schema: { ...schema },
	});
} catch (error) {
	console.log('Database created and factoried cause by error:', error);
	fs.writeFileSync(dbPath, '');
	execSync('npx drizzle-kit push', { cwd: process.cwd() });
	runFactory()
	db = drizzle(dbPath, {
		schema: { ...schema },
	});
}

export { db };
