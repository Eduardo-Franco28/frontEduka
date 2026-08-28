import { api } from "../configs/api";
import {LoginRequest, RegisterRequest, AuthResponse, User, NewProfileRequest, NewPasswordRequest} from "../types/auth";

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse>{
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
}

export async function updateProfile(data: NewProfileRequest): Promise<AuthResponse>{
    const response = await api.patch<AuthResponse>('/auth/profile', data);
    return response.data;
}

export async function updatePassword(data: NewPasswordRequest): Promise<AuthResponse>{
    const response = await api.patch<AuthResponse>('/auth/password', data);
    return response.data;
}

export async function me(token: string): Promise<User>{
    const response = await api.get<User>('/auth/me');
    return response.data;
}