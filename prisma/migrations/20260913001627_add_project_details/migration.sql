/*
  Warnings:

  - Added the required column `grassColor` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installationTime` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warranty` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "grassColor" TEXT NOT NULL,
ADD COLUMN     "installationTime" TEXT NOT NULL,
ADD COLUMN     "warranty" TEXT NOT NULL;
