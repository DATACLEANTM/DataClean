/*
  Warnings:

  - You are about to drop the `Upload` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `confidence` on the `ColumnMapping` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed` on the `ColumnMapping` table. All the data in the column will be lost.
  - You are about to drop the column `sourceCol` on the `ColumnMapping` table. All the data in the column will be lost.
  - You are about to drop the column `targetCol` on the `ColumnMapping` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ColumnMapping` table. All the data in the column will be lost.
  - You are about to drop the column `uploadId` on the `ColumnMapping` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `ColumnMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mappedField` to the `ColumnMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalColumnName` to the `ColumnMapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Upload";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UploadedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rowNumber" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileId" TEXT NOT NULL,
    CONSTRAINT "Record_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "UploadedFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ErrorType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DetectedError" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldName" TEXT NOT NULL,
    "detectedValue" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "errorTypeId" TEXT NOT NULL,
    CONSTRAINT "DetectedError_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "UploadedFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetectedError_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DetectedError_errorTypeId_fkey" FOREIGN KEY ("errorTypeId") REFERENCES "ErrorType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalRecords" INTEGER NOT NULL,
    "totalErrors" INTEGER NOT NULL,
    "qualityScore" REAL NOT NULL,
    "analyzedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileId" TEXT NOT NULL,
    CONSTRAINT "AnalysisHistory_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "UploadedFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ColumnMapping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalColumnName" TEXT NOT NULL,
    "mappedField" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ColumnMapping_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "UploadedFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ColumnMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ColumnMapping" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "ColumnMapping";
DROP TABLE "ColumnMapping";
ALTER TABLE "new_ColumnMapping" RENAME TO "ColumnMapping";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ErrorType_name_key" ON "ErrorType"("name");
