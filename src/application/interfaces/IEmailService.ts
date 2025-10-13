export interface IEmailService {
  sendVerificationEmail(to: string, token: string, name: string): Promise<void>;
  sendWelcomeEmail(to: string, name: string): Promise<void>;
  sendPasswordResetEmail(to: string, otp: string, name: string): Promise<void>;
}
