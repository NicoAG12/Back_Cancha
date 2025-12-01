-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Tipo_Movimiento" AS ENUM ('INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "Tipo_Pago_Turno" AS ENUM ('SENIA', 'COMPLETO');

-- CreateEnum
CREATE TYPE "estados_turno" AS ENUM ('RESERVADO', 'CANCELADO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" TEXT NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cancha" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio_hora" DOUBLE PRECISION NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "nombre_cliente" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "minutos_duracion" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "canchaId" INTEGER NOT NULL,
    "estado_turno" "estados_turno" NOT NULL DEFAULT 'RESERVADO',
    "usuarioAltaId" TEXT NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caja" (
    "id" TEXT NOT NULL,
    "saldo_inicial" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),
    "usuarioAperturaId" TEXT NOT NULL,
    "usuarioCierreId" TEXT,
    "Total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimientos_Caja" (
    "id" TEXT NOT NULL,
    "tipo_movimiento" "Tipo_Movimiento" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cajaId" TEXT NOT NULL,
    "descripcion" TEXT,
    "usuarioAltaId" TEXT NOT NULL,

    CONSTRAINT "Movimientos_Caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno_Pagos" (
    "id" TEXT NOT NULL,
    "turnoId" TEXT NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "monto_pagado" DOUBLE PRECISION NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_pago" "Tipo_Pago_Turno" NOT NULL,
    "Observaciones" TEXT,

    CONSTRAINT "Turno_Pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorias_Gastos" (
    "id" SERIAL NOT NULL,
    "nombre_gasto" TEXT NOT NULL,

    CONSTRAINT "Categorias_Gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gastos_pagos" (
    "id" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Gastos_pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ventas" (
    "id" TEXT NOT NULL,
    "productoId" INTEGER NOT NULL,
    "movimientoId" TEXT NOT NULL,
    "turnoId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Total" DOUBLE PRECISION NOT NULL,
    "usuarioAltaId" TEXT NOT NULL,

    CONSTRAINT "Ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detalle_Venta" (
    "id" TEXT NOT NULL,
    "ventaId" TEXT NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Detalle_Venta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_nombre_usuario_key" ON "Usuarios"("nombre_usuario");

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_usuarioAltaId_fkey" FOREIGN KEY ("usuarioAltaId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioAperturaId_fkey" FOREIGN KEY ("usuarioAperturaId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimientos_Caja" ADD CONSTRAINT "Movimientos_Caja_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimientos_Caja" ADD CONSTRAINT "Movimientos_Caja_usuarioAltaId_fkey" FOREIGN KEY ("usuarioAltaId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno_Pagos" ADD CONSTRAINT "Turno_Pagos_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno_Pagos" ADD CONSTRAINT "Turno_Pagos_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimientos_Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gastos_pagos" ADD CONSTRAINT "Gastos_pagos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categorias_Gastos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gastos_pagos" ADD CONSTRAINT "Gastos_pagos_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimientos_Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "Movimientos_Caja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_usuarioAltaId_fkey" FOREIGN KEY ("usuarioAltaId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
