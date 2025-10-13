import { Role } from "@prisma/client";

export interface UserProps {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpiry?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpiry?: Date | null;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(
    props: Omit<UserProps, "id" | "createdAt" | "updatedAt">
  ): User {
    return new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get role(): Role {
    return this.props.role;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get emailVerificationToken(): string | null | undefined {
    return this.props.emailVerificationToken;
  }

  get emailVerificationExpiry(): Date | null | undefined {
    return this.props.emailVerificationExpiry;
  }

  get passwordResetToken(): string | null | undefined {
    return this.props.passwordResetToken;
  }

  get passwordResetExpiry(): Date | null | undefined {
    return this.props.passwordResetExpiry;
  }

  get refreshToken(): string | null | undefined {
    return this.props.refreshToken;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updatePassword(newPassword: string): void {
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
  }

  verifyEmail(): void {
    this.props.isEmailVerified = true;
    this.props.emailVerificationToken = null;
    this.props.emailVerificationExpiry = null;
    this.props.updatedAt = new Date();
  }

  setEmailVerificationToken(token: string, expiry: Date): void {
    this.props.emailVerificationToken = token;
    this.props.emailVerificationExpiry = expiry;
    this.props.updatedAt = new Date();
  }

  setPasswordResetToken(token: string, expiry: Date): void {
    this.props.passwordResetToken = token;
    this.props.passwordResetExpiry = expiry;
    this.props.updatedAt = new Date();
  }

  clearPasswordResetToken(): void {
    this.props.passwordResetToken = null;
    this.props.passwordResetExpiry = null;
    this.props.updatedAt = new Date();
  }

  setRefreshToken(token: string | null): void {
    this.props.refreshToken = token;
    this.props.updatedAt = new Date();
  }

  isPasswordResetTokenValid(): boolean {
    if (!this.props.passwordResetToken || !this.props.passwordResetExpiry) {
      return false;
    }
    return this.props.passwordResetExpiry > new Date();
  }

  isEmailVerificationTokenValid(): boolean {
    if (
      !this.props.emailVerificationToken ||
      !this.props.emailVerificationExpiry
    ) {
      return false;
    }
    return this.props.emailVerificationExpiry > new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      role: this.props.role,
      isEmailVerified: this.props.isEmailVerified,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
