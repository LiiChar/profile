import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { relations, sql } from 'drizzle-orm';

export const projects = sqliteTable('projects', {
	id: int().primaryKey({ autoIncrement: true }),
	userId: int()
		.notNull()
		.references(() => users.id),
	title: text('title').notNull(),
	image: text('image'),
	author: text('author').default('LiiChar').notNull(),
	repoName: text('repo_name'),
	url: text('url'),
	description: text('description'),
	content: text('content').notNull(),
	lang: text('lang', {
		mode: 'json',
	}).$type<ProjectLang>(),
	gallery: text('gallery', { mode: 'json' }),
	tags: text(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const projectsRelation = relations(projects, ({ one }) => ({
	user: one(users, {
		fields: [projects.userId],
		references: [users.id],
	}),
}));

export type ProjectType = typeof projects.$inferSelect;
export type ProjectInsert = typeof projects.$inferInsert;

export type ProjectLangField = {
	content: string;
	tags: string | null;
	title: string;
	description?: string | null | undefined;
};
export type ProjectLanguages = 'en';
export type ProjectLang = Record<'en', Partial<ProjectLangField>>;
