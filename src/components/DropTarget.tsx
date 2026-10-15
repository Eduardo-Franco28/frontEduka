import { ReactNode, useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { TargetRegistry } from "../types/dragAndDrop";

interface DropTargetProps {
  id: string;
  targets: TargetRegistry;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export default function DropTarget({
  id,
  targets,
  style,
  children,
}: DropTargetProps) {
  const ref = useRef<View | null>(null);

  const measure = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      targets.current[id] = { x, y, width, height, remeasure: measure };
    });
  };

  return (
    <View ref={ref} collapsable={false} onLayout={measure} style={style}>
      {children}
    </View>
  );
}
