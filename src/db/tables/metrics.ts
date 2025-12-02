import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';

export const metrics = sqliteTable('metrics', {
	id: int().primaryKey({ autoIncrement: true }),
	userId: int().references(() => users.id),
	action: text().notNull(), // 'view', 'like', 'comment', etc.
	targetType: text().notNull(), // 'blog', 'project', etc.
	targetId: int().notNull(), // blog id, etc.
	timestamp: text().notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const metricsRelation = relations(metrics, ({ one }) => ({
	user: one(users, {
		fields: [metrics.userId],
		references: [users.id],
	}),
}));

export type MetricType = typeof metrics.$inferSelect;
export type MetricInsert = typeof metrics.$inferInsert;
