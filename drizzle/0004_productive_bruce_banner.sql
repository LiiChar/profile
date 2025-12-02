ALTER TABLE `user` ADD `uuid` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `username` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `photo` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_uuid_unique` ON `user` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);