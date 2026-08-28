import { AuthResponse, LoginRequest, NewPasswordRequest, NewProfileRequest, RegisterRequest, User } from "./auth";

export interface AuthContextData {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (data: LoginRequest) => Promise<AuthResponse | null>;
    register: (data: RegisterRequest) => Promise<AuthResponse | null>;
    updateProfile: (data: NewProfileRequest) => Promise<AuthResponse | null>;
    updatePassword: (data: NewPasswordRequest) => Promise<AuthResponse | null>;
    logOut: () => Promise<void>;
}