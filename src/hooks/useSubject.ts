import { useState } from "react";
import getMessageError from "../utils/getMessageErrorUtils";
import * as subjectService from "../services/subjectService";
import { SubjectResponse } from "../types/subject";

export default function useSubject() {
  const [subject, setSubject] = useState<Array<SubjectResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await subjectService.getAll();
      setSubject(response);
      return response;
    } catch (error) {
      const errorMessage = getMessageError(error, "Erro na busca de matérias");
      console.error("Subject error:", errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, loading, error, subject };
}
