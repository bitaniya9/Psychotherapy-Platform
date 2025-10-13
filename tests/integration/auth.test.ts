// Mock PrismaUserRepository to avoid real DB access and NodemailerEmailService to avoid sending emails
jest.mock("@infrastructure/database/UserRepository", () => {
  return {
    PrismaUserRepository: class {
      private users: any[] = [];
      async findByEmail(email: string) {
        return this.users.find((u) => u.email === email) || null;
      }
      async create(data: any) {
        const user = {
          id: (Math.random() + 1).toString(36).substring(7),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          isEmailVerified: false,
          toJSON() {
            return { id: this.id, email: this.email };
          },
          setEmailVerificationToken() {},
          setRefreshToken() {},
        };
        this.users.push(user);
        return user;
      }
      async update(user: any) {
        const idx = this.users.findIndex((u) => u.id === user.id);
        if (idx >= 0) this.users[idx] = user;
        return user;
      }
      // other methods used by app
      async findById(id: string) {
        return this.users.find((u) => u.id === id) || null;
      }
      async findByEmailVerificationToken(token: string) {
        return null;
      }
      async findByPasswordResetToken(token: string) {
        return null;
      }
      async findByRefreshToken(token: string) {
        return null;
      }
      async delete(id: string) {
        return;
      }
    },
  };
});

jest.mock("@infrastructure/email/NodemailerEmailService", () => {
  return {
    NodemailerEmailService: class {
      async sendVerificationEmail() {}
      async sendWelcomeEmail() {}
      async sendPasswordResetEmail() {}
    },
  };
});

import request from "supertest";
import app from "../../src/index";

describe("Auth API", () => {
  it("should register user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "new@example.com",
      password: "Password1",
      firstName: "Test",
      lastName: "User",
      role: "PATIENT",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
