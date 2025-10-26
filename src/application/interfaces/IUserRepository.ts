import { User } from "@domain/entities/User";

export type Role = "PATIENT" | "THERAPIST" | "ADMIN";

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailVerificationToken(token: string): Promise<User | null>;
  findByPasswordResetToken(token: string): Promise<User | null>;
  findByRefreshToken(token: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  updateFields(
    id: string,
    data: Partial<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: Role;
      isEmailVerified: boolean;
      emailVerificationToken: string | null;
      emailVerificationExpiry: Date | null;
      passwordResetToken: string | null;
      passwordResetExpiry: Date | null;
      refreshToken: string | null;
      updatedAt: Date;
    }>
  ): Promise<User>;
  delete(id: string): Promise<void>;
  updateFieldsForExpiredTokens(currentDate:Date):Promise<void>
  list(page: number, size: number): Promise<PaginatedUsers>;
}
