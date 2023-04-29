const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swift API',
      version: '1.0.0',
      description: 'API for accepting and storing MT799 messages',
    },
  },
  apis: ['./routes/messagesRoutes.js'], // Update the file location if necessary
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(specs));
};

