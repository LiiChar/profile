ALTER TABLE `blogs` RENAME COLUMN "content_lang" TO "lang";--> statement-breakpoint
ALTER TABLE `projects` ADD `title` text NOT NULL;