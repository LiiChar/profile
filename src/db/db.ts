import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { runFactory } from './content';
import { exec } from 'child_process';

const dbPath = path.resolve(process.cwd(), process.env.DB_FILE_NAME || 'db.sqlite');

let db: BetterSQLite3Database<typeof schema>;
try {
	db = drizzle(dbPath, {
		schema: { ...schema },
	});
} catch (error) {
	console.log('Database created and factoried cause by error:', error);
	fs.writeFileSync(dbPath, '');
	exec('npx drizzle-kit push', { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        runFactory();
        return;
    }
    console.log(`Output: ${stdout}`);
});
	
	db = drizzle(dbPath, {
		schema: { ...schema },
	});
}

export { db };
