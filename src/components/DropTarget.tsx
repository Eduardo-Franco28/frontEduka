import { ReactNode, useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { TargetRegistry } from "../types/dragAndDrop";

interface DropTargetProps {
  /** O `slotId` — é ele que volta no `onDrop` da peça. */
  id: string;
  targets: TargetRegistry;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Um alvo que se cadastra sozinho: no layout ele mede a própria posição e
 * escreve no registro. Nenhuma coordenada é escrita à mão em lugar nenhum.
 *
 * Usa `measureInWindow` (coordenada absoluta de tela) em vez do `layout` do
 * onLayout (relativo ao pai) porque alvos e peças costumam ficar em ramos
 * diferentes da árvore — e só a coordenada de tela é comparável entre eles.
 */
export default function DropTarget({
  id,
  targets,
  style,
  children,
}: DropTargetProps) {
  const ref = useRef<View | null>(null);

  const measure = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      targets.current[id] = { x, y, width, height };
    });
  };

  return (
    <View ref={ref} collapsable={false} onLayout={measure} style={style}>
      {children}
    </View>
  );
}
