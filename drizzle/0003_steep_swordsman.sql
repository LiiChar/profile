ALTER TABLE `projects` RENAME COLUMN "content_lang" TO "lang";--> statement-breakpoint
ALTER TABLE `projects` ADD `author` text DEFAULT 'LiiChar' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `repo_name` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `url` text;