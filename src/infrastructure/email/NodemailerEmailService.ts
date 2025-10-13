import nodemailer from "nodemailer";
import { IEmailService } from "@application/interfaces/IEmailService";

export class NodemailerEmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    token: string,
    name: string
  ): Promise<void> {
    // token here is an OTP
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your verification code for Melkam Psychotherapy",
      html: `<p>Hello ${name},</p><p>Your verification code is: <strong>${token}</strong>. It expires in 10 minutes.</p>`,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Welcome to Melkam Psychotherapy",
      html: `<p>Hello ${name},</p><p>Your email is verified. Welcome aboard!</p>`,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    otp: string,
    name: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Reset Your Password for Melkam Psychotherapy",
      html: `<p>Hello ${name},</p><p>Your OTP for password reset is: <strong>${otp}</strong>. Expires in 10 minutes.</p>`,
    });
  }
}
