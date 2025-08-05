import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { blogs } from './blog';
import { relations, sql } from 'drizzle-orm';

export const likes = sqliteTable('likes', {
	id: int().primaryKey({ autoIncrement: true }),
	userId: int()
		.notNull()
		.references(() => users.id),
	blogId: int()
		.notNull()
		.references(() => blogs.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const likesRelation = relations(likes, ({ one }) => ({
	user: one(users, {
		fields: [likes.userId],
		references: [users.id],
	}),
	blog: one(blogs, {
		fields: [likes.blogId],
		references: [blogs.id],
	}),
}));

export type LikeType = typeof likes.$inferSelect;
export type LikeInsert = typeof likes.$inferInsert;
