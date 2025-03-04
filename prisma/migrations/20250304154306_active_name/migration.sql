/*
  Warnings:

  - Added the required column `name` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "themeId" INTEGER;
