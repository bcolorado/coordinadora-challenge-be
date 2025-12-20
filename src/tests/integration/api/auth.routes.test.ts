import request from "supertest";
import express from "express";
import { AuthController } from "@adapters/controllers/auth.controller";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { MockUserRepository } from "../../mocks/repositories/mock-user.repository";
import { JwtService } from "@infrastructure/services/jwt.service";
import {
  mockRegisterDto,
  mockLoginDto,
} from "../../mocks/data/mock-users.data";

// Setup dependencies
const mockUserRepository = new MockUserRepository();
const jwtService = new JwtService();
const registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
const loginUserUseCase = new LoginUserUseCase(mockUserRepository, jwtService);
const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase
);

const app = express();
app.use(express.json());

app.post("/auth/register", authController.register.bind(authController));
app.post("/auth/login", authController.login.bind(authController));

describe("Auth Integration Tests (API)", () => {
  beforeEach(() => {
    mockUserRepository.clear();
  });

  describe("POST /auth/register", () => {
    it("should register a new user and return 201", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(mockRegisterDto);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(mockRegisterDto.email);
      expect(response.body.data.id).toBe(1);
    });

    it("should return 409 if email already exists", async () => {
      await request(app).post("/auth/register").send(mockRegisterDto);

      const response = await request(app)
        .post("/auth/register")
        .send(mockRegisterDto);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("USER_ALREADY_EXISTS");
    });

    it("should return 400 if validation fails (empty email)", async () => {
      const invalidDto = { ...mockRegisterDto, email: "" };
      const response = await request(app)
        .post("/auth/register")
        .send(invalidDto);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully and return token", async () => {
      await request(app).post("/auth/register").send(mockRegisterDto);

      const response = await request(app)
        .post("/auth/login")
        .send(mockLoginDto);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(mockLoginDto.email);
    });

    it("should return 401 for invalid credentials", async () => {
      await request(app).post("/auth/register").send(mockRegisterDto);

      const response = await request(app)
        .post("/auth/login")
        .send({ ...mockLoginDto, password: "WrongPassword" });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    });
  });
});
