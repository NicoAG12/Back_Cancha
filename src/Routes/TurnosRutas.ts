import TurnosControllers from "../controllers/TurnosControllers.js";
import express from 'express';

const router = express.Router();

router.get('/', TurnosControllers.obtenerTurnos);
router.get('/usuario/:usuario_alta', TurnosControllers.obtenerTurnosPorUsuario);
router.get('/:id', TurnosControllers.obtenerTurnoPorID);
router.get('/fecha/:fecha', TurnosControllers.obtenerTurnosPorFecha);
router.get('/rango/:fecha_inicio/:fecha_fin', TurnosControllers.obtenerTurnosPorRangoFechas);
router.post('/', TurnosControllers.crearTurno);

export default router;