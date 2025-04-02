require('dotenv').config();
const express = require('express');
const configureSwagger = require('./config/swagger');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const productRoutes = require('./routes/product.routes'); 


const db = require(path.join(__dirname, 'models', 'index.js'));
const app = express();


const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

configureSwagger(app);

// Config
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(uploadDir));

// Routes
app.use('/api', productRoutes);


// Sync DB
db.sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.log('Error syncing database: ' + err.message);
    });

    // Route for test
    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the product API' });
    });

    // Error treating 404
    app.use((req, res, next) => {
            res.status(404).send({
            success: false,
            message: 'Route not found'
        })
    })

    // Treating global error
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    })

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.APP_ENV}`);
    });