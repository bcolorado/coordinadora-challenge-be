import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "./dist" : "./src";
const ext = isProduction ? "js" : "ts";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Challenge Coordinadora API",
      version: "1.0.0",
      description: "API para cotización y seguimiento de envíos",
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
      schemas: {
        // Auth schemas
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            email: { type: "string", example: "test@example.com" },
            fullName: { type: "string", example: "John Doe" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: [
            "document",
            "documentType",
            "email",
            "password",
            "firstName",
            "firstSurname",
          ],
          properties: {
            document: { type: "string", example: "12345678" },
            documentType: { type: "string", example: "CC" },
            email: {
              type: "string",
              format: "email",
              example: "test@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePass123!",
            },
            firstName: { type: "string", example: "John" },
            firstSurname: { type: "string", example: "Doe" },
            secondName: { type: "string", example: "David" },
            secondSurname: { type: "string", example: "Smith" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "test@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePass123!",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/UserResponse" },
          },
        },

        // Location schemas
        LocationResponse: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            cityName: { type: "string", example: "Bogotá" },
          },
        },

        // Quote schemas
        QuoteRequest: {
          type: "object",
          required: ["weight", "dimensions", "originId", "destinationId"],
          properties: {
            weight: { type: "number", example: 5.5 },
            dimensions: {
              type: "object",
              properties: {
                length: { type: "number", example: 30 },
                width: { type: "number", example: 20 },
                height: { type: "number", example: 15 },
              },
            },
            originId: { type: "number", example: 1 },
            destinationId: { type: "number", example: 2 },
          },
        },
        QuoteResponse: {
          type: "object",
          properties: {
            origin: {
              type: "object",
              properties: {
                id: { type: "number" },
                cityName: { type: "string" },
              },
            },
            destination: {
              type: "object",
              properties: {
                id: { type: "number" },
                cityName: { type: "string" },
              },
            },
            actualWeight: { type: "number" },
            volumetricWeight: { type: "number" },
            chargeableWeight: { type: "number" },
            rate: {
              type: "object",
              properties: {
                id: { type: "number" },
                basePriceCents: { type: "number" },
                pricePerKgCents: { type: "number" },
              },
            },
            totalPriceCents: { type: "number" },
          },
        },

        // Shipment schemas
        CreateShipmentRequest: {
          type: "object",
          required: [
            "origin",
            "destination",
            "actualWeight",
            "volumetricWeight",
            "chargeableWeight",
            "rate",
            "totalPriceCents",
          ],
          properties: {
            origin: {
              type: "object",
              properties: {
                id: { type: "number" },
                cityName: { type: "string" },
              },
            },
            destination: {
              type: "object",
              properties: {
                id: { type: "number" },
                cityName: { type: "string" },
              },
            },
            actualWeight: { type: "number" },
            volumetricWeight: { type: "number" },
            chargeableWeight: { type: "number" },
            rate: {
              type: "object",
              properties: {
                id: { type: "number" },
                basePriceCents: { type: "number" },
                pricePerKgCents: { type: "number" },
              },
            },
            totalPriceCents: { type: "number" },
            dimensions: {
              type: "object",
              properties: {
                length: { type: "number" },
                width: { type: "number" },
                height: { type: "number" },
              },
            },
          },
        },
        ShipmentResponse: {
          type: "object",
          properties: {
            id: { type: "number" },
            trackingNumber: { type: "string" },
            status: {
              type: "string",
              enum: ["EN_ESPERA", "EN_TRANSITO", "ENTREGADO"],
            },
            origin: {
              type: "object",
              properties: {
                id: { type: "number" },
                cityName: { type: "string" },
              },
            },
            destination: {
              type: "object",
              properties: {
                id: { type: "number" },
                cityName: { type: "string" },
              },
            },
            quotedPriceCents: { type: "number" },
            createdAt: { type: "string" },
          },
        },
        ShipmentStatusResponse: {
          type: "object",
          properties: {
            id: { type: "number" },
            trackingNumber: { type: "string" },
            currentStatus: { type: "string" },
            origin: { $ref: "#/components/schemas/LocationResponse" },
            destination: { $ref: "#/components/schemas/LocationResponse" },
            actualWeightKg: { type: "number" },
            chargeableWeightKg: { type: "number" },
            quotedPriceCents: { type: "number" },
            history: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  occurredAt: { type: "string" },
                  note: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        UserShipmentResponse: {
          type: "object",
          properties: {
            id: { type: "number" },
            trackingNumber: { type: "string" },
            status: { type: "string" },
            chargeableWeightKg: { type: "number" },
            quotedPriceCents: { type: "number" },
            createdAt: { type: "string" },
          },
        },
      },
    },
  },
  apis: [`${basePath}/framework/routes/*.${ext}`],
};

export const swaggerSpec = swaggerJsdoc(options);
