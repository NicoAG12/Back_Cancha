import TurnosPagosModels from "../models/TurnosPagosModels.js"; 

class TurnosPagosControllers{
    static async obtenerTurnosPagosPorIDTurno(req:any, res:any){
        try {
            const {id_turno} = req.params
            const resultado = await TurnosPagosModels.obtenerTurnosPagosPorIDTurno(id_turno)
            res.json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al obtener los turnos pagos'})
        }
    }

    static async crearTurnoPago(req:any, res:any){
        try {
            const {id_turno, movimiento_id, monto, fecha_pago, tipo_pago, observaciones} = req.body
            const resultado = await TurnosPagosModels.crearTurnoPago(id_turno, movimiento_id, monto, new Date(fecha_pago), tipo_pago, observaciones)
            res.json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al crear el turno pago'})
        }
    }

    static async obtenerTurnoPagoPorID(req:any, res:any){
        try {
            const {id_pago} = req.params
            const resultado = await TurnosPagosModels.obtenerTurnoPagoPorID(id_pago)
            res.json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al obtener el turno pago'})
        }
    }

    static async modificarTurnoPago(req:any, res:any){
        try {
            const {id_pago} = req.params
            const {monto_pagado, fecha_pago, tipo_pago, observaciones} = req.body
            const resultado = await TurnosPagosModels.modificarTurnoPago(id_pago, monto_pagado, new Date(fecha_pago), tipo_pago, observaciones)
            res.json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al modificar el turno pago'})
        }
    }   

    static async eliminarTurnoPago(req:any, res:any){
        try {
            const {id_pago} = req.params
            const resultado = await TurnosPagosModels.eliminarTurnoPago(id_pago)
            res.json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al eliminar el turno pago'})
        }
    }
}

export default TurnosPagosControllers