import { useCallback, useRef, useState } from "react";
import { Rect, Placements } from "../types/dragAndDrop";

/**
 * Guarda o cadastro dos alvos e o que o aluno já montou.
 *
 * Não sabe nada de atividade: quem decide se `golfinho -> mar` está certo é a
 * tela (e, na real, o backend). Aqui só registra que caiu ali.
 */
export default function useDragAndDrop() {
  // Ref e não state: os alvos mudam durante o layout e não devem re-renderizar.
  const targets = useRef<Record<string, Rect>>({});

  const [placements, setPlacements] = useState<Placements>({});

  const place = useCallback((pieceId: string, slotId: string) => {
    setPlacements((antes) => ({ ...antes, [pieceId]: slotId }));
  }, []);

  const remove = useCallback((pieceId: string) => {
    setPlacements((antes) => {
      const { [pieceId]: _fora, ...resto } = antes;
      return resto;
    });
  }, []);

  const reset = useCallback(() => setPlacements({}), []);

  /** Quantas peças já foram colocadas. */
  const placedCount = Object.keys(placements).length;

  /**
   * Converte pro formato que o backend espera.
   * `resolver` traduz o id da peça no id da alternativa.
   */
  const toFilledSlots = useCallback(
    (resolver: (pieceId: string) => number) =>
      Object.entries(placements).map(([pieceId, slotId]) => ({
        slotId,
        alternativeId: resolver(pieceId),
      })),
    [placements],
  );

  return {
    targets,
    placements,
    placedCount,
    place,
    remove,
    reset,
    toFilledSlots,
  };
}
