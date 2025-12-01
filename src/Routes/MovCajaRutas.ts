import express from 'express';
import MovCajaController from '../controllers/MovCajaController.js';

const router = express.Router();

router.post('/', MovCajaController.crearMovCaja);
router.get('/caja/:id', MovCajaController.obtenerMovimientosPorIDCaja);
router.put('/', MovCajaController.modificarMovCaja);

export default router;
