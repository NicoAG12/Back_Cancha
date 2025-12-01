import {prisma} from '../../lib/prisma.js'
import DetalleDTO from '../DTOS/DetalleDTO/DetalleDTO.js'
import { prepararDatosTurnoPago } from '../../helpers/prepararDatosTurnoPago.js';
import { prepararDatosVenta } from '../../helpers/prepararDatosVenta.js';
import { prepararDatosEgreso } from '../../helpers/prepararDatosEgreso.js';
import Turno from './TurnosModel.js';
import Producto from './ProductosModels.js';
class MovCaja{
    static async crearMovCaja(
    tipo_movimiento: 'INGRESO' | 'EGRESO',
    fecha: Date,
    descripcion: string,
    cajaId: string,
    usuarioAltaId: string,
    detalles?: DetalleDTO[] 
) {
    try {

        if (tipo_movimiento === 'INGRESO'){
            const itemsTurnos = detalles?.filter(detalle => detalle.turno_id) || [];
            const itemsProductos = detalles?.filter(detalle => detalle.producto_id) || [];
            const totalTurnos = itemsTurnos?.reduce((acc,item) => acc + (item.monto_turno || 0), 0) || 0;

            for (let turno of itemsTurnos){
                if(!turno.turno_id){
                    throw new Error('No existe el turno')
                }
                const estadoCuenta = await Turno.validarYObtenerSaldo(turno.turno_id)

                if(estadoCuenta.saldoRestante <= 0){
                    throw new Error(`El turno ${turno.turno_id} ya está pagado completamente.`);
                }
                                
                if ((turno.monto_turno || 0) > estadoCuenta.saldoRestante){
                    throw new Error(`El turno ${turno.turno_id} tiene un saldo de: ${estadoCuenta.saldoRestante} pero se esta intentando ingresar: ${turno.monto_turno}` )
                }

            }

            const productosConSubtotal = await Promise.all(
             (itemsProductos || []).map(async (p) => {
                const productoReal = await Producto.obtenerProductoPorID(Number(p.producto_id));

                if (!productoReal) throw new Error(`Producto ${p.producto_id} no encontrado`);

                const precioReal =  p.precio_unitario ? p.precio_unitario : Number(productoReal.precio);
                const cantidad = p.cantidad || 1;

            return {
            ...p,
            precio_unitario: precioReal, 
            subtotalCalculado: cantidad * precioReal
                 };
                  })
                     );

            const totalVenta = productosConSubtotal?.reduce((acc,p)=> acc + p.subtotalCalculado,0) || 0;
            
            const totalMovimiento = totalTurnos + totalVenta
            

           return await prisma.$transaction(async (tx)=>{

    
            const nuevoMovimiento = await tx.movimientos_Caja.create({
                data:{
                    monto: totalMovimiento,
                    tipo_movimiento: tipo_movimiento,
                    fecha: fecha,
                    id_caja: {
                        connect:{id:String(cajaId)}
                    },
                    descripcion:descripcion,
                    usuario_alta: {
                        connect:{id:String(usuarioAltaId)}
                    },
                    //Inserto turnos_pagos 
                    turnos_pagos: itemsTurnos.length > 0 ? {
                        create: itemsTurnos.filter((turno): turno is DetalleDTO & { turno_id: string } => !!turno.turno_id).map(turno => 
                        prepararDatosTurnoPago(
                        turno.turno_id,
                        turno.monto_turno || 0,
                        fecha,
                        turno.turno_concepto === 'SENIA' ? 'SENIA' : 'COMPLETO', 
                        turno.turno_concepto || 'Cobro de Turno'
                        
                    )
                        )
                    } : undefined,
                    //Inserto en Ventas
                    ventas: itemsProductos.length > 0 ? {
                        create: [{
                            fecha: fecha,
                            Total: totalVenta,
                            user_alta: {
                                connect:{id: String(usuarioAltaId)}
                            },
                            detalles_venta: {
                                    create: productosConSubtotal.filter((p): p is DetalleDTO & { producto_id: number; subtotalCalculado : number ; cantidad : number ; precio_unitario : number} => !!p.producto_id).map(prod => 
                                        prepararDatosVenta(
                                            prod.producto_id,
                                            prod.cantidad,
                                            prod.precio_unitario,
                                            prod.subtotalCalculado
                                        )
                                      )
                                }
                        }]
                    } : undefined
                }
            })

            

            if(itemsTurnos.length > 0){
                await Promise.all(
                    itemsTurnos.map(async(turno)=>{
                        if(turno.turno_id){
                            await tx.turno.update({
                                where:{id:turno.turno_id},
                                data:{
                                    estado_turno:"FINALIZADO"
                                }
                            })
                        }
                    })
                )
            }

            if(productosConSubtotal.length >0){
                await Promise.all(
                    productosConSubtotal.map(async (prod)=>{
                        if(prod.producto_id){
                            await tx.productos.update({
                                where:{id:prod.producto_id},
                                data:{
                                    stock:{
                                        decrement: prod.cantidad || 1
                                    }
                                }
                            })
                        }
                    })
                )
            }

    

            await tx.caja.update({
                where:{id:cajaId},
                data:{
                    Total:{
                        increment: totalMovimiento 
                    }
                }
            }
            )

            return nuevoMovimiento;
            })
        }

        if(tipo_movimiento === 'EGRESO'){
            const itemsGastos = detalles?.filter(detalle => detalle.categoria_gasto_id) || [];
            const totalGastos = itemsGastos.reduce((acc,item) => acc + (item.monto_gasto || 0), 0) || 0;

            return await prisma.$transaction(async (tx)=>{
                    const nuevoMovimiento = await prisma.movimientos_Caja.create({
                data:{
                    monto: totalGastos,
                    tipo_movimiento: tipo_movimiento,
                    fecha: fecha,
                    id_caja:{
                        connect:{id:cajaId}
                    },
                    descripcion:descripcion,
                    usuario_alta: {
                        connect:{id:String(usuarioAltaId)}
                    },
                    gastos_pagos: itemsGastos.length > 0 ? {
                    create: itemsGastos
                    .filter((g): g is DetalleDTO & { categoria_gasto_id: string } => !!g.categoria_gasto_id)
                    .map((gasto) => 
                    prepararDatosEgreso(
                    Number(gasto.categoria_gasto_id), 
                    gasto.monto_gasto || 0,           
                    descripcion                      
                    )
                    )
                } : undefined
                }
            })

            await tx.caja.update({
                where : {id : cajaId},
                data:{
                    Total:{
                        decrement: totalGastos
                    }
                }
            })
            

            return nuevoMovimiento
            })

        }

    } catch (error) {
        console.error("Error creando movimiento:", error);
        throw error;
    }
}

    static async obtenerMovimientoPorID(id_movimiento: String){
        try {
            const result = await prisma.movimientos_Caja.findUnique({
                where:{
                    id: String(id_movimiento)
                }
            })
            return result
        } catch (error) {
            throw error
        }
    }

    static async obtenerMovimientosPorIDCaja(id_caja: String){
        try {
            const result = await prisma.movimientos_Caja.findMany({
                where:{
                    cajaId: String(id_caja)
                },
                orderBy:{
                    fecha:'desc'
                }
            })
            return result
        } catch (error) {
            throw error
        }
    }

    static async modificarMovCaja(
        id_movimiento: string,
        monto: number,
        descripcion: string
    ){
        try {
            const result = await prisma.movimientos_Caja.update({
                where:{
                    id: String(id_movimiento)
                },
                data:{
                    monto,
                    descripcion
                }
            })
            return result
        } catch (error) {
            throw error
        }
    }   
    
}

export default MovCaja