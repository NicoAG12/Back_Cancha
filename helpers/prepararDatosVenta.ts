
export const prepararDatosVenta = (
    id_producto : number,
    cantidad: number,
    precio_unitario: number,
    subtotal:number
)=>{
    return{
         id_producto: {
            connect: {id: id_producto}
         },
         cantidad: cantidad || 1,
         precio_unitario: precio_unitario || 0,
         subtotal: subtotal
    }
}