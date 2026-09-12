/**
 * Faz a ponte entre o desenho e a tela.
 *
 * Um tabuleiro SVG desenha em coordenadas próprias ("o braço começa em 84, 88"),
 * mas o DropTarget é uma View e precisa de pixels. Como View não pode envolver
 * um <Path>, os alvos ficam sobrepostos ao desenho — e alguém tem que converter
 * uma coisa na outra.
 *
 * É esse alguém. Serve pro corpo, pro mapa e pra qualquer tabuleiro novo.
 *
 *   const board = svgBoard(STATIC_BOARD.viewBox, 210);
 *
 *   <View style={{ width: board.width, height: board.height }}>
 *     <Svg viewBox={...} width={board.width} height={board.height} />
 *     <DropTarget style={[{ position: "absolute" }, board.rectOf(slot.bbox)]} />
 *   </View>
 */

export interface SlotRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SvgBoard {
  /** Largura em pixels, calculada a partir da altura pra não distorcer. */
  width: number;
  height: number;
  /** Onde um slot fica na tela, a partir do `bbox` dele. */
  rectOf: (bbox: string, padding?: number) => SlotRect;
}

/**
 * @param viewBox a moldura do desenho: "84 18 132 300"
 * @param height  a altura em pixels que o tabuleiro vai ocupar
 */
export default function svgBoard(viewBox: string, height: number): SvgBoard {
  const [vbX, vbY, vbW, vbH] = viewBox.trim().split(/\s+/).map(Number);

  // Quanto o desenho encolhe pra caber na altura pedida.
  const scale = height / vbH;

  return {
    width: vbW * scale,
    height,

    /**
     * @param padding pixels a mais em volta do alvo. O buraco continua do mesmo
     *              tamanho na tela, mas a área que aceita a peça fica maior —
     *              ajuda quando o alvo é estreito e o dedo é de criança.
     */
    rectOf(bbox: string, padding = 0): SlotRect {
      const [x, y, w, h] = bbox.trim().split(/\s+/).map(Number);

      return {
        // Desconta a origem do viewBox: o desenho pode não começar em (0,0).
        left: (x - vbX) * scale - padding,
        top: (y - vbY) * scale - padding,
        width: w * scale + padding * 2,
        height: h * scale + padding * 2,
      };
    },
  };
}
