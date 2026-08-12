import { useState, createContext, ReactNode, useEffect } from "react";
import { authLogin, authRegister, authMe } from "../services/authService";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types/auth";
import { STORAGE_KEY } from "../constants/constant";
import { saveStore, deleteStore, getStore } from "../services/storageService";
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
        const token = await getStore(STORAGE_KEY);

        if (!token) {
        setUser(null);
        return;
      }

        const user = await authMe(token);

        setUser(user);
      } catch (error) {
        console.log("Inicialização: Nenhum usuário ativo ou token expirado.");

        await deleteStore(STORAGE_KEY);
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
      const response = await authLogin(data);
      setUser(response.userResponse);
      await saveStore(STORAGE_KEY, response.token);
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
      const response = await authRegister(data);
      setUser(response.userResponse);
      await saveStore(STORAGE_KEY, response.token);
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

  const logOut = async (): Promise<void> => {
    setUser(null);
    setError(null);

    await deleteStore(STORAGE_KEY);
  };

  if (initializing) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
