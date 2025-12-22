import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { MockUserRepository } from "../../mocks/repositories/mock-user.repository";
import { mockRegisterDto } from "../../mocks/data/mock-users.data";
import { UserAlreadyExistsException } from "@domain/exceptions/auth.exceptions";

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_mock"),
}));

describe("RegisterUserUseCase", () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const result = await registerUserUseCase.execute(mockRegisterDto);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.email).toBe(mockRegisterDto.email);
    expect(result.fullName).toBe(
      `${mockRegisterDto.firstName} ${mockRegisterDto.firstSurname}`
    );

    const createdUser = await mockUserRepository.findByEmail(
      mockRegisterDto.email
    );
    expect(createdUser).not.toBeNull();
    expect(createdUser?.email).toBe(mockRegisterDto.email);
  });

  it("should throw UserAlreadyExistsException if email already exists", async () => {
    await registerUserUseCase.execute(mockRegisterDto);

    await expect(registerUserUseCase.execute(mockRegisterDto)).rejects.toThrow(
      UserAlreadyExistsException
    );
    await expect(registerUserUseCase.execute(mockRegisterDto)).rejects.toThrow(
      "Un usuario con este campo email ya existe"
    );
  });

  it("should throw UserAlreadyExistsException if document already exists", async () => {
    await registerUserUseCase.execute(mockRegisterDto);

    const duplicateDocumentDto = {
      ...mockRegisterDto,
      email: "newemail@example.com",
    };

    await expect(
      registerUserUseCase.execute(duplicateDocumentDto)
    ).rejects.toThrow(UserAlreadyExistsException);
    await expect(
      registerUserUseCase.execute(duplicateDocumentDto)
    ).rejects.toThrow("Un usuario con este campo document ya existe");
  });
});
