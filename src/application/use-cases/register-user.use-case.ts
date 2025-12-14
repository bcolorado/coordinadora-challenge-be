import bcrypt from "bcrypt";
import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user.repository";
import { UserAlreadyExistsException } from "@domain/exceptions/auth.exceptions";

export interface RegisterUserInput {
  document: string;
  documentType: string;
  email: string;
  password: string;
  firstName: string;
  secondName?: string | undefined;
  firstSurname: string;
  secondSurname?: string | undefined;
}

export interface RegisterUserOutput {
  id: number;
  email: string;
  fullName: string;
}

const SALT_ROUNDS = 12;

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
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

    return {
      id: createdUser.id!,
      email: createdUser.email,
      fullName: createdUser.fullName,
    };
  }
}
