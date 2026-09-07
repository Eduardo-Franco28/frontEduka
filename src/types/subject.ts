import { TopicStatus } from "../enums/TopicStatusEnum";
import { QuestionType } from "../enums/QuestionTypeEnum";

export interface SubjectResponse {
  id: number;
  name: string;
}

export interface TopicsResponse {
  id: number;
  title: string;
  subTitle: string;
  subject: number;
  percentConclued: number;
  status: TopicStatus;
}

export interface QuestionResponse {
  id: number;
  title: string;
  topic: number;
  level: number;
  type: QuestionType;
  content: string;
  lstAlternative: Array<AlternativeResponse>;
  conclued: boolean;
  board: BoardResponse | null;
}

export interface AlternativeResponse {
  id: number;
  description: string;
}

export interface ActivityResponse {
  resumeQuestionId: number | null;
  lstQuestions: Array<QuestionResponse>;
}

export interface AnsweredAlternativeResponse{
  correct: boolean,
  concluded: boolean
  lstWrongSlots: Array<string>;
}

export interface AttemptAlternativeRequest{
  questionId: number,
  lstAlternativeId?: Array<number>
  lstFilledSlots?: Array<FilledSlot>;
}

export interface BoardResponse {
  viewBox: string;
  slots: string;
}

export interface BoardSlot {
  name: string;
  path: string;
  bbox: string;
}

export interface QuestionSlot {
  name: string;
  blank: boolean;
}

export interface QuestionContent {
  slots: Array<QuestionSlot>;
}

export interface FilledSlot {
  name: string;
  alternativeId: number;
}
