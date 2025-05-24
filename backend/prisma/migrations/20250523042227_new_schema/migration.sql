/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leetcodeHandle]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeAvatarId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeBackgroundId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leetcodeHandle` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "activeAvatarId" TEXT NOT NULL,
ADD COLUMN     "activeBackgroundId" TEXT NOT NULL,
ADD COLUMN     "easySolved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hardSolved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "leetcodeHandle" TEXT NOT NULL,
ADD COLUMN     "leetcodeLastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "levels" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "mediumSolved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ranking" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streaks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSolved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "LeetcodeProblem" (
    "id" TEXT NOT NULL,
    "titleSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,

    CONSTRAINT "LeetcodeProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSolvedLeetcodeProblems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSolvedLeetcodeProblems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "unlockRequirement" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Background" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "unlockRequirement" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Background_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarUnlocked" (
    "userId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,

    CONSTRAINT "AvatarUnlocked_pkey" PRIMARY KEY ("userId","avatarId")
);

-- CreateTable
CREATE TABLE "BackgroundUnlocked" (
    "userId" TEXT NOT NULL,
    "backgroundId" TEXT NOT NULL,

    CONSTRAINT "BackgroundUnlocked_pkey" PRIMARY KEY ("userId","backgroundId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeetcodeProblem_titleSlug_key" ON "LeetcodeProblem"("titleSlug");

-- CreateIndex
CREATE UNIQUE INDEX "UserSolvedLeetcodeProblems_userId_problemId_key" ON "UserSolvedLeetcodeProblems"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_name_key" ON "Avatar"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Background_name_key" ON "Background"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_leetcodeHandle_key" ON "User"("leetcodeHandle");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeAvatarId_fkey" FOREIGN KEY ("activeAvatarId") REFERENCES "Avatar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeBackgroundId_fkey" FOREIGN KEY ("activeBackgroundId") REFERENCES "Background"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSolvedLeetcodeProblems" ADD CONSTRAINT "UserSolvedLeetcodeProblems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSolvedLeetcodeProblems" ADD CONSTRAINT "UserSolvedLeetcodeProblems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "LeetcodeProblem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarUnlocked" ADD CONSTRAINT "AvatarUnlocked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarUnlocked" ADD CONSTRAINT "AvatarUnlocked_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundUnlocked" ADD CONSTRAINT "BackgroundUnlocked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundUnlocked" ADD CONSTRAINT "BackgroundUnlocked_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "Background"("id") ON DELETE CASCADE ON UPDATE CASCADE;
