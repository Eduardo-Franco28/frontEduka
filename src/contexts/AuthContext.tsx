  import { useState, createContext, ReactNode, useEffect, useRef } from "react";
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
import SplashLoading, { SPLASH_DURATION_MS } from "../components/SplashLoading";

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initializing, setInitializing] = useState<boolean>(true);

  // Guarda o resolve da espera da abertura: é o que o toque na tela chama
  // para não ter que assistir a animação inteira.
  const skipSplash = useRef<(() => void) | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // A abertura tem tempo próprio: sem isso ela pisca, porque quando não
      // há token guardado a verificação termina em milissegundos.
      const splash = new Promise<void>((resolve) => {
        skipSplash.current = resolve;
        setTimeout(resolve, SPLASH_DURATION_MS);
      });

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
        // Mesmo pulando, a verificação da sessão precisa ter terminado.
        await splash;
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
    return <SplashLoading onSkip={() => skipSplash.current?.()} />;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logOut, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}