import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../styles/colors";

interface ErrorMessageProps {
  message?: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>

      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity onPress={onRetry} activeOpacity={0.7}>
          <Text style={styles.action}>Tentar novamente</Text>
        </TouchableOpacity>
      )}

      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} activeOpacity={0.7} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fdecec",
    borderWidth: 1,
    borderColor: COLORS.DANGER,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  icon: {
    fontSize: 18,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: COLORS.DANGER,
    fontWeight: "500",
    lineHeight: 19,
  },
  action: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.DANGER,
  },
  close: {
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.DANGER,
  },
});
