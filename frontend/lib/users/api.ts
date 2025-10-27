import api from "@/lib/api";
import type { UserCreate, User } from "@/types/user";

export async function createUser(payload: UserCreate) {
  const res = await api.post("/users", payload);
  return res.data as User;
}

export async function getUser(id: string) {
  const res = await api.get(`/users/${id}`);
  return res.data as User;
}

export async function listUsers() {
  const res = await api.get("/users");
  return res.data as User[];
}
