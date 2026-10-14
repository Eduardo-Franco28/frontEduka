import useTheme from "./useTheme";

/**
 * O tamanho padrão das peças e dos alvos das atividades, em relação às medidas
 * escritas em cada atividade (o `scaled(56)` de lá).
 *
 * É 1.15 porque esse foi o tamanho que ficou certo na prática: era o das peças
 * no "Muito grande", e passou a ser o de todo mundo.
 */
export const PIECE_BASE_SCALE = 1.15;

/**
 * O tamanho das peças e dos alvos, a partir do tamanho escolhido na tela de
 * Acessibilidade. Parte do padrão e acompanha a escala, pra cima e pra baixo:
 *
 *   Pequeno (0.9)       → 0.9 × padrão
 *   Normal (1)          → o padrão
 *   Grande (1.15)       → 1.15 × padrão
 *   Muito grande (1.3)  → 1.3 × padrão
 *
 * Atenção: nos tamanhos maiores, peças e alvos ocupam mais espaço, e a tela de
 * atividade não rola. Em celular estreito, o que não couber pode sair da tela.
 *
 * Devolve uma função que já faz a conta:
 *
 *   const scaled = usePieceScale();
 *   scaled(56)  // 58, 64, 74 ou 84, do Pequeno ao Muito grande
 */
export default function usePieceScale() {
  const { fontScale } = useTheme();
  const scale = PIECE_BASE_SCALE * fontScale;

  return (value: number) => Math.round(value * scale);
}
