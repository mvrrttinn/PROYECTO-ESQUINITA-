const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { verificarToken, soloAdmin, SECRET } = require('../middleware/auth');

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
        const admin = await Admin.findOne({ email, activo: true });
        if (!admin || !(await admin.compararPassword(password)))
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        const token = jwt.sign({ id: admin._id, nombre: admin.nombre, email: admin.email, rol: admin.rol }, SECRET, { expiresIn: '12h' });
        res.json({ token, admin: { nombre: admin.nombre, email: admin.email, rol: admin.rol } });
    } catch (e) { next(e); }
});
router.get('/perfil', verificarToken, (req, res) => { res.json(req.admin); });
router.post('/registro', verificarToken, soloAdmin, async (req, res, next) => {
    try {
        const a = await Admin.create(req.body);
        res.status(201).json({ mensaje: 'Usuario creado', admin: { nombre: a.nombre, email: a.email, rol: a.rol } });
    } catch (e) { next(e); }
});
module.exports = router;
