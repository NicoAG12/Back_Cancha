
export interface CrearUsuarioDTO{
    nombre_usuario: string,
    password: string,
    rol: 'ADMIN' | 'USER',
}

export interface ActualizarUsuarioDTO{
    nombre_usuario?: string,
    password?: string,
    rol?: 'ADMIN' | 'USER',
    estado? : 'ACTIVO' | 'INACTIVO',
}

