import MovCaja from "../models/MovCajaModel.js";
import {Request, Response} from 'express'
import dayjs from "dayjs";
import Caja from "../models/CajaModel.js";
class MovCajaController{
    static async crearMovCaja(req:Request, res:Response){
        try {
            const {tipo_movimiento,fecha,descripcion,cajaId,usuarioAltaId,detalles} = req.body
            const fechaFormateada = dayjs.utc(fecha,'YYYYMMDD').toDate();

            const CajaExistente = await Caja.obtenerCajaPorID(cajaId)
            
            if(CajaExistente?.estado !== 'ACTIVO'){
                return res.status(400).json({error: 'La caja no está activa o no existe'})
            }

            const resultado = await MovCaja.crearMovCaja(
                tipo_movimiento,
                fechaFormateada,
                descripcion,
                cajaId,
                usuarioAltaId,
                detalles
            )

            res.status(201).json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al crear el movimiento de caja'})
        }
    }

    static async obtenerMovimientosPorIDCaja(req:Request, res:Response){
        try {
            const {id} = req.params
            const resultado = await MovCaja.obtenerMovimientosPorIDCaja(id)
            res.status(200).json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al obtener los movimientos de caja'})
        }
    }  

    static async modificarMovCaja(req:Request, res:Response){
        try {
            const {id_movimiento, monto, descripcion} = req.body

            const MovExistente = await MovCaja.obtenerMovimientoPorID(id_movimiento)
            
            if(!MovExistente){
                return res.status(404).json({error: 'El movimiento de caja no existe'})
            }

            const resultado = await MovCaja.modificarMovCaja(
                id_movimiento,
                monto ? monto : MovExistente.monto,
                descripcion ? descripcion : MovExistente
            )
            res.status(200).json(resultado)
        } catch (error) {
            res.status(500).json({error: 'Error al modificar el movimiento de caja'})
        }
    }
}

export default MovCajaController