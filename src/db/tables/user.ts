import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { blogs } from './blog';
import { comments } from './comment';
import { likes } from './like';

export const users = sqliteTable('user', {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelation = relations(users, ({ many }) => ({
	user: many(blogs),
	comments: many(comments),
	likes: many(likes),
}));

export type UserType = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
