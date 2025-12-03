CREATE TABLE `metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`action` text NOT NULL,
	`targetType` text NOT NULL,
	`targetId` integer NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`last_visit` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`user_agent` text,
	`name` text NOT NULL,
	`password` text,
	`password_updated` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`photo` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "last_visit", "user_agent", "name", "password", "password_updated", "photo", "created_at", "updated_at") SELECT "id", "last_visit", "user_agent", "name", "password", "password_updated", "photo", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;