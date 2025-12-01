

interface DetalleDTO {
    turno_id?:string,
    monto_turno?:number,
    turno_concepto?:string
    categoria_gasto_id?:string,
    monto_gasto?:number
    producto_id?:number,
    cantidad?:number,
    precio_unitario?:number,
}

export default DetalleDTO;