import Producto from "../models/ProductosModels.js";
import { Request, Response } from 'express';
import { ActualizarProductoDTO,CrearProductoDTO } from "../DTOS/ProductoDTO/ProductoDTO.js";
class ProductosControllers{
    
      static async crearProducto(req:Request, res:Response){
        const {nombre,precio,stock,estado} = req.body as CrearProductoDTO ;
        try {
            const nuevoProducto = await Producto.crearProducto(
                nombre,
                precio,
                stock,
                estado
            );
            res.status(201).json(nuevoProducto);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async obtenerProductos(req:Request, res:Response){
        try {
            const productos = await Producto.obtenerProductos();
            res.status(200).json(productos);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async obtenerProductoPorID(req:Request, res:Response){
        const {id} = req.params;
        try {
            const producto = await Producto.obtenerProductoPorID(Number(id));
            res.status(200).json(producto);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }

    static async actualizarProducto(req:Request, res:Response){
        const {id} = req.params;
        const {nombre,precio,stock,estado} = req.body as ActualizarProductoDTO;
        try {

            const ProductoExistente = await Producto.obtenerProductoPorID(Number(id));
            if(!ProductoExistente){
                return res.status(404).json({error: 'El producto no existe'});
            }

            if (!nombre && !precio && !stock && !estado){
                return res.status(400).json({error: 'No se proporcionaron datos para actualizar'});
            }


            const productoActualizado = await Producto.actualizarProducto(
                Number(id) ? Number(id) : ProductoExistente.id,
                nombre ? nombre : ProductoExistente.nombre,
                precio ? precio : ProductoExistente.precio,
                stock ? stock : ProductoExistente.stock,
                estado ? estado : ProductoExistente.estado
            );
            res.status(200).json(productoActualizado);
        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    }
  

}

export default ProductosControllers;