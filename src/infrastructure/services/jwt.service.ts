import jwt, { SignOptions, Secret } from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface IJwtService {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload | null;
}

export class JwtService implements IJwtService {
  private readonly secret: Secret;
  private readonly expiresIn: number;

  constructor() {
    const secretFromEnv = process.env["JWT_SECRET"] || "default-secret";
    this.secret = secretFromEnv;

    //default 24 hours in seconds
    const expiresInEnv = process.env["JWT_EXPIRES_IN"] || "86400";
    this.expiresIn = parseInt(expiresInEnv, 10) || 86400;
  }

  sign(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: this.expiresIn,
    };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}
