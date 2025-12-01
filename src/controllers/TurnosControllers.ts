import Turno from "../models/TurnosModel.js";
import { Request, Response } from 'express';
import { CrearTurnoDTO, ActualizarTurnoDTO } from "../DTOS/TurnoDTO/TurnoDTO.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
class TurnosControllers{
    static async obtenerTurnos(req:Request, res:Response){
        try {
            const turnos = await Turno.obtenerTurnos();
            res.status(200).json(turnos);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async obtenerTurnosPorUsuario(req:Request, res:Response){
        const {usuario_alta} = req.params;
        try {
            const turnos = await Turno.obtenerTurnosPorUsuario(usuario_alta);
            res.status(200).json(turnos);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async obtenerTurnoPorID(req:Request, res:Response){
        const {id} = req.params;
        try {
            const turno = await Turno.obtenerTurnoPorID(id);
            res.status(200).json(turno);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }
static async obtenerTurnosPorFecha(req: Request, res: Response) {
    try {
        const {fecha} = req.params as { fecha: string};
        if (!fecha) {
            return res.status(400).json({ error: 'La fecha es obligatoria' });
        }
        const fechaDate = dayjs.utc(`${fecha}`, 'YYYYMMDD').toDate();
       console.log(fechaDate);
        const turnos = await Turno.obtenerTurnosPorFecha(fechaDate);
        res.status(200).json(turnos);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

    static async obtenerTurnosPorRangoFechas(req:Request, res:Response){
        const {fecha_inicio, fecha_fin} = req.params;
        const fechaInicioDate = dayjs(fecha_inicio,'YYYYMMDD 0000').toDate();
        const fechaFinDate = dayjs(fecha_fin,'YYYYMMDD 2359').toDate();
        try {
            const turnos = await Turno.obtenerTurnosPorRangoFechas(new Date(fechaInicioDate), new Date(fechaFinDate));
            res.status(200).json(turnos);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async crearTurno(req:Request, res:Response){

        const {nombre_cliente, fecha, Hora_inicio, Cancha_id, usuario_alta,minutos_duracion} = req.body as CrearTurnoDTO;
       const fechaDate = dayjs.utc(`${fecha} ${Hora_inicio}`, 'YYYYMMDD HHmm').toDate();
        
        const turnoExistente = await Turno.verificarDisponibilidadTurno(fechaDate, Cancha_id);
        if(turnoExistente){
            return  res.status(400).json({error: 'Ya existe un turno para la cancha en la fecha y hora indicada'});
        }

       

        try {
            const nuevoTurno = await Turno.crearTurno(
                nombre_cliente,
                fechaDate,
                Cancha_id,
                usuario_alta,
                minutos_duracion? minutos_duracion:60
            );
            res.status(201).json(nuevoTurno);
        }
        catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async actualizarTurno(req:Request, res:Response){
        const {id} = req.params;
        const {nombre_cliente, fecha, Hora_inicio, Cancha_id,minutos_duracion,estado_turno} = req.body as ActualizarTurnoDTO;
        try {
            const fechaDate = fecha ? dayjs.utc(`${fecha} ${Hora_inicio}`, 'YYYYMMDD HHmm').toDate() : undefined;
            const turnoExistente = await Turno.obtenerTurnoPorID(id);
            if(!turnoExistente){
                return res.status(404).json({error: 'El turno no existe'});
            }

            if (!nombre_cliente && !fecha && !Hora_inicio && !Cancha_id && !minutos_duracion && !estado_turno){
                return res.status(400).json({error: 'No se proporcionaron datos para actualizar'});
            }

            const turnoActualizado = await Turno.actualizarTurno(
                id,
                nombre_cliente ? nombre_cliente : turnoExistente.nombre_cliente,
                fechaDate ? new Date(fechaDate) : turnoExistente.fecha_hora,
                Cancha_id ? Cancha_id : turnoExistente.canchaId,
                estado_turno ? estado_turno : turnoExistente.estado_turno,
                minutos_duracion ? minutos_duracion : turnoExistente.minutos_duracion
            );
            res.status(200).json(turnoActualizado);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }
}

export default TurnosControllers;