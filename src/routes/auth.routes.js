const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.findAll);
router.get('/users/:id', authController.findOne);
router.put('/users/:id', authMiddleware.authenticate, authController.update);
router.delete('/users/:id', authController.delete);

// Rotas protegidas
router.get('/profile', authMiddleware.authenticate, (req, res) => {
  return res.json({ userId: req.userId });
});

router.get('/admin', authMiddleware.authenticate, authMiddleware.isAdmin, (req, res) => {
  return res.json({ message: 'Acesso admin autorizado' });
});

module.exports = router;