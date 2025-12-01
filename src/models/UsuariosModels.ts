import {prisma} from '../../lib/prisma.js';

class Usuario{
    static async crearUsuario(
        nombre_usuario: string,
        password: string,
        rol: 'ADMIN' | 'USER',
    ) {
        try {
            const usuarioCreado = await prisma.usuarios.create({
                data: { nombre_usuario, password, rol }
            });
            return usuarioCreado;
        } catch (error) {
            throw error;
        }
    }

    
    static async obtenerUsuarios(){
        try {
            const usuarios = await prisma.usuarios.findMany()
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerUsuarioPorID(id: string){
        try {
            const usuario = await prisma.usuarios.findUnique({
                where:{id}
            })
            return usuario
        } catch (error) {
            throw error;            
        }
    }

    static async obtenerUsuarioPorNombre(nombre_usuario: string){
        try {
            const usuario = await prisma.usuarios.findUnique({
                where:{nombre_usuario}
            })
            return usuario
        } catch (error) {
            throw error;            
        }
    }

    static async actualizarUsuario(
        id: string,
        nombre_usuario?: string,
        password?: string,
        rol?: 'ADMIN' | 'USER',
        estado ?: 'ACTIVO' | 'INACTIVO',
    ){
        try {
            const usuarioActualizado = await prisma.usuarios.update({
                where:{id},
                data:{
                    nombre_usuario,
                    password,
                    rol,
                    estado
                }
            })
            return usuarioActualizado;
        } catch (error) {  
            throw error;
        }
    }

    static async inactivarUsuario(id: string){
        try {
            const usuarioInactivado = await prisma.usuarios.update({
                where:{id},
                data:{
                    estado: 'INACTIVO'
                }
            })
            return usuarioInactivado;
        } catch (error) {
            throw error;            
        }
    }
}

export default Usuario;