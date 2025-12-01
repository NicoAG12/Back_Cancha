
export const prepararDatosTurnoPago = (
    id_turno: string, 
    monto: number, 
    fecha: Date, 
    tipo: 'SENIA' | 'COMPLETO', 
    observaciones?: string
) => {
    return {
        turnoId: id_turno,
        monto_pagado: monto,
        fecha_pago: fecha,
        tipo_pago: tipo,
        Observaciones: observaciones
    };
};

