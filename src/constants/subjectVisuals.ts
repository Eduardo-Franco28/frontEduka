import { ComponentProps } from "react";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { COLORS } from "../styles/colors";

export type SubjectIconName = ComponentProps<typeof FontAwesomeFreeSolid>["name"];

export interface SubjectVisual {
  icon: SubjectIconName;
  bg: string;
  color: string;
  // Dois tons da mesma cor para o gradiente do card. São fixos de propósito:
  // a identidade da matéria não muda entre tema claro e escuro.
  gradient: [string, string];
}

const SUBJECT_VISUALS: Record<string, SubjectVisual> = {
  "Matemática": {
    icon: "calculator",
    bg: COLORS.SURFACE_BLUE,
    color: COLORS.INFO,
    gradient: ["#4a71a4", "#7aa5d8"],
  },
  "Português": {
    icon: "book-open",
    bg: COLORS.SURFACE_ORANGE,
    color: "#c0455e",
    gradient: ["#b83a55", "#e8798f"],
  },
  "Ciências": {
    icon: "flask",
    bg: COLORS.SURFACE_GREEN,
    color: COLORS.SUCCESS,
    gradient: ["#2f8f5f", "#6bc294"],
  },
  "História": {
    icon: "landmark",
    bg: COLORS.SURFACE_YELLOW,
    color: COLORS.WARNING,
    gradient: ["#d4762a", "#f0a862"],
  },
  "Geografia": {
    icon: "earth-americas",
    bg: COLORS.SURFACE_BLUE_PILL,
    color: "#0f7b8a",
    gradient: ["#0f7b8a", "#3fb3c4"],
  },
};

const DEFAULT_SUBJECT_VISUAL: SubjectVisual = {
  icon: "book",
  bg: COLORS.SURFACE_LOCKED,
  color: COLORS.TEXT_MUTED,
  gradient: [COLORS.PRIMARY, COLORS.SECONDARY],
};

export function getSubjectVisual(subjectName: string): SubjectVisual {
  return SUBJECT_VISUALS[subjectName] ?? DEFAULT_SUBJECT_VISUAL;
}