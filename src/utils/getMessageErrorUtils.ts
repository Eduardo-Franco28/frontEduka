import axios from "axios";

export default function getMessageError(error: unknown, fallBack: string): string{
    if(axios.isAxiosError(error)){
        return (
            error.response?.data?.message ??
            error.message ??
            fallBack
        );
    }

    if(error instanceof Error){
        return error.message;
    }

    return fallBack
}