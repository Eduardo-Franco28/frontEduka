import { MutableRefObject } from "react";

/** Posição e tamanho de um elemento, em coordenadas absolutas de tela. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Onde os alvos se cadastram. A chave é o `slotId` — o mesmo que vai no
 * `lstFilledSlot` da tentativa.
 */
export type TargetRegistry = MutableRefObject<Record<string, Rect>>;

/** O que o aluno montou: qual peça caiu em qual slot. */
export type Placements = Record<string, string>;
