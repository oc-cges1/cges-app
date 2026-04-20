-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'PROCESSED', 'ERROR');

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_uploadedById_fkey";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "embedding" JSONB,
ADD COLUMN     "extension" TEXT,
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "files_uploadedById_idx" ON "files"("uploadedById");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
