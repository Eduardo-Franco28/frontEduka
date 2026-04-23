import { useState } from "react";
import { authLogin, authRegister } from "../services/authService";
import { LoginReponse, LoginRequest, RegisterRequest, RegisterResponse } from "../types/auth";

export default function useAuth() {
    const [userLogin, setUserLogin] = useState<LoginReponse | null>(null)
    const [userRegister, setUserRegister] = useState<RegisterResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const login = async (data: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authLogin(data);

            setUserLogin(response);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false)
        }
    }

    const register = async (data: RegisterRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authRegister(data)
            setUserRegister(response);
        } catch (error: any) {
            setLoading(false)
            setError(error)
        }
    }

    return { register, login, loading, error, userLogin, userRegister}
}