import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { comments } from './comment';
import { likes } from './like';

export const blogs = sqliteTable('blogs', {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	image: text(),
	content: text().notNull(),
	lang: text('lang', {
		mode: 'json',
	}).$type<BlogLang>(),
	tags: text(),
	userId: int()
		.notNull()
		.references(() => users.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const blogsRelation = relations(blogs, ({ one, many }) => ({
	user: one(users, {
		fields: [blogs.userId],
		references: [users.id],
	}),
	comments: many(comments),
	likes: many(likes),
}));

export type BlogLangField = { content: string; tags: string; title: string };
export type BlogLanguages = 'en';
export type BlogType = typeof blogs.$inferSelect;
export type BlogInsert = typeof blogs.$inferInsert;
export type BlogLang = Record<'en', Partial<BlogLangField>>;
