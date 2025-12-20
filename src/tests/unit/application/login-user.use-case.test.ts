import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { MockUserRepository } from "../../mocks/repositories/mock-user.repository";
import { mockUser, mockLoginDto } from "../../mocks/data/mock-users.data";
import { InvalidCredentialsException } from "@domain/exceptions/auth.exceptions";
import { IJwtService } from "@infrastructure/services/jwt.service";

const mockJwtService: jest.Mocked<IJwtService> = {
  sign: jest.fn(),
  verify: jest.fn(),
  compare: jest.fn(),
};

describe("LoginUserUseCase", () => {
  let loginUserUseCase: LoginUserUseCase;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    loginUserUseCase = new LoginUserUseCase(mockUserRepository, mockJwtService);
    jest.clearAllMocks();
  });

  it("should login successfully with valid credentials", async () => {
    await mockUserRepository.create(mockUser);
    mockJwtService.compare.mockReturnValue(true);
    mockJwtService.sign.mockReturnValue("mock_token_123");

    const result = await loginUserUseCase.execute(mockLoginDto);

    expect(result.token).toBe("mock_token_123");
    expect(result.user.email).toBe(mockUser.email);
    expect(mockJwtService.compare).toHaveBeenCalledWith(
      mockLoginDto.password,
      mockUser.hashedPassword
    );
  });

  it("should throw InvalidCredentialsException if user does not exist", async () => {
    await expect(loginUserUseCase.execute(mockLoginDto)).rejects.toThrow(
      InvalidCredentialsException
    );
    await expect(loginUserUseCase.execute(mockLoginDto)).rejects.toThrow(
      "Credenciales inválidas"
    );
  });

  it("should throw InvalidCredentialsException if password does not match", async () => {
    await mockUserRepository.create(mockUser);

    mockJwtService.compare.mockReturnValue(false);

    await expect(loginUserUseCase.execute(mockLoginDto)).rejects.toThrow(
      InvalidCredentialsException
    );
  });
});
