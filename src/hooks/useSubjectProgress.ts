import { useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import * as subjectService from "../services/subjectService";
import * as activityService from "../services/activityService";
import { TopicsResponse } from "../types/subject";
import { TopicStatus } from "../enums/TopicStatusEnum";

export interface SubjectWithProgress {
  id: number;
  name: string;
  currentTopic: TopicsResponse | null;
  concludedTopics: number;
  totalTopics: number;
  progressLoaded: boolean;
}

export default function useSubjectProgress() {
  const [subjects, setSubjects] = useState<Array<SubjectWithProgress>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const subjectList = await subjectService.getAll();

      setSubjects(
        subjectList.map((item) => ({
          id: item.id,
          name: item.name,
          currentTopic: null,
          concludedTopics: 0,
          totalTopics: 0,
          progressLoaded: false,
        }))
      );

      const withProgress = await Promise.all(
        subjectList.map(async (item) => {
          const topics = await activityService.getTopicsBySubject(item.id);

          const inProgress = topics.find(
            (topic) => topic.status === TopicStatus.EM_ANDAMENTO
          );
          const notStarted = topics.find(
            (topic) => topic.status === TopicStatus.NAO_INICIADO
          );

          return {
            id: item.id,
            name: item.name,
            currentTopic: inProgress ?? notStarted ?? null,
            concludedTopics: topics.filter(
              (topic) => topic.status === TopicStatus.CONCLUIDO
            ).length,
            totalTopics: topics.length,
            progressLoaded: true,
          };
        })
      );

      setSubjects(withProgress);
      return withProgress;
    } catch (error) {
      const errorMessage = getMessageError(
        error,
        "Erro ao buscar o progresso das matérias"
      );
      console.error("Subject progress error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, subjects, loading, error };
}