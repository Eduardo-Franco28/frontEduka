import { ReactNode, useEffect, useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { PieceRegistry, Rect, TargetRegistry } from "../types/dragAndDrop";

interface DraggablePieceProps {
  /** Id da peça — volta no `onDrop` junto com o slot onde ela caiu. */
  id: number;
  targets: TargetRegistry;
  /** Chamado quando a peça cai dentro de um alvo. */
  onDrop: (pieceId: number, slotName: string) => void;
  /** Chamado quando ela é solta fora de qualquer alvo. */
  onMiss?: (pieceId: number) => void;
  /**
   * `true` (padrão): a peça pula pro centro do alvo.
   * `false`: fica onde o dedo soltou — melhor quando um alvo recebe várias
   * peças, senão elas empilham no mesmo ponto.
   */
  snap?: boolean;
  /**
   * Onde a peça cadastra a função que a manda de volta pra caixa. É o que
   * permite o `returnToBox` do useDragAndDrop mover a peça daqui de fora.
   */
  pieces?: PieceRegistry;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export default function DraggablePiece({
  id,
  targets,
  onDrop,
  onMiss,
  snap = true,
  pieces,
  disabled = false,
  style,
  children,
}: DraggablePieceProps) {
  const ref = useRef<View | null>(null);

  // Onde a peça mora quando não está deslocada. Ref (não shared value) porque
  // só é lida na thread do JS, na hora de decidir o encaixe.
  const home = useRef<Rect>(EMPTY_RECT);

  const dx = useSharedValue(0);
  const dy = useSharedValue(0);
  const isDragging = useSharedValue(false);

  /** Volta a peça pro lugar de origem, com uma mola. */
  const returnHome = () => {
    dx.value = withSpring(0);
    dy.value = withSpring(0);
  };

  // Se cadastra no registro pra poder ser mandada de volta daqui de fora,
  // e se descadastra quando some da tela (ex.: trocou de questão).
  useEffect(() => {
    if (!pieces) return;

    pieces.current[id] = returnHome;

    return () => {
      delete pieces.current[id];
    };
  }, [id, pieces]);

  const measureHome = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      // Desconta o deslocamento atual: queremos a posição de origem, não a de agora.
      home.current = { x: x - dx.value, y: y - dy.value, width, height };
    });
  };

  /**
   * Roda na thread do JS (via runOnJS). Fazer a geometria aqui evita ler o
   * registro de alvos — que é um objeto comum — de dentro de um worklet.
   */
  const resolveDrop = (offsetX: number, offsetY: number) => {
    const origin = home.current;
    const cx = origin.x + origin.width / 2 + offsetX;
    const cy = origin.y + origin.height / 2 + offsetY;

    // Todos os alvos que contêm o centro da peça.
    const candidates = Object.entries(targets.current).filter(
      ([, a]) =>
        cx >= a.x && cx <= a.x + a.width && cy >= a.y && cy <= a.y + a.height,
    );

    if (candidates.length === 0) {
      returnHome();
      onMiss?.(id);
      return;
    }

    // Sobreposição de alvos: ganha o de centro mais próximo.
    const [slotId, target] = candidates.reduce((best, current) => {
      const distance = ([, a]: [string, Rect]) =>
        Math.hypot(a.x + a.width / 2 - cx, a.y + a.height / 2 - cy);
      return distance(current) < distance(best) ? current : best;
    });

    if (snap) {
      dx.value = withSpring(
        target.x + target.width / 2 - (origin.x + origin.width / 2),
      );
      dy.value = withSpring(
        target.y + target.height / 2 - (origin.y + origin.height / 2),
      );
    }

    onDrop(id, slotId);
  };

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      isDragging.value = true;
      // Mede de novo a cada arrasto: a tela pode ter rolado ou mudado de layout.
      runOnJS(measureHome)();
    })
    .onChange((e) => {
      dx.value += e.changeX;
      dy.value += e.changeY;
    })
    .onEnd(() => {
      runOnJS(resolveDrop)(dx.value, dy.value);
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dx.value }, { translateY: dy.value }],
    // Enquanto arrasta, a peça passa por cima de tudo.
    zIndex: isDragging.value ? 100 : 1,
    elevation: isDragging.value ? 8 : 0,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={ref}
        collapsable={false}
        onLayout={measureHome}
        style={[animatedStyle, style]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
