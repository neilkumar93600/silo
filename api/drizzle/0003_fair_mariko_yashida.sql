ALTER TABLE "folders" ADD COLUMN "starred" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "starred" boolean DEFAULT false NOT NULL;