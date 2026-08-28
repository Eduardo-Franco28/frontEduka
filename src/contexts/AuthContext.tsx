import { useState, createContext, ReactNode, useEffect } from "react";
import * as authService from "../services/authService";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  NewProfileRequest,
  NewPasswordRequest,
} from "../types/auth";
import { STORAGE_KEY } from "../constants/constant";
import * as storageService from "../services/storageService";
import getMessageError from "../utils/getMessageErrorUtils";
import { AuthContextData } from "../types/context";
import LoadingPage from "../components/LoadingPage";

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await storageService.get(STORAGE_KEY);

        if (!token) {
        setUser(null);
        return;
      }

        const user = await authService.me(token);

        setUser(user);
      } catch (error) {
        console.log("Inicialização: Nenhum usuário ativo ou token expirado.");

        await storageService.remove(STORAGE_KEY);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      setUser(response.userResponse);
      await storageService.save(STORAGE_KEY, response.token);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro ao fazer login");
      console.error("Login Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    data: RegisterRequest,
  ): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      setUser(response.userResponse);
      await storageService.save(STORAGE_KEY, response.token);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro ao criar conta");
      console.error("Register Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: NewProfileRequest): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.updateProfile(data);
      setUser(response.userResponse);
      await storageService.save(STORAGE_KEY, response.token);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro ao atualizar perfil");
      console.error("Update Profile Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: NewPasswordRequest): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.updatePassword(data);
      setUser(response.userResponse);
      await storageService.save(STORAGE_KEY, response.token);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro ao atualizar a senha");
      console.error("Update Password Error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async (): Promise<void> => {
    setUser(null);
    setError(null);

    await storageService.remove(STORAGE_KEY);
  };

  if (initializing) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logOut, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}
