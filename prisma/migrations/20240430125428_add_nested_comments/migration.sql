-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "CommentModel_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CommentModel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CommentModel" ("email", "id", "text", "userName") SELECT "email", "id", "text", "userName" FROM "CommentModel";
DROP TABLE "CommentModel";
ALTER TABLE "new_CommentModel" RENAME TO "CommentModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
