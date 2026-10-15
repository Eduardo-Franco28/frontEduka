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
  path: string | null;
  bbox: string | null;
  icon: string | null;
}

export interface ActivityResponse {
  resumeQuestionId: number | null;
  lstQuestions: Array<QuestionResponse>;
}

export interface AnsweredAlternativeResponse{
  correct: boolean;
  concluded: boolean
  lstWrongSlots: Array<string>;
}

export interface AttemptAlternativeRequest{
  questionId: number;
  lstAlternativeId?: Array<number>
  lstFilledSlots?: Array<FilledSlot>;
}

export interface BoardResponse {
  id: number;
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
  label?: string;
}

export interface QuestionSlotContent {
  slots: Array<QuestionSlot>;
  hint?: string;
  allowMultiple?: boolean;
}

export interface FilledSlot {
  name: string;
  alternativeId: number;
}
