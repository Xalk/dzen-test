-- CreateTable
CREATE TABLE "AttachmentModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    CONSTRAINT "AttachmentModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommentModel_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CommentModel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CommentModel" ("email", "id", "parentId", "text", "userName") SELECT "email", "id", "parentId", "text", "userName" FROM "CommentModel";
DROP TABLE "CommentModel";
ALTER TABLE "new_CommentModel" RENAME TO "CommentModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "AttachmentModel_path_key" ON "AttachmentModel"("path");

-- CreateIndex
CREATE UNIQUE INDEX "AttachmentModel_commentId_key" ON "AttachmentModel"("commentId");
