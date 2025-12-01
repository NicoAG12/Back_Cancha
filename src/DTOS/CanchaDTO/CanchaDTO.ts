
export interface CrearCanchaDTO{
    nombre : string,
    precio_hora : number
}
export interface ActualizarCanchaDTO{
    nombre?: string,
    precio_hora?: number,
    activo?: boolean
}
