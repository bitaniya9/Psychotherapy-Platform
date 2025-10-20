import { User } from "../../domain/entities/User";
import {
  IUserRepository,
  CreateUserDTO,
} from "../../application/interfaces/IUserRepository";
import prisma from "./prisma";
import { AppError, NotFoundError } from "../../domain/exceptions/AppError";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    if (!id || typeof id !== "string") return null;
    try {
      const userData = await prisma.user.findUnique({ where: { id } });
      return userData ? User.fromPersistence(userData as any) : null;
    } catch (e: any) {
      throw new AppError(
        `Database error when finding user by id: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email || typeof email !== "string") return null;
    try {
      const userData = await prisma.user.findUnique({ where: { email } });
      return userData ? User.fromPersistence(userData as any) : null;
    } catch (e: any) {
      throw new AppError(
        `Database error when finding user by email: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    if (!token || typeof token !== "string") return null;
    try {
      const userData = await prisma.user.findFirst({
        where: { emailVerificationToken: token },
      });
      return userData ? User.fromPersistence(userData as any) : null;
    } catch (e: any) {
      throw new AppError(
        `Database error when finding user by email verification token: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    if (!token || typeof token !== "string") return null;
    try {
      const userData = await prisma.user.findFirst({
        where: { passwordResetToken: token },
      });
      return userData ? User.fromPersistence(userData as any) : null;
    } catch (e: any) {
      throw new AppError(
        `Database error when finding user by password reset token: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    if (!token || typeof token !== "string") return null;
    try {
      const userData = await prisma.user.findFirst({
        where: { refreshToken: token },
      });
      return userData ? User.fromPersistence(userData as any) : null;
    } catch (e: any) {
      throw new AppError(
        `Database error when finding user by refresh token: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async create(data: CreateUserDTO): Promise<User> {
    try {
      const userData = await prisma.user.create({ data: { ...data } as any });
      return User.fromPersistence(userData as any);
    } catch (e: any) {
      throw new AppError(
        `Database error when creating user: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async update(user: User): Promise<User> {
    try {
      const updatedData = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: user.password,
          isEmailVerified: user.isEmailVerified,
          emailVerificationToken: user.emailVerificationToken,
          emailVerificationExpiry: user.emailVerificationExpiry,
          passwordResetToken: user.passwordResetToken,
          passwordResetExpiry: user.passwordResetExpiry,
          refreshToken: user.refreshToken,
          updatedAt: user.updatedAt,
        },
      });
      return User.fromPersistence(updatedData as any);
    } catch (e: any) {
      throw new AppError(
        `Database error when updating user: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async updateFields(id: string, data: any): Promise<User> {
    try {
      const updatedData = await prisma.user.update({
        where: { id },
        data: { ...data, updatedAt: new Date() },
      });
      return User.fromPersistence(updatedData as any);
    } catch (e: any) {
      throw new AppError(
        `Database error when updating user fields: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (e: any) {
      throw new AppError(
        `Database error when deleting user: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async updateFieldsForExpiredTokens(currentDate:Date):Promise<void>{
    try{
      await prisma.user.updateMany({
        where:{
          emailVerificationExpiry:{lt:currentDate},
          isEmailVerified:false,
        },
        data:{
          emailVerificationToken:null,
          emailVerificationExpiry:null,
        },

      });
    }catch(e:any){
      throw new AppError(
        `Database error when cleaning expired OTPs: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }

  async list(page = 1, size = 10) {
    try {
      const skip = (page - 1) * size;
      const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
          skip,
          take: size,
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count(),
      ]);

      return {
        users: users.map((u: any) => User.fromPersistence(u as any)),
        total,
      };
    } catch (e: any) {
      throw new AppError(
        `Database error when listing users: ${e.message || e}`,
        "PRISMA_ERROR",
        500
      );
    }
  }
}
