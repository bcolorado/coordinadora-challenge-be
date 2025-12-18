import { User } from "@domain/entities/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;

  findByDocument(document: string, documentType: string): Promise<User | null>;

  findById(id: number): Promise<User | null>;

  create(user: User): Promise<User>;
}
