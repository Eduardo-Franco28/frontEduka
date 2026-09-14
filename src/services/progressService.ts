import { api } from "../configs/api";
import { QuestionResponse } from "../types/subject";

/** Quantas questões o aluno já concluiu, em todas as matérias. */
export async function countConcludedQuestions(): Promise<number> {
  const response = await api.get<number>("/stats");
  return response.data;
}

/**
 * Quantos tópicos o aluno já concluiu, em todas as matérias.
 *
 */
export async function countConcludedTopics(): Promise<number> {
  const response = await api.get<number>("/stats/topic");
  return response.data;
}

/** As últimas questões que o aluno tentou e ainda não acertou. */
export async function getUnfinishedQuestions(
  limit: number = 5,
): Promise<Array<QuestionResponse>> {
  const response = await api.get<Array<QuestionResponse>>(
    "/stats/" + limit + "/unfinished",
  );
  return response.data;
}
