import { useCallback, useRef, useState } from "react";
import { Rect, Placement } from "../types/dragAndDrop";

/**
 * Guarda o cadastro dos alvos e o que o aluno já montou.
 *
 * Não sabe nada de atividade: quem decide se `golfinho -> mar` está certo é a
 * tela (e, na real, o backend). Aqui só registra que caiu ali.
 */
export default function useDragAndDrop() {
  // Ref e não state: os alvos mudam durante o layout e não devem re-renderizar.
  const targets = useRef<Record<string, Rect>>({});

  // Cada peça cadastra aqui a função que a faz voltar pra caixa. Precisa disso
  // porque a posição do desenho mora dentro do DraggablePiece — daqui de fora
  // não dá pra mexer nela direto, só pedir pra ela voltar.
  const pieces = useRef<Record<number, () => void>>({});

  const [placements, setPlacements] = useState<Placement[]>([]);

  const place = useCallback((pieceId: number, slotName: string) => {
    setPlacements((previous) => [
      // Tira a peça do lugar antigo antes de pôr no novo. Sem isso ela
      // apareceria duas vezes na lista e o contador mentiria.
      ...previous.filter((placement) => placement.pieceId !== pieceId),
      { pieceId, slotName },
    ]);
  }, []);

  const remove = useCallback((pieceId: number) => {
    setPlacements((previous) =>
      previous.filter((placement) => placement.pieceId !== pieceId),
    );
  }, []);

  /**
   * Manda uma peça de volta pra caixa: ela sai do lugar onde estava E volta
   * pra posição original na tela.
   *
   * O `remove` sozinho só apaga do registro — o desenho continuaria parado em
   * cima do buraco. Este faz as duas coisas.
   */
  const returnToBox = useCallback(
    (pieceId: number) => {
      pieces.current[pieceId]?.();
      remove(pieceId);
    },
    [remove],
  );

  /** Esquece tudo e manda todas as peças de volta pra caixa. */
  const reset = useCallback(() => {
    Object.values(pieces.current).forEach((returnHome) => returnHome());
    setPlacements([]);
  }, []);

  /** Quantas peças já foram colocadas. */
  const placedCount = placements.length;

  // As duas perguntas que toda tela de arrastar faz. Funções simples, sem
  // useCallback: só são chamadas durante a renderização, nunca viram prop.

  /** Esse buraco já recebeu alguma peça? */
  const isSlotFilled = (slotName: string) =>
    placements.some((placement) => placement.slotName === slotName);

  /** Essa peça já está em algum buraco? */
  const isPiecePlaced = (pieceId: number) =>
    placements.some((placement) => placement.pieceId === pieceId);

  return {
    targets,
    pieces,
    placements,
    placedCount,
    place,
    remove,
    returnToBox,
    reset,
    isSlotFilled,
    isPiecePlaced,
  };
}
