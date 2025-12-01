import Caja from "../models/CajaModel.js";
import { Request, Response } from "express";
import dayjs from "dayjs";
class CajaController{
    static async obtenerCajaPorID(req:Request, res:Response){
        try {
            const { id } = req.params;
            const caja = await Caja.obtenerCajaPorID(id);
            res.json(caja);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la caja por ID' });
        }
    }

    static async obtenerCajaPorFecha(req:Request, res:Response){
        try {
            const { fecha } = req.params;
            const fechaFormateada = dayjs.utc(fecha,'YYYYMMDD').toDate();
            const caja = await Caja.obtenerCajaPorFecha(fechaFormateada);
            res.json(caja);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la caja por fecha' });
        }
    }

    static async actualizarCaja(req:Request, res:Response){
        try {
            const { id } = req.params;
            const { monto, fechaCierre, usuarioCierreId, estado_caja } = req.body;
            const fechaCierreFormateada = fechaCierre ? dayjs.utc(fechaCierre,'YYYYMMDD HH:mm').toDate() : null;
            const cajaExistente = await Caja.obtenerCajaPorID(id);
            if (!cajaExistente) {
                return res.status(404).json({ error: 'Caja no encontrada' });
            }

            if (cajaExistente.estado === 'INACTIVO' as any) {
                return res.status(400).json({ error: 'No se puede actualizar una caja cerrada' });
            }


            const cajaActualizada = await Caja.actualizarCaja(id, monto ? cajaExistente.Total + monto : cajaExistente.Total , fechaCierreFormateada ? fechaCierreFormateada : cajaExistente.fecha_cierre , usuarioCierreId, estado_caja);
            res.json(cajaActualizada);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la caja' });
        }
    }

    static async crearCaja(req:Request, res:Response){
        try {
            const { monto, fecha_apertura, usuarioAperturaId, estado_caja } = req.body;

            const fechaAperturaFormateada = dayjs.utc(fecha_apertura,'YYYYMMDD').toDate();

            const cajas = await Caja.obtenerCajas();

            const cajaEncontrada = cajas.find(caja => 
                dayjs.utc(caja.fecha_apertura).isSame(dayjs.utc(fechaAperturaFormateada), 'day')
            );
            
            if (cajaEncontrada && cajaEncontrada.estado === 'ACTIVO') {
                return res.status(400).json({ error: `Error! Se encuentra una caja abierta del dia: ${cajaEncontrada.fecha_apertura} `});
            }
            

            const cajaExistente = await Caja.obtenerCajaPorFecha(fechaAperturaFormateada)

            if (cajaExistente && cajaExistente.length > 0) {
                return res.status(400).json({ error: 'Ya existe una caja para la fecha de apertura indicada' });
            }

            if (estado_caja !== 'ACTIVO' && estado_caja !== 'INACTIVO') {
                return res.status(400).json({ error: 'Estado de caja inválido' });
            }

            const nuevaCaja = await Caja.crearCaja(monto, fechaAperturaFormateada, usuarioAperturaId, estado_caja);
            res.status(201).json(nuevaCaja);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la caja' });
        }
    }
}

export default CajaController;