import { SubjectIconName } from "./subjectVisuals";

export interface AchievementLevel {
  name: string;
  meaning: string;
  minPercent: number;
  icon: SubjectIconName;
}

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

export function getLevelIndex(percent: number): number {
  let index = -1;

  ACHIEVEMENT_LEVELS.forEach((level, position) => {
    if (percent >= level.minPercent) index = position;
  });

  return index;
}