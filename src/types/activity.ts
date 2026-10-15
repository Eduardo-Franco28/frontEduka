import { AnsweredAlternativeResponse, AttemptAlternativeRequest, QuestionResponse } from "./subject";

export interface ActivityProps{
    question: QuestionResponse;
    answering: boolean;
    onAnswer: (
        atetmpt : Omit<AttemptAlternativeRequest, "questionId">
    ) => Promise<AnsweredAlternativeResponse | null>
}