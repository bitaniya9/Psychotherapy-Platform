import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import { TherapistProfile } from "@domain/entities/TherapistProfile";
import { nullable, property } from "zod";

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
        TherapistProfile:{
          type:"object",
          properties:{
            id:{type:"string"},
            userId:{type:"string"},
            user:{$ref:"#/components/schema/User",},
            licenseNumber:{type:"string"},
            specialization:{type:"array",items:{type:"string"}},
            bio:{type:"string",nullable:true},
            experience:{type:"number", nullable:true},
            hourlyRate:{type:"number", nullable:true},
            availability:{
              type:"array",
              nullable:true,
              items:{
                type:"object",
                properties:{
                  day:{type:"string"},
                  start:{type:"string"},
                  end:{type:"string"}
                }
              }

            },
            isVerified:{type:"boolean"},
            profileImgUrl:{type:"string",nullable:true},
            profileImgPublicId:{type:"string",nullable:true},

            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },

            appointments:{type:"array", items:{$ref:"#/components/schemas/Appointment"}}


          }
        }
      },
    },
  },
  apis: ["./src/presentation/controllers/*.ts"], // Scan for JSDoc comments
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: express.Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
