const express = require('express');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const path = require('path');
const logger = require('./logger');
require('dotenv').config();


const messageRoutes = require('./routes/messagesRoutes.js');

const app = express();

// define the path to the views directory
app.set('views', path.join(__dirname, 'views'));

//set the view engine to Pug
app.set('view engine', 'pug');
app.use('/views', express.static('views'));

// define the route for the homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Add this line to import the pool from db.js:
const { pool } = require('./db');

//files upload
app.use(fileUpload());
app.use((req, res, next) => {
    // console.log(req.method, req.url);
    next();
});

//method override for delete
app.use(methodOverride('_method'));

//setting up a middleware to serve and display the API documentation generated from the Swagger document.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use message routes
app.use('/', messageRoutes);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server started on port ${process.env.PORT || 3000}`);
});

require('./swagger')(app);