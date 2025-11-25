-- AlterTable: Add admin features to users table
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
ALTER TABLE "users" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "users" ADD COLUMN "approved_by" INTEGER;
ALTER TABLE "users" ADD COLUMN "approved_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "must_change_password" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateTable: System settings
CREATE TABLE "system_settings" (
    "id" SERIAL NOT NULL,
    "registration_mode" TEXT NOT NULL DEFAULT 'approval',
    "site_name" TEXT NOT NULL DEFAULT 'SubTrack',
    "max_users_limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- Insert default system settings
INSERT INTO "system_settings" ("id", "registration_mode", "site_name", "updated_at")
VALUES (1, 'approval', 'SubTrack', CURRENT_TIMESTAMP);
