const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'esquinita_secret_2026';
function verificarToken(req, res, next) {
    const h = req.headers.authorization;
    if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Token no proporcionado' });
    try { req.admin = jwt.verify(h.split(' ')[1], SECRET); next(); }
    catch (e) { res.status(401).json({ error: 'Token inválido o expirado' }); }
}
function soloAdmin(req, res, next) {
    if (req.admin.rol !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
    next();
}
module.exports = { verificarToken, soloAdmin, SECRET };
