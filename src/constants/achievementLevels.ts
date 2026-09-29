import { SubjectIconName } from "./subjectVisuals";

export interface AchievementLevel {
  name: string;
  meaning: string;
  // Percentual mínimo da matéria para alcançar este nível.
  minPercent: number;
  icon: SubjectIconName;
}

// O termômetro é sempre o mesmo para toda matéria, por percentual e não por
// número de tópicos: assim uma matéria de 2 tópicos e outra de 4 chegam aos
// mesmos níveis.
export const ACHIEVEMENT_LEVELS: Array<AchievementLevel> = [
  {
    name: "Corajoso",
    meaning: "Quem tenta mesmo sem saber se vai acertar.",
    minPercent: 1,
    icon: "seedling",
  },
  {
    name: "Destemido",
    meaning: "Quem não tem medo de errar e continua.",
    minPercent: 25,
    icon: "bolt",
  },
  {
    name: "Determinado",
    meaning: "Quem decide terminar o que começou.",
    minPercent: 50,
    icon: "bullseye",
  },
  {
    name: "Persistente",
    meaning: "Quem continua tentando até conseguir.",
    minPercent: 75,
    icon: "fire",
  },
  {
    name: "Mestre",
    meaning: "Quem aprendeu tanto que já pode ensinar.",
    minPercent: 100,
    icon: "crown",
  },
];

/** Índice do nível atual. -1 quando o aluno ainda não começou a matéria. */
export function getLevelIndex(percent: number): number {
  let index = -1;

  ACHIEVEMENT_LEVELS.forEach((level, position) => {
    if (percent >= level.minPercent) index = position;
  });

  return index;
}