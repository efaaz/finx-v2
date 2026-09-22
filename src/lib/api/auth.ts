import { SignupInput } from "@/Schema/signupSchema"
import { api } from "./client"
import type { User } from "@/types/auth"

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
  }
}

export async function signup(
  payload: SignupInput
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/signup",
    payload
  )

  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<{ data: User }>("/auth/me")

  return response.data.data
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout")
}