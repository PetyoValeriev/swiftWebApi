const express = require('express');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const logger = require('./logger');
require('dotenv').config();
const messageRoutes = require('./routes/messagesRoutes.js');

const app = express();

//set the view engine to Pug
app.set('view engine', 'pug');
app.use('/views', express.static('views'));

// define the route for the homepage
app.get('/', (req, res) => {
  res.render('index');
});

//files upload
app.use(fileUpload());
app.use((req, res, next) => {
    // console.log(req.method, req.url);
    next();
});

//setting up a middleware to serve and display the API documentation generated from the Swagger document.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use message routes
app.use('/', messageRoutes);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server started on port ${process.env.PORT || 3000}`);
});

require('./swagger')(app);
