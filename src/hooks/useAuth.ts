import { useState } from "react";
import { authLogin, authRegister } from "../services/authService";
import {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export default function useAuth() {
  const [userLogin, setUserLogin] = useState<LoginResponse | null>(null);
  const [userRegister, setUserRegister] = useState<RegisterResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authLogin(data);

      setUserLogin(response);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao fazer login";
      console.error("Login Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authRegister(data);
      setUserRegister(response);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao criar conta";
      console.error("Register Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, login, loading, error, userLogin, userRegister };
}
