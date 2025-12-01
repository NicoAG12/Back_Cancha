import express from 'express';
import canchasRutas from './src/Routes/CanchasRutas.js';
import usuariosRutas from './src/Routes/UsuariosRutas.js';
import productosRutas from './src/Routes/ProductosRutas.js'
import turnosRutas from './src/Routes/TurnosRutas.js';
import cajasRutas from './src/Routes/CajaRutas.js';
import movcajasRutas from './src/Routes/MovCajaRutas.js'
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/canchas', canchasRutas);
app.use('/usuarios', usuariosRutas);
app.use('/productos', productosRutas);
app.use('/turnos', turnosRutas);
app.use('/cajas', cajasRutas);
app.use('/movcajas', movcajasRutas);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});