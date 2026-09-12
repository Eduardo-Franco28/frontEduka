import { MutableRefObject } from "react";

/** Posição e tamanho de um elemento, em coordenadas absolutas de tela. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Onde os alvos se cadastram. A chave é o `name` do slot — o mesmo que vai no
 * `lstFilledSlots` da tentativa.
 */
export type TargetRegistry = MutableRefObject<Record<string, Rect>>;

/**
 * Uma peça que foi colocada num buraco.
 *
 * É uma lista de objetos, e não um `Record<pecaId, buraco>`, porque chave de
 * objeto em JavaScript é sempre string: o id da alternativa (número) perderia
 * o tipo na ida e precisaria de um `Number()` na volta. Aqui o id é um campo
 * comum e continua sendo número do começo ao fim.
 */
export interface Placement {
  /** O id da alternativa que a criança arrastou. */
  pieceId: number;
  /** O `name` do slot onde ela caiu. */
  slotName: string;
}

/**
 * Onde cada peça cadastra a função que a manda de volta pra caixa.
 * Mesma ideia do TargetRegistry: a peça se apresenta sozinha, e quem precisar
 * mandá-la de volta só chama pelo id.
 */
export type PieceRegistry = MutableRefObject<Record<number, () => void>>;
