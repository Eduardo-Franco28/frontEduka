export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginReponse {
    token: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    name: string;
    email: string;
}