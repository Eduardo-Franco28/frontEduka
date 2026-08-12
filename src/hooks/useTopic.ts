import { useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import { getTopicsBySubject, getActivityByTopic } from "../services/activityService";
import { TopicsResponse, ActivityResponse } from "../types/subject";

export default function useTopic() {
  const [topic, setTopic] = useState<Array<TopicsResponse> | null>(null);
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBySubject = async (subjectId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTopicsBySubject(subjectId);
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
        const response = await getActivityByTopic(topicId);
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

  return { getBySubject, getActivity, loading, error, topic, activity };
}
