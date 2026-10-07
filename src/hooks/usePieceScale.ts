import useTheme from "./useTheme";

/**
 * Até onde as peças crescem. Acima do "Grande", peças e alvos maiores empurram
 * o botão Confirmar pra fora da tela em celular pequeno, e a tela de atividade
 * não rola. O texto continua seguindo o tamanho escolhido normalmente.
 */
export const MAX_PIECE_SCALE = 1.15;

/**
 * O tamanho das peças e dos alvos das atividades, a partir do tamanho escolhido
 * na tela de Acessibilidade (Pequeno 0.9, Normal 1, Grande 1.15).
 *
 * Devolve uma função que já faz a conta:
 *
 *   const scaled = usePieceScale();
 *   scaled(56)  // 50, 56 ou 64, conforme o tamanho escolhido
 */
export default function usePieceScale() {
  const { fontScale } = useTheme();
  const scale = Math.min(fontScale, MAX_PIECE_SCALE);

  return (value: number) => Math.round(value * scale);
}
