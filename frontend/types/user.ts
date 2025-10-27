export type Role = "PATIENT" | "THERAPIST" | "ADMIN";

export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: Role;
  createdAt?: string;
};

export type UserCreate = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: Role;
};
