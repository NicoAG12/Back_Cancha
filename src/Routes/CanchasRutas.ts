import express from 'express';
import CanchasControllers from '../controllers/CanchasControllers.js';

const router = express.Router();

router.get('/', CanchasControllers.getCanchas);
router.post('/', CanchasControllers.crearCancha);
router.put('/:id', CanchasControllers.actualizarCancha);

export default router;