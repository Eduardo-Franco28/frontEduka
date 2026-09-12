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
  /**
   * O desenho da peca. Nao e guardado na alternativa: vem copiado do slot do
   * board com o mesmo nome do correctSlot. Nulo quando a questao nao tem board.
   */
  path: string | null;
  bbox: string | null;
  /** Emoji que a peca mostra quando ela nao e um desenho. */
  icon: string | null;
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
  /**
   * A chave do lugar. No mapa e no corpo casa com o slot do board; na palavra
   * e a posicao da letra ("1", "2", "3"); nas zonas e o nome do cenario.
   */
  name: string;
  blank: boolean;
  /**
   * O texto que a tela mostra nesse lugar: a letra "V" que ja vem pronta, ou o
   * nome "MAR" do cenario. Nos lugares vazios de uma palavra nao vem — mandar a
   * letra seria entregar a resposta.
   */
  label?: string;
}

export interface QuestionSlotContent {
  slots: Array<QuestionSlot>;
  /** Emoji ou texto de apoio. Hoje so a atividade da palavra usa. */
  hint?: string;
  /**
   * Um mesmo lugar aceita mais de uma peca? E o caso dos animais, onde o mar
   * recebe golfinho e peixe. Ausente vale como false.
   */
  allowMultiple?: boolean;
}

export interface FilledSlot {
  name: string;
  alternativeId: number;
}
