import {prisma} from '../../lib/prisma.js';
import dayjs from 'dayjs';
import Cancha from './CanchasModels.js';
class Turno{
    static async crearTurno(nombre_cliente : string, fecha_hora: Date, Cancha_id :number, usuario_alta: string,minutos_duracion:number){
        const cancha = await Cancha.obtenerCanchaPorId(Number(Cancha_id))
        if (!cancha){
            throw new Error("Cancha no existente")
        }
        try {
            const turnoCreado = await prisma.turno.create({
                data:{
                    nombre_cliente,
                    fecha_hora,
                    usuario_alta: { connect: { id: usuario_alta } },
                    Cancha_id: { connect: { id: Cancha_id } },
                    precio_turno : (cancha.precio_hora * minutos_duracion) / 60
                }
            })
            return turnoCreado;
        } catch (error) {
            throw error;
        }
    }

   

    static async obtenerTurnos(){
        try {
            const turnos = await prisma.turno.findMany()
            return turnos;
        } catch (error) {
            throw error;
        }
    }
    static async obtenerTurnosPorUsuario(usuario_alta:string){
        try {
            const turnos = await prisma.turno.findMany({
                where:{usuarioAltaId: usuario_alta}
            })
            return turnos;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTurnosPorFecha(fecha:Date){
        try {
           const turnos = await prisma.turno.findMany({
                where:
                {fecha_hora :{
                    gte: dayjs.utc(fecha).startOf('day').toDate(),
                    lte: dayjs.utc(fecha).endOf('day').toDate()
                }},
                orderBy:{fecha_hora: 'asc'}
           })
            return turnos;
        } catch (error) {
            throw error
        }
    }

    static async obtenerTurnosPorRangoFechas(fecha_inicio:Date, fecha_fin:Date){
        try {
           const turnos = await prisma.turno.findMany({
                where:
                {fecha_hora : {
                    gte: fecha_inicio,
                    lte: fecha_fin
                }
                },
                orderBy:{fecha_hora: 'asc'}
                
           })
            return turnos;
        } catch (error) {
            throw error
        }
    }

    static async obtenerTurnoPorID(id:string){
        try {
            const turno = await prisma.turno.findUnique({
                where:{id},
                include:{
                    turnos_pagos:true
                }
            })
            return turno;
        } catch (error) {
            throw error;
        }
    }

     static async validarYObtenerSaldo(id_turno: string){
        const turno =  await this.obtenerTurnoPorID(id_turno)

        if(!turno) throw new Error('El turno no existe')

        const totalPagadoHastaAhora = turno.turnos_pagos.reduce((acc,pago)=>{
            return acc + Number(pago.monto_pagado)
        },0)    

        const precioTotal = Number(turno.precio_turno);
        const saldoRestante = turno.precio_turno - totalPagadoHastaAhora

        return{
            precioTotal,
            totalPagado: totalPagadoHastaAhora,
            saldoRestante,
            estaPagadoTotalmente: saldoRestante <= 0
        }


    }


    static async actualizarTurno(
        id: string,
        nombre_cliente?: string,
        fecha?: Date,
        Cancha_id?: number,
        estado_turno?: 'RESERVADO' | 'CANCELADO' | 'FINALIZADO',
        minutos_duracion?:number
    ){
        
        try {
            const turnoActualizado = await prisma.turno.update({
                where:{id},
                data:{
                    nombre_cliente,
                    fecha_hora: fecha,
                    minutos_duracion,
                    ...(Cancha_id && { Cancha_id: { connect: { id: Cancha_id } } }),
                    estado_turno
                }
            })
            return turnoActualizado;
        } catch (error) {
            throw error;
        }
    }

    static async verificarDisponibilidadTurno(fecha:Date, Cancha_id:number){
        try {
            const turno = await prisma.turno.findFirst({
                where:{
                    fecha_hora: fecha,
                    canchaId: Cancha_id
                }
            })
            return turno;
        } catch (error) {
            throw error;
        }
    }

    static async eliminarTurno(id: string){
        try {
            const turnoEliminado = await prisma.turno.delete({
                where:{id}
            })
            return turnoEliminado;
        } catch (error) {
            throw error;
        }
    }

}

export default Turno