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
  id: number;
  targets: TargetRegistry;
  onDrop: (pieceId: number, slotName: string) => void;
  onMiss?: (pieceId: number) => void;
  canDrop?: (slotName: string) => boolean;
  snap?: boolean;
  pieces?: PieceRegistry;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  frameStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
  children: ReactNode;
}

const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

export default function DraggablePiece({
  id,
  targets,
  onDrop,
  onMiss,
  canDrop,
  snap = true,
  pieces,
  disabled = false,
  style,
  frameStyle,
  footer,
  children,
}: DraggablePieceProps) {
  const ref = useRef<View | null>(null);

  const home = useRef<Rect>(EMPTY_RECT);

  const dx = useSharedValue(0);
  const dy = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const returnHome = () => {
    dx.value = withSpring(0);
    dy.value = withSpring(0);
  };

  useEffect(() => {
    if (!pieces) return;

    pieces.current[id] = returnHome;

    return () => {
      delete pieces.current[id];
    };
  }, [id, pieces]);

  const measureHome = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      home.current = { x: x - dx.value, y: y - dy.value, width, height };
    });
  };

  const measureAll = () => {
    measureHome();
    Object.values(targets.current).forEach((target) => target.remeasure());
  };

  const resolveDrop = (offsetX: number, offsetY: number) => {
    const origin = home.current;
    const cx = origin.x + origin.width / 2 + offsetX;
    const cy = origin.y + origin.height / 2 + offsetY;

    const candidates = Object.entries(targets.current).filter(
      ([, a]) =>
        cx >= a.x && cx <= a.x + a.width && cy >= a.y && cy <= a.y + a.height,
    );

    if (candidates.length === 0) {
      returnHome();
      onMiss?.(id);
      return;
    }

    const [slotId, target] = candidates.reduce((best, current) => {
      const distance = ([, a]: [string, Rect]) =>
        Math.hypot(a.x + a.width / 2 - cx, a.y + a.height / 2 - cy);
      return distance(current) < distance(best) ? current : best;
    });

    if (canDrop && !canDrop(slotId)) {
      returnHome();
      onMiss?.(id);
      return;
    }

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
    .minDistance(0)
    .onBegin(() => {
      isDragging.value = true;
      runOnJS(measureAll)();
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
    zIndex: isDragging.value ? 100 : 1,
    elevation: isDragging.value ? 8 : 0,
  }));

  const frameAnimatedStyle = useAnimatedStyle(() => ({
    zIndex: isDragging.value ? 100 : 1,
  }));

  const piece = (
    <Animated.View
      ref={ref}
      collapsable={false}
      onLayout={measureHome}
      style={[animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );

  if (!frameStyle) {
    return <GestureDetector gesture={gesture}>{piece}</GestureDetector>;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[frameStyle, frameAnimatedStyle]}>
        {piece}
        {footer}
      </Animated.View>
    </GestureDetector>
  );
}
