export const prepararDatosEgreso = (
    id_categoria: number, 
    monto_pagado: number, 
    descripcion: string
) => {
    return {
        
        id_categoria: {
            connect: { id: id_categoria }
        },
        monto_pagado: monto_pagado || 0, 

        descripcion: descripcion || ('GASTO POR CATEGORIA: ' + id_categoria)

    };
}