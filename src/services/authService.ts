import axios from "axios";
import { API_URL } from "../constants/constant";
import { LoginReponse, LoginRequest, RegisterRequest, RegisterResponse } from "../types/auth";

export async function authLogin(data: LoginRequest): Promise<LoginReponse> {
    const response = await axios.post<LoginReponse>(API_URL + '/auth/login', data);
    return response.data;
}

export async function authRegister(data: RegisterRequest): Promise<RegisterResponse>{
    const response = await axios.post<RegisterResponse>(API_URL + 'auth/register', data);
    return response.data;
}