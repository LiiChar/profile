import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { blogs } from './blog';
import { relations, sql } from 'drizzle-orm';

export const comments = sqliteTable('comments', {
	id: int().primaryKey({ autoIncrement: true }),
	userId: int()
		.notNull()
		.references(() => users.id),
	blogId: int()
		.notNull()
		.references(() => blogs.id),
	description: text(),
	message: text().notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const commentsRelation = relations(comments, ({ one }) => ({
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	blog: one(blogs, {
		fields: [comments.blogId],
		references: [blogs.id],
	}),
}));

export type CommentType = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;
