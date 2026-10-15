import useTheme from "./useTheme";

export const PIECE_BASE_SCALE = 1.15;

export default function usePieceScale() {
  const { fontScale } = useTheme();
  const scale = PIECE_BASE_SCALE * fontScale;

  return (value: number) => Math.round(value * scale);
}
