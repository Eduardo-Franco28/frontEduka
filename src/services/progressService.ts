import { api } from "../configs/api";
import { QuestionResponse } from "../types/subject";
import { StatsResponse } from "../types/progress";

export async function getSummary(): Promise<StatsResponse> {
  const response = await api.get<StatsResponse>("/stats/summary");
  return response.data;
}

export async function countConcludedQuestions(): Promise<number> {
  const response = await api.get<number>("/stats");
  return response.data;
}

export async function countConcludedTopics(): Promise<number> {
  const response = await api.get<number>("/stats/topic");
  return response.data;
}

export async function getSequence(): Promise<number> {
  const response = await api.get<number>("/stats/sequence");
  return response.data;
}

export async function getUnfinishedQuestions(
  limit: number = 5,
): Promise<Array<QuestionResponse>> {
  const response = await api.get<Array<QuestionResponse>>(
    "/stats/" + limit + "/unfinished",
  );
  return response.data;
}
