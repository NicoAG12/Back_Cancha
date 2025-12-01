import {prisma} from '../../lib/prisma.js';

class Producto{
    static async crearProducto(nombre: string, precio: number, stock: number, estado: 'ACTIVO' | 'INACTIVO'){
        try {
            const productoCreado = await prisma.productos.create({
                data:{nombre,precio,stock,estado}
            })
            return productoCreado;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerProductos(){
        try {
            const productos = await prisma.productos.findMany()
            return productos;
        } catch (error) {
            throw error;
        }
    }
    static async obtenerProductoPorID(id:number){
        try {
            const producto = await prisma.productos.findUnique({
                where:{id}
            })
            return producto;
        } catch (error) {
            throw error;
        }
    }
    static async actualizarProducto(
        id: number,
        nombre?: string,
        precio?: number,
        stock?: number,
        estado?: 'ACTIVO' | 'INACTIVO'
    ){
        
        try {
            
            const productoActualizado = await prisma.productos.update({
                where:{id},
                data:{nombre,precio,stock,estado}
            })
            return productoActualizado;
        } catch (error) {
            throw error;
        }
    }
    
}

export default Producto