import { MutableRefObject } from "react";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TargetEntry extends Rect {
  remeasure: () => void;
}

export type TargetRegistry = MutableRefObject<Record<string, TargetEntry>>;

export interface Placement {
  pieceId: number;
  slotName: string;
}

export type PieceRegistry = MutableRefObject<Record<number, () => void>>;
