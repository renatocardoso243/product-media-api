const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authConfig = require('../config/auth');
const bcrypt = require('bcryptjs');

module.exports = {
  
  // Registrar um novo usuário
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Verifica se todos os campos foram fornecidos
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false, 
          error: 'Todos os campos são obrigatórios' 
        });
      }

      const user = await User.create({ name, email, password });

      // Gera um token JWT
      const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: authConfig.expiresIn });

      // Retorna o token junto com os dados do usuário
      return res.status(201).json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        token
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Erro no servidor' 
      });
    }
  },

  // Atualizar um usuário existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, currentPassword, newPassword } = req.body;

      // Busca o usuário
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      // Verifica se o email já existe (para outro usuário)
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            error: 'Email já está em uso por outro usuário'
          });
        }
      }

      // Se estiver alterando a senha, verifica a senha atual
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            error: 'Senha atual é obrigatória para alteração de senha'
          });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: 'Senha atual incorreta'
          });
        }

        // Atualiza a senha (o hook beforeSave fará o hash)
        user.password = newPassword;
      }

      // Atualiza os outros campos
      if (name) user.name = name;
      if (email) user.email = email;

      // Salva as alterações
      await user.save();

      // Retorna o usuário atualizado (sem a senha)
      const userData = user.get({ plain: true });
      delete userData.password;

      return res.json({
        success: true,
        user: userData,
        message: 'Usuário atualizado com sucesso'
      });

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao atualizar usuário'
      });
    }
  },

  // Autenticar um usuário existente
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Credenciais inválidas' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false, 
          error: 'Credenciais inválidas' 
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      return res.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
        token
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Erro no servidor' 
      });
    }
  },

  // Listar todos os usuários
  findAll: async (req, res) => {
    try {
      const users = await User.findAll({
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Erro na listagem de usuários"
      })
    }
  },

  // Listar um usuário por ID
  findOne: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      // Verifica se o usuário existe
      if (!user) {
        return res.status(404).json({
          sucess: false,
          message: `Usuário com id ${req.params.id} nao encontrado`
        });
      }

      // Retorna o usuário
      res.status(200).json({
        success: true,
        data: user
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Erro em encontrar usuário com id ${req.params.id}`
      });
    }
  },

  // Deletar um usuário
  delete: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      // Verifica se o usuário existe
      if (!user) {
        return res.status(404).json({
          sucess: false,
          message: `Usuário com id ${req.params.id} nao encontrado`
        });
      }

      // Deletar usuário
      await user.destroy();

      res.status(200).json({
        success: true,
        message: "Usuário deletado com sucesso!"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Erro ao deletar usuário com id ${req.params.id}`
      })
    }
  }
};