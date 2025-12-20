import { IUserRepository } from "@application/repositories/user.repository";
import { User } from "@domain/entities/user.entity";

export class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async findByDocument(
    document: string,
    documentType: string
  ): Promise<User | null> {
    return (
      this.users.find(
        (u) => u.document === document && u.documentType === documentType
      ) || null
    );
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async create(user: User): Promise<User> {
    const newUser = user.with({ id: this.users.length + 1 });
    this.users.push(newUser);
    return newUser;
  }

  // Helper to reset state
  clear(): void {
    this.users = [];
  }

  // Helper to seed data
  seed(users: User[]): void {
    this.users = [...users];
  }
}
