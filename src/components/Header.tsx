import { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../styles/colors";
import useAppNavigation from "../hooks/useNavigation";

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
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}

      {title ? <Text style={styles.headerTitle}>{title}</Text> : null}

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  // Espaçador do mesmo tamanho do botão: é o que mantém o título no centro.
  side: {
    width: 36,
  },
});
