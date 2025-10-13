import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Melkam Psychotherapy API",
      version: "1.0.0",
      description: "API for mental health platform",
    },
    servers: [
      {
        // server URL includes the API base path so paths in JSDoc can be relative (e.g. /auth/register)
        url: "http://localhost:{port}/api/v1",
        description:
          "Local development server (API base path includes /api/v1)",
        variables: {
          port: {
            default: process.env.PORT || "7777",
          },
        },
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
      schemas: {
        // minimal User schema for documentation
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: { type: "string" },
            isEmailVerified: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/presentation/controllers/*.ts"], // Scan for JSDoc comments
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: express.Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
