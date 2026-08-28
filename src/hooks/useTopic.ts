import { useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import * as activityService from "../services/activityService";
import { TopicsResponse, ActivityResponse, AttemptAlternativeRequest, AnsweredAlternativeResponse } from "../types/subject";

export default function useTopic() {
  const [topic, setTopic] = useState<Array<TopicsResponse> | null>(null);
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [result, setResult] = useState<AnsweredAlternativeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBySubject = async (subjectId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await activityService.getTopicsBySubject(subjectId);
      setTopic(response);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro na busca dos tópicos da matéria");
      console.error("Topic error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getActivity = async (topicId: number) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await activityService.getByTopic(topicId);
        setActivity(response);
        return response;
      } catch (error) {
        const errorMessage = getMessageError(error, "Erro na busca da atividade");
        console.error("Activity error:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    };

    const answer = async (attempt: AttemptAlternativeRequest) =>{
      setAnswering(true);
      setError(null);

      try {
        const response = await activityService.answer(attempt);
        setResult(response);
        return response;
      } catch (error) {
        const errorMessage = getMessageError(error, "Falha ao processar a resposta");
        console.error("Attempt error:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setAnswering(false);
      }
    }

  return { getBySubject, getActivity, answer, topic, activity, result, loading, answering, error };
}
