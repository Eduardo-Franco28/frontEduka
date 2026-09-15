import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import BackButton from "./BackButton";
import useTheme from "../hooks/useTheme";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: ReactNode;
}

export default function Header({
  title,
  onBack,
  showBack = true,
  right,
}: HeaderProps) {
  const { colors, fontScale } = useTheme();

  return (
    <View style={styles.header}>
      {showBack ? <BackButton onPress={onBack} /> : <View style={styles.side} />}

      {title ? (
        <Text
          style={[
            styles.headerTitle,
            { color: colors.TEXT_PRIMARY, fontSize: 20 * fontScale },
          ]}
        >
          {title}
        </Text>
      ) : null}

      {right ?? <View style={styles.side} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  headerTitle: {
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  // Espaçador do mesmo tamanho do botão: é o que mantém o título no centro.
  side: {
    width: 36,
  },
});