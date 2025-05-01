// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API for managing users, majors, and opportunities',
    },
    servers: [
      {
        url:'http://104.248.12.12:3000/api', // or your server's IP
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the files with API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
