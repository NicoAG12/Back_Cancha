
export interface CrearProductoDTO{
    nombre : string,
    precio : number,
    stock : number,
    estado : 'ACTIVO' | 'INACTIVO'
}

export interface ActualizarProductoDTO{
    nombre?: string,
    precio?: number,
    stock?: number,
    estado?: 'ACTIVO' | 'INACTIVO'
}