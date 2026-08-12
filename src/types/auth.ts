export interface User {
    id: number;
    nome: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    userResponse: User
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
