import { User, UserProps } from "@domain/entities/user.entity";

export const mockUserProps: UserProps = {
  id: 1,
  document: "12345678",
  documentType: "CC",
  email: "test@example.com",
  hashedPassword: "hashed_password_123",
  firstName: "Test",
  firstSurname: "User",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUser = new User(mockUserProps);

export const mockRegisterDto = {
  document: "12345678",
  documentType: "CC",
  email: "test@example.com",
  password: "Password123!",
  firstName: "Test",
  firstSurname: "User",
};

export const mockLoginDto = {
  email: "test@example.com",
  password: "Password123!",
};
