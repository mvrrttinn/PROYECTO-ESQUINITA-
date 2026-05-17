const router = require('express').Router();
const Admin = require('../models/Admin');
const { verificarToken, soloAdmin } = require('../middleware/auth');

router.use(verificarToken);
router.use(soloAdmin);

// GET /api/usuarios
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await Admin.find()
      .select('nombre email rol activo createdAt')
      .sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (e) { next(e); }
});

// POST /api/usuarios
router.post('/', async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    if (password.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    const existe = await Admin.findOne({ email });
    if (existe)
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    const usuario = await Admin.create({ nombre, email, password, rol: rol || 'cajero' });
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: { _id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (e) { next(e); }
});

// PUT /api/usuarios/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, email, rol, activo } = req.body;
    const usuario = await Admin.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    if (email && email !== usuario.email) {
      const existe = await Admin.findOne({ email });
      if (existe)
        return res.status(400).json({ error: 'Ya existe otro usuario con ese email' });
    }
    if (nombre !== undefined) usuario.nombre = nombre;
    if (email !== undefined) usuario.email = email;
    if (rol !== undefined) usuario.rol = rol;
    if (activo !== undefined) usuario.activo = activo;
    await usuario.save();
    res.json({
      mensaje: 'Usuario actualizado',
      usuario: { _id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, activo: usuario.activo }
    });
  } catch (e) { next(e); }
});

// PATCH /api/usuarios/:id/password
router.patch('/:id/password', async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    const usuario = await Admin.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    usuario.password = password;
    await usuario.save();
    res.json({ mensaje: `Contraseña de ${usuario.nombre} actualizada correctamente` });
  } catch (e) { next(e); }
});

// DELETE /api/usuarios/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.admin.id)
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    const usuario = await Admin.findByIdAndDelete(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: `Usuario "${usuario.nombre}" eliminado` });
  } catch (e) { next(e); }
});

module.exports = router;
