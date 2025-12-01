import { Request, Response } from 'express';
import CanchasModels from '../models/CanchasModels.js';
import { CrearCanchaDTO,ActualizarCanchaDTO } from '../DTOS/CanchaDTO/CanchaDTO.js';

class CanchasControllers {

    static async getCanchas(req: Request, res: Response) {
        const activas = req.query.activas as string | undefined;

        try {
            const canchas = await CanchasModels.obtenerCanchas(activas === 'true');
            res.status(200).json(canchas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async crearCancha(req: Request, res: Response) {
        const { nombre, precio_hora } = req.body as CrearCanchaDTO;

        try {
            const nuevaCancha = await CanchasModels.crearCancha(nombre, precio_hora);
            res.status(201).json(nuevaCancha);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    
    static async actualizarCancha(req: Request, res: Response) {
        const id = Number(req.params.id); 
        const { nombre, precio_hora, activo } = req.body as ActualizarCanchaDTO;

        const canchaExistente = await CanchasModels.obtenerCanchaPorId(id);
        if (!canchaExistente) {
            return res.status(404).json({ error: 'Cancha no encontrada' });
        }

        try {
            const canchaActualizada = await CanchasModels.actualizarCancha(
                id,
                nombre? nombre : canchaExistente.nombre,
                precio_hora ? precio_hora : canchaExistente.precio_hora,
                activo ? activo : true
            );
            res.status(200).json(canchaActualizada);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CanchasControllers;