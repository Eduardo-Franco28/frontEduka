import { useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import * as progressService from "../services/progressService";
import { QuestionResponse } from "../types/subject";

export default function useProgress() {
  const [concludedQuestions, setConcludedQuestions] = useState<number>(0);
  const [concludedTopics, setConcludedTopics] = useState<number>(0);
  const [unfinishedQuestions, setUnfinishedQuestions] = useState<
    Array<QuestionResponse>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConcludedQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await progressService.countConcludedQuestions();
      setConcludedQuestions(response);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(
        error,
        "Erro ao buscar as questões concluídas",
      );
      console.error("Progress error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getConcludedTopics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await progressService.countConcludedTopics();
      setConcludedTopics(response);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(
        error,
        "Erro ao buscar os tópicos concluídos",
      );
      console.error("Progress error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUnfinishedQuestions = async (limit?: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await progressService.getUnfinishedQuestions(limit);
      setUnfinishedQuestions(response);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(
        error,
        "Erro ao buscar as atividades pendentes",
      );
      console.error("Progress error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getConcludedQuestions,
    getConcludedTopics,
    getUnfinishedQuestions,
    concludedQuestions,
    concludedTopics,
    unfinishedQuestions,
    loading,
    error,
  };
}
