import { api } from "../configs/api";
import {LoginRequest, RegisterRequest, AuthResponse, User} from "../types/auth";

export async function authLogin(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
}

export async function authRegister(data: RegisterRequest): Promise<AuthResponse>{
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
}

export async function authMe(token: string): Promise<User>{
    const response = await api.get<User>('/auth/me');
    return response.data;
}