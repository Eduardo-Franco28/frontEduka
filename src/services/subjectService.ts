import { api } from "../configs/api";
import { SubjectResponse } from "../types/subject";

export async function getAll(): Promise<Array<SubjectResponse>> {
    const response = await api.get<Array<SubjectResponse>>('/subject');
    return response.data;
}