import { AnsweredAlternativeResponse, AttemptAlternativeRequest, QuestionResponse } from "./subject";

export interface ActivityProps{
    question: QuestionResponse;
    answering: boolean;
    onAnswer: (
        atetmpt : Omit<AttemptAlternativeRequest, "questionId"> // tira o id da questao porque a screen ja conhece
    ) => Promise<AnsweredAlternativeResponse | null>
}