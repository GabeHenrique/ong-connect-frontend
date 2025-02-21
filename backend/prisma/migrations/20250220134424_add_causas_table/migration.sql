/*
  Warnings:

  - You are about to drop the `_Attendees` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_Attendees_B_index";

-- DropIndex
DROP INDEX "_Attendees_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_Attendees";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Causa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EventParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventCausas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventCausas_A_fkey" FOREIGN KEY ("A") REFERENCES "Causa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventCausas_B_fkey" FOREIGN KEY ("B") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "image" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatorId" INTEGER NOT NULL,
    CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("createdAt", "creatorId", "date", "description", "id", "image", "location", "name", "updatedAt") SELECT "createdAt", "creatorId", "date", "description", "id", "image", "location", "name", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_EventParticipants_AB_unique" ON "_EventParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_EventParticipants_B_index" ON "_EventParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventCausas_AB_unique" ON "_EventCausas"("A", "B");

-- CreateIndex
CREATE INDEX "_EventCausas_B_index" ON "_EventCausas"("B");
