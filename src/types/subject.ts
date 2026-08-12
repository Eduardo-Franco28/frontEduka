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
}

export interface AlternativeResponse {
  id: number;
  description: string;
}

export interface ActivityResponse {
  resumeQuestionId: number | null;
  lstQuestions: Array<QuestionResponse>;
}
