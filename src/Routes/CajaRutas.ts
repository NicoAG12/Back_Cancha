import express from 'express';
import CajaController from '../controllers/CajaController.js';

const router = express.Router();

router.get('/:id', CajaController.obtenerCajaPorID);
router.get('/fecha/:fecha', CajaController.obtenerCajaPorFecha);
router.put('/:id', CajaController.actualizarCaja);
router.post('/', CajaController.crearCaja);

export default router;
