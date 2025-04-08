const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, authConfig.secret);
      req.userId = decoded.id;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  },

  isAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(' ');
    const decoded = jwt.verify(token, authConfig.secret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    return next();
  }
};