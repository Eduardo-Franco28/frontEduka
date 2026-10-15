export interface SlotRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SvgBoard {
  width: number;
  height: number;
  rectOf: (bbox: string, padding?: number) => SlotRect;
}

export default function svgBoard(viewBox: string, height: number): SvgBoard {
  const [vbX, vbY, vbW, vbH] = viewBox.trim().split(/\s+/).map(Number);

  const scale = height / vbH;

  return {
    width: vbW * scale,
    height,

    rectOf(bbox: string, padding = 0): SlotRect {
      const [x, y, w, h] = bbox.trim().split(/\s+/).map(Number);

      return {
        left: (x - vbX) * scale - padding,
        top: (y - vbY) * scale - padding,
        width: w * scale + padding * 2,
        height: h * scale + padding * 2,
      };
    },
  };
}
