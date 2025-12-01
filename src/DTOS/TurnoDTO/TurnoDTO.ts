
export interface CrearTurnoDTO{
    nombre_cliente : string,
    fecha : Date,
    Hora_inicio : Date,
    Cancha_id : number,
    usuario_alta: string,
    minutos_duracion : number
}

export interface ActualizarTurnoDTO{
    nombre_cliente?: string,
    fecha?: Date,
    Hora_inicio?: Date,
    Cancha_id?: number,
    estado_turno?: 'RESERVADO' | 'CANCELADO' | 'FINALIZADO',
    minutos_duracion?:number
}

