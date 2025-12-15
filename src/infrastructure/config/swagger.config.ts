import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Challenge Coordinadora API",
      version: "1.0.0",
      description: "API Documentation for User Registration and Authentication",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/framework/routes/*.ts", "./src/application/dtos/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
