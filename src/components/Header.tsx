import { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useAppNavigation from "../hooks/useNavigation";
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
  const navigation = useAppNavigation();
  const { colors, fontScale } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.CARD }]}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={[styles.backArrow, { color: colors.TEXT_PRIMARY }]}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}

      {title ? (
        <Text
          style={[
            styles.headerTitle,
            { color: colors.TEXT_PRIMARY, fontSize: 18 * fontScale },
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
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    lineHeight: 20,
  },
  headerTitle: {
    fontWeight: "700",
  },
  // Espaçador do mesmo tamanho do botão: é o que mantém o título no centro.
  side: {
    width: 36,
  },
});