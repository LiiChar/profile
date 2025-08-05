import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { relations, sql } from 'drizzle-orm';

export const emails = sqliteTable('emails', {
	id: int().primaryKey({ autoIncrement: true }),
	userId: int()
		.notNull()
		.references(() => users.id),
	name: text().notNull(),
	message: text().notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const emailsRelation = relations(emails, ({ one }) => ({
	user: one(users, {
		fields: [emails.userId],
		references: [users.id],
	}),
}));
