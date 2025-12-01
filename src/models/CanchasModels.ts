import { prisma } from '../../lib/prisma.js';
class Cancha {

    static async crearCancha(nombre: string, precio_hora: number) {
        try {
            const canchaCreada = await prisma.cancha.create({
                data: { nombre, precio_hora }
            });
            return canchaCreada;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerCanchas(activas: boolean) {
        try {
            if (activas) {
                const canchas = await prisma.cancha.findMany({
                    where: { estado: 'ACTIVO' }
                });
                return canchas;
            }

            const canchas = await prisma.cancha.findMany();
            return canchas;

        } catch (error) {
            throw error;
        }
    }

    static async obtenerCanchaPorId(id: number) {
        try {
            const cancha = await prisma.cancha.findUnique({
                where: { id }
            });
            return cancha;
        } catch (error) {
            throw error;
        }
    }

    static async actualizarCancha(
        id: number,
        nombre: string,
        precio_hora: number,
        activo: boolean
    ) {
        try {
            const canchaExistente = await this.obtenerCanchaPorId(id);

            if (!canchaExistente) {
                throw new Error('La cancha no existe');
            }

            const canchaActualizada = await prisma.cancha.update({
                where: { id },
                data: {
                    nombre: nombre ?? canchaExistente.nombre,
                    precio_hora: precio_hora ?? canchaExistente.precio_hora,
                    estado: activo ? 'ACTIVO' : 'INACTIVO'
                }
            });

            return canchaActualizada;

        } catch (error) {
            throw error;
        }
    }

}

export default Cancha;