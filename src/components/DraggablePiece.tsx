import { ReactNode, useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Rect, TargetRegistry } from "../types/dragAndDrop";

interface DraggablePieceProps {
  /** Id da peça — volta no `onDrop` junto com o slot onde ela caiu. */
  id: string;
  targets: TargetRegistry;
  /** Chamado quando a peça cai dentro de um alvo. */
  onDrop: (pieceId: string, slotId: string) => void;
  /** Chamado quando ela é solta fora de qualquer alvo. */
  onMiss?: (pieceId: string) => void;
  /**
   * `true` (padrão): a peça pula pro centro do alvo.
   * `false`: fica onde o dedo soltou — melhor quando um alvo recebe várias
   * peças, senão elas empilham no mesmo ponto.
   */
  snap?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const VAZIO: Rect = { x: 0, y: 0, width: 0, height: 0 };

export default function DraggablePiece({
  id,
  targets,
  onDrop,
  onMiss,
  snap = true,
  disabled = false,
  style,
  children,
}: DraggablePieceProps) {
  const ref = useRef<View | null>(null);

  // Onde a peça mora quando não está deslocada. Ref (não shared value) porque
  // só é lida na thread do JS, na hora de decidir o encaixe.
  const casa = useRef<Rect>(VAZIO);

  const dx = useSharedValue(0);
  const dy = useSharedValue(0);
  const arrastando = useSharedValue(false);

  const medirCasa = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      // Desconta o deslocamento atual: queremos a posição de origem, não a de agora.
      casa.current = { x: x - dx.value, y: y - dy.value, width, height };
    });
  };

  /**
   * Roda na thread do JS (via runOnJS). Fazer a geometria aqui evita ler o
   * registro de alvos — que é um objeto comum — de dentro de um worklet.
   */
  const resolverSoltura = (deslocX: number, deslocY: number) => {
    const origem = casa.current;
    const cx = origem.x + origem.width / 2 + deslocX;
    const cy = origem.y + origem.height / 2 + deslocY;

    // Todos os alvos que contêm o centro da peça.
    const candidatos = Object.entries(targets.current).filter(
      ([, a]) =>
        cx >= a.x && cx <= a.x + a.width && cy >= a.y && cy <= a.y + a.height,
    );

    if (candidatos.length === 0) {
      dx.value = withSpring(0);
      dy.value = withSpring(0);
      onMiss?.(id);
      return;
    }

    // Sobreposição de alvos: ganha o de centro mais próximo.
    const [slotId, alvo] = candidatos.reduce((melhor, atual) => {
      const dist = ([, a]: [string, Rect]) =>
        Math.hypot(a.x + a.width / 2 - cx, a.y + a.height / 2 - cy);
      return dist(atual) < dist(melhor) ? atual : melhor;
    });

    if (snap) {
      dx.value = withSpring(
        alvo.x + alvo.width / 2 - (origem.x + origem.width / 2),
      );
      dy.value = withSpring(
        alvo.y + alvo.height / 2 - (origem.y + origem.height / 2),
      );
    }

    onDrop(id, slotId);
  };

  const gesto = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      arrastando.value = true;
      // Mede de novo a cada arrasto: a tela pode ter rolado ou mudado de layout.
      runOnJS(medirCasa)();
    })
    .onChange((e) => {
      dx.value += e.changeX;
      dy.value += e.changeY;
    })
    .onEnd(() => {
      runOnJS(resolverSoltura)(dx.value, dy.value);
    })
    .onFinalize(() => {
      arrastando.value = false;
    });

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ translateX: dx.value }, { translateY: dy.value }],
    // Enquanto arrasta, a peça passa por cima de tudo.
    zIndex: arrastando.value ? 100 : 1,
    elevation: arrastando.value ? 8 : 0,
  }));

  return (
    <GestureDetector gesture={gesto}>
      <Animated.View
        ref={ref}
        collapsable={false}
        onLayout={medirCasa}
        style={[estiloAnimado, style]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
