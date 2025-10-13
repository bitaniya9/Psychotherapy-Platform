import bcrypt from "bcryptjs";
import { IPasswordHasher } from "@application/interfaces/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  private saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
