import Usuario from "../models/UsuariosModels.js";
import { CrearUsuarioDTO, ActualizarUsuarioDTO } from "../DTOS/UsuariosDTO/UsuariosDTO.js";
import { Request, Response } from 'express';
class UsuariosControllers{
    static async crearUsuario(req: Request,res: Response){
      const {nombre_usuario,password,rol} = req.body as CrearUsuarioDTO;
      const UsuarioExistente = await Usuario.obtenerUsuarioPorNombre(nombre_usuario);
      if(UsuarioExistente){
        return  res.status(400).json({error: 'El nombre de usuario ya existe'});
      }

      try {
        const nuevoUsuario = await Usuario.crearUsuario(
          nombre_usuario,
          password,
          rol
        );
        res.status(201).json(nuevoUsuario);
      } catch (error:any) {
        res.status(500).json({error: error.message});
      }
    }  

    static async obtenerUsuarios(req: Request,res: Response){
      try {
        const usuarios = await Usuario.obtenerUsuarios();
        res.status(200).json(usuarios);
      } catch (error:any) {
        res.status(500).json({error: error.message});
      }
    }

    static async obtenerUsuarioPorNombre(req: Request,res: Response){
      const {nombre_usuario} = req.params;
      try {
        const usuario = await Usuario.obtenerUsuarioPorNombre(nombre_usuario);
        res.status(200).json(usuario);
      } catch (error:any) {
        res.status(500).json({error: error.message});
      }
    }

    static async obtenerUsuarioPorID(req: Request,res: Response){
      const {id} = req.params;
      try {
        const usuario = await Usuario.obtenerUsuarioPorID(id);
        res.status(200).json(usuario);
      } catch (error:any) {
        res.status(500).json({error: error.message});
      }
    }

    static async actualizarUsuario(req: Request,res: Response){
      const {id} = req.params;
      
      const {nombre_usuario ,password,rol,estado} = req.body as ActualizarUsuarioDTO;

      const UsuarioExistente = await Usuario.obtenerUsuarioPorID(id);
      
      if(!UsuarioExistente){
        return  res.status(404).json({error: 'El usuario no existe'});
      }

      if (!nombre_usuario && !password && !rol && !estado){
        return res.status(400).json({error: 'No se proporcionaron datos para actualizar'});
      }
      
      if(!nombre_usuario){
        try {
          const actualizarUsuario = await Usuario.actualizarUsuario(
          id,
          UsuarioExistente.nombre_usuario,
          password ? password : UsuarioExistente.password,
          rol ? rol : UsuarioExistente.rol,
          estado ? estado : UsuarioExistente.estado
        );
        return res.status(200).json(actualizarUsuario);
        } catch (error) {
          return res.status(500).json({error: 'Error al actualizar el usuario'});
        }
        
      }
      const UsuarioNombreExistente = await Usuario.obtenerUsuarioPorNombre(nombre_usuario);
      
      if(UsuarioNombreExistente){
        if(UsuarioNombreExistente.id !== id){
            return  res.status(400).json({error: 'El nombre de usuario ya existe'});
            }
      }

      try {
        const usuarioActualizado = await Usuario.actualizarUsuario(
          id,
          nombre_usuario? nombre_usuario : UsuarioExistente.nombre_usuario,
          password ? password : UsuarioExistente.password,
          rol ? rol : UsuarioExistente.rol
        );
        res.status(200).json(usuarioActualizado);
      } catch (error:any) {
        res.status(500).json({error: error.message});
      }
    }


}

export default UsuariosControllers;