import { useCallback, useRef, useState } from "react";
import { Placement, TargetEntry } from "../types/dragAndDrop";

export default function useDragAndDrop() {
  const targets = useRef<Record<string, TargetEntry>>({});

  const pieces = useRef<Record<number, () => void>>({});

  const [placements, setPlacements] = useState<Placement[]>([]);

  const place = useCallback((pieceId: number, slotName: string) => {
    setPlacements((previous) => [
      ...previous.filter((placement) => placement.pieceId !== pieceId),
      { pieceId, slotName },
    ]);
  }, []);

  const remove = useCallback((pieceId: number) => {
    setPlacements((previous) =>
      previous.filter((placement) => placement.pieceId !== pieceId),
    );
  }, []);

  const returnToBox = useCallback(
    (pieceId: number) => {
      pieces.current[pieceId]?.();
      remove(pieceId);
    },
    [remove],
  );

  const reset = useCallback(() => {
    Object.values(pieces.current).forEach((returnHome) => returnHome());
    setPlacements([]);
  }, []);

  const placedCount = placements.length;

const isSlotFilled = (slotName: string) =>
    placements.some((placement) => placement.slotName === slotName);

  const isPiecePlaced = (pieceId: number) =>
    placements.some((placement) => placement.pieceId === pieceId);

  const isSlotFree = (slotName: string, pieceId: number) =>
    !placements.some(
      (placement) =>
        placement.slotName === slotName && placement.pieceId !== pieceId,
    );

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
    isSlotFree,
  };
}
