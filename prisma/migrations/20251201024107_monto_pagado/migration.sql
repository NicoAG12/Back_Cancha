/*
  Warnings:

  - Added the required column `monto_pagado` to the `Gastos_pagos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gastos_pagos" ADD COLUMN     "monto_pagado" DOUBLE PRECISION NOT NULL;
