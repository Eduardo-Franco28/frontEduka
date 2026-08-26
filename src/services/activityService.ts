import { api } from "../configs/api";
import { ActivityResponse, AnsweredAlternativeResponse, AttemptAlternativeRequest, TopicsResponse } from "../types/subject";

export async function answer(attempt: AttemptAlternativeRequest): Promise<AnsweredAlternativeResponse>{
    const response = await api.post<AnsweredAlternativeResponse>('/progress/answer', attempt);
    return response.data;
}

export async function getTopicsBySubject(subjectId: number): Promise<Array<TopicsResponse>> {
    const response = await api.get<Array<TopicsResponse>>('/topic/' + subjectId + '/subject');
    return response.data;
}

export async function getByTopic(topicId: number): Promise<ActivityResponse>{
    const response = await api.get<ActivityResponse>('/topic/' + topicId + '/activity');
    return response.data;
}