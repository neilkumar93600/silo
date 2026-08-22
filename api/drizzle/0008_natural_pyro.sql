CREATE TABLE "file_views" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"file_id" text NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "file_views" ADD CONSTRAINT "file_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_views" ADD CONSTRAINT "file_views_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "file_views_user_file_idx" ON "file_views" USING btree ("user_id","file_id");--> statement-breakpoint
CREATE INDEX "file_views_user_id_idx" ON "file_views" USING btree ("user_id");