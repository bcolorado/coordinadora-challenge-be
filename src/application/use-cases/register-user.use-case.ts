import bcrypt from "bcrypt";
import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user.repository";
import { UserAlreadyExistsException } from "@domain/exceptions/auth.exceptions";
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from "@application/dtos/auth.dto";

const SALT_ROUNDS = 12;

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingByEmail = await this.userRepository.findByEmail(input.email);
    if (existingByEmail) {
      throw new UserAlreadyExistsException("email");
    }

    const existingByDocument = await this.userRepository.findByDocument(
      input.document,
      input.documentType
    );
    if (existingByDocument) {
      throw new UserAlreadyExistsException("document");
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = new User({
      document: input.document,
      documentType: input.documentType,
      email: input.email,
      hashedPassword,
      firstName: input.firstName,
      secondName: input.secondName ?? null,
      firstSurname: input.firstSurname,
      secondSurname: input.secondSurname ?? null,
    });

    const createdUser = await this.userRepository.create(user);

    const response: RegisterResponseDto = {
      id: createdUser.id!,
      email: createdUser.email,
      fullName: createdUser.fullName,
    };

    return response;
  }
}
