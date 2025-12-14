import bcrypt from "bcrypt";
import { IUserRepository } from "@domain/repositories/user.repository";
import { InvalidCredentialsException } from "@domain/exceptions/auth.exceptions";
import { IJwtService } from "@infrastructure/services/jwt.service";

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const token = this.jwtService.sign({
      userId: user.id!,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id!,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
