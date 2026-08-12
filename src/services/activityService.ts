import { api } from "../configs/api";
import { ActivityResponse, TopicsResponse } from "../types/subject";

export async function getTopicsBySubject(subjectId: number): Promise<Array<TopicsResponse>> {
    const response = await api.get<Array<TopicsResponse>>('/topic/' + subjectId + '/subject');
    return response.data;
}

export async function getActivityByTopic(topicId: number): Promise<ActivityResponse>{
    const response = await api.get<ActivityResponse>('/topic/' + topicId + '/activity');
    return response.data;
}