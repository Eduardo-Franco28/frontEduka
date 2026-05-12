import { Escolaridade } from "../enums/userGrades";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    anoEscolar: Escolaridade | null;
}

export interface RegisterResponse {
    name: string;
    email: string;
}