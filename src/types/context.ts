import { AuthResponse, LoginRequest, RegisterRequest, User } from "./auth";

export interface AuthContextData {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (data: LoginRequest) => Promise<AuthResponse | null>;
    register: (data: RegisterRequest) => Promise<AuthResponse | null>;
    logOut: () => Promise<void>;
}