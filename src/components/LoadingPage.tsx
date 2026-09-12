import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message }: LoadingPageProps) {
  const { colors, fontScale } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.BG_APP }]}>
      <ActivityIndicator size="large" color={colors.PRIMARY} />

      {message && (
        <Text
          style={[
            styles.message,
            { color: colors.TEXT_MUTED, fontSize: 14 * fontScale },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  message: {
    fontWeight: "500",
  },
});