const { Product } = require('../models');
const upload = require('../config/upload');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function safeUnlink(filePath, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (err) {
      if (err.code === 'EBUSY' && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
        continue;
      }
      console.error(`Failed to delete ${filePath}:`, err.message);
      return false;
    }
  }
}

module.exports = {
  create: [
    upload.single('image'),
    async (req, res) => {
      try {
        let imageUrl = null;
        
        if (req.file) {
          const filename = `processed_${req.file.filename}`;
          const outputPath = path.join(process.cwd(), 'uploads', filename);
          
          try {
            // Processa a imagem
            await sharp(req.file.path)
              .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(outputPath);
            
            // Remove o arquivo temporário de forma segura
            await safeUnlink(req.file.path);
            
            imageUrl = `/images/${filename}`;
          } catch (error) {
            await safeUnlink(req.file.path);
            throw error;
          }
        }

        const productData = {
          ...req.body,
          price: parseFloat(req.body.price),
          inStock: req.body.inStock === 'true',
          imageUrl
        };

        const product = await Product.create(productData);
        
        res.status(201).json({
          success: true,
          message: "Produto criado com sucesso!",
          data: product
        });
      } catch (error) {
        // Remove o arquivo se houver erro
        if (req.file) fs.unlinkSync(req.file.path);
        
        res.status(400).json({
          success: false,
          message: error.message || "Erro ao criar produto"
        });
      }
    }
  ],

  findAll: async (req, res) => {
    try {
      const products = await Product.findAll({
        order: [['created_at', 'DESC']]
      });
      
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Erro em listar produtos"
      });
    }
  },

  findOne: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto com id ${req.params.id} não encontrado.`
        });
      }
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Erro em encontrar produto com id ${req.params.id}`
      });
    }
  },

  update: [
    upload.single('image'),
    async (req, res) => {
      try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Produto com id ${req.params.id} não encontrado.`
          });
        }
  
        let updateData = { ...req.body };
        const uploadDir = path.join(process.cwd(), 'uploads');
  
        // Processamento da nova imagem se foi enviada
        if (req.file) {
          const filename = `processed_${req.file.filename}`;
          const outputPath = path.join(uploadDir, filename);
          
          // Processa nova imagem
          await sharp(req.file.path)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);
  
          // Remove arquivo temporário
          await safeUnlink(req.file.path);
          
          // Remove imagem antiga se existir
          if (product.imageUrl) {
            const oldImageName = path.basename(product.imageUrl);
            const oldImagePath = path.join(uploadDir, oldImageName);
            const oldThumbPath = path.join(uploadDir, `thumb_${oldImageName}`);
            
            await safeUnlink(oldImagePath);
            await safeUnlink(oldThumbPath);
          }
  
          // Atualiza os dados com a nova imagem
          updateData.imageUrl = `/images/${filename}`;
        }
  
        // Converte tipos se necessário
        if (updateData.price) updateData.price = parseFloat(updateData.price);
        if (updateData.inStock) updateData.inStock = updateData.inStock === 'true';
  
        // Atualiza o produto no banco de dados
        const [updated] = await Product.update(updateData, {
          where: { id: req.params.id }
        });
        
        if (updated) {
          const updatedProduct = await Product.findByPk(req.params.id);
          return res.status(200).json({
            success: true,
            message: "Produto atualizado com sucesso!",
            data: updatedProduct
          });
        }
        
        return res.status(404).json({
          success: false,
          message: `Product with id ${req.params.id} not found`
        });
      } catch (error) {
        if (req.file) await safeUnlink(req.file.path);
        
        res.status(500).json({
          success: false,
          message: error.message || `Erro em atualizar produto com id ${req.params.id}`
        });
      }
    }
  ],
  
  delete: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto com id ${req.params.id} não encontrado.`
        });
      }
      
      // Remove a imagem associada se existir
      if (product.imageUrl) {
        const imageName = path.basename(product.imageUrl);
        const imagePath = path.join(process.cwd(), 'uploads', imageName);
        
        // Remove também a thumbnail se existir
        const thumbPath = path.join(process.cwd(), 'uploads', `thumb_${imageName}`);
        
        [imagePath, thumbPath].forEach(filePath => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${filePath}`);
            }
          } catch (err) {
            console.error(`Error deleting file ${filePath}:`, err.message);
          }
        });
      }
      
      await product.destroy();
      
      res.status(200).json({
        success: true,
        message: "Produto deletado com sucesso!"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message || `Erro em deletar produto com id ${req.params.id}`
      });
    }
  }
};