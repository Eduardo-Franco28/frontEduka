import { ComponentProps } from "react";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { COLORS } from "../styles/colors";

export type SubjectIconName = ComponentProps<typeof FontAwesomeFreeSolid>["name"];

export interface SubjectVisual {
  icon: SubjectIconName;
  bg: string;
  color: string;
}

const SUBJECT_VISUALS: Record<string, SubjectVisual> = {
  "Matemática": { icon: "calculator", bg: COLORS.SURFACE_BLUE, color: COLORS.INFO },
  "Português": { icon: "book-open", bg: COLORS.SURFACE_GREEN, color: COLORS.SUCCESS },
  "Ciências": { icon: "flask", bg: COLORS.SURFACE_GREEN_LIGHT, color: COLORS.SUCCESS_DARK },
  "História": { icon: "landmark", bg: COLORS.SURFACE_ORANGE, color: COLORS.WARNING },
  "Geografia": { icon: "earth-americas", bg: COLORS.SURFACE_PRIMARY, color: COLORS.PRIMARY_LIGHT },
};

const DEFAULT_SUBJECT_VISUAL: SubjectVisual = {
  icon: "book",
  bg: COLORS.SURFACE_LOCKED,
  color: COLORS.TEXT_MUTED,
};

export function getSubjectVisual(subjectName: string): SubjectVisual {
  return SUBJECT_VISUALS[subjectName] ?? DEFAULT_SUBJECT_VISUAL;
}
