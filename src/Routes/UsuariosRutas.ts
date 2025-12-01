import express from "express";
import UsuariosControllers from "../controllers/UsuariosControllers.js";

const router = express.Router();

router.post('/', UsuariosControllers.crearUsuario);
router.get('/', UsuariosControllers.obtenerUsuarios);
router.get('/nombre/:nombre_usuario', UsuariosControllers.obtenerUsuarioPorNombre);
router.get('/:id', UsuariosControllers.obtenerUsuarioPorID);
router.put('/:id', UsuariosControllers.actualizarUsuario);

export default router;