ALTER TABLE `apiKeys` RENAME COLUMN `lastUsed` TO `lastUsedAt`;--> statement-breakpoint
ALTER TABLE `apiKeys` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `apiKeys` MODIFY COLUMN `keyHash` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `apiKeys` ADD `permissions` text;