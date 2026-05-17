/**
 * Middleware de manejo de errores centralizado.
 */

function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err.message);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errores = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: 'Error de validación', detalles: errores });
    }

    // Error de ID inválido
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'ID inválido' });
    }

    // Error de duplicado
    if (err.code === 11000) {
        return res.status(400).json({ error: 'Ya existe un registro con esos datos' });
    }

    // Error genérico
    const status = err.status || 500;
    const response = {
        error: status >= 500 ? 'Error interno del servidor' : err.message || 'Error desconocido'
    };
    res.status(status).json(response);
}

module.exports = errorHandler;
