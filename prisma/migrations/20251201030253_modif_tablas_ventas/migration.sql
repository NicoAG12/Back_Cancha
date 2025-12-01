/*
  Warnings:

  - You are about to drop the column `productoId` on the `Ventas` table. All the data in the column will be lost.
  - You are about to drop the column `turnoId` on the `Ventas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ventas" DROP CONSTRAINT "Ventas_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Ventas" DROP CONSTRAINT "Ventas_turnoId_fkey";

-- AlterTable
ALTER TABLE "Ventas" DROP COLUMN "productoId",
DROP COLUMN "turnoId";
