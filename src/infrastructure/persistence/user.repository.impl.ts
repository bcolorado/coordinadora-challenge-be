import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user.repository";
import { executeQuery } from "@infrastructure/config/database.config";

interface UserRow {
  id: number;
  document: string;
  document_type: string;
  email: string;
  hashed_password: string;
  first_name: string;
  second_name: string | null;
  first_surname: string;
  second_surname: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository implements IUserRepository {
  private mapRowToUser(row: UserRow): User {
    return new User({
      id: row.id,
      document: row.document,
      documentType: row.document_type,
      email: row.email,
      hashedPassword: row.hashed_password,
      firstName: row.first_name,
      secondName: row.second_name,
      firstSurname: row.first_surname,
      secondSurname: row.second_surname,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await executeQuery<UserRow[]>(
      `SELECT id, document, document_type, email, hashed_password, 
              first_name, second_name, first_surname, second_surname,
              created_at, updated_at
       FROM users 
       WHERE email = ?`,
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(rows[0]!);
  }

  async findByDocument(
    document: string,
    documentType: string
  ): Promise<User | null> {
    const rows = await executeQuery<UserRow[]>(
      `SELECT id, document, document_type, email, hashed_password,
              first_name, second_name, first_surname, second_surname,
              created_at, updated_at
       FROM users 
       WHERE document = ? AND document_type = ?`,
      [document, documentType]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(rows[0]!);
  }

  async findById(id: number): Promise<User | null> {
    const rows = await executeQuery<UserRow[]>(
      `SELECT id, document, document_type, email, hashed_password,
              first_name, second_name, first_surname, second_surname,
              created_at, updated_at
       FROM users 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(rows[0]!);
  }

  async create(user: User): Promise<User> {
    const result = await executeQuery<{ insertId: number }>(
      `INSERT INTO users 
        (document, document_type, email, hashed_password, 
         first_name, second_name, first_surname, second_surname)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.document,
        user.documentType,
        user.email,
        user.hashedPassword,
        user.firstName,
        user.secondName,
        user.firstSurname,
        user.secondSurname,
      ]
    );

    const createdUser = await this.findById(result.insertId);
    return createdUser!;
  }
}
