import { runBlogFactory } from './blog.factory';
import { runUserFactory } from './user.factory';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { blogs, comments, emails, users } from '../schema';
import { cwd } from 'process';
import {runProjectFactory} from "@/db/content/project.factory";

export const db = drizzle(cwd() + '\\db.sqlite', {
	schema: { users, comments, emails, blogs },
});

export const runFactory = async () => {
	await runUserFactory();
	await runBlogFactory();
    await runProjectFactory();
};

runFactory();
