/*
  Warnings:

  - You are about to drop the `_EventParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EventParticipants";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_Participating" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_Participating_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Participating_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_Participating_AB_unique" ON "_Participating"("A", "B");

-- CreateIndex
CREATE INDEX "_Participating_B_index" ON "_Participating"("B");
