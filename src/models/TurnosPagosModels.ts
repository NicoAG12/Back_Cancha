import {prisma} from '../../lib/prisma.js'
import { prepararDatosTurnoPago } from '../../helpers/prepararDatosTurnoPago.js'
class TurnosPagosModels{
    static async obtenerTurnosPagosPorIDTurno(id_turno: String){
        try {
            const resultado =  await prisma.turno_Pagos.findMany({
            where:{
                turnoId: String(id_turno)
            }
        })
        return resultado
        } catch (error) {
            throw error
        }
        
    }

    static async crearTurnoPago(id_turno: string, movimiento_id : string,  monto: number, fecha_pago: Date, tipo_pago: 'SENIA' | 'COMPLETO',observaciones?: string){
        try {
            
            const datosTurnoPago = prepararDatosTurnoPago(id_turno, monto, fecha_pago, tipo_pago, observaciones);
            
            const resultado = await prisma.turno_Pagos.create({
                data:{
                    ...datosTurnoPago,
                    movimientoId: movimiento_id
                }
            })
            return resultado
        } catch (error) {
            throw error 
        }
    }

    static async obtenerTurnoPagoPorID(id_pago: string){
        try {
            const resultado = await prisma.turno_Pagos.findUnique({
                where:{
                    id: String(id_pago)
                }
            })
            return resultado
        } catch (error) {
            throw error
        }
    }

    static async modificarTurnoPago(id_pago: string, monto_pagado: number, fecha_pago: Date, tipo_pago: 'SENIA' | 'PRODUCTO' | 'TURNO', observaciones?: string){
        try {
            const resultado = await prisma.turno_Pagos.update({
                where:{
                    id: String(id_pago)
                },
                data:{
                    monto_pagado,
                    fecha_pago,
                    tipo_pago: tipo_pago as any,
                    Observaciones: observaciones
                }
            })
            return resultado
        } catch (error) {
            throw error
        }
    }

    static async eliminarTurnoPago(id_pago: string){
        try {
            const resultado = await prisma.turno_Pagos.delete({
                where:{
                    id: String(id_pago)
                }
            })
            return resultado
        } catch (error) {
            throw error
        }
    }

}

export default TurnosPagosModels