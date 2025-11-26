import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { execSync } from 'child_process';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { runFactory } from './content';

const dbPath = path.resolve(
	process.cwd(),
	process.env.DB_FILE_NAME || 'db.sqlite'
);

function needsMigration(db: any) {
	try {
		const info = db.prepare('PRAGMA table_info(user);').all();
        
		return info.length === 0; // таблицы нет → миграции нужны
	} catch {
		return true;
	}
}

function ensureDatabase() {
	const exists = fs.existsSync(dbPath);

	if (!exists) {
		console.log('Database not found — creating...');
		fs.writeFileSync(dbPath, '');
	}

	const testDb = new Database(dbPath);

	if (needsMigration(testDb)) {
		console.log('Running migrations...');
		execSync('npx drizzle-kit push', { stdio: 'inherit' });
		runFactory();
	}

	testDb.close();
}

ensureDatabase();

const sqlite = new Database(dbPath);
const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, { schema });

export { db };
