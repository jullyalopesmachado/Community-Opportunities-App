import express from 'express';
import setupSwagger from './api/swagger.js'; //Adjusts to your existing swagger.js

const app = express();

// Setup Swagger UI
setupSwagger(app);

const PORT = 2456;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Swagger docs available at http://104.248.12.12:${PORT}/api-docs`);
});

