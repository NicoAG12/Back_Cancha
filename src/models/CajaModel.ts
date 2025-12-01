import { prisma } from '../../lib/prisma.js';
import dayjs from 'dayjs';
class Caja{
    static async obtenerCajaPorID(id_caja: String){
        try {
            const resultado = await prisma.caja.findUnique({
                where:{
                    id: String(id_caja)
                },
                include:{
                    movimientos_caja : true
                }
            });
            return resultado;
        } catch (error) {
            throw error;
        }
    }
    static async obtenerCajaPorFecha(fecha: Date){
        try {
            const resultado = await prisma.caja.findMany({
                where:{
                    fecha_apertura:{
                        gte: dayjs.utc(fecha).startOf('day').toDate(),
                        lte: dayjs.utc(fecha).endOf('day').toDate()
                    },
                }
            });
            return resultado;
        } catch (error) {
            
        }
    }

    static async obtenerCajas(){
        try {
            const resultado = await prisma.caja.findMany();
            return resultado;
        }
        catch (error) {
            throw error;
        }
    }

    static async actualizarCaja(
        id_caja: string,
        monto: number,
        fechaCierre: Date | null,
        usuarioCierreId?: string,
        estado_caja?: 'ACTIVO' | 'INACTIVO}'
    ) {
        try {
            const resultado = await prisma.caja.update({
                where: {
                    id: String(id_caja)
                },
                data: {
                    Total: monto,
                    fecha_cierre: fechaCierre,
                    usuarioCierreId: usuarioCierreId,
                    estado: estado_caja as any
                }
            });
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    
    static async crearCaja(monto:number, fecha_apertura:Date, usuarioAperturaId:string, estado_caja:'ACTIVO' | 'INACTIVO'){
        try {
            const resultado = await prisma.caja.create({
                data:{
                    Total: monto,
                    fecha_apertura: fecha_apertura,
                    usuarioAperturaId: usuarioAperturaId,
                    estado: estado_caja as any
                }
            });
            return resultado;
        } catch (error) {
            throw error;
        }

    }

}

export default Caja;