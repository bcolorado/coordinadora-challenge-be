import { IUserRepository } from "../repositories/user.repository";
import { InvalidCredentialsException } from "@domain/exceptions/auth.exceptions";
import { IJwtService } from "@infrastructure/services/jwt.service";
import { LoginRequestDto, LoginResponseDto } from "@application/dtos/auth.dto";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(input: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = this.jwtService.compare(
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

    const response: LoginResponseDto = {
      token,
      user: {
        id: user.id!,
        email: user.email,
        fullName: user.fullName,
      },
    };

    return response;
  }
}
