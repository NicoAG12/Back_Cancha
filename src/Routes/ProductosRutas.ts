import express from 'express';
import ProductosControllers from '../controllers/ProductosControllers.js';

const router = express.Router();

router.post('/', ProductosControllers.crearProducto);
router.get('/', ProductosControllers.obtenerProductos);
router.get('/:id', ProductosControllers.obtenerProductoPorID);
router.put('/:id', ProductosControllers.actualizarProducto);

export default router;